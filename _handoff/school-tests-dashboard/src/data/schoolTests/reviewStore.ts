"use client";

// Leo's work on his school-test mistakes, and Neritan's settings for the next
// test. Local-first and synced, like every other data/*.ts module:
//
//   school_review_cards   one row per missed question (see analytics.allCards)
//   school_test_settings  one row, id 'leo': next test + goals
//
// Merging is newest-wins per row on `updated_at`, which the app sets itself —
// so do NOT add the generic set_updated_at trigger to these two tables, or a
// sync would stamp every row "now" and an older edit could beat a newer one.

import { useCallback, useEffect, useState } from "react";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";
import { reportCloudSyncFailure, reportCloudSyncSuccess } from "@/lib/syncStatus";
import { defaultGoals } from "./analytics";
import type { CardStatus, CoreSubject, MissReason, ReviewCardState, SchoolTestSettings } from "./types";

const CARDS_KEY = "leea.schoolReview.cards.v1";
const SETTINGS_KEY = "leea.schoolReview.settings.v1";
const STUDENT = "leo";

export const defaultSettings: SchoolTestSettings = {
  nextTest: { name: "2学期中間テスト", date: "", cardsPerDay: 4 },
  goals: defaultGoals,
  updatedAt: new Date(0).toISOString()
};

// ---------- local ----------

function readLocal<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeLocal(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage full or blocked — the cloud copy still has it */
  }
}

export function readCardStates(): Record<string, ReviewCardState> {
  return readLocal<Record<string, ReviewCardState>>(CARDS_KEY, {});
}

export function readSettings(): SchoolTestSettings {
  const s = readLocal<Partial<SchoolTestSettings>>(SETTINGS_KEY, {});
  return {
    nextTest: { ...defaultSettings.nextTest, ...(s.nextTest ?? {}) },
    goals: {
      ...defaultSettings.goals,
      ...(s.goals ?? {}),
      subjects: { ...defaultSettings.goals.subjects, ...(s.goals?.subjects ?? {}) }
    },
    updatedAt: s.updatedAt ?? defaultSettings.updatedAt
  };
}

// ---------- cloud rows ----------

type CardRow = {
  id: string;
  student_id: string;
  test_id: string;
  subject: string;
  question_no: string;
  status: CardStatus;
  reason: MissReason | null;
  note: string;
  practice_count: number;
  practiced_at: string | null;
  mastered_at: string | null;
  updated_at: string;
};

function toRow(s: ReviewCardState): CardRow {
  return {
    id: s.id,
    student_id: STUDENT,
    test_id: s.testId,
    subject: s.subject,
    question_no: s.questionNo,
    status: s.status,
    reason: s.reason,
    note: s.note,
    practice_count: s.practiceCount,
    practiced_at: s.practicedAt,
    mastered_at: s.masteredAt,
    updated_at: s.updatedAt
  };
}

function fromRow(r: CardRow): ReviewCardState {
  return {
    id: r.id,
    testId: r.test_id,
    subject: r.subject as CoreSubject,
    questionNo: r.question_no,
    status: r.status,
    reason: r.reason,
    note: r.note ?? "",
    practiceCount: r.practice_count ?? 0,
    practicedAt: r.practiced_at,
    masteredAt: r.mastered_at,
    updatedAt: new Date(r.updated_at).toISOString()
  };
}

async function pushCard(state: ReviewCardState) {
  if (!isSupabaseConfigured || !supabase) return;
  const { error } = await supabase.from("school_review_cards").upsert(toRow(state), { onConflict: "id" });
  if (error) reportCloudSyncFailure("school-tests", error);
  else reportCloudSyncSuccess("school-tests");
}

async function pushSettings(settings: SchoolTestSettings) {
  if (!isSupabaseConfigured || !supabase) return;
  const { error } = await supabase.from("school_test_settings").upsert(
    { id: STUDENT, student_id: STUDENT, next_test: settings.nextTest, goals: settings.goals, updated_at: settings.updatedAt },
    { onConflict: "id" }
  );
  if (error) reportCloudSyncFailure("school-tests", error);
  else reportCloudSyncSuccess("school-tests");
}

