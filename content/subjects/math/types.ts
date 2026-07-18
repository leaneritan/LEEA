export type MathChipKind = "simulation" | "worksheet" | "flashcard" | "hint-answer" | "video" | "dialogue-sheet";

export type MathChip = {
  kind: MathChipKind;
  label: string;
};

export type NumberLineDiagram = {
  min: number;
  max: number;
  ticks: number[];
  arrow?: { from: number; to: number; label: string };
};

export type MathBlockIntro = {
  id: string;
  type: "intro";
  sectionNumber: number;
  title: string;
  question: string;
  pageRange: string;
  topicFlow: string;
};

export type MathBlockGoal = {
  id: string;
  type: "goal";
  text: string;
  page?: string;
};

export type MathBlockQ = {
  id: string;
  type: "q";
  heading: string;
  intro: string;
  prompts: string[];
  diagram?: NumberLineDiagram;
  chips?: MathChip[];
  page?: string;
};

export type MathBlockExample = {
  id: string;
  type: "example";
  label: string;
  heading: string;
  problem: string;
  steps: string[];
  note?: string;
  page?: string;
};

export type MathBlockRule = {
  id: string;
  type: "rule";
  label: string;
  statement: string;
  highlightPhrases: string[];
  examples: string[];
  page?: string;
};

export type MathBlockPractice = {
  id: string;
  type: "practice";
  label: string;
  heading: string;
  mustMaster?: boolean;
  tag?: "知識・技能" | "思考・判断・表現";
  items: string[];
  chips?: MathChip[];
  page?: string;
};

export type MathBlockRecall = {
  id: string;
  type: "recall";
  label: string;
  heading: string;
  body: string;
  page?: string;
};

export type MathBlockQuickCheck = {
  id: string;
  type: "quickcheck";
  heading: string;
  items: string[];
  answers: string[];
  page?: string;
};

export type MathBlockWindow = {
  id: string;
  type: "window";
  heading: string;
  body: string;
  chips?: MathChip[];
  page?: string;
};

export type MathBlockReflect = {
  id: string;
  type: "reflect";
  prompts: string[];
  page?: string;
};

/** A hands-on widget standing in for the textbook's "シミュレーション" digital content. */
export type MathBlockInteractiveWidget =
  | "kuku-table"
  | "prime-sieve"
  | "number-line-walk"
  | "card-game"
  | "number-line-plot"
  | "signed-product"
  | "walk-rate"
  | "number-range-grid"
  | "average-baseline";

export type MathBlockInteractive = {
  id: string;
  type: "interactive";
  widget: MathBlockInteractiveWidget;
  heading: string;
  intro?: string;
  page?: string;
  /** Only used by "signed-product" — how many sign tiles to start with. */
  tileCount?: number;
};

export type MathBlock =
  | MathBlockIntro
  | MathBlockGoal
  | MathBlockQ
  | MathBlockExample
  | MathBlockRule
  | MathBlockPractice
  | MathBlockRecall
  | MathBlockQuickCheck
  | MathBlockWindow
  | MathBlockReflect
  | MathBlockInteractive;

/** Blocks with a per-student できた / 解答閲覧 state that progress tracking keys off. */
export type MathStatefulBlock = MathBlockPractice | MathBlockQuickCheck;

export type MathSectionStatus = "done" | "now" | "todo";

export type MathSectionMeta = {
  id: string;
  chapterId: string;
  number: number;
  name: string;
  pages: string;
  status: MathSectionStatus;
};

export type MathSection = {
  id: string;
  chapterId: string;
  number: number;
  title: string;
  pages: string;
  question: string;
  blocks: MathBlock[];
};

export type MathChapterMeta = {
  id: string;
  num: string;
  title: string;
  subtitle: string;
  color: string;
  tint: string;
  dark: string;
  sections: MathSectionMeta[];
};
