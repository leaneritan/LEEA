import { isSupabaseConfigured, supabase } from "@/lib/supabase";
import { reportCloudSyncFailure, reportCloudSyncSuccess } from "@/lib/syncStatus";

/**
 * 理科 progress — local-first, Supabase-shaped, the same contract as
 * `mathProgress.ts` and `geographyProgress.ts`. Keyed by section + block, so a
 * 観察 / 実習, a 章末 check and a widget each carry their own done state.
 */

export type ScienceBlockProgressStatus = "not-done" | "done";

export type ScienceBlockProgressRecord = {
  studentId: "leo";
  sectionId: string;
  blockId: string;
  status: ScienceBlockProgressStatus;
  /** Set by widget blocks that score themselves; null for a plain tick. */
  quizScore: { correct: number; total: number } | null;
  completedAt: string | null;
  updatedAt: string;
};

/** Keyed by `${sectionId}::${blockId}`. */
export type ScienceBlockProgressMap = Record<string, ScienceBlockProgressRecord>;

export const scienceProgressStorageKey = "leea.scienceProgress.v1";

type ScienceBlockProgressRow = {
  id: string;
  student_id: "leo";
  section_id: string;
  block_id: string;
  status: ScienceBlockProgressStatus;
  quiz_score: { correct: number; total: number } | null;
  completed_at: string | null;
  updated_at: string;
};

function progressKey(sectionId: string, blockId: string) {
  return `${sectionId}::${blockId}`;
}

export function createScienceBlockProgressRecord(
  sectionId: string,
  blockId: string,
  done: boolean,
  quizScore: { correct: number; total: number } | null = null
): ScienceBlockProgressRecord {
  const now = new Date().toISOString();

  return {
    studentId: "leo",
    sectionId,
    blockId,
    status: done ? "done" : "not-done",
    quizScore,
    completedAt: done ? now : null,
    updatedAt: now
  };
}

export function isBlockDone(sectionId: string, blockId: string, progress: ScienceBlockProgressMap) {
  return progress[progressKey(sectionId, blockId)]?.status === "done";
}

export function getBlockQuizScore(sectionId: string, blockId: string, progress: ScienceBlockProgressMap) {
  return progress[progressKey(sectionId, blockId)]?.quizScore ?? null;
}

export function getSectionCompletionPercent(
  sectionId: string,
  blockIds: string[],
  progress: ScienceBlockProgressMap
) {
  if (blockIds.length === 0) return 0;
  const done = blockIds.filter((blockId) => isBlockDone(sectionId, blockId, progress)).length;
  return Math.round((done / blockIds.length) * 100);
}

export function readScienceProgress(): ScienceBlockProgressMap {
  if (typeof window === "undefined") return {};

  try {
    const saved = window.localStorage.getItem(scienceProgressStorageKey);
    return saved ? (JSON.parse(saved) as ScienceBlockProgressMap) : {};
  } catch {
    return {};
  }
}

export function writeScienceProgress(progress: ScienceBlockProgressMap) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(scienceProgressStorageKey, JSON.stringify(progress));
}

export async function syncScienceProgressWithCloud(
  current: ScienceBlockProgressMap
): Promise<ScienceBlockProgressMap> {
  if (!isSupabaseConfigured || !supabase || typeof window === "undefined") return current;

  try {
    const { data, error } = await supabase
      .from("science_block_progress")
      .select("id, student_id, section_id, block_id, status, quiz_score, completed_at, updated_at")
      .eq("student_id", "leo");

    if (error) throw error;
    reportCloudSyncSuccess("science");

    const cloud = ((data ?? []) as ScienceBlockProgressRow[]).reduce<ScienceBlockProgressMap>((next, row) => {
      next[progressKey(row.section_id, row.block_id)] = fromScienceProgressRow(row);
      return next;
    }, {});

    const merged = { ...current };
    const localRecordsToPush: ScienceBlockProgressRecord[] = [];

    for (const [key, localRecord] of Object.entries(current)) {
      const cloudRecord = cloud[key];
      if (!cloudRecord || isNewer(localRecord.updatedAt, cloudRecord.updatedAt)) {
        localRecordsToPush.push(localRecord);
      }
    }

    for (const [key, cloudRecord] of Object.entries(cloud)) {
      const localRecord = current[key];
      if (!localRecord || isNewer(cloudRecord.updatedAt, localRecord.updatedAt)) {
        merged[key] = cloudRecord;
      }
    }

    // Best-effort: reports its own outcome, so a push failure isn't masked by
    // the read above already having reported success.
    if (localRecordsToPush.length) {
      await upsertScienceProgressRecords(localRecordsToPush);
    }

    writeScienceProgress(merged);
    return merged;
  } catch (error) {
    console.warn("LEEA Supabase science progress sync failed", error);
    reportCloudSyncFailure("science", error);
    return current;
  }
}

