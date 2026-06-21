/**
 * reference-shapes.ts — final UI-facing schema for the LEEA Reference feature.
 *
 * The raw JSON in content/.../vocabulary.json + grammar.json is rich but not
 * uniformly shaped. The UI cards (Word / Academic / Grammar) need a small
 * predictable shape. This file:
 *
 *   1. Defines the final UI-facing types (WordEntry · AcademicEntry · GrammarEntry).
 *   2. Provides transformers from the raw VocabularyItem / GrammarPoint to
 *      these shapes.
 *
 * Rule: the raw JSON is the source of truth; this module is a thin adapter.
 * No JSON files were edited to introduce these shapes.
 */

import type { GrammarPoint, VocabularyItem } from "./types";

/* ─── POS color tag ─── */
export type PosTag = "verb" | "noun" | "adjective" | "adverb" | "adj/adv" | "phrase" | "other";

const POS_NORMALIZE: Record<string, PosTag> = {
  verb: "verb",
  v: "verb",
  noun: "noun",
  n: "noun",
  adjective: "adjective",
  adj: "adjective",
  adverb: "adverb",
  adv: "adverb",
  "adjective/adverb": "adj/adv",
  "adj/adv": "adj/adv",
  phrase: "phrase"
};

function normalizePos(raw: string | undefined): PosTag {
  if (!raw) return "other";
  return POS_NORMALIZE[raw.toLowerCase().trim()] ?? "other";
}

/* ─── Source rendered on cards ─── */
export type RefSource = {
  course: "our-world" | "joyful-work" | "junior-high";
  tag: string;
  level?: number;
  unit?: number;
  lessonId?: string;
  lessonStatus: "live" | "draft";
};

function normalizeSources(raw: VocabularyItem["sources"]): RefSource[] {
  return raw.map((source) => ({
    course:
      source.course === "joyful-work"
        ? "joyful-work"
        : source.course === "special-training"
          ? "junior-high"
          : "our-world",
    tag: source.tag,
    level: source.level,
    unit: source.unit,
    lessonId: source.lessonId,
    lessonStatus: source.lessonStatus === "live" ? "live" : "draft"
  }));
}

/* ─── Word Card shape ─── */
export type WordEntry = {
  id: string;
  type: "vocabulary" | "academic" | "content" | "related" | "glossary";
  word: string;
  emoji: string;
  pos: PosTag;
  syllables: string;
  pronUS: string;             // US IPA (UK dropped per spec)
  definition: string;
  examples: string[];
  family: string[];
  sources: RefSource[];
  jp: {
    gloss: string;
    sentence: string;
    needsReview: boolean;
  };
};

export function toWordEntry(item: VocabularyItem): WordEntry {
  return {
    id: item.id,
    type: item.type,
    word: item.word,
    emoji: item.emoji,
    pos: normalizePos(item.partOfSpeech ?? item.pos),
    syllables: item.syllables ?? "",
    pronUS: item.ipa ?? "",
    definition: item.meaning,
    examples: item.example ? [item.example] : [],
    family: [],
    sources: normalizeSources(item.sources),
    jp: {
      gloss: item.japanese?.word ?? item.jp_word ?? "",
      sentence: item.japanese?.meaning ?? item.jp_sentence ?? "",
      needsReview: Boolean(item.japanese?.needsReview ?? item.jp_tags?.includes("needs-review"))
    }
  };
}

/* ─── Academic Card shape — richer ─── */
export type AcademicEntry = WordEntry & {
  type: "academic";
  academic: {
    meaningEN: string;
    meaningJP: string;
    whenToUse: string[];                // up to 3
    howToUse: string;                   // pattern, single line
    examples: { test: string; school: string; real: string };
    collocations: string[];
    jpNote: string;
    practicePrompt: string;
    nonExamples: string[];
    quiz: Array<{
      prompt: string;
      options: string[];
      correctIndex: number;
      explanationEN: string;
      explanationJP: string;
    }>;
    relatedLessonId: string | null;
  };
};

export function toAcademicEntry(item: VocabularyItem): AcademicEntry | null {
  if (item.type !== "academic") return null;
  const base = toWordEntry(item);
  const whenEN = (item.when_to_use ?? []).map((entry) => entry.text);
  const examples = item.examples ?? [];
  const exTest = examples.find((entry) => entry.context === "test")?.en ?? "";
  const exSchool = examples.find((entry) => entry.context === "school")?.en ?? "";
  const exReal = examples.find((entry) => entry.context === "real-world")?.en ?? "";
  const howToUse = item.how_to_use?.structure ?? item.how_to_use?.patterns?.[0] ?? "";
  return {
    ...base,
    type: "academic",
    academic: {
      meaningEN: item.meaning,
      meaningJP: item.jp_meaning ?? item.japanese?.meaning ?? "",
      whenToUse: whenEN.slice(0, 3),
      howToUse,
      examples: { test: exTest, school: exSchool, real: exReal },
      collocations: item.collocations ?? [],
      jpNote: item.jp_note ?? "",
      practicePrompt: item.practice_prompt ?? "",
      nonExamples: (item.nonExamples ?? []).map((entry) => entry.en),
      quiz: (item.miniQuiz ?? []).map((entry) => ({
        prompt: entry.prompt,
        options: entry.options,
        correctIndex: entry.correct,
        explanationEN: entry.explanation,
        explanationJP: entry.jp
      })),
      relatedLessonId: null     // wired when the linked lesson goes live
    }
  };
}

