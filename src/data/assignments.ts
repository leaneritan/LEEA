import type { Lesson } from "./types";

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

export const assignmentStorageKey = "leea.assignments.v1";

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

export function seedAssignments(items: Lesson[], current: AssignmentMap) {
  return items.reduce<AssignmentMap>((next, lesson) => {
    if (lesson.mode === "learner" && lesson.status === "assigned" && !next[lesson.id]) {
      next[lesson.id] = createAssignmentRecord(lesson.id);
    }
    return next;
  }, { ...current });
}

// Browser-only: call from effects/handlers, not during render.
export function readAssignments(learnerItems: Lesson[]): AssignmentMap {
  try {
    const saved = window.localStorage.getItem(assignmentStorageKey);
    const parsed = saved ? (JSON.parse(saved) as AssignmentMap) : {};
    const seeded = seedAssignments(learnerItems, parsed);
    window.localStorage.setItem(assignmentStorageKey, JSON.stringify(seeded));
    return seeded;
  } catch {
    const seeded = seedAssignments(learnerItems, {});
    window.localStorage.setItem(assignmentStorageKey, JSON.stringify(seeded));
    return seeded;
  }
}

export function getOpenAssignmentCount(assignments: AssignmentMap) {
  return Object.values(assignments).filter(
    (assignment) => assignment.status === "assigned" || assignment.status === "needs-redo"
  ).length;
}