/**
 * Saves one block's progress. A scored block never downgrades what Leo has
 * already earned — the same rule `geographyProgress.ts` follows: once a widget
 * has been solved it stays solved, and the best score is kept, so replaying it
 * and making a mistake cannot take the tick away.
 *
 * A plain tick (`quizScore === null`) is a manual toggle, so it is left free to
 * go both ways: unticking a 観察 Leo decided he had not really done must work.
 */
export async function saveScienceBlockProgress(record: ScienceBlockProgressRecord) {
  const current = readScienceProgress();
  const merged = mergeScienceRecords(current[progressKey(record.sectionId, record.blockId)], record);

  writeScienceProgress({ ...current, [progressKey(record.sectionId, record.blockId)]: merged });
  await upsertScienceProgressRecords([merged]);
  return merged;
}

export function mergeScienceRecords(
  existing: ScienceBlockProgressRecord | undefined,
  incoming: ScienceBlockProgressRecord
): ScienceBlockProgressRecord {
  if (!existing || incoming.quizScore === null) return incoming;

  const status = existing.status === "done" ? "done" : incoming.status;
  const quizScore = bestQuizScore(existing.quizScore, incoming.quizScore);

  return {
    ...incoming,
    status,
    quizScore,
    completedAt:
      existing.completedAt ?? (status === "done" ? incoming.completedAt ?? new Date().toISOString() : null)
  };
}

function bestQuizScore(
  existing: { correct: number; total: number } | null,
  incoming: { correct: number; total: number } | null
) {
  if (!existing) return incoming;
  if (!incoming) return existing;
  // Compare as a ratio: a widget's 観点 change the number of organisms in play,
  // so 3/3 beats 7/8 even though it has fewer correct.
  return incoming.correct * existing.total >= existing.correct * incoming.total ? incoming : existing;
}

async function upsertScienceProgressRecords(records: ScienceBlockProgressRecord[]) {
  if (!isSupabaseConfigured || !supabase || records.length === 0) return;

  try {
    const { error } = await supabase
      .from("science_block_progress")
      .upsert(records.map(toScienceProgressRow), { onConflict: "student_id,section_id,block_id" });

    if (error) throw error;
    reportCloudSyncSuccess("science");
  } catch (error) {
    console.warn("LEEA Supabase science progress save failed", error);
    reportCloudSyncFailure("science", error);
  }
}

function fromScienceProgressRow(row: ScienceBlockProgressRow): ScienceBlockProgressRecord {
  return {
    studentId: "leo",
    sectionId: row.section_id,
    blockId: row.block_id,
    status: row.status,
    quizScore: row.quiz_score,
    completedAt: row.completed_at,
    updatedAt: row.updated_at
  };
}

function toScienceProgressRow(record: ScienceBlockProgressRecord): ScienceBlockProgressRow {
  return {
    id: `science-progress-${record.studentId}-${record.sectionId}-${record.blockId}`,
    student_id: record.studentId,
    section_id: record.sectionId,
    block_id: record.blockId,
    status: record.status,
    quiz_score: record.quizScore,
    completed_at: record.completedAt,
    updated_at: record.updatedAt
  };
}

function isNewer(first: string, second: string) {
  const firstTime = Date.parse(first);
  const secondTime = Date.parse(second);
  if (Number.isNaN(firstTime)) return false;
  if (Number.isNaN(secondTime)) return true;
  return firstTime > secondTime;
}
