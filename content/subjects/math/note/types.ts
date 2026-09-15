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

/**
 * A widget standing in for a question better done by touching than by typing.
 *
 * Each family carries its own config rather than one loose bag, so a widget
 * cannot be wired to a shape it does not understand.
 */
export type MathNoteWidget = {
  kind: MathBlockInteractiveWidget;
  /** `number-line-points` and `number-line-plot`. */
  numberLine?: {
    min: number;
    max: number;
    /** Snap increment when Leo taps the line. */
    step?: number;
    /** Points to plot (plot mode) or to read off (points mode). */
    points: { label: string; value: number }[];
  };
  /**
   * `number-line-walk-read` — the book draws two arrows and asks what addition
   * they show. Each problem is the pair of moves, drawn from 0.
   */
  walkRead?: {
    min: number;
    max: number;
    /** The worked example the book prints above the questions. */
    example?: { moves: [number, number] };
    problems: { label: string; moves: [number, number] }[];
  };
  /**
   * `subtraction-flip` — a − b becomes a + (−b). Leo flips the sign himself and
   * then walks the result, so the rule is something he does rather than recites.
   */
  subtractionFlip?: {
    min: number;
    max: number;
    problems: { a: number; b: number }[];
  };
  /**
   * `term-sort` — the move both 加法の計算法則 and 加減の混じった計算 turn on:
   * split an expression into its 項, gather 正の項 and 負の項, total each side.
   */
  termSort?: {
    problems: { expression: string; terms: number[] }[];
  };
  /** `magic-square` — 3x3, `cells` giving the printed numbers and null for blanks. */
  magicSquare?: {
    cells: (number | null)[];
    answers: number[];
  };
  /**
   * `power-expand` — 累乗, and the one place where notation *is* the
   * mathematics. －5² and （－5）² differ only in where the minus sits, and the
   * scan of p.28 and p.33 shows that difference costing Leo three answers in a
   * row. So the first thing he does here is not compute: it is say which number
   * is being repeated. The expansion is then written out for him, and the
   * reading he did not choose is shown beside his answer, because the rule only
   * sticks when both readings are in front of him at once.
   */
  powerExpand?: {
    problems: {
      /** Exactly as the book prints it, e.g. "－5²" or "（－5）²". */
      expression: string;
      /** The number actually repeated — 5 in －5², －5 in （－5）². */
      factor: number;
      exponent: number;
      /** True when the minus sits OUTSIDE the power: －5² ＝ －(5×5). */
      minusOutside: boolean;
      /** The value, as it should be written. */
      value: string;
      /** The value of the OTHER reading, shown as the contrast. */
      otherValue: string;
      note?: string;
    }[];
  };
  /**
   * `reciprocal` — 逆数. Two things go wrong at once here: the swap itself, and
   * the belief that flipping a fraction also flips its sign. The widget splits
   * them, asks about the sign before the swap, and finishes by multiplying the
   * two numbers together so that 「積が1」 — the actual definition — is what he
   * sees, not a rule about turning fractions upside down.
   */
  reciprocal?: {
    problems: {
      /** As the book prints it: "－3/4", "－7", "－0.9". */
      printed: string;
      /** Shown as an intermediate step when the printed form is not a fraction. */
      asFraction?: string;
      /** Signed numerator and positive denominator of the printed number. */
      numerator: number;
      denominator: number;
      note?: string;
    }[];
  };
  /**
   * `sign-count` — the POINT box of 節7, made into something done rather than
   * read: 負の数が奇数個 → 積の符号は －, 偶数個 → ＋. Leo taps the negative
   * factors, the widget counts them and reads off the sign, and only then does
   * he supply the absolute value. Splitting the answer into 符号 and 絶対値 is
   * the book's own order, and it is what stops a long product from being one
   * undifferentiated chance to slip.
   */
  signCount?: {
    problems: {
      expression: string;
      factors: { display: string; negative: boolean }[];
      /** The product/quotient of the absolute values, as it should be written. */
      magnitude: string;
      /** Overrides 「絶対値の積は？」 — 節9 divides, so it asks for 商. */
      magnitudeAsk?: string;
      magnitudeAccept?: string[];
      note?: string;
    }[];
  };
  /**
   * `mixed-chain` — p.31 問1 is already an interactive exercise on paper: the
   * book prints ○ for the sign and □ for each factor and asks Leo to fill them.
   * This is that question, live. Each ÷ slot offers the number and its 逆数, so
   * 「除法は逆数をかけること」 is a choice he makes per slot instead of a line he
   * copies.
   */
  mixedChain?: {
    problems: {
      expression: string;
      /** "+" or "-" — the sign that belongs in the book's ○. */
      sign: "+" | "-";
      /** One per factor, in the book's order. */
      slots: { op: "start" | "×" | "÷"; keep: string; flip: string }[];
      /** The answer, as it should be written. */
      result: string;
      resultAccept?: string[];
      note?: string;
    }[];
  };
  /**
   * `order-steps` — 四則の混じった計算. The order is the entire content of 節12,
   * and it is invisible in a written answer: a wrong answer and a right one look
   * equally like one line of working. So here Leo never computes a whole
   * expression — he only ever chooses which part goes first, and the expression
   * rewrites itself around his choice. Getting it wrong costs a sentence of
   * explanation, not the question.
   */
  orderSteps?: {
    problems: {
      expression: string;
      steps: {
        ask?: string;
        /** The candidate pieces, as substrings of the current expression. */
        options: string[];
        correct: number;
        /** What the expression becomes once that piece is computed. */
        becomes: string;
        why: string;
      }[];
      result: string;
      note?: string;
    }[];
  };
  /**
   * `notation-rules` — 2章 p.42–43. The POINT box prints six rules for writing a
   * 文字式 (×をはぶく, 数を文字の前に, アルファベット順, 同じ文字は累乗, 1をはぶく,
   * ÷は分数の形), and a single answer like 3a²b exercises four of them at once.
   * When that answer comes back wrong, a bare × says nothing about *which* rule
   * was missed — the same diagnostic problem 節7's sign-count solved by splitting
   * 符号 from 絶対値.
   *
   * So the rule list is on screen and stays there, and answering lights up the
   * rules this particular expression turns on, each with a line saying what it
   * means *here*. The box stops being decoration and becomes the thing being
   * practised.
   */
  notationRules?: {
    /** The book's own POINT box, in the book's own order. */
    rules: string[];
    problems: {
      expression: string;
      answer: string;
      accept?: string[];
      /** Indices into `rules` that this expression actually exercises. */
      rulesUsed: number[];
      /** What each used rule means here. Same length and order as `rulesUsed`. */
      howApplied: string[];
      note?: string;
    }[];
  };
  /**
   * `substitute` — 2章 p.46 代入と式の値.
   *
   * The seal in the margin says 「負の数を代入するときは、（　）をつけて代入するよ」,
   * and that parenthesis is the entire difficulty: －x² with x＝－4 is －16, but
   * written without the brackets it turns into something else on the way. So the
   * bracket is a decision Leo makes before any arithmetic happens, and it is a
   * real decision — a positive value genuinely does not need them, so the
   * question cannot be answered 「はい」 every time.
   *
   * This is 1章節8's 累乗 trap wearing letters. x², －x², （－x)² and －x³ at
   * x＝－4 give 16, －16, 16 and ＋64 — the last one positive, which is the
   * surprise worth stopping on.
   */
  substitute?: {
    problems: {
      /** As printed, e.g. "－x²". */
      expression: string;
      /** The assignments, in the book's order. */
      values: { letter: string; value: string; negative: boolean }[];
      /** The expression with the values written in, as it should be written. */
      substituted: string;
      answer: string;
      accept?: string[];
      note?: string;
    }[];
  };
  /**
   * `like-terms` — 2章 p.48–49. 「文字の部分が同じ項どうし、数の項どうしを加える」
   * is the whole method, and it is 1章's 項を並べた式 with letters attached: the
   * same move, sorting into two piles and totalling each, except the piles are
   * now 文字の項 and 数の項 rather than 正の項 and 負の項.
   *
   * Sorting by hand is what makes 8x－6x＋3＋2 stop being one frightening line
   * and become 2x and 5. It also catches the specific slip this page exists to
   * prevent — adding an x term to a bare number — at the moment it happens,
   * instead of at the answer.
   */
  likeTerms?: {
    problems: {
      expression: string;
      /** Each 項 with its sign, as printed, plus which pile it belongs in. */
      terms: { display: string; kind: "letter" | "number" }[];
      /** The totals of each pile, and the finished expression. */
      letterTotal: string;
      numberTotal: string;
      answer: string;
      accept?: string[];
      note?: string;
    }[];
  };
  /**
   * `distribute` — 2章 p.50–52. 分配法則 with letters, where the error is always
   * the same one: the number outside reaches the first term and not the second.
   * p.51 B問2 prints that mistake as the question — (10a－5)÷5 written as 2a－5,
   * where the 10 was divided and the 5 was left alone.
   *
   * So the multiplication is done one term at a time, with the term being
   * reached lit up, and the answer is not available until every term has been
   * paired. Missing one is impossible rather than merely marked wrong.
   */
  distribute?: {
    problems: {
      expression: string;
      /** The number (or divisor-as-multiplier) being distributed, as printed. */
      multiplier: string;
      /** Each term inside the bracket, and what it becomes. */
      terms: { term: string; becomes: string }[];
      answer: string;
      accept?: string[];
      note?: string;
    }[];
  };
  /**
   * `straw-pattern` — 2章 p.53 文字式の利用.
   *
   * The book draws a strip of triangles made of straws and asks for the count as
   * an expression in n. The answer 2n＋1 is unremarkable; *seeing why* is the
   * lesson, and it cannot be seen from a static picture of one case.
   *
   * So the strip is drawn for whatever n Leo picks, and the straw count is
   * obtained by actually enumerating the edges and removing the duplicates —
   * the shared sides — rather than by evaluating a formula. The picture is the
   * proof: each new triangle adds two straws because one of its three sides is
   * already there.
   */
  strawPattern?: {
    /** How many straws the first shape needs, and how many each one after adds. */
    first: number;
    perExtra: number;
    maxN: number;
    /** The question asked once he has played with the strip. */
    ask: string;
    answer: string;
    accept?: string[];
    note?: string;
  };
  /**
   * `drill` — a 特訓ドリル group, run against the clock.
   *
   * The timer is the book's own: every 特訓ドリル page prints
   * 「全問解くのにかかった時間　分　秒」 at the top. Paper cannot start it,
   * mark as you go, or bring the missed ones back, which is the whole reason
   * this page is worth putting on a screen at all.
   */
  drill?: {
    /** The yellow note the book prints under the group heading. */
    hint?: string;
    /** Where in the workbook the group drills, as the book's own back-reference. */
    backRef?: string;
    items: { expression: string; answer: string; accept?: string[]; note?: string; tag?: string }[];
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
  /** Absent on 特訓ドリル and 確認テスト, which the book does not number as 節. */
  number?: number;
  title: string;
  /** WORKBOOK pages. */
  workbookPages: string;
  /**
   * Absent on 特訓ドリル, which drills earlier WORKBOOK pages rather than
   * practising a 教科書 range — its own header says 「3〜6 の内容を特訓!」.
   */
  textbookRef?: string;
  /** Replaces the 教科書 line when the page has none, e.g. the 特訓ドリル badge. */
  kicker?: string;
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
  /** Absent on 特訓ドリル and 確認テスト, which the book does not number as 節. */
  number?: number;
  title: string;
  /** WORKBOOK pages. */
  workbookPages: string;
  /** Absent on 特訓ドリル — see the intro block's note. */
  textbookRef?: string;
  /** Replaces the 教科書 line when the page has none. */
  kicker?: string;
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
