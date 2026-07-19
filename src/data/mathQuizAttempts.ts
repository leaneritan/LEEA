export type MathQuizAttempt = {
  sectionId: string;
  chapterTitle: string;
  sectionTitle: string;
  correct: number;
  total: number;
  createdAt: string;
};

const STORAGE_KEY = "leea.mathQuizAttempts.v1";
const MAX_STORED = 20;

export function readMathQuizAttempts(): MathQuizAttempt[] {
  if (typeof window === "undefined") return [];

  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    return saved ? (JSON.parse(saved) as MathQuizAttempt[]) : [];
  } catch {
    return [];
  }
}

export function saveMathQuizAttempt(attempt: MathQuizAttempt) {
  if (typeof window === "undefined") return;

  const next = [attempt, ...readMathQuizAttempts()].slice(0, MAX_STORED);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}
