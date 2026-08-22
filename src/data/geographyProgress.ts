import { isSupabaseConfigured, supabase } from "@/lib/supabase";
import { reportCloudSyncFailure, reportCloudSyncSuccess } from "@/lib/syncStatus";

// Leo's progress through the Geography course. Local-first and Supabase-shaped,
// following the same contract as src/data/mathProgress.ts: read local, merge
// cloud by updatedAt, push anything local that is newer.
//
// A map counts as "explored" once Leo has opened every marker on it, and as
// "done" once he has finished its quiz. Both signals come from the embedded
// map through the postMessage bridge in GeographyMapView — maps never write
// to localStorage themselves, so this file is the only writer.
//
// Records are keyed by map id alone. They used to carry the 節 they sat in,
// back when Geography had a chapter spine; that spine is gone, and a map is
// the only thing progress was ever really about.

export type GeographyMapProgressStatus = "not-done" | "explored" | "done";

/**
 * How Leo has done on one thing inside a map — a country, a continent, a
 * civilization. Kept per item so the quiz can lean on what he keeps missing
 * instead of drawing at random, the same idea as Reference's I Know /
 * I Don't Know for English words.
 */
export type GeographyItemStat = {
  asked: number;
  correct: number;
  /** Whether the most recent answer was right — a fresh miss outranks old accuracy. */
  lastCorrect: boolean;
  updatedAt: string;
};

export type GeographyItemStats = Record<string, GeographyItemStat>;

/** One quiz answer as an embedded map reports it. */
export type GeographyItemResult = { id: string; correct: boolean };

export type GeographyMapProgressRecord = {
  studentId: "leo";
  mapId: string;
  status: GeographyMapProgressStatus;
  quizScore: { correct: number; total: number } | null;
  /** How many of the map's markers Leo has opened at least once. */
  exploredCount: number;
  /** Per-item quiz history, keyed by the id the map uses for that item. */
  items: GeographyItemStats;
  completedAt: string | null;
  updatedAt: string;
};

/** Keyed by map id. */
export type GeographyProgressMap = Record<string, GeographyMapProgressRecord>;

export const geographyProgressStorageKey = "leea.geographyProgress.v1";

type GeographyMapProgressRow = {
  id: string;
  student_id: "leo";
  map_id: string;
  status: GeographyMapProgressStatus;
  quiz_score: { correct: number; total: number } | null;
  explored_count: number;
  items: GeographyItemStats | null;
  completed_at: string | null;
  updated_at: string;
};

export function createGeographyMapProgressRecord(
  mapId: string,
  status: GeographyMapProgressStatus,
  quizScore: { correct: number; total: number } | null = null,
  exploredCount = 0,
  items: GeographyItemStats = {}
): GeographyMapProgressRecord {
  const now = new Date().toISOString();

  return {
    studentId: "leo",
    mapId,
    status,
    quizScore,
    exploredCount,
    items,
    completedAt: status === "done" ? now : null,
    updatedAt: now
  };
}

/**
 * Folds one quiz run's answers into the stats already held. Counts accumulate,
 * and lastCorrect always reflects the most recent answer — a fresh miss should
 * bring an item back around even if its long-run accuracy is good.
 */
export function applyItemResults(
  existing: GeographyItemStats | undefined,
  results: GeographyItemResult[]
): GeographyItemStats {
  const next: GeographyItemStats = { ...(existing ?? {}) };
  const now = new Date().toISOString();

  for (const result of results) {
    if (!result || typeof result.id !== "string" || !result.id) continue;
    const current = next[result.id];
    next[result.id] = {
      asked: (current?.asked ?? 0) + 1,
      correct: (current?.correct ?? 0) + (result.correct ? 1 : 0),
      lastCorrect: Boolean(result.correct),
      updatedAt: now
    };
  }

  return next;
}

/** Items Leo has been asked and is not reliably getting right. */
export function getWeakItemIds(items: GeographyItemStats | undefined) {
  return Object.entries(items ?? {})
    .filter(([, stat]) => stat.asked > 0 && (!stat.lastCorrect || stat.correct / stat.asked < 0.5))
    .map(([id]) => id);
}

export function getGeographyMapRecord(mapId: string, progress: GeographyProgressMap) {
  return progress[mapId] ?? null;
}

export function isGeographyMapDone(mapId: string, progress: GeographyProgressMap) {
  return getGeographyMapRecord(mapId, progress)?.status === "done";
}

