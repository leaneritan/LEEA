import unit3Vocabulary from "../../content/subjects/english/courses/our-world/level-4/unit-3/vocabulary.json";
import unit4Vocabulary from "../../content/subjects/english/courses/our-world/level-4/unit-4/vocabulary.json";
import unit5Vocabulary from "../../content/subjects/english/courses/our-world/level-4/unit-5/vocabulary.json";
import unit6Vocabulary from "../../content/subjects/english/courses/our-world/level-4/unit-6/vocabulary.json";
import unit7Vocabulary from "../../content/subjects/english/courses/our-world/level-4/unit-7/vocabulary.json";
import unit8Vocabulary from "../../content/subjects/english/courses/our-world/level-4/unit-8/vocabulary.json";
import unit9Vocabulary from "../../content/subjects/english/courses/our-world/level-4/unit-9/vocabulary.json";
import unit4Grammar from "../../content/subjects/english/courses/our-world/level-4/unit-4/grammar.json";
import unit5Grammar from "../../content/subjects/english/courses/our-world/level-4/unit-5/grammar.json";
import unit6Grammar from "../../content/subjects/english/courses/our-world/level-4/unit-6/grammar.json";
import unit7Grammar from "../../content/subjects/english/courses/our-world/level-4/unit-7/grammar.json";
import unit8Grammar from "../../content/subjects/english/courses/our-world/level-4/unit-8/grammar.json";
import unit9Grammar from "../../content/subjects/english/courses/our-world/level-4/unit-9/grammar.json";
import type {
  GrammarChart,
  GrammarLevelUp,
  GrammarMasterQuestion,
  GrammarPoint,
  GrammarQuizQuestion,
  SourceTag,
  VocabularyItem
} from "./types";

type UnitVocabularyWord =
  | (typeof unit3Vocabulary.words)[number]
  | (typeof unit9Vocabulary.words)[number]
  | (typeof unit8Vocabulary.words)[number]
  | (typeof unit7Vocabulary.words)[number]
  | (typeof unit6Vocabulary.words)[number]
  | (typeof unit5Vocabulary.words)[number]
  | (typeof unit4Vocabulary.words)[number];
type UnitGrammarPoint =
  | (typeof unit4Grammar.grammarPoints)[number]
  | (typeof unit9Grammar.grammarPoints)[number]
  | (typeof unit8Grammar.grammarPoints)[number]
  | (typeof unit7Grammar.grammarPoints)[number]
  | (typeof unit6Grammar.grammarPoints)[number]
  | (typeof unit5Grammar.grammarPoints)[number];

function hasKey<T extends object, K extends string>(word: T, key: K): word is T & Record<K, unknown> {
  return key in word;
}

function toVocabularyItem(word: UnitVocabularyWord): VocabularyItem {
  return {
    id: word.id,
    type: word.type as VocabularyItem["type"],
    word: word.word,
    normalizedWord: word.normalizedWord,
    emoji: word.displayEmoji,
    emojiDescription: word.emojiDescription,
    ipa: hasKey(word, "ipa") ? (word.ipa as string) : undefined,
    syllables: word.syllables,
    partOfSpeech: word.partOfSpeech,
    meaning: word.meaning,
    example: word.example,
    exampleJp: hasKey(word, "exampleJp") ? (word.exampleJp as string) : undefined,
    additionalExamples: hasKey(word, "additionalExamples")
      ? (word.additionalExamples as string[])
      : undefined,
    additionalExamplesJp: hasKey(word, "additionalExamplesJp")
      ? (word.additionalExamplesJp as string[])
      : undefined,
    additionalMeanings: hasKey(word, "additionalMeanings")
      ? (word.additionalMeanings as VocabularyItem["additionalMeanings"])
      : undefined,
    japanese: word.japanese,
    sources: word.sources as SourceTag[],
    tags: word.tags,
    knows: false,
    pos: hasKey(word, "pos") ? (word.pos as string) : undefined,
    sample: hasKey(word, "sample") ? (word.sample as string) : undefined,
    jp_word: hasKey(word, "jp_word") ? (word.jp_word as string) : undefined,
    jp_reading: hasKey(word, "jp_reading") ? (word.jp_reading as string) : undefined,
    jp_sentence: hasKey(word, "jp_sentence") ? (word.jp_sentence as string) : undefined,
    jp_tags: hasKey(word, "jp_tags") ? (word.jp_tags as string[]) : undefined,
    category: hasKey(word, "category") ? (word.category as string) : undefined,
    jp_meaning: hasKey(word, "jp_meaning") ? (word.jp_meaning as string) : undefined,
    when_to_use: hasKey(word, "when_to_use") ? (word.when_to_use as VocabularyItem["when_to_use"]) : undefined,
    jp_when_to_use: hasKey(word, "jp_when_to_use") ? (word.jp_when_to_use as VocabularyItem["jp_when_to_use"]) : undefined,
    how_to_use: hasKey(word, "how_to_use") ? (word.how_to_use as VocabularyItem["how_to_use"]) : undefined,
    jp_how_to_use: hasKey(word, "jp_how_to_use") ? (word.jp_how_to_use as VocabularyItem["jp_how_to_use"]) : undefined,
    examples: hasKey(word, "examples") ? (word.examples as VocabularyItem["examples"]) : undefined,
    collocations: hasKey(word, "collocations") ? (word.collocations as string[]) : undefined,
    jp_note: hasKey(word, "jp_note") ? (word.jp_note as string) : undefined,
    practice_prompt: hasKey(word, "practice_prompt") ? (word.practice_prompt as string) : undefined,
    jp_practice_prompt: hasKey(word, "jp_practice_prompt") ? (word.jp_practice_prompt as string) : undefined,
    nonExamples: hasKey(word, "nonExamples") ? (word.nonExamples as VocabularyItem["nonExamples"]) : undefined,
    miniQuiz: hasKey(word, "miniQuiz") ? (word.miniQuiz as VocabularyItem["miniQuiz"]) : undefined
  };
}

