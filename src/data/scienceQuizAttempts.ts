export type ScienceQuizAttempt = {
  sectionId: string;
  chapterTitle: string;
  sectionTitle: string;
  correct: number;
  total: number;
  createdAt: string;
};

/** Kept apart from the math key so one subject's record never colours the other's tutor. */
const STORAGE_KEY = "leea.scienceQuizAttempts.v1";
const MAX_STORED = 20;

export function readScienceQuizAttempts(): ScienceQuizAttempt[] {
  if (typeof window === "undefined") return [];

  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    return saved ? (JSON.parse(saved) as ScienceQuizAttempt[]) : [];
  } catch {
    return [];
  }
}

export function saveScienceQuizAttempt(attempt: ScienceQuizAttempt) {
  if (typeof window === "undefined") return;

  const next = [attempt, ...readScienceQuizAttempts()].slice(0, MAX_STORED);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}
