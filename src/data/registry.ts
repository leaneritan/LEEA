export const totalWords = 312;
export const grammarPoints = 24;
export const knownWords = 186;
export const wordsToReview = 42;

export const academyStats = {
  totalVocabulary: totalWords,
  grammarPoints,
  knownWords,
  wordsToReview,
  liveLessons: 3,
  assignedLessons: 2
};

export const currentFocus = {
  subject: "English",
  course: "Our World",
  courseId: "our-world" as const,
  level: 4,
  unit: 8,
  title: "That's Really Interesting!",
  goalLabel: "Finish Unit 8",
  targetDate: "Set goal"
};

export const nextAssignment = {
  subject: "English",
  course: "Our World",
  level: 4,
  unit: 8,
  component: "Unit Opener",
  lessonId: "ow-l4-u8-opener",
  status: "to teach"
};

export const englishCourses = [
  {
    id: "our-world",
    title: "Our World",
    eyebrow: "National Geographic",
    description: "Photo-rich unit lessons, vocabulary, grammar, reading, missions, and projects.",
    tags: ["Level 4 active", "Unit 8"],
    theme: "ow"
  },
  {
    id: "joyful-work",
    title: "Joyful Work",
    eyebrow: "Junior High",
    description: "School workbook support, grammar practice, word order, writing, and tests.",
    tags: ["Year 1 planned", "Workbook"],
    theme: "jw"
  },
  {
    id: "training-ground",
    title: "Training Ground",
    eyebrow: "Skill Focus",
    description: "Focused practice for weak points like punctuation, nouns, articles, and word order.",
    tags: ["Manchester City inspired", "Drills"],
    theme: "tg"
  },
  {
    id: "reference",
    title: "Reference",
    eyebrow: "Look It Up",
    description: "Every word and grammar point Leo has learned, searchable and grouped by source.",
    tags: ["Vocabulary", "Grammar", "I Know"],
    theme: "ref"
  }
];
