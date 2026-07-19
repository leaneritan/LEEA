import level5Unit1Vocabulary from "../../content/subjects/english/courses/our-world/level-5/unit-1/vocabulary.json";
import level3Unit4Vocabulary from "../../content/subjects/english/courses/our-world/level-3/unit-4/vocabulary.json";
import level3Unit5Vocabulary from "../../content/subjects/english/courses/our-world/level-3/unit-5/vocabulary.json";
import level3Unit6Vocabulary from "../../content/subjects/english/courses/our-world/level-3/unit-6/vocabulary.json";
import level3Unit7Vocabulary from "../../content/subjects/english/courses/our-world/level-3/unit-7/vocabulary.json";
import level3Unit8Vocabulary from "../../content/subjects/english/courses/our-world/level-3/unit-8/vocabulary.json";
import level3Unit9Vocabulary from "../../content/subjects/english/courses/our-world/level-3/unit-9/vocabulary.json";
import unit1Vocabulary from "../../content/subjects/english/courses/our-world/level-4/unit-1/vocabulary.json";
import unit2Vocabulary from "../../content/subjects/english/courses/our-world/level-4/unit-2/vocabulary.json";
import unit3Vocabulary from "../../content/subjects/english/courses/our-world/level-4/unit-3/vocabulary.json";
import unit4Vocabulary from "../../content/subjects/english/courses/our-world/level-4/unit-4/vocabulary.json";
import unit5Vocabulary from "../../content/subjects/english/courses/our-world/level-4/unit-5/vocabulary.json";
import unit6Vocabulary from "../../content/subjects/english/courses/our-world/level-4/unit-6/vocabulary.json";
import unit7Vocabulary from "../../content/subjects/english/courses/our-world/level-4/unit-7/vocabulary.json";
import unit8Vocabulary from "../../content/subjects/english/courses/our-world/level-4/unit-8/vocabulary.json";
import unit9Vocabulary from "../../content/subjects/english/courses/our-world/level-4/unit-9/vocabulary.json";
import level5Unit1Grammar from "../../content/subjects/english/courses/our-world/level-5/unit-1/grammar.json";
import level3Unit4Grammar from "../../content/subjects/english/courses/our-world/level-3/unit-4/grammar.json";
import level3Unit5Grammar from "../../content/subjects/english/courses/our-world/level-3/unit-5/grammar.json";
import level3Unit6Grammar from "../../content/subjects/english/courses/our-world/level-3/unit-6/grammar.json";
import level3Unit7Grammar from "../../content/subjects/english/courses/our-world/level-3/unit-7/grammar.json";
import level3Unit8Grammar from "../../content/subjects/english/courses/our-world/level-3/unit-8/grammar.json";
import level3Unit9Grammar from "../../content/subjects/english/courses/our-world/level-3/unit-9/grammar.json";
import unit1Grammar from "../../content/subjects/english/courses/our-world/level-4/unit-1/grammar.json";
import unit2Grammar from "../../content/subjects/english/courses/our-world/level-4/unit-2/grammar.json";
import unit3Grammar from "../../content/subjects/english/courses/our-world/level-4/unit-3/grammar.json";
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
  | (typeof level5Unit1Vocabulary.words)[number]
  | (typeof level3Unit4Vocabulary.words)[number]
  | (typeof level3Unit5Vocabulary.words)[number]
  | (typeof level3Unit6Vocabulary.words)[number]
  | (typeof level3Unit7Vocabulary.words)[number]
  | (typeof level3Unit8Vocabulary.words)[number]
  | (typeof level3Unit9Vocabulary.words)[number]
  | (typeof unit1Vocabulary.words)[number]
  | (typeof unit2Vocabulary.words)[number]
  | (typeof unit3Vocabulary.words)[number]
  | (typeof unit9Vocabulary.words)[number]
  | (typeof unit8Vocabulary.words)[number]
  | (typeof unit7Vocabulary.words)[number]
  | (typeof unit6Vocabulary.words)[number]
  | (typeof unit5Vocabulary.words)[number]
  | (typeof unit4Vocabulary.words)[number];
