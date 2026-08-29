/**
 * 理科 content types for 新編 新しい科学1 (東京書籍, 中1).
 *
 * Deliberately a smaller vocabulary than `content/subjects/math/types.ts`.
 * The blocks that carry over are the subject-neutral ones — a section opens
 * with an intro, states a goal, poses the textbook's ？, walks worked
 * material, and ends with something Leo answers. What does not carry over is
 * anything shaped by 数学 specifically, and math's 52-member widget union: the
 * whole 理科 book has 16 hands-on moments (9 シミュレーション + 7 思考ツール),
 * so this union grows one entry at a time as chapters are authored.
 */

/** Mirrors the publisher's QR content kinds, so a block can show what the book flags. */
export type ScienceChipKind =
  | "simulation"
  | "thinking-tool"
  | "worksheet"
  | "video"
  | "reference"
  | "practice";

export type ScienceChip = {
  kind: ScienceChipKind;
  label: string;
};

export type ScienceBlockIntro = {
  id: string;
  type: "intro";
  sectionNumber: number;
  title: string;
  question: string;
  pageRange: string;
  topicFlow: string;
  /** Overrides the "{sectionNumber}" pill for non-節 units like 章末. */
  kicker?: string;
};

export type ScienceBlockGoal = {
  id: string;
  type: "goal";
  text: string;
  page?: string;
};

/** The textbook's blue ？ box — the question a 節 exists to answer. */
export type ScienceBlockQ = {
  id: string;
  type: "q";
  heading: string;
  intro: string;
  prompts: string[];
  chips?: ScienceChip[];
  page?: string;
};

/** 観察 / 実験 / 実習 — a numbered procedure with steps and 考察のポイント. */
export type ScienceBlockProcedure = {
  id: string;
  type: "procedure";
  label: string;
  heading: string;
  purpose: string;
  materials?: string[];
  steps: { title: string; items: string[] }[];
  cautions?: string[];
  observationPoints?: string[];
  chips?: ScienceChip[];
  page?: string;
};

/** 基礎操作 — how to use a piece of equipment. */
export type ScienceBlockTechnique = {
  id: string;
  type: "technique";
  heading: string;
  steps: string[];
  cautions?: string[];
  chips?: ScienceChip[];
  page?: string;
};

/** A term the chapter defines, with the sentence the book defines it in. */
export type ScienceBlockTerm = {
  id: string;
  type: "term";
  term: string;
  reading: string;
  statement: string;
  highlightPhrases: string[];
  page?: string;
};

/** 図鑑-style reference rows (p.14–15's 身近に見られる植物 / 動物). */
export type ScienceBlockField = {
  id: string;
  type: "field";
  heading: string;
  intro?: string;
  entries: { name: string; family: string; size: string; note: string }[];
  chips?: ScienceChip[];
  page?: string;
};

export type ScienceBlockRecall = {
  id: string;
  type: "recall";
  label: string;
  heading: string;
  body: string;
  page?: string;
};

/** 章末 学んだことをチェックしよう — answered, then revealed. */
export type ScienceBlockQuickCheck = {
  id: string;
  type: "quickcheck";
  heading: string;
  items: string[];
  answers: string[];
  chips?: ScienceChip[];
  page?: string;
};

/** Before & After シート and the 自分の考えをまとめよう prompts. */
export type ScienceBlockReflect = {
  id: string;
  type: "reflect";
  heading?: string;
  prompts: string[];
  keywords?: string[];
  chips?: ScienceChip[];
  page?: string;
};

/**
 * A hands-on widget standing in for a シミュレーション or 思考ツール QR item.
 * Golden rule 12: anything the book flags as digital/hands-on ships as a real
 * widget that computes from Leo's input, never as re-typed text.
 */
export type ScienceInteractiveWidget = "classification-sort";

export type ScienceBlockInteractive = {
  id: string;
  type: "interactive";
  widget: ScienceInteractiveWidget;
  heading: string;
  intro?: string;
  chips?: ScienceChip[];
  page?: string;
};

export type ScienceBlock =
  | ScienceBlockIntro
  | ScienceBlockGoal
  | ScienceBlockQ
  | ScienceBlockProcedure
  | ScienceBlockTechnique
  | ScienceBlockTerm
  | ScienceBlockField
  | ScienceBlockRecall
  | ScienceBlockQuickCheck
  | ScienceBlockReflect
  | ScienceBlockInteractive;

/** Blocks with a per-student done state that progress tracking keys off. */
export type ScienceStatefulBlock =
  | ScienceBlockQuickCheck
  | ScienceBlockProcedure
  | ScienceBlockInteractive;

export function isScienceStatefulBlock(block: ScienceBlock): block is ScienceStatefulBlock {
  return block.type === "quickcheck" || block.type === "procedure" || block.type === "interactive";
}

export type ScienceSectionStatus = "done" | "now" | "todo";

export type ScienceSectionMeta = {
  id: string;
  chapterId: string;
  number: number;
  name: string;
  pages: string;
  status: ScienceSectionStatus;
  /** Replaces the "{number} {name}" label for non-節 units like 章末. */
  kicker?: string;
  /**
   * Deep link into the publisher's digital companion for this 節.
   * Only ever set from a link someone has actually opened — see
   * `docs/lesson-plans/science/new-science-1/README.md`.
   */
  digitalUrl?: string;
};

export type ScienceSection = {
  id: string;
  chapterId: string;
  number: number;
  title: string;
  pages: string;
  question: string;
  blocks: ScienceBlock[];
  kicker?: string;
};

export type ScienceChapterMeta = {
  id: string;
  unitId: string;
  /** "1" … "4", or null for 学習前 / 単元末, which are not numbered 章. */
  num: string | null;
  title: string;
  subtitle: string;
  pages: string;
  sections: ScienceSectionMeta[];
};

export type ScienceUnitMeta = {
  id: string;
  num: string;
  title: string;
  /** The colour tokens the unit's pages run under. */
  color: string;
  tint: string;
  dark: string;
  chapters: ScienceChapterMeta[];
};
