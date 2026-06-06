import unit8Vocabulary from "../../content/subjects/english/courses/our-world/level-4/unit-8/vocabulary.json";
import type { SourceTag, GrammarPoint, VocabularyItem } from "./types";

type UnitVocabularyWord = (typeof unit8Vocabulary.words)[number];

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

export const grammarPoints: GrammarPoint[] = [
  {
    id: "ow_l4_u8_g1_who_clauses",
    subject: "english",
    course: "our-world",
    level: 4,
    unit: 8,
    component: "grammar-1",
    lessonId: "ow-l4-u8-grammar-1",
    lessonStatus: "draft",
    tag: "OW4-U8-G1",
    title: "Describing people with who",
    shortName: "who clauses",
    rule: "Use who to give more information about a person.",
    pattern: "person + who + verb phrase",
    japanese: {
      title: "",
      rule: "",
      pattern: "",
      needsReview: true
    },
    examples: [
      {
        sentence: "A photographer is a person who takes photos.",
        highlight: "who takes photos"
      },
      {
        sentence: "The boy who collects fossils is my friend.",
        highlight: "who collects fossils"
      },
      {
        sentence: "She is the girl who likes soccer.",
        highlight: "who likes soccer"
      }
    ]
  },
  {
    id: "ow_l4_u8_g2_direct_indirect_objects",
    subject: "english",
    course: "our-world",
    level: 4,
    unit: 8,
    component: "grammar-2",
    lessonId: "ow-l4-u8-grammar-2",
    lessonStatus: "draft",
    tag: "OW4-U8-G2",
    title: "Direct and indirect objects",
    shortName: "give someone something",
    rule: "Use this pattern to say who gets something and what they get.",
    pattern: "subject + verb + person + thing",
    japanese: {
      title: "",
      rule: "",
      pattern: "",
      needsReview: true
    },
    examples: [
      {
        sentence: "I gave my friend a comic book.",
        highlight: "my friend a comic book"
      },
      {
        sentence: "She showed Leo her fossil.",
        highlight: "Leo her fossil"
      }
    ]
  }
];

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
