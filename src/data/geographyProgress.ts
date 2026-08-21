import { isSupabaseConfigured, supabase } from "@/lib/supabase";
import { reportCloudSyncFailure, reportCloudSyncSuccess } from "@/lib/syncStatus";

// Leo's progress through the Geography course. Local-first and Supabase-shaped,
// following the same contract as src/data/mathProgress.ts: read local, merge
// cloud by updatedAt, push anything local that is newer.
//
// A map counts as "explored" once Leo has opened every marker on it, and as
// "done" once he has finished its quiz. Both signals come from the embedded
// map through the postMessage bridge in GeographyMapFrame — maps never write
// to localStorage themselves, so this file is the only writer.

export type GeographyMapProgressStatus = "not-done" | "explored" | "done";

export type GeographyMapProgressRecord = {
  studentId: "leo";
  sectionId: string;
  mapId: string;
  status: GeographyMapProgressStatus;
  quizScore: { correct: number; total: number } | null;
  /** How many of the map's markers Leo has opened at least once. */
  exploredCount: number;
  completedAt: string | null;
  updatedAt: string;
};

/** Keyed by `${sectionId}::${mapId}`. */
export type GeographyProgressMap = Record<string, GeographyMapProgressRecord>;

export const geographyProgressStorageKey = "leea.geographyProgress.v1";

type GeographyMapProgressRow = {
  id: string;
  student_id: "leo";
  section_id: string;
  map_id: string;
  status: GeographyMapProgressStatus;
  quiz_score: { correct: number; total: number } | null;
  explored_count: number;
  completed_at: string | null;
  updated_at: string;
};

export function geographyProgressKey(sectionId: string, mapId: string) {
  return `${sectionId}::${mapId}`;
}

export function createGeographyMapProgressRecord(
  sectionId: string,
  mapId: string,
  status: GeographyMapProgressStatus,
  quizScore: { correct: number; total: number } | null = null,
  exploredCount = 0
): GeographyMapProgressRecord {
  const now = new Date().toISOString();

  return {
    studentId: "leo",
    sectionId,
    mapId,
    status,
    quizScore,
    exploredCount,
    completedAt: status === "done" ? now : null,
    updatedAt: now
  };
}

export function getGeographyMapRecord(sectionId: string, mapId: string, progress: GeographyProgressMap) {
  return progress[geographyProgressKey(sectionId, mapId)] ?? null;
}

export function isGeographyMapDone(sectionId: string, mapId: string, progress: GeographyProgressMap) {
  return getGeographyMapRecord(sectionId, mapId, progress)?.status === "done";
}

/**
 * Percent of a chapter's maps Leo has finished. Only 節 that actually have a
 * built map count toward the denominator — a chapter of planned 節 reads 0%
 * rather than pretending to be complete.
 */
export function getChapterCompletionPercent(
  sections: Array<{ id: string; mapIds: string[] }>,
  progress: GeographyProgressMap,
  isReady: (mapId: string) => boolean
) {
  const pairs = sections.flatMap((section) =>
    section.mapIds.filter(isReady).map((mapId) => ({ sectionId: section.id, mapId }))
  );
  if (pairs.length === 0) return { percent: 0, done: 0, total: 0 };

  const done = pairs.filter((pair) => isGeographyMapDone(pair.sectionId, pair.mapId, progress)).length;
  return { percent: Math.round((done / pairs.length) * 100), done, total: pairs.length };
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
      .select("id, student_id, section_id, map_id, status, quiz_score, explored_count, completed_at, updated_at")
      .eq("student_id", "leo");

    if (error) throw error;
    reportCloudSyncSuccess();

    const cloud = ((data ?? []) as GeographyMapProgressRow[]).reduce<GeographyProgressMap>((next, row) => {
      next[geographyProgressKey(row.section_id, row.map_id)] = fromGeographyProgressRow(row);
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
  const key = geographyProgressKey(incoming.sectionId, incoming.mapId);
  const record = mergeGeographyRecords(current[key], incoming);

  writeGeographyProgress({ ...current, [key]: record });
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
      .upsert(records.map(toGeographyProgressRow), { onConflict: "student_id,section_id,map_id" });

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
    sectionId: row.section_id,
    mapId: row.map_id,
    status: row.status,
    quizScore: row.quiz_score,
    exploredCount: row.explored_count,
    completedAt: row.completed_at,
    updatedAt: row.updated_at
  };
}

function toGeographyProgressRow(record: GeographyMapProgressRecord): GeographyMapProgressRow {
  return {
    id: `geography-progress-${record.studentId}-${record.sectionId}-${record.mapId}`,
    student_id: record.studentId,
    section_id: record.sectionId,
    map_id: record.mapId,
    status: record.status,
    quiz_score: record.quizScore,
    explored_count: record.exploredCount,
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