/* ─── Grammar Card shape ─── */
export type GrammarSampleDisplay = {
  en: string;
  jp: string;
  sourceTag?: string;
  needsReview?: boolean;
};

export type GrammarQuizDisplay = {
  prompt: string;
  options: string[];
  correctIndex: number;
  explanationEN: string;
  explanationJP: string;
};

export type GrammarMasterDisplay =
  | (GrammarQuizDisplay & { kind: "mcq" })
  | {
      kind: "sentence-build";
      prompt: string;
      tokens: string[];                  // bank, randomized at render
      correctOrder: string[];            // expected token order
      explanationEN: string;
      explanationJP: string;
    };

export type GrammarEntry = {
  grammarId: string;
  tag: string;
  title: string;
  subtitle: string;
  course: "our-world" | "joyful-work" | "junior-high";
  level: number;
  unit: number;

  /* persistent sentence chart shown above every tab */
  chart: {
    legend: Array<{ key: string; label: string; color: string }>;
    patterns: Array<{ title: string; chips: Array<{ key: string; text: string }> }>;
  };

  /* Tab 1: Chart & Samples */
  chartAndSamples: {
    rule: string;
    samples: GrammarSampleDisplay[];     // currently <=10
  };

  /* Tab 2: Level Up */
  levelUp: {
    rules: Array<{ heading: string; body: string }>;
    samples: GrammarSampleDisplay[];
  };

  /* Tab 3: Quiz */
  quiz: GrammarQuizDisplay[];

  /* Tab 4: Master Quiz — JP ALWAYS shown after answer, regardless of toggle */
  masterQuiz: GrammarMasterDisplay[];

  relatedLessonId: string | null;
  lessonStatus: "live" | "draft";
};

const CHART_LEGEND: Array<{ key: string; label: string; color: string }> = [
  { key: "subject", label: "Subject", color: "#36618e" },
  { key: "verb", label: "Verb", color: "#5f8a4e" },
  { key: "directObject", label: "Direct object", color: "#c9a227" },
  { key: "indirectObject", label: "Indirect object", color: "#74508c" },
  { key: "prep", label: "Preposition", color: "#9aa49c" },
  { key: "clause", label: "Clause", color: "#6f9cc6" }
];

export function toGrammarEntry(point: GrammarPoint): GrammarEntry {
  return {
    grammarId: point.id,
    tag: point.tag,
    title: point.title,
    subtitle: point.rule,
    course:
      point.course === "joyful-work"
        ? "joyful-work"
        : point.course === "special-training"
          ? "junior-high"
          : "our-world",
    level: point.level ?? 0,
    unit: point.unit ?? 0,

    chart: {
      legend: CHART_LEGEND,
      patterns: []     // populated in PR97 from chart.intro_examples + workbookChart per grammar point
    },

    chartAndSamples: {
      rule: point.rule,
      samples: (point.tab1_samples ?? []).map((sample) => ({
        en: sample.text,
        jp: sample.jp ?? ""
      }))
    },

    levelUp: {
      rules: (point.tab2_levelup?.rules ?? []).map((rule) => ({
        heading: rule.title,
        body: rule.subtitle
      })),
      samples: (point.tab2_levelup?.mixed_samples ?? []).map((sample) => ({
        en: sample.text,
        jp: sample.jp ?? ""
      }))
    },

    quiz: (point.tab3_quiz ?? []).map((question) => ({
      prompt: question.stem.join(" "),
      options: question.answers,
      correctIndex: question.correct,
      explanationEN: question.explanation.body,
      explanationJP: question.jp
    })),

    masterQuiz: (point.tab4_master ?? []).map((question) => {
      if (question.type === "build") {
        return {
          kind: "sentence-build" as const,
          prompt: question.cue,
          tokens: question.bank,
          correctOrder: question.correct,
          explanationEN: "",
          explanationJP: question.jp
        };
      }
      return {
        kind: "mcq" as const,
        prompt: question.stem.join(" "),
        options: question.answers,
        correctIndex: question.correct,
        explanationEN: question.explanation.body,
        explanationJP: question.jp
      };
    }),

    relatedLessonId: null,
    lessonStatus: point.lessonStatus === "live" ? "live" : "draft"
  };
}