type UnitGrammarPoint =
  | (typeof level5Unit1Grammar.grammarPoints)[number]
  | (typeof level3Unit4Grammar.grammarPoints)[number]
  | (typeof level3Unit5Grammar.grammarPoints)[number]
  | (typeof level3Unit6Grammar.grammarPoints)[number]
  | (typeof level3Unit7Grammar.grammarPoints)[number]
  | (typeof level3Unit8Grammar.grammarPoints)[number]
  | (typeof level3Unit9Grammar.grammarPoints)[number]
  | (typeof unit1Grammar.grammarPoints)[number]
  | (typeof unit2Grammar.grammarPoints)[number]
  | (typeof unit3Grammar.grammarPoints)[number]
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
          byId.set(item.id, {
            ...item,
            sources: existing.sources,
            tags: existing.tags
          });
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
  level5Unit1Vocabulary.words as UnitVocabularyWord[],
  level3Unit4Vocabulary.words as UnitVocabularyWord[],
  level3Unit5Vocabulary.words as UnitVocabularyWord[],
  level3Unit6Vocabulary.words as UnitVocabularyWord[],
  level3Unit7Vocabulary.words as UnitVocabularyWord[],
  level3Unit8Vocabulary.words as UnitVocabularyWord[],
  level3Unit9Vocabulary.words as UnitVocabularyWord[],
  unit1Vocabulary.words as UnitVocabularyWord[],
  unit2Vocabulary.words as UnitVocabularyWord[],
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
  [`${level5Unit1Vocabulary.level}-${level5Unit1Vocabulary.unit}`]: level5Unit1Vocabulary.unitTitle,
  [`${level3Unit4Vocabulary.level}-${level3Unit4Vocabulary.unit}`]: level3Unit4Vocabulary.unitTitle,
  [`${level3Unit5Vocabulary.level}-${level3Unit5Vocabulary.unit}`]: level3Unit5Vocabulary.unitTitle,
  [`${level3Unit6Vocabulary.level}-${level3Unit6Vocabulary.unit}`]: level3Unit6Vocabulary.unitTitle,
  [`${level3Unit7Vocabulary.level}-${level3Unit7Vocabulary.unit}`]: level3Unit7Vocabulary.unitTitle,
  [`${level3Unit8Vocabulary.level}-${level3Unit8Vocabulary.unit}`]: level3Unit8Vocabulary.unitTitle,
  [`${level3Unit9Vocabulary.level}-${level3Unit9Vocabulary.unit}`]: level3Unit9Vocabulary.unitTitle,
  [`${unit1Vocabulary.level}-${unit1Vocabulary.unit}`]: unit1Vocabulary.unitTitle,
  [`${unit2Vocabulary.level}-${unit2Vocabulary.unit}`]: unit2Vocabulary.unitTitle,
  [`${unit3Vocabulary.level}-${unit3Vocabulary.unit}`]: unit3Vocabulary.unitTitle,
  [`${unit4Vocabulary.level}-${unit4Vocabulary.unit}`]: unit4Vocabulary.unitTitle,
  [`${unit5Vocabulary.level}-${unit5Vocabulary.unit}`]: unit5Vocabulary.unitTitle,
  [`${unit6Vocabulary.level}-${unit6Vocabulary.unit}`]: unit6Vocabulary.unitTitle,
  [`${unit7Vocabulary.level}-${unit7Vocabulary.unit}`]: unit7Vocabulary.unitTitle,
  [`${unit8Vocabulary.level}-${unit8Vocabulary.unit}`]: unit8Vocabulary.unitTitle,
  [`${unit9Vocabulary.level}-${unit9Vocabulary.unit}`]: unit9Vocabulary.unitTitle
};

export const level5Unit1Vocab1Items = vocabularyItems.filter(
  (item) => item.type === "vocabulary" && item.sources.some((source) => source.course === "our-world" && source.level === 5 && source.unit === 1 && source.component === "vocab-1")
);
export const level5Unit1Vocab2Items = vocabularyItems.filter(
  (item) => item.type === "vocabulary" && item.sources.some((source) => source.course === "our-world" && source.level === 5 && source.unit === 1 && source.component === "vocab-2")
);
export const level5Unit1AcademicItems = vocabularyItems.filter(
  (item) => item.type === "academic" && item.sources.some((source) => source.course === "our-world" && source.level === 5 && source.unit === 1)
);
export const level5Unit1GlossaryItems = vocabularyItems.filter(
  (item) =>
    (item.type === "content" || item.type === "related" || item.type === "glossary") &&
    item.sources.some((source) => source.course === "our-world" && source.level === 5 && source.unit === 1)
);

