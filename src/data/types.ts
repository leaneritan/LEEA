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
  chart?: {
    chartType: string;
    tabs: Array<{
      id: string;
      label: string;
      title: string;
      blocks: Array<Record<string, unknown>>;
    }>;
  };
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