function typeRank(type: VocabularyItem["type"]) {
  if (type === "academic") return 4;
  if (type === "vocabulary") return 3;
  if (type === "content") return 2;
  if (type === "related") return 1;
  return 0;
}

function mergeWordsAcrossUnits(unitWordLists: UnitVocabularyWord[][]): VocabularyItem[] {
  const byId = new Map<string, VocabularyItem>();
  const order: string[] = [];
  for (const unitWords of unitWordLists) {
    for (const word of unitWords) {
      const item = toVocabularyItem(word);
      const existing = byId.get(item.id);
      if (existing) {
        const seenTags = new Set(existing.sources.map((s) => s.tag));
        for (const source of item.sources) {
          if (!seenTags.has(source.tag)) {
            existing.sources.push(source);
            seenTags.add(source.tag);
          }
        }
        if (typeRank(item.type) > typeRank(existing.type)) {
          existing.type = item.type;
        }
        for (const tag of item.tags) {
          if (!existing.tags.includes(tag)) existing.tags.push(tag);
        }
      } else {
        byId.set(item.id, item);
        order.push(item.id);
      }
    }
  }
  return order.map((id) => byId.get(id) as VocabularyItem);
}

export const vocabularyItems: VocabularyItem[] = mergeWordsAcrossUnits([
  unit3Vocabulary.words as UnitVocabularyWord[],
  unit9Vocabulary.words as UnitVocabularyWord[],
  unit8Vocabulary.words as UnitVocabularyWord[],
  unit7Vocabulary.words as UnitVocabularyWord[],
  unit6Vocabulary.words as UnitVocabularyWord[],
  unit5Vocabulary.words as UnitVocabularyWord[],
  unit4Vocabulary.words as UnitVocabularyWord[]
]);

/* Real unit titles, sourced from each unit's own vocabulary.json — keyed
   "<level>-<unit>". Add a new entry here whenever a unit is scanned, so the
   Reference tree never has to guess or hardcode a title elsewhere. */
export const unitTitles: Record<string, string> = {
  [`${unit3Vocabulary.level}-${unit3Vocabulary.unit}`]: unit3Vocabulary.unitTitle,
  [`${unit4Vocabulary.level}-${unit4Vocabulary.unit}`]: unit4Vocabulary.unitTitle,
  [`${unit5Vocabulary.level}-${unit5Vocabulary.unit}`]: unit5Vocabulary.unitTitle,
  [`${unit6Vocabulary.level}-${unit6Vocabulary.unit}`]: unit6Vocabulary.unitTitle,
  [`${unit7Vocabulary.level}-${unit7Vocabulary.unit}`]: unit7Vocabulary.unitTitle,
  [`${unit8Vocabulary.level}-${unit8Vocabulary.unit}`]: unit8Vocabulary.unitTitle,
  [`${unit9Vocabulary.level}-${unit9Vocabulary.unit}`]: unit9Vocabulary.unitTitle
};

