export type SourceTag = {
  subject: "english";
  course: "our-world" | "joyful-work" | "special-training";
  level?: number;
  year?: number;
  unit?: number;
  topic?: string;
  component: string;
  lessonId?: string;
  tag: string;
  lessonStatus?: "draft" | "live" | "assigned" | "locked";
};

export type VocabularyItem = {
  id: string;
  type: "vocabulary" | "academic" | "content" | "related" | "glossary";
  word: string;
  normalizedWord: string;
  emoji: string;
  emojiDescription?: string;
  ipa?: string;
  syllables?: string;
  partOfSpeech?: string;
  countability?: string;
  meaning: string;
  example: string;
  exampleJp?: string;
  additionalExamples?: string[];
  additionalExamplesJp?: string[];
  additionalMeanings?: Array<{ text: string; context?: string; jp?: string }>;
  japanese?: {
    word: string;
    reading?: string;
    meaning: string;
    needsReview?: boolean;
  };
  sources: SourceTag[];
  tags: string[];
  knows?: boolean;
  pos?: string;
  sample?: string;
  jp_word?: string;
  jp_reading?: string;
  jp_sentence?: string;
  jp_tags?: string[];
  category?: string;
  jp_meaning?: string;
  when_to_use?: Array<{
    context: "test" | "school" | "real-world" | string;
    text: string;
  }>;
  jp_when_to_use?: Array<{
    context: "test" | "school" | "real-world" | string;
    text: string;
  }>;
  how_to_use?: {
    structure: string;
    patterns: string[];
  };
  jp_how_to_use?: {
    structure: string;
    patterns: string[];
    needsReview?: boolean;
  };
  examples?: Array<{
    context: string;
    en: string;
    jp: string;
  }>;
  collocations?: string[];
  jp_note?: string;
  practice_prompt?: string;
  jp_practice_prompt?: string;
  nonExamples?: Array<{
    en: string;
    jp: string;
  }>;
  miniQuiz?: Array<{
    prompt: string;
    options: string[];
    correct: number;
    explanation: string;
    jp: string;
  }>;
};

export type GrammarSample = {
  text: string;
  jp?: string;
};

export type GrammarChartRow = {
  form: string;
  pattern: string;
  example: string;
  jp?: string;
};

export type GrammarWorkbookChart = {
  label: string;
  title: string;
  seeHowItWorks: {
    beforeWho: string;
    who: string;
    afterWho: string;
    explanation: string;
  };
  columns: [string, string, string];
  rows: Array<{
    person: string;
    who: string;
    description: string;
  }>;
  rule: string;
  but?: string;
};

/* General-purpose grammar table — the one shape meant to fit every grammar
   point's chart, not just sentence-pattern ones. The Level 4 print Grammar
   Workbook has ~14 different boxed chart shapes across its 9 units
   (comparatives, have-to, would-like, reflexive pronouns, superlatives,
   future will/won't, used to, double comparatives, definitions with which,
   plus the two sentence-pattern ones already built). Most of those are
   genuine rows-and-columns tables, not S-V-O sentence chips, so they need a
   real table renderer rather than being forced into the chip-pattern shape
   that only fits "subject + verb + object"-style points. Add this data
   once per grammar point; the UI figures out how to draw it. */
/** Grammatical role keys shared with CHART_LEGEND in reference-shapes.ts —
    used to color-code table cells the same way pattern-chart chips are
    colored (subject blue, verb green, direct object gold, indirect object
    purple, etc). */
export type GrammarRoleKey = "subject" | "verb" | "directObject" | "indirectObject" | "prep" | "clause";

export type GrammarTableRow = {
  /** Optional left-side row label, e.g. "I'm" / "You're" / "My cat is". */
  label?: string;
  /** Grammatical role of the row label, for color-coding (e.g. "subject"). */
  labelRole?: GrammarRoleKey;
  /** One string per column, in the same order as GrammarChartTable.columns. */
  cells: string[];
  /** Indices into `cells` to visually emphasize (e.g. the target form). Used
      only when `roles` isn't set — `roles` takes precedence. */
  highlight?: number[];
  /** Grammatical role per cell (same order as `cells`), for role color
      coding instead of the plain single-color `highlight`. Use `null` for
      cells that shouldn't be tinted. */
  roles?: Array<GrammarRoleKey | null>;
};

