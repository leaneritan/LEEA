export type SchoolSubjectId = "japanese" | "social" | "math" | "science" | "english";

export type SubjectScore = {
  subject: SchoolSubjectId;
  score: number;
  average: number | null;
  maxScore: number;
};

export type TestResultRecord = {
  id: string;
  studentId: "leo";
  schoolYear: string;
  term: string;
  testName: string;
  testDate: string;
  rank: number | null;
  studentCount: number | null;
  subjects: SubjectScore[];
  notes: string;
  createdAt: string;
  updatedAt: string;
};

export type AcademicGoalRecord = {
  id: string;
  studentId: "leo";
  totalScore: number;
  rank: number;
  studentCount: number;
  subjectGoals: Record<SchoolSubjectId, number>;
  updatedAt: string;
};

export const testResultsStorageKey = "leea.academicProgress.testResults.v1";
export const academicGoalsStorageKey = "leea.academicProgress.goals.v1";

export const schoolSubjects: Array<{ id: SchoolSubjectId; label: string; shortLabel: string; color: string }> = [
  { id: "japanese", label: "Japanese", shortLabel: "JP", color: "#c92f2f" },
  { id: "social", label: "Social Studies", shortLabel: "SS", color: "#d76a14" },
  { id: "math", label: "Math", shortLabel: "MA", color: "#1f63c2" },
  { id: "science", label: "Science", shortLabel: "SC", color: "#149447" },
  { id: "english", label: "English", shortLabel: "EN", color: "#7b3fc5" }
];

export const defaultAcademicGoals: AcademicGoalRecord = {
  id: "academic-goals-leo-default",
  studentId: "leo",
  totalScore: 420,
  rank: 40,
  studentCount: 150,
  subjectGoals: {
    japanese: 85,
    social: 85,
    math: 85,
    science: 85,
    english: 95
  },
  updatedAt: "2026-05-17T00:00:00.000Z"
};

export const starterTestResults: TestResultRecord[] = [
  {
    id: "test-leo-2026-05-17-term-1-midterm",
    studentId: "leo",
    schoolYear: "2026",
    term: "Term 1",
    testName: "Term 1 Midterm",
    testDate: "2026-05-17",
    rank: 65,
    studentCount: 150,
    subjects: [
      { subject: "japanese", score: 70, average: 74.2, maxScore: 100 },
      { subject: "social", score: 75, average: 56.3, maxScore: 100 },
      { subject: "math", score: 75, average: 67.2, maxScore: 100 },
      { subject: "science", score: 80, average: 67.6, maxScore: 100 },
      { subject: "english", score: 92, average: 82.7, maxScore: 100 }
    ],
    notes: "Imported from Leo's periodic test tracker prototype.",
    createdAt: "2026-05-17T00:00:00.000Z",
    updatedAt: "2026-05-17T00:00:00.000Z"
  }
];

export function getSubjectMeta(subject: SchoolSubjectId) {
  return schoolSubjects.find((item) => item.id === subject) ?? schoolSubjects[0];
}

export function getTestTotal(record: TestResultRecord) {
  return record.subjects.reduce((total, subject) => total + subject.score, 0);
}

export function getAverageTotal(record: TestResultRecord) {
  const averages = record.subjects.map((subject) => subject.average).filter((value): value is number => value !== null);
  if (!averages.length) return null;
  return Math.round(averages.reduce((total, value) => total + value, 0) * 10) / 10;
}

export function sortTestResults(records: TestResultRecord[]) {
  return [...records].sort((a, b) => a.testDate.localeCompare(b.testDate));
}