export const level3Unit4Vocab1Items = vocabularyItems.filter((item) => (level3Unit4Vocabulary.vocab1WordIds as string[]).includes(item.id));
export const level3Unit4Vocab2Items = vocabularyItems.filter((item) => (level3Unit4Vocabulary.vocab2WordIds as string[]).includes(item.id));
export const level3Unit4AcademicItems = vocabularyItems.filter((item) => (level3Unit4Vocabulary.academicWordIds as string[]).includes(item.id));
export const level3Unit4GlossaryItems = vocabularyItems.filter(
  (item) => (level3Unit4Vocabulary.contentWordIds as string[]).includes(item.id) || (level3Unit4Vocabulary.relatedWordIds as string[]).includes(item.id)
);

export const level3Unit5Vocab1Items = vocabularyItems.filter((item) => (level3Unit5Vocabulary.vocab1WordIds as string[]).includes(item.id));
export const level3Unit5Vocab2Items = vocabularyItems.filter((item) => (level3Unit5Vocabulary.vocab2WordIds as string[]).includes(item.id));
export const level3Unit5AcademicItems = vocabularyItems.filter((item) => (level3Unit5Vocabulary.academicWordIds as string[]).includes(item.id));
export const level3Unit5GlossaryItems = vocabularyItems.filter(
  (item) => (level3Unit5Vocabulary.contentWordIds as string[]).includes(item.id) || (level3Unit5Vocabulary.relatedWordIds as string[]).includes(item.id)
);

export const level3Unit6Vocab1Items = vocabularyItems.filter((item) => level3Unit6Vocabulary.vocab1WordIds.includes(item.id));
export const level3Unit6Vocab2Items = vocabularyItems.filter((item) => level3Unit6Vocabulary.vocab2WordIds.includes(item.id));
export const level3Unit6AcademicItems = vocabularyItems.filter((item) => (level3Unit6Vocabulary.academicWordIds as string[]).includes(item.id));
export const level3Unit6GlossaryItems = vocabularyItems.filter(
  (item) => level3Unit6Vocabulary.contentWordIds.includes(item.id) || level3Unit6Vocabulary.relatedWordIds.includes(item.id)
);

export const level3Unit7Vocab1Items = vocabularyItems.filter((item) => level3Unit7Vocabulary.vocab1WordIds.includes(item.id));
export const level3Unit7Vocab2Items = vocabularyItems.filter((item) => level3Unit7Vocabulary.vocab2WordIds.includes(item.id));
export const level3Unit7AcademicItems = vocabularyItems.filter((item) => (level3Unit7Vocabulary.academicWordIds as string[]).includes(item.id));
export const level3Unit7GlossaryItems = vocabularyItems.filter(
  (item) => level3Unit7Vocabulary.contentWordIds.includes(item.id) || level3Unit7Vocabulary.relatedWordIds.includes(item.id)
);

export const level3Unit8Vocab1Items = vocabularyItems.filter((item) => level3Unit8Vocabulary.vocab1WordIds.includes(item.id));
export const level3Unit8Vocab2Items = vocabularyItems.filter((item) => level3Unit8Vocabulary.vocab2WordIds.includes(item.id));
export const level3Unit8AcademicItems = vocabularyItems.filter((item) => (level3Unit8Vocabulary.academicWordIds as string[]).includes(item.id));
export const level3Unit8GlossaryItems = vocabularyItems.filter(
  (item) => level3Unit8Vocabulary.contentWordIds.includes(item.id) || level3Unit8Vocabulary.relatedWordIds.includes(item.id)
);