export const unit3Vocab1Items = vocabularyItems.filter((item) => unit3Vocabulary.vocab1WordIds.includes(item.id));
export const unit3Vocab2Items = vocabularyItems.filter((item) => unit3Vocabulary.vocab2WordIds.includes(item.id));
export const unit3AcademicItems = vocabularyItems.filter((item) => unit3Vocabulary.academicWordIds.includes(item.id));
export const unit3GlossaryItems = vocabularyItems.filter(
  (item) => unit3Vocabulary.contentWordIds.includes(item.id) || unit3Vocabulary.relatedWordIds.includes(item.id)
);

export const unit4Vocab1Items = vocabularyItems.filter(
  (item) => item.type === "vocabulary" && item.sources.some((source) => source.tag === "OW4-U4-V1")
);
export const unit4Vocab2Items = vocabularyItems.filter(
  (item) => item.type === "vocabulary" && item.sources.some((source) => source.tag === "OW4-U4-V2")
);
export const unit4AcademicItems = vocabularyItems.filter(
  (item) => item.type === "academic" && item.sources.some((source) => source.course === "our-world" && source.level === 4 && source.unit === 4)
);
export const unit4GlossaryItems = vocabularyItems.filter(
  (item) =>
    (item.type === "content" || item.type === "related" || item.type === "glossary") &&
    item.sources.some((source) => source.course === "our-world" && source.level === 4 && source.unit === 4)
);

export const unit5Vocab1Items = vocabularyItems.filter(
  (item) => item.type === "vocabulary" && item.sources.some((source) => source.tag === "OW4-U5-V1")
);
export const unit5Vocab2Items = vocabularyItems.filter(
  (item) => item.type === "vocabulary" && item.sources.some((source) => source.tag === "OW4-U5-V2")
);
export const unit5AcademicItems = vocabularyItems.filter(
  (item) => item.type === "academic" && item.sources.some((source) => source.course === "our-world" && source.level === 4 && source.unit === 5)
);
export const unit5GlossaryItems = vocabularyItems.filter(
  (item) =>
    (item.type === "content" || item.type === "related" || item.type === "glossary") &&
    item.sources.some((source) => source.course === "our-world" && source.level === 4 && source.unit === 5)
);

export const unit6Vocab1Items = vocabularyItems.filter(
  (item) => item.type === "vocabulary" && item.sources.some((source) => source.tag === "OW4-U6-V1")
);
export const unit6Vocab2Items = vocabularyItems.filter(
  (item) => item.type === "vocabulary" && item.sources.some((source) => source.tag === "OW4-U6-V2")
);
export const unit6AcademicItems = vocabularyItems.filter(
  (item) => item.type === "academic" && item.sources.some((source) => source.course === "our-world" && source.level === 4 && source.unit === 6)
);
export const unit6GlossaryItems = vocabularyItems.filter(
  (item) =>
    (item.type === "content" || item.type === "related" || item.type === "glossary") &&
    item.sources.some((source) => source.course === "our-world" && source.level === 4 && source.unit === 6)
);

export const unit7Vocab1Items = vocabularyItems.filter(
  (item) => item.type === "vocabulary" && item.sources.some((source) => source.tag === "OW4-U7-V1")
);
export const unit7Vocab2Items = vocabularyItems.filter(
  (item) => item.type === "vocabulary" && item.sources.some((source) => source.tag === "OW4-U7-V2")
);
export const unit7AcademicItems = vocabularyItems.filter(
  (item) => item.type === "academic" && item.sources.some((source) => source.course === "our-world" && source.level === 4 && source.unit === 7)
);
export const unit7GlossaryItems = vocabularyItems.filter(
  (item) =>
    (item.type === "content" || item.type === "related" || item.type === "glossary") &&
    item.sources.some((source) => source.course === "our-world" && source.level === 4 && source.unit === 7)
);

