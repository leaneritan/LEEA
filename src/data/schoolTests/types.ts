// School test results (定期テスト・実力テスト) for Leo.
//
// The master copy of the data lives next to the photos of the papers, in
// Neritan's `Leo's_Tests/tests.json`. `content/school-tests/tests.json` is a
// copy of that file — replace it whole after each new test, never hand-edit
// one without the other.

export const CORE_SUBJECTS = ["japanese", "social", "math", "science", "english"] as const;
export const EXTRA_SUBJECTS = ["music", "health", "techHome", "art"] as const;
export const ALL_SUBJECTS = [...CORE_SUBJECTS, ...EXTRA_SUBJECTS] as const;

export type CoreSubject = (typeof CORE_SUBJECTS)[number];
export type ExtraSubject = (typeof EXTRA_SUBJECTS)[number];
export type Subject = (typeof ALL_SUBJECTS)[number];

export type TestType = "中間" | "期末" | "実力" | "その他";

export type TotalResult = {
  score: number;
  /** Official average of the total, as printed. Not the sum of subject averages. */
  average: number;
  rank: number | null;
  genderRank: number | null;
};

export type DomainResult = {
  /** 領域名 as printed on the score report. */
  name: string;
  score: number;
  max: number;
  /** Leo's 正答率 (%). */
  rate: number;
  /** Everyone's 正答率 (%). */
  overall: number;
};

export type QuestionResult = {
  /** The paper's own number, e.g. "1(9)" or "四(一)③". */
  no: string;
  ok: boolean;
  /** Everyone's 正答率 for this question (%). */
  rate: number;
  topic: string;
  /** 1-based index into the subject's `domains` array. */
  domain: number;
  /** 配点. null when the report does not let us derive it. */
  points: number | null;
};

export type SchoolTest = {
  /** Stable id, e.g. "2026-1-chukan". Review cards are keyed by it. */
  id: string;
  /** Folder in Leo's_Tests that holds the photos. */
  folder: string;
  name: string;
  type: TestType;
  /** The day the test was sat (YYYY-MM-DD). */
  date: string;
  /** 定期テスト averages are the school's; 実力テスト averages are the prefecture's. */
  averageScope: "school" | "prefecture";
  files: string[];
  scores: Partial<Record<Subject, number>>;
  average: Partial<Record<Subject, number>>;
  /** 校内（学年）順位 per subject. */
  subjectRanks: Partial<Record<Subject, number>>;
  /** 男女別順位 per subject. */
  genderRanks?: Partial<Record<Subject, number>>;
  totals: {
    total3: TotalResult;
    total5: TotalResult;
    total9?: TotalResult;
  };
  domains?: Partial<Record<CoreSubject, DomainResult[]>>;
  questions?: Partial<Record<CoreSubject, QuestionResult[]>>;
  remarks?: string[];
};

export type SchoolTestsFile = {
  schemaVersion: number;
  updated: string;
  student: { name: string; school: string; grade: number; class: number; number: number };
  subjectLabels: Record<Subject, string>;
  notes: string[];
  tests: SchoolTest[];
};

// ---------- Review cards (弱点カード) ----------

export type CardStatus = "todo" | "practiced" | "mastered";

/** Why Leo got it wrong. Each one needs a different fix. */
export type MissReason = "careless" | "unknown" | "misread" | "time" | "blank";

export type ReviewCardState = {
  /** `${testId}:${subject}:${questionNo}` */
  id: string;
  testId: string;
  subject: CoreSubject;
  questionNo: string;
  status: CardStatus;
  reason: MissReason | null;
  note: string;
  practiceCount: number;
  practicedAt: string | null;
  masteredAt: string | null;
  updatedAt: string;
};

export type NextTestPlan = {
  name: string;
  /** YYYY-MM-DD, or "" when the date is not known yet. */
  date: string;
  /** How many review cards Leo does on a study day. */
  cardsPerDay: number;
};

export type AcademicGoals = {
  total5: number;
  /** 5科目 school rank to aim for. */
  rank: number;
  /** Students in the year, for 上位% figures. */
  students: number;
  subjects: Record<CoreSubject, number>;
};

export type SchoolTestSettings = {
  nextTest: NextTestPlan;
  goals: AcademicGoals;
  updatedAt: string;
};