/** Pull both tables, merge newest-wins, push whatever local had that was newer. */
export async function syncSchoolReviewWithCloud(): Promise<{
  cards: Record<string, ReviewCardState>;
  settings: SchoolTestSettings;
} | null> {
  if (!isSupabaseConfigured || !supabase) return null;
  try {
    const [cardsRes, settingsRes] = await Promise.all([
      supabase.from("school_review_cards").select("*").eq("student_id", STUDENT),
      supabase.from("school_test_settings").select("*").eq("id", STUDENT).maybeSingle()
    ]);
    if (cardsRes.error) throw cardsRes.error;
    if (settingsRes.error) throw settingsRes.error;

    const local = readCardStates();
    const merged: Record<string, ReviewCardState> = { ...local };
    const toPush: ReviewCardState[] = [];
    const cloudIds = new Set<string>();
    for (const row of (cardsRes.data ?? []) as CardRow[]) {
      const cloud = fromRow(row);
      cloudIds.add(cloud.id);
      const mine = local[cloud.id];
      if (!mine || cloud.updatedAt >= mine.updatedAt) merged[cloud.id] = cloud;
      else toPush.push(mine);
    }
    for (const id of Object.keys(local)) if (!cloudIds.has(id)) toPush.push(local[id]);
    writeLocal(CARDS_KEY, merged);
    if (toPush.length) {
      const { error } = await supabase.from("school_review_cards").upsert(toPush.map(toRow), { onConflict: "id" });
      if (error) throw error;
    }

    let settings = readSettings();
    const row = settingsRes.data as { next_test: SchoolTestSettings["nextTest"]; goals: SchoolTestSettings["goals"]; updated_at: string } | null;
    if (row) {
      const cloudAt = new Date(row.updated_at).toISOString();
      if (cloudAt >= settings.updatedAt) {
        settings = {
          nextTest: { ...defaultSettings.nextTest, ...row.next_test },
          goals: { ...defaultSettings.goals, ...row.goals, subjects: { ...defaultSettings.goals.subjects, ...(row.goals?.subjects ?? {}) } },
          updatedAt: cloudAt
        };
        writeLocal(SETTINGS_KEY, settings);
      } else await pushSettings(settings);
    } else if (settings.updatedAt !== defaultSettings.updatedAt) await pushSettings(settings);

    reportCloudSyncSuccess("school-tests");
    return { cards: merged, settings };
  } catch (error) {
    reportCloudSyncFailure("school-tests", error);
    return null;
  }
}

// ---------- hook ----------

export function useSchoolReview() {
  const [cards, setCards] = useState<Record<string, ReviewCardState>>({});
  const [settings, setSettingsState] = useState<SchoolTestSettings>(defaultSettings);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setCards(readCardStates());
    setSettingsState(readSettings());
    setLoaded(true);
    let alive = true;
    syncSchoolReviewWithCloud().then((r) => {
      if (alive && r) {
        setCards(r.cards);
        setSettingsState(r.settings);
      }
    });
    return () => {
      alive = false;
    };
  }, []);

  const updateCard = useCallback((base: ReviewCardState, patch: Partial<ReviewCardState>) => {
    const now = new Date().toISOString();
    const next: ReviewCardState = { ...base, ...patch, updatedAt: now };
    setCards((prev) => {
      const all = { ...prev, [next.id]: next };
      writeLocal(CARDS_KEY, all);
      return all;
    });
    void pushCard(next);
    return next;
  }, []);

  const updateSettings = useCallback((patch: Partial<SchoolTestSettings>) => {
    setSettingsState((prev) => {
      const next = { ...prev, ...patch, updatedAt: new Date().toISOString() };
      writeLocal(SETTINGS_KEY, next);
      void pushSettings(next);
      return next;
    });
  }, []);

  return { cards, settings, loaded, updateCard, updateSettings };
}
