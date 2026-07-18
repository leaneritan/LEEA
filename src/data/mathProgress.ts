import { isSupabaseConfigured, supabase } from "@/lib/supabase";

export type MathBlockProgressStatus = "not-done" | "done";

export type MathBlockProgressRecord = {
  studentId: "leo";
  sectionId: string;
  blockId: string;
  status: MathBlockProgressStatus;
  quizScore: { correct: number; total: number } | null;
  completedAt: string | null;
  updatedAt: string;
};

/** Keyed by `${sectionId}::${blockId}`. */
export type MathBlockProgressMap = Record<string, MathBlockProgressRecord>;

export const mathProgressStorageKey = "leea.mathProgress.v1";

type MathBlockProgressRow = {
  id: string;
  student_id: "leo";
  section_id: string;
  block_id: string;
  status: MathBlockProgressStatus;
  quiz_score: { correct: number; total: number } | null;
  completed_at: string | null;
  updated_at: string;
};

function progressKey(sectionId: string, blockId: string) {
  return `${sectionId}::${blockId}`;
}

export function createMathBlockProgressRecord(
  sectionId: string,
  blockId: string,
  done: boolean,
  quizScore: { correct: number; total: number } | null = null
): MathBlockProgressRecord {
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

export function isBlockDone(sectionId: string, blockId: string, progress: MathBlockProgressMap) {
  return progress[progressKey(sectionId, blockId)]?.status === "done";
}

export function getSectionCompletionPercent(sectionId: string, blockIds: string[], progress: MathBlockProgressMap) {
  if (blockIds.length === 0) return 0;
  const done = blockIds.filter((blockId) => isBlockDone(sectionId, blockId, progress)).length;
  return Math.round((done / blockIds.length) * 100);
}

export function readMathProgress(): MathBlockProgressMap {
  if (typeof window === "undefined") return {};

  try {
    const saved = window.localStorage.getItem(mathProgressStorageKey);
    return saved ? (JSON.parse(saved) as MathBlockProgressMap) : {};
  } catch {
    return {};
  }
}

export function writeMathProgress(progress: MathBlockProgressMap) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(mathProgressStorageKey, JSON.stringify(progress));
}

export async function syncMathProgressWithCloud(current: MathBlockProgressMap): Promise<MathBlockProgressMap> {
  if (!isSupabaseConfigured || !supabase || typeof window === "undefined") return current;

  try {
    const { data, error } = await supabase
      .from("math_block_progress")
      .select("id, student_id, section_id, block_id, status, quiz_score, completed_at, updated_at")
      .eq("student_id", "leo");

    if (error) throw error;

    const cloud = ((data ?? []) as MathBlockProgressRow[]).reduce<MathBlockProgressMap>((next, row) => {
      next[progressKey(row.section_id, row.block_id)] = fromMathProgressRow(row);
      return next;
    }, {});

    const merged = { ...current };
    const localRecordsToPush: MathBlockProgressRecord[] = [];

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

    if (localRecordsToPush.length) {
      await upsertMathProgressRecords(localRecordsToPush);
    }

    writeMathProgress(merged);
    return merged;
  } catch (error) {
    console.warn("LEEA Supabase math progress sync failed", error);
    return current;
  }
}

export async function saveMathBlockProgress(record: MathBlockProgressRecord) {
  writeMathProgress({ ...readMathProgress(), [progressKey(record.sectionId, record.blockId)]: record });
  await upsertMathProgressRecords([record]);
}

async function upsertMathProgressRecords(records: MathBlockProgressRecord[]) {
  if (!isSupabaseConfigured || !supabase || records.length === 0) return;

  const { error } = await supabase
    .from("math_block_progress")
    .upsert(records.map(toMathProgressRow), { onConflict: "student_id,section_id,block_id" });

  if (error) throw error;
}

function fromMathProgressRow(row: MathBlockProgressRow): MathBlockProgressRecord {
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

function toMathProgressRow(record: MathBlockProgressRecord): MathBlockProgressRow {
  return {
    id: `math-progress-${record.studentId}-${record.sectionId}-${record.blockId}`,
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
