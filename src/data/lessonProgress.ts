import { isSupabaseConfigured, supabase } from "@/lib/supabase";

export type LessonProgressStatus = "not-started" | "done";

export type LessonProgressRecord = {
  lessonId: string;
  teacherId: "neritan";
  studentId: "leo";
  status: LessonProgressStatus;
  completedAt: string | null;
  updatedAt: string;
};

export type LessonProgressMap = Record<string, LessonProgressRecord>;

export const lessonProgressStorageKey = "leea.lessonProgress.v1";

type LessonProgressRow = {
  id: string;
  lesson_id: string;
  teacher_id: "neritan";
  student_id: "leo";
  status: LessonProgressStatus;
  completed_at: string | null;
  updated_at: string;
};

export function createLessonProgressRecord(lessonId: string, done: boolean): LessonProgressRecord {
  const now = new Date().toISOString();

  return {
    lessonId,
    teacherId: "neritan",
    studentId: "leo",
    status: done ? "done" : "not-started",
    completedAt: done ? now : null,
    updatedAt: now
  };
}

export function getDoneLessonCount(lessonIds: string[], progress: LessonProgressMap) {
  return lessonIds.filter((lessonId) => progress[lessonId]?.status === "done").length;
}

export function readLessonProgress(): LessonProgressMap {
  if (typeof window === "undefined") return {};

  try {
    const saved = window.localStorage.getItem(lessonProgressStorageKey);
    return saved ? (JSON.parse(saved) as LessonProgressMap) : {};
  } catch {
    return {};
  }
}

export function writeLessonProgress(progress: LessonProgressMap) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(lessonProgressStorageKey, JSON.stringify(progress));
}

export async function syncLessonProgressWithCloud(current: LessonProgressMap): Promise<LessonProgressMap> {
  if (!isSupabaseConfigured || !supabase || typeof window === "undefined") return current;

  try {
    const { data, error } = await supabase
      .from("teacher_lesson_progress")
      .select("id, lesson_id, teacher_id, student_id, status, completed_at, updated_at")
      .eq("student_id", "leo")
      .eq("teacher_id", "neritan");

    if (error) throw error;

    const cloud = ((data ?? []) as LessonProgressRow[]).reduce<LessonProgressMap>((next, row) => {
      next[row.lesson_id] = fromLessonProgressRow(row);
      return next;
    }, {});

    const merged = { ...current };
    const localRecordsToPush: LessonProgressRecord[] = [];

    for (const [lessonId, localRecord] of Object.entries(current)) {
      const cloudRecord = cloud[lessonId];
      if (!cloudRecord || isNewer(localRecord.updatedAt, cloudRecord.updatedAt)) {
        localRecordsToPush.push(localRecord);
      }
    }

    for (const [lessonId, cloudRecord] of Object.entries(cloud)) {
      const localRecord = current[lessonId];
      if (!localRecord || isNewer(cloudRecord.updatedAt, localRecord.updatedAt)) {
        merged[lessonId] = cloudRecord;
      }
    }

    if (localRecordsToPush.length) {
      await upsertLessonProgressRecords(localRecordsToPush);
    }

    writeLessonProgress(merged);
    return merged;
  } catch (error) {
    console.warn("LEEA Supabase teacher lesson progress sync failed", error);
    return current;
  }
}

export async function saveLessonProgressRecord(record: LessonProgressRecord) {
  writeLessonProgress({ ...readLessonProgress(), [record.lessonId]: record });
  await upsertLessonProgressRecords([record]);
}

async function upsertLessonProgressRecords(records: LessonProgressRecord[]) {
  if (!isSupabaseConfigured || !supabase || records.length === 0) return;

  const { error } = await supabase
    .from("teacher_lesson_progress")
    .upsert(records.map(toLessonProgressRow), { onConflict: "lesson_id,teacher_id,student_id" });

  if (error) throw error;
}

function fromLessonProgressRow(row: LessonProgressRow): LessonProgressRecord {
  return {
    lessonId: row.lesson_id,
    teacherId: "neritan",
    studentId: "leo",
    status: row.status,
    completedAt: row.completed_at,
    updatedAt: row.updated_at
  };
}

function toLessonProgressRow(record: LessonProgressRecord): LessonProgressRow {
  return {
    id: `teacher-progress-${record.teacherId}-${record.studentId}-${record.lessonId}`,
    lesson_id: record.lessonId,
    teacher_id: record.teacherId,
    student_id: record.studentId,
    status: record.status,
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