export function readGeographyProgress(): GeographyProgressMap {
  if (typeof window === "undefined") return {};

  try {
    const saved = window.localStorage.getItem(geographyProgressStorageKey);
    return saved ? (JSON.parse(saved) as GeographyProgressMap) : {};
  } catch {
    return {};
  }
}

export function writeGeographyProgress(progress: GeographyProgressMap) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(geographyProgressStorageKey, JSON.stringify(progress));
}

export async function syncGeographyProgressWithCloud(current: GeographyProgressMap): Promise<GeographyProgressMap> {
  if (!isSupabaseConfigured || !supabase || typeof window === "undefined") return current;

  try {
    const { data, error } = await supabase
      .from("geography_map_progress")
      .select("id, student_id, map_id, status, quiz_score, explored_count, items, completed_at, updated_at")
      .eq("student_id", "leo");

    if (error) throw error;
    reportCloudSyncSuccess();

    const cloud = ((data ?? []) as GeographyMapProgressRow[]).reduce<GeographyProgressMap>((next, row) => {
      next[row.map_id] = fromGeographyProgressRow(row);
      return next;
    }, {});

    const merged = { ...current };
    const localRecordsToPush: GeographyMapProgressRecord[] = [];

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
      await upsertGeographyProgressRecords(localRecordsToPush);
    }

    writeGeographyProgress(merged);
    return merged;
  } catch (error) {
    console.warn("LEEA Supabase geography progress sync failed", error);
    reportCloudSyncFailure();
    return current;
  }
}

/**
 * Saves one map's progress, never downgrading what Leo has already earned:
 * a "done" map stays done when he reopens it, the best quiz score is kept,
 * and exploredCount only ever grows.
 */
export async function saveGeographyMapProgress(incoming: GeographyMapProgressRecord) {
  const current = readGeographyProgress();
  const record = mergeGeographyRecords(current[incoming.mapId], incoming);

  writeGeographyProgress({ ...current, [incoming.mapId]: record });
  await upsertGeographyProgressRecords([record]);
  return record;
}

export function mergeGeographyRecords(
  existing: GeographyMapProgressRecord | undefined,
  incoming: GeographyMapProgressRecord
): GeographyMapProgressRecord {
  if (!existing) return incoming;

  const rank: Record<GeographyMapProgressStatus, number> = { "not-done": 0, explored: 1, done: 2 };
  const status = rank[incoming.status] >= rank[existing.status] ? incoming.status : existing.status;
  const quizScore = bestQuizScore(existing.quizScore, incoming.quizScore);

  return {
    ...incoming,
    status,
    quizScore,
    exploredCount: Math.max(existing.exploredCount, incoming.exploredCount),
    items: { ...existing.items, ...incoming.items },
    completedAt: existing.completedAt ?? (status === "done" ? incoming.completedAt ?? new Date().toISOString() : null)
  };
}

function bestQuizScore(
  existing: { correct: number; total: number } | null,
  incoming: { correct: number; total: number } | null
) {
  if (!existing) return incoming;
  if (!incoming) return existing;
  return incoming.correct >= existing.correct ? incoming : existing;
}

async function upsertGeographyProgressRecords(records: GeographyMapProgressRecord[]) {
  if (!isSupabaseConfigured || !supabase || records.length === 0) return;

  try {
    const { error } = await supabase
      .from("geography_map_progress")
      .upsert(records.map(toGeographyProgressRow), { onConflict: "student_id,map_id" });

    if (error) throw error;
    reportCloudSyncSuccess();
  } catch (error) {
    console.warn("LEEA Supabase geography progress save failed", error);
    reportCloudSyncFailure();
  }
}

function fromGeographyProgressRow(row: GeographyMapProgressRow): GeographyMapProgressRecord {
  return {
    studentId: "leo",
    mapId: row.map_id,
    status: row.status,
    quizScore: row.quiz_score,
    exploredCount: row.explored_count,
    items: row.items ?? {},
    completedAt: row.completed_at,
    updatedAt: row.updated_at
  };
}

function toGeographyProgressRow(record: GeographyMapProgressRecord): GeographyMapProgressRow {
  return {
    id: `geography-progress-${record.studentId}-${record.mapId}`,
    student_id: record.studentId,
    map_id: record.mapId,
    status: record.status,
    quiz_score: record.quizScore,
    explored_count: record.exploredCount,
    items: record.items,
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
