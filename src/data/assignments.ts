import type { Lesson } from "./types";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";

export type AssignmentStatus = "assigned" | "completed" | "reviewed" | "needs-redo";

export type AssignmentRecord = {
  id: string;
  lessonId: string;
  teacherId: "neritan";
  studentId: "leo";
  status: AssignmentStatus;
  assignedAt: string;
  updatedAt: string;
  reviewedAt: string | null;
  reviewNote?: string;
};

export type AssignmentMap = Record<string, AssignmentRecord>;

type AssignmentRow = {
  id: string;
  lesson_id: string;
  teacher_id: "neritan";
  student_id: "leo";
  status: AssignmentStatus;
  assigned_at: string;
  completed_at: string | null;
  reviewed_at: string | null;
  review_note: string | null;
  updated_at: string;
};

export const assignmentStorageKey = "leea.assignments.v1";
const unassignedStorageKey = "leea.assignments.unassigned.v1";

export function createAssignmentRecord(lessonId: string): AssignmentRecord {
  const now = new Date().toISOString();

  return {
    id: `assignment-${lessonId}`,
    lessonId,
    teacherId: "neritan",
    studentId: "leo",
    status: "assigned",
    assignedAt: now,
    updatedAt: now,
    reviewedAt: null
  };
}

export function createReviewRecord(current: AssignmentRecord, status: Extract<AssignmentStatus, "reviewed" | "needs-redo">): AssignmentRecord {
  const now = new Date().toISOString();

  return {
    ...current,
    status,
    updatedAt: now,
    reviewedAt: now
  };
}

function readUnassignedSet(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = window.localStorage.getItem(unassignedStorageKey);
    return new Set(raw ? (JSON.parse(raw) as string[]) : []);
  } catch {
    return new Set();
  }
}

function writeUnassignedSet(set: Set<string>) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(unassignedStorageKey, JSON.stringify(Array.from(set)));
}

function readLocalAssignments(): AssignmentMap {
  if (typeof window === "undefined") return {};
  try {
    const saved = window.localStorage.getItem(assignmentStorageKey);
    return saved ? (JSON.parse(saved) as AssignmentMap) : {};
  } catch {
    return {};
  }
}

function writeLocalAssignments(assignments: AssignmentMap) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(assignmentStorageKey, JSON.stringify(assignments));
}

function toAssignmentRecord(row: AssignmentRow): AssignmentRecord {
  return {
    id: row.id,
    lessonId: row.lesson_id,
    teacherId: "neritan",
    studentId: "leo",
    status: row.status,
    assignedAt: row.assigned_at,
    updatedAt: row.updated_at,
    reviewedAt: row.reviewed_at,
    reviewNote: row.review_note ?? undefined
  };
}

function toAssignmentRow(record: AssignmentRecord): AssignmentRow {
  return {
    id: record.id,
    lesson_id: record.lessonId,
    teacher_id: record.teacherId,
    student_id: record.studentId,
    status: record.status,
    assigned_at: record.assignedAt,
    completed_at: record.status === "completed" ? record.updatedAt : null,
    reviewed_at: record.reviewedAt,
    review_note: record.reviewNote ?? null,
    updated_at: record.updatedAt
  };
}

async function upsertAssignmentRecords(records: AssignmentRecord[]) {
  if (!isSupabaseConfigured || !supabase || records.length === 0) return;
  try {
    await supabase
      .from("assignments")
      .upsert(records.map(toAssignmentRow), { onConflict: "lesson_id,student_id" });
  } catch (error) {
    console.warn("LEEA Supabase assignment upsert failed", error);
  }
}

async function deleteAssignmentRecord(lessonId: string) {
  if (!isSupabaseConfigured || !supabase) return;
  try {
    await supabase
      .from("assignments")
      .delete()
      .eq("lesson_id", lessonId)
      .eq("student_id", "leo");
  } catch (error) {
    console.warn("LEEA Supabase assignment delete failed", error);
  }
}

// Seed auto-assigned lessons, but never resurrect lessons Neritan explicitly unassigned.
export function seedAssignments(items: Lesson[], current: AssignmentMap) {
  const unassigned = readUnassignedSet();
  return items.reduce<AssignmentMap>((next, lesson) => {
    if (
      lesson.mode === "learner" &&
      lesson.status === "assigned" &&
      !next[lesson.id] &&
      !unassigned.has(lesson.id)
    ) {
      next[lesson.id] = createAssignmentRecord(lesson.id);
    }
    return next;
  }, { ...current });
}

// Browser-only: call from effects/handlers, not during render.
export function readAssignments(learnerItems: Lesson[]): AssignmentMap {
  const seeded = seedAssignments(learnerItems, readLocalAssignments());
  writeLocalAssignments(seeded);
  return seeded;
}

export async function readAssignmentsFromCloud(learnerItems: Lesson[]): Promise<AssignmentMap> {
  const localSeeded = readAssignments(learnerItems);
  if (!isSupabaseConfigured || !supabase) return localSeeded;

  try {
    const { data, error } = await supabase
      .from("assignments")
      .select("id, lesson_id, teacher_id, student_id, status, assigned_at, completed_at, reviewed_at, review_note, updated_at")
      .eq("student_id", "leo");

    if (error) throw error;

    const cloudMap = (data ?? []).reduce<AssignmentMap>((next, row) => {
      const record = toAssignmentRecord(row as AssignmentRow);
      next[record.lessonId] = record;
      return next;
    }, {});
    const merged = seedAssignments(learnerItems, cloudMap);
    writeLocalAssignments(merged);

    const recordsMissingFromCloud = Object.values(merged).filter((record) => !cloudMap[record.lessonId]);
    void upsertAssignmentRecords(recordsMissingFromCloud);
    return merged;
  } catch (error) {
    console.warn("LEEA Supabase assignment read failed; using local assignments", error);
    return localSeeded;
  }
}

export function assignLesson(lessonId: string, current: AssignmentMap): AssignmentMap {
  const next = { ...current, [lessonId]: current[lessonId] ?? createAssignmentRecord(lessonId) };
  writeLocalAssignments(next);
  const unassigned = readUnassignedSet();
  if (unassigned.delete(lessonId)) writeUnassignedSet(unassigned);
  void upsertAssignmentRecords([next[lessonId]]);
  return next;
}

export function unassignLesson(lessonId: string, current: AssignmentMap): AssignmentMap {
  const next = { ...current };
  delete next[lessonId];
  writeLocalAssignments(next);
  const unassigned = readUnassignedSet();
  unassigned.add(lessonId);
  writeUnassignedSet(unassigned);
  void deleteAssignmentRecord(lessonId);
  return next;
}

export function saveAssignments(assignments: AssignmentMap): AssignmentMap {
  writeLocalAssignments(assignments);
  void upsertAssignmentRecords(Object.values(assignments));
  return assignments;
}

export function getOpenAssignmentCount(assignments: AssignmentMap) {
  return Object.values(assignments).filter(
    (assignment) => assignment.status === "assigned" || assignment.status === "needs-redo"
  ).length;
}
