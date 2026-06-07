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

export type GrammarChart = {
  title: string;
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