export type GrammarChartTable = {
  /** Shown above the table, e.g. "Have to" or "Comparatives with -er". */
  title?: string;
  /** Column headers. Omit for a label-only two-column table. */
  columns?: string[];
  rows: GrammarTableRow[];
  /** Optional small Question/Answer pairs shown under the main table
      (many workbook charts pair a rule table with one of these), e.g.
      Have to's "What do they have to do? / They have to cook." */
  qa?: Array<{ question: string; answer: string }>;
  /** Footer rule lines, e.g. "Add -er: tall -> taller. But: good -> better." */
  notes?: string[];
  /** Set true when this chart is a pure subject/verb/object sentence
      pattern — renders the color-coded chip/legend view (PatternChart's
      chip branch) instead of this plain table. See docs/content-model.md. */
  preferChips?: boolean;
};

export type GrammarChart = {
  title: string;
  workbookChart?: GrammarWorkbookChart;
  /** General table shape — prefer this for any new grammar point whose
      chart isn't a simple subject/verb/object sentence pattern. */
  table?: GrammarChartTable;
  intro_examples: GrammarSample[];
  rows: GrammarChartRow[];
  note_rule?: string;
  note_exception?: string;
  note_exception_detail?: string;
};

export type GrammarTransform = {
  from: string;
  to: string;
};

export type GrammarLevelUpRule = {
  title: string;
  jp_title?: string;
  subtitle: string;
  jp_subtitle?: string;
  transforms: GrammarTransform[];
  examples: GrammarSample[];
};

export type GrammarLevelUp = {
  rules: GrammarLevelUpRule[];
  mixed_samples: Array<GrammarSample & { kind: string }>;
};

export type GrammarQuizQuestion = {
  stem: string[];
  answers: string[];
  correct: number;
  explanation: {
    title: string;
    body: string;
  };
  jp: string;
};

export type GrammarMasterQuestion =
  | (GrammarQuizQuestion & { type: "mcq" })
  | {
      type: "build";
      cue: string;
      bank: string[];
      correct: string[];
      jp: string;
    };

export type GrammarPoint = {
  id: string;
  subject: "english";
  course: "our-world" | "joyful-work" | "special-training";
  level?: number;
  year?: number;
  unit?: number;
  component: string;
  lessonId?: string;
  lessonStatus?: "draft" | "live" | "assigned" | "locked";
  tag: string;
  title: string;
  shortName: string;
  rule: string;
  pattern: string;
  chart: GrammarChart;
  tab1_samples: GrammarSample[];
  tab2_levelup: GrammarLevelUp;
  tab3_quiz: GrammarQuizQuestion[];
  tab4_master: GrammarMasterQuestion[];
  japanese?: {
    title: string;
    rule: string;
    pattern: string;
    needsReview?: boolean;
  };
  examples: Array<{
    sentence: string;
    highlight: string;
  }>;
  workbookActivities?: Array<{
    number: number;
    type: string;
    instruction: string;
  }>;
  tags?: string[];
};

export type LessonReferenceLink = {
  label: string;
  kind: "vocabulary" | "academic" | "grammar";
  id?: string;
  status: "linked" | "needed";
};

export type Lesson = {
  id: string;
  subject: "english";
  course: "our-world" | "joyful-work" | "special-training";
  level?: number;
  unit?: number;
  component: string;
  mode: "teacher" | "learner";
  status: "draft" | "live" | "assigned" | "locked";
  title: string;
  subtitle: string;
  source: {
    type: "html-slides" | "html-app" | "lesson-planner" | "book" | "workbook";
    file: string;
    embedPath?: string;
    slideCount?: number;
    moduleCount?: number;
    storagePrefix?: string;
    homeworkId?: string;
    /** Module done-key pattern appended to storagePrefix. {n} = 1-based, {i} = 0-based. Default "m{n}-done". */
    moduleKeyFormat?: string;
    /** Explicit per-module done-key suffixes. Takes precedence over moduleKeyFormat. Use when module IDs are non-numeric (e.g. "ma") or the suffix is not "-done". */
    moduleKeys?: string[];
    /** Display labels per module, in order. Falls back to "Module N". */
    moduleLabels?: string[];
    /** Key appended to storagePrefix that stores Leo's written caption, if the app has one. */
    captionKey?: string;
    /** Key appended to storagePrefix where the app's quiz score is stored. Default "score". */
    scoreKey?: string;
  };
  objectives: {
    content: string[];
    language: string[];
  };
  referenceLinks: LessonReferenceLink[];
};
