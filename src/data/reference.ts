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
    ipa: "ipa" in word ? word.ipa : undefined,
    syllables: word.syllables,
    partOfSpeech: word.partOfSpeech,
    meaning: word.meaning,
    example: word.example,
    japanese: word.japanese,
    sources: word.sources as SourceTag[],
    tags: word.tags,
    knows: false,
    pos: "pos" in word ? word.pos : undefined,
    sample: "sample" in word ? word.sample : undefined,
    jp_word: "jp_word" in word ? word.jp_word : undefined,
    jp_reading: "jp_reading" in word ? word.jp_reading : undefined,
    jp_sentence: "jp_sentence" in word ? word.jp_sentence : undefined,
    jp_tags: "jp_tags" in word ? word.jp_tags : undefined,
    category: "category" in word ? word.category : undefined,
    jp_meaning: "jp_meaning" in word ? word.jp_meaning : undefined,
    when_to_use: "when_to_use" in word ? word.when_to_use : undefined,
    jp_when_to_use: "jp_when_to_use" in word ? word.jp_when_to_use : undefined,
    how_to_use: "how_to_use" in word ? word.how_to_use : undefined,
    jp_how_to_use: "jp_how_to_use" in word ? word.jp_how_to_use : undefined,
    examples: "examples" in word ? word.examples : undefined,
    collocations: "collocations" in word ? word.collocations : undefined,
    jp_note: "jp_note" in word ? word.jp_note : undefined,
    practice_prompt: "practice_prompt" in word ? word.practice_prompt : undefined,
    jp_practice_prompt: "jp_practice_prompt" in word ? word.jp_practice_prompt : undefined,
    nonExamples: "nonExamples" in word ? word.nonExamples : undefined,
    miniQuiz: "miniQuiz" in word ? (word.miniQuiz as VocabularyItem["miniQuiz"]) : undefined
  };
}

export const vocabularyItems: VocabularyItem[] = unit8Vocabulary.words.map(toVocabularyItem);

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
