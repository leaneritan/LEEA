import type { Lesson } from "./types";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";

export type LearnerAppProgress = {
  completedModules: number;
  moduleCount: number;
  modules: Array<{
    id: string;
    label: string;
    done: boolean;
  }>;
  score: number | null;
  done: boolean;
  caption: string;
};

export type LearnerProgressStorageRow = {
  storage_key: string;
  value: unknown;
};

type LearnerProgressCloudRow = {
  homework_id: string;
  raw_progress: Record<string, unknown> | null;
};

export function getLearnerAppProgress(source: Lesson["source"]): LearnerAppProgress {
  const moduleCount = source.moduleCount ?? 0;
  const storagePrefix = source.storagePrefix ?? "";

  if (typeof window === "undefined" || !storagePrefix || !moduleCount) {
    return { completedModules: 0, moduleCount: moduleCount || 1, modules: [], score: null, done: false, caption: "" };
  }

  const keyFormat = source.moduleKeyFormat ?? "m{n}-done";
  const explicitKeys = source.moduleKeys;
  const modules = Array.from({ length: moduleCount }, (_, index) => {
    const doneKey = explicitKeys?.[index]
      ?? keyFormat.replace("{n}", String(index + 1)).replace("{i}", String(index));
    // Apps may store either a raw boolean or a {done, timestamp} object — both are truthy when complete.
    return {
      id: `m${index + 1}`,
      label: source.moduleLabels?.[index] ?? `Module ${index + 1}`,
      done: Boolean(loadLocalValue<unknown>(`${storagePrefix}${doneKey}`, null))
    };
  });
  const completedModules = modules.filter((module) => module.done).length;
  const scoreKeyPath = source.scoreKey ?? "score";
  const scoreData = loadLocalValue<{ score?: number; total?: number; percent?: number; done?: boolean } | null>(
    `${storagePrefix}${scoreKeyPath}`,
    null
  );
  const homeworkDone = source.homeworkId ? loadLocalValue(`leea-${source.homeworkId}-done`, false) : false;
  const done = Boolean(loadLocalValue(`${storagePrefix}done`, false) || scoreData?.done || homeworkDone);
  const caption = source.captionKey ? loadLocalValue(`${storagePrefix}${source.captionKey}`, "") : "";

  // Score is displayed as a percent. Apps may store it as `percent` (canonical)
  // or as `score` (raw correct count) with `total`. Prefer percent; fall back to
  // computing it; fall back to treating raw score as percent for legacy apps.
  let scorePercent: number | null = null;
  if (typeof scoreData?.percent === "number") {
    scorePercent = scoreData.percent;
  } else if (typeof scoreData?.score === "number" && typeof scoreData?.total === "number" && scoreData.total > 0) {
    scorePercent = Math.round((scoreData.score / scoreData.total) * 100);
  } else if (typeof scoreData?.score === "number") {
    scorePercent = scoreData.score;
  }

  return {
    completedModules,
    moduleCount,
    modules,
    score: scorePercent,
    done,
    caption
  };
}

export async function fetchLearnerProgressRows(homeworkId: string | undefined): Promise<LearnerProgressStorageRow[]> {
  if (!homeworkId || !isSupabaseConfigured || !supabase) return [];

  try {
    const { data, error } = await supabase
      .from("learner_progress")
      .select("raw_progress")
      .eq("homework_id", homeworkId)
      .eq("student_id", "leo")
      .maybeSingle();

    if (error) throw error;

    return Object.entries((data?.raw_progress ?? {}) as Record<string, unknown>)
      .filter(([, value]) => value !== null && value !== undefined)
      .map(([storage_key, value]) => ({ storage_key, value }));
  } catch (error) {
    console.warn("LEEA Supabase learner progress read failed", error);
    return [];
  }
}

export async function hydrateLearnerProgressFromCloud(lessons: Lesson[]): Promise<boolean> {
  const homeworkIds = lessons.map((lesson) => lesson.source.homeworkId).filter((id): id is string => Boolean(id));
  if (!homeworkIds.length || !isSupabaseConfigured || !supabase || typeof window === "undefined") return false;

  try {
    const { data, error } = await supabase
      .from("learner_progress")
      .select("homework_id, raw_progress")
      .eq("student_id", "leo")
      .in("homework_id", homeworkIds);

    if (error) throw error;

    for (const row of (data ?? []) as LearnerProgressCloudRow[]) {
      for (const [storageKey, value] of Object.entries(row.raw_progress ?? {})) {
        if (value === null || value === undefined) {
          window.localStorage.removeItem(storageKey);
        } else {
          window.localStorage.setItem(storageKey, JSON.stringify(value));
        }
      }
    }

    return Boolean(data?.length);
  } catch (error) {
    console.warn("LEEA Supabase learner progress hydrate failed", error);
    return false;
  }
}

export async function saveLearnerProgressValue(lesson: Lesson, key: string, value: unknown) {
  if (!lesson.source.homeworkId || !isSupabaseConfigured || !supabase || typeof window === "undefined") return;

  const storageKey = normalizeLearnerStorageKey(key);
  if (value === null || value === undefined) {
    window.localStorage.removeItem(storageKey);
  } else {
    window.localStorage.setItem(storageKey, JSON.stringify(value));
  }

  try {
    const { data, error } = await supabase
      .from("learner_progress")
      .select("raw_progress")
      .eq("homework_id", lesson.source.homeworkId)
      .eq("student_id", "leo")
      .maybeSingle();

    if (error) throw error;

    const rawProgress = { ...((data?.raw_progress ?? {}) as Record<string, unknown>) };
    if (value === null || value === undefined) {
      delete rawProgress[storageKey];
    } else {
      rawProgress[storageKey] = value;
    }

    await upsertLearnerProgressSummary(lesson, rawProgress);
  } catch (error) {
    console.warn("LEEA Supabase learner progress save failed", error);
  }
}

async function upsertLearnerProgressSummary(lesson: Lesson, rawProgress: Record<string, unknown>) {
  if (!lesson.source.homeworkId || !supabase) return;

  const progress = getLearnerAppProgress(lesson.source);
  const scoreKey = lesson.source.scoreKey ?? "score";
  const scoreData = lesson.source.storagePrefix
    ? loadLocalValue<unknown>(`${lesson.source.storagePrefix}${scoreKey}`, null)
    : null;
  const now = new Date().toISOString();

  const { error } = await supabase.from("learner_progress").upsert(
    {
      id: `learner-progress-leo-${lesson.source.homeworkId}`,
      homework_id: lesson.source.homeworkId,
      lesson_id: lesson.id,
      student_id: "leo",
      storage_prefix: lesson.source.storagePrefix ?? null,
      module_count: progress.moduleCount,
      completed_modules: progress.completedModules,
      modules: progress.modules,
      score_percent: progress.score,
      score: scoreData,
      caption: progress.caption || null,
      done: progress.done,
      raw_progress: rawProgress,
      completed_at: progress.done ? now : null
    },
    { onConflict: "homework_id,student_id" }
  );

  if (error) throw error;
}

export function loadLocalValue<T>(key: string, fallback: T): T {
  try {
    const value = window.localStorage.getItem(key);
    return value === null ? fallback : (JSON.parse(value) as T);
  } catch {
    return fallback;
  }
}

function normalizeLearnerStorageKey(key: string) {
  return key.startsWith("leea-") ? key : `leea-${key}`;
}
