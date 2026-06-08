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
