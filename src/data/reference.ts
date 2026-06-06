import type { GrammarPoint, VocabularyItem } from "./types";

export const vocabularyItems: VocabularyItem[] = [
  {
    id: "global_relatives",
    type: "vocabulary",
    word: "relatives",
    normalizedWord: "relative",
    emoji: "👨‍👩‍👦",
    ipa: "/ˈrelətɪvz/",
    syllables: "rel-a-tives",
    partOfSpeech: "noun",
    countability: "countable",
    meaning: "People in your family, such as cousins, aunts, uncles, or grandparents.",
    example: "I have so many relatives because we are a big family.",
    japanese: {
      word: "親戚",
      reading: "しんせき",
      meaning: "家族や親族の人たち。"
    },
    sources: [
      {
        subject: "english",
        course: "our-world",
        level: 4,
        unit: 8,
        component: "vocab-1",
        lessonId: "ow-l4-u8-vocab-1",
        tag: "OW4-U8-V1",
        lessonStatus: "live"
      },
      {
        subject: "english",
        course: "joyful-work",
        year: 1,
        component: "vocabulary",
        tag: "JF1-VOCAB",
        lessonStatus: "draft"
      }
    ],
    tags: ["vocabulary", "family", "OW4-U8-V1", "JF1-VOCAB"],
    knows: true
  },
  {
    id: "global_clause",
    type: "academic",
    word: "clause",
    normalizedWord: "clause",
    emoji: "🧩",
    ipa: "/klɔːz/",
    syllables: "clause",
    partOfSpeech: "noun",
    meaning: "A group of words that has a subject and a verb.",
    example: "The clause who collects fossils tells us more about the boy.",
    japanese: {
      word: "節",
      reading: "せつ",
      meaning: "主語と動詞を含む語のまとまり。"
    },
    sources: [
      {
        subject: "english",
        course: "our-world",
        level: 4,
        unit: 8,
        component: "grammar-1",
        lessonId: "ow-l4-u8-grammar-1",
        tag: "OW4-U8-G1",
        lessonStatus: "live"
      }
    ],
    tags: ["academic", "grammar", "OW4-U8-G1"],
    knows: false
  },
  {
    id: "global_caption",
    type: "academic",
    word: "caption",
    normalizedWord: "caption",
    emoji: "🏷️",
    ipa: "/ˈkæpʃən/",
    syllables: "cap-tion",
    partOfSpeech: "noun",
    meaning: "Short text that explains a picture.",
    example: "Write a caption for the polar bear photo.",
    japanese: {
      word: "キャプション",
      reading: "きゃぷしょん",
      meaning: "写真や絵を説明する短い文。"
    },
    sources: [
      {
        subject: "english",
        course: "our-world",
        level: 4,
        unit: 8,
        component: "opener",
        lessonId: "ow-l4-u8-opener",
        tag: "OW4-U8-OP",
        lessonStatus: "draft"
      }
    ],
    tags: ["academic", "opener", "OW4-U8-OP"],
    knows: false
  },
  {
    id: "global_alone",
    type: "vocabulary",
    word: "alone",
    normalizedWord: "alone",
    emoji: "🧍",
    ipa: "/əˈloʊn/",
    syllables: "a-lone",
    partOfSpeech: "adjective / adverb",
    meaning: "Without other people.",
    example: "Sometimes I like to read alone.",
    japanese: {
      word: "一人で",
      reading: "ひとりで",
      meaning: "ほかの人と一緒ではないこと。"
    },
    sources: [
      {
        subject: "english",
        course: "our-world",
        level: 4,
        unit: 8,
        component: "vocab-1",
        lessonId: "ow-l4-u8-vocab-1",
        tag: "OW4-U8-V1",
        lessonStatus: "live"
      }
    ],
    tags: ["vocabulary", "OW4-U8-V1"],
    knows: true
  },
  {
    id: "global_word_order",
    type: "glossary",
    word: "word order",
    normalizedWord: "word order",
    emoji: "🧱",
    partOfSpeech: "noun",
    meaning: "The order of words in a sentence.",
    example: "English word order is different from Japanese word order.",
    japanese: {
      word: "語順",
      reading: "ごじゅん",
      meaning: "文の中で言葉が並ぶ順番。"
    },
    sources: [
      {
        subject: "english",
        course: "special-training",
        topic: "word-order",
        component: "lesson",
        tag: "TG-WORD-ORDER",
        lessonStatus: "draft"
      }
    ],
    tags: ["glossary", "training-ground", "word-order"],
    knows: false
  }
];

export const grammarPoints: GrammarPoint[] = [
  {
    id: "ow_l4_u8_g1_who_clauses",
    subject: "english",
    course: "our-world",
    level: 4,
    unit: 8,
    component: "grammar-1",
    lessonId: "ow-l4-u8-grammar-1",
    lessonStatus: "live",
    tag: "OW4-U8-G1",
    title: "Describing people with who",
    shortName: "who clauses",
    rule: "Use who to give more information about a person.",
    pattern: "person + who + verb phrase",
    japanese: {
      title: "who を使って人を説明する",
      rule: "人について、さらに説明を加えるときに who を使います。",
      pattern: "人 + who + 動詞句"
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
      title: "直接目的語と間接目的語",
      rule: "だれが何を受け取るかを言うときに使います。",
      pattern: "主語 + 動詞 + 人 + 物"
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