export const unit8Vocab1Items = vocabularyItems.filter(
  (item) => item.type === "vocabulary" && item.sources.some((source) => source.tag === "OW4-U8-V1")
);
export const unit8Vocab2Items = vocabularyItems.filter(
  (item) => item.type === "vocabulary" && item.sources.some((source) => source.tag === "OW4-U8-V2")
);
export const unit8AcademicItems = vocabularyItems.filter(
  (item) => item.type === "academic" && item.sources.some((source) => source.course === "our-world" && source.level === 4 && source.unit === 8)
);
export const unit8GlossaryItems = vocabularyItems.filter(
  (item) =>
    (item.type === "content" || item.type === "related" || item.type === "glossary") &&
    item.sources.some((source) => source.course === "our-world" && source.level === 4 && source.unit === 8)
);

export const unit9Vocab1Items = vocabularyItems.filter(
  (item) => item.type === "vocabulary" && item.sources.some((source) => source.tag === "OW4-U9-V1")
);
export const unit9Vocab2Items = vocabularyItems.filter(
  (item) => item.type === "vocabulary" && item.sources.some((source) => source.tag === "OW4-U9-V2")
);
export const unit9AcademicItems = vocabularyItems.filter(
  (item) => item.type === "academic" && item.sources.some((source) => source.course === "our-world" && source.level === 4 && source.unit === 9)
);
export const unit9GlossaryItems = vocabularyItems.filter(
  (item) =>
    (item.type === "content" || item.type === "related" || item.type === "glossary") &&
    item.sources.some((source) => source.course === "our-world" && source.level === 4 && source.unit === 9)
);

function toGrammarPoint(point: UnitGrammarPoint): GrammarPoint {
  return {
    id: point.id,
    subject: point.subject as GrammarPoint["subject"],
    course: point.course as GrammarPoint["course"],
    level: point.level,
    unit: point.unit,
    component: point.component,
    lessonId: point.lessonId,
    lessonStatus: point.lessonStatus as GrammarPoint["lessonStatus"],
    tag: point.tag,
    title: point.title,
    shortName: point.shortName,
    rule: point.rule,
    pattern: point.pattern,
    chart: point.chart as GrammarChart,
    tab1_samples: point.tab1_samples,
    tab2_levelup: point.tab2_levelup as GrammarLevelUp,
    tab3_quiz: point.tab3_quiz as GrammarQuizQuestion[],
    tab4_master: point.tab4_master as GrammarMasterQuestion[],
    japanese: point.japanese,
    examples: point.examples,
    highlightRole: point.highlightRole as GrammarPoint["highlightRole"],
    workbookActivities: hasKey(point, "workbookActivities")
      ? (point.workbookActivities as GrammarPoint["workbookActivities"])
      : undefined,
    tags: point.tags
  };
}

export const grammarPoints: GrammarPoint[] = [
  ...unit9Grammar.grammarPoints.map(toGrammarPoint),
  ...unit8Grammar.grammarPoints.map(toGrammarPoint),
  ...unit7Grammar.grammarPoints.map(toGrammarPoint),
  ...unit6Grammar.grammarPoints.map(toGrammarPoint),
  ...unit5Grammar.grammarPoints.map(toGrammarPoint),
  ...unit4Grammar.grammarPoints.map(toGrammarPoint)
];
export const unit4GrammarItems = grammarPoints.filter((item) => item.level === 4 && item.unit === 4);

export const unit9GrammarItems = grammarPoints.filter((item) => item.level === 4 && item.unit === 9);
export const unit8GrammarItems = grammarPoints.filter((item) => item.level === 4 && item.unit === 8);
export const unit7GrammarItems = grammarPoints.filter((item) => item.level === 4 && item.unit === 7);
export const unit6GrammarItems = grammarPoints.filter((item) => item.level === 4 && item.unit === 6);
export const unit5GrammarItems = grammarPoints.filter((item) => item.level === 4 && item.unit === 5);

export const referenceWordOrder = vocabularyItems.map((item) => item.id);

export function getVocabularyById(id: string) {
  return vocabularyItems.find((item) => item.id === id);
}

export function getGrammarById(id: string) {
  return grammarPoints.find((item) => item.id === id);
}

export function getVocabularyIndex(id: string) {
  return Math.max(0, referenceWordOrder.indexOf(id));
}

export function getNextVocabularyId(id: string) {
  const index = getVocabularyIndex(id);
  return referenceWordOrder[(index + 1) % referenceWordOrder.length];
}

export function getPreviousVocabularyId(id: string) {
  const index = getVocabularyIndex(id);
  return referenceWordOrder[(index - 1 + referenceWordOrder.length) % referenceWordOrder.length];
}