export const level3Unit9Vocab1Items = vocabularyItems.filter((item) => level3Unit9Vocabulary.vocab1WordIds.includes(item.id));
export const level3Unit9Vocab2Items = vocabularyItems.filter((item) => level3Unit9Vocabulary.vocab2WordIds.includes(item.id));
export const level3Unit9AcademicItems = vocabularyItems.filter((item) => (level3Unit9Vocabulary.academicWordIds as string[]).includes(item.id));
export const level3Unit9GlossaryItems = vocabularyItems.filter(
  (item) => level3Unit9Vocabulary.contentWordIds.includes(item.id) || level3Unit9Vocabulary.relatedWordIds.includes(item.id)
);

export const unit1Vocab1Items = vocabularyItems.filter((item) => unit1Vocabulary.vocab1WordIds.includes(item.id));
export const unit1Vocab2Items = vocabularyItems.filter((item) => unit1Vocabulary.vocab2WordIds.includes(item.id));
export const unit1AcademicItems = vocabularyItems.filter((item) => (unit1Vocabulary.academicWordIds as string[]).includes(item.id));
export const unit1GlossaryItems = vocabularyItems.filter(
  (item) => unit1Vocabulary.contentWordIds.includes(item.id) || unit1Vocabulary.relatedWordIds.includes(item.id)
);

export const unit2Vocab1Items = vocabularyItems.filter((item) => unit2Vocabulary.vocab1WordIds.includes(item.id));
export const unit2Vocab2Items = vocabularyItems.filter((item) => unit2Vocabulary.vocab2WordIds.includes(item.id));
export const unit2AcademicItems = vocabularyItems.filter((item) => (unit2Vocabulary.academicWordIds as string[]).includes(item.id));
export const unit2GlossaryItems = vocabularyItems.filter(
  (item) => unit2Vocabulary.contentWordIds.includes(item.id) || unit2Vocabulary.relatedWordIds.includes(item.id)
);

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
  ...level5Unit1Grammar.grammarPoints.map(toGrammarPoint),
  ...level3Unit4Grammar.grammarPoints.map(toGrammarPoint),
  ...level3Unit5Grammar.grammarPoints.map(toGrammarPoint),
  ...level3Unit6Grammar.grammarPoints.map(toGrammarPoint),
  ...level3Unit7Grammar.grammarPoints.map(toGrammarPoint),
  ...level3Unit8Grammar.grammarPoints.map(toGrammarPoint),
  ...level3Unit9Grammar.grammarPoints.map(toGrammarPoint),
  ...unit9Grammar.grammarPoints.map(toGrammarPoint),
  ...unit8Grammar.grammarPoints.map(toGrammarPoint),
  ...unit7Grammar.grammarPoints.map(toGrammarPoint),
  ...unit6Grammar.grammarPoints.map(toGrammarPoint),
  ...unit5Grammar.grammarPoints.map(toGrammarPoint),
  ...unit4Grammar.grammarPoints.map(toGrammarPoint),
  ...unit3Grammar.grammarPoints.map(toGrammarPoint),
  ...unit2Grammar.grammarPoints.map(toGrammarPoint),
  ...unit1Grammar.grammarPoints.map(toGrammarPoint)
];
export const unit1GrammarItems = grammarPoints.filter((item) => item.level === 4 && item.unit === 1);
export const unit2GrammarItems = grammarPoints.filter((item) => item.level === 4 && item.unit === 2);
export const unit3GrammarItems = grammarPoints.filter((item) => item.level === 4 && item.unit === 3);
export const unit4GrammarItems = grammarPoints.filter((item) => item.level === 4 && item.unit === 4);

export const level3Unit4GrammarItems = grammarPoints.filter((item) => item.level === 3 && item.unit === 4);
export const level3Unit5GrammarItems = grammarPoints.filter((item) => item.level === 3 && item.unit === 5);
export const level3Unit6GrammarItems = grammarPoints.filter((item) => item.level === 3 && item.unit === 6);
export const level3Unit7GrammarItems = grammarPoints.filter((item) => item.level === 3 && item.unit === 7);
export const level3Unit8GrammarItems = grammarPoints.filter((item) => item.level === 3 && item.unit === 8);
export const level3Unit9GrammarItems = grammarPoints.filter((item) => item.level === 3 && item.unit === 9);
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
