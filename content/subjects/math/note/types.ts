/**
 * 数学の学習ノート 1年（東京書籍版）— the 教科書準拠ワーク that accompanies
 * 新編 新しい数学1.
 *
 * A separate book from the textbook, so it gets a separate spine and its own
 * page numbers. **Every page number in this file and its content is a WORKBOOK
 * page.** The textbook page a section practises is carried explicitly as
 * `textbookRef`, read off the 教科書 P.NN line the workbook itself prints in the
 * corner of each section — never inferred from chapter order. The same split
 * 理科 already keeps between `new-science-1` and `yokuwakaru-rika-1`.
 *
 * Widgets are deliberately NOT a new union: a note block reuses
 * `MathBlockInteractiveWidget` from `../types`, so every widget already built
 * for the textbook is available here without being rebuilt.
 */

import type { MathBlockInteractiveWidget } from "../types";

export type MathNoteTag = "知・技" | "思・判・表";

/**
 * One 小問 — the book's (1), (2), … How Leo answers depends on what the book
 * gives, in the same spirit as 理科's ワーク items:
 *
 * - `accept` → he types the answer and is marked ○/×. This is the common case
 *   in 数学, where an answer is a value rather than a choice. It is not a
 *   multiple-choice question in disguise: he produces the book's own answer.
 * - `choices` → he picks. **Only ever the book's own options, in the book's own
 *   order** (a 「どちらですか」 question prints exactly two). Distractors are
 *   never invented, because a made-up wrong answer teaches a made-up
 *   distinction.
 * - neither, with `answer` → a 記述 question: he answers on paper, then checks.
 * - neither at all → paper work with nothing to check against. No button.
 */
export type MathNotePart = {
  /** The book's own label: "(1)", "(2)", or a named slot like "負の数". */
  label?: string;
  /** Omitted when the question's stem is the whole prompt. */
  prompt?: string;
  /**
   * Accepted answers. Compared after normalisation (full-width → half-width,
   * every dash → "-", spaces dropped), and numerically where both sides parse
   * as numbers, so "+14" and "14" agree. The first entry is the canonical one
   * shown as 正解.
   */
  accept?: string[];
  /** Answer is a set: "+14, -14" and "-14, +14" both count. */
  unordered?: boolean;
  /** Printed after the input box so Leo types the number, not the unit. */
  unit?: string;
  /** The book's own options, in the book's own order. */
  choices?: string[];
  /** Indices into `choices`. More than one for a すべて選びなさい question. */
  correct?: number[];
  /** The worked explanation, shown once he has committed to an answer. */
  answer?: string;
  /**
   * How this answer was established. The workbook's 別冊解答 is not scanned, so
   * every answer here was recomputed — this records that, and flags the places
   * where the handwriting in the scan disagrees with the mathematics.
   */
  source?: string;
};

export type MathNoteQuestion = {
  /** The book's own question number. */
  number: number;
  /** The orange topic label the book prints above the question. */
  topic?: string;
  tag?: MathNoteTag;
  /** The 教科書 reference printed on the question, e.g. "教 P.22 例1". */
  textbookRef?: string;
  prompt: string;
  /** A data line printed under the stem — a list of numbers, a table row. */
  given?: string;
  /** 理解を深める1問! — the book marks these with a lightbulb. */
  deepen?: boolean;
  /**
   * Require the sign to be written. Set on questions that exist to teach
   * ＋/－ notation ("＋，－の符号を使って…"), where accepting a bare "7" for
   * "+7" would skip the point of the question. Off elsewhere, so "+14" and
   * "14" agree.
   */
  strictSign?: boolean;
  parts?: MathNotePart[];
  /** A question answered by manipulating something instead of typing. */
  widget?: MathNoteWidget;
};

/** A widget standing in for a question better done by touching than by typing. */
export type MathNoteWidget = {
  kind: MathBlockInteractiveWidget;
  /** Config for the number-line widgets. */
  numberLine?: {
    min: number;
    max: number;
    /** Snap increment when Leo taps the line. */
    step?: number;
    /** Points to plot (plot mode) or to read off (points mode). */
    points: { label: string; value: number }[];
  };
};

/** The teaching box at the top of a 基本のページ. */
export type MathNoteBlockTeach = {
  id: string;
  type: "teach";
  heading: string;
  statement: string;
  highlightPhrases?: string[];
  examples?: string[];
  /** The seal/bird speech bubble the book draws beside the box. */
  aside?: string;
};

/** The book's own ▶ POINT box. */
export type MathNoteBlockPoint = {
  id: string;
  type: "point";
  heading: string;
  bullets: string[];
};

/** An A問題 or B問題 set. Scores itself from first answers. */
export type MathNoteBlockQuestionSet = {
  id: string;
  type: "qset";
  label: "A問題" | "B問題";
  questions: MathNoteQuestion[];
};

/** The 「C問題 → P.40」 footer the book prints at the end of a section. */
export type MathNoteBlockCarry = {
  id: string;
  type: "carry";
  text: string;
};

export type MathNoteBlockIntro = {
  id: string;
  type: "intro";
  number: number;
  title: string;
  /** WORKBOOK pages. */
  workbookPages: string;
  textbookRef: string;
};

export type MathNoteBlock =
  | MathNoteBlockIntro
  | MathNoteBlockTeach
  | MathNoteBlockPoint
  | MathNoteBlockQuestionSet
  | MathNoteBlockCarry;

export type MathNoteSection = {
  id: string;
  chapterKey: string;
  number: number;
  title: string;
  /** WORKBOOK pages. */
  workbookPages: string;
  textbookRef: string;
  blocks: MathNoteBlock[];
};

export type MathNoteSectionMeta = {
  id: string;
  chapterKey: string;
  /** The book's own section number. Null for 特訓ドリル / 確認テスト rows. */
  number: number | null;
  name: string;
  /** WORKBOOK pages. */
  workbookPages: string;
  textbookRef?: string;
  /** Whether a JSON file backs this row yet. Everything else renders 準備中. */
  authored: boolean;
  /** Whether the pages exist in docs/lesson-plans/math/sugaku-no-gakushu-note-1. */
  scanned: boolean;
};

export type MathNoteChapterMeta = {
  key: string;
  /** The pill label: "0章", "1章", "スタート". */
  badge: string;
  title: string;
  subtitle: string;
  /** WORKBOOK page span. */
  workbookPages: string;
  color: string;
  tint: string;
  dark: string;
  sections: MathNoteSectionMeta[];
};
