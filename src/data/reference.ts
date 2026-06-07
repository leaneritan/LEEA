import unit8Vocabulary from "../../content/subjects/english/courses/our-world/level-4/unit-8/vocabulary.json";
import unit8Grammar from "../../content/subjects/english/courses/our-world/level-4/unit-8/grammar.json";
import type {
  GrammarChart,
  GrammarLevelUp,
  GrammarMasterQuestion,
  GrammarPoint,
  GrammarQuizQuestion,
  SourceTag,
  VocabularyItem
} from "./types";

type UnitVocabularyWord = (typeof unit8Vocabulary.words)[number];
type UnitGrammarPoint = (typeof unit8Grammar.grammarPoints)[number];

function toVocabularyItem(word: UnitVocabularyWord): VocabularyItem {
  return {
    id: word.id,
    type: word.type as VocabularyItem["type"],
    word: word.word,
    normalizedWord: word.normalizedWord,
    emoji: word.displayEmoji,
    emojiDescription: word.emojiDescription,
    syllables: word.syllables,
    partOfSpeech: word.partOfSpeech,
    meaning: word.meaning,
    example: word.example,
    japanese: word.japanese,
    sources: word.sources as SourceTag[],
    tags: word.tags,
    knows: false
  };
}

export const vocabularyItems: VocabularyItem[] = unit8Vocabulary.words.map(toVocabularyItem);

export const unit8Vocab1Items = vocabularyItems.filter((item) => item.sources.some((source) => source.tag === "OW4-U8-V1"));
export const unit8Vocab2Items = vocabularyItems.filter((item) => item.sources.some((source) => source.tag === "OW4-U8-V2"));

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
    workbookActivities: point.workbookActivities,
    tags: point.tags
  };
}

export const grammarPoints: GrammarPoint[] = unit8Grammar.grammarPoints.map(toGrammarPoint);
export const unit8GrammarItems = grammarPoints.filter((item) => item.level === 4 && item.unit === 8);

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
