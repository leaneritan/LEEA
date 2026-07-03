import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const errors = [];

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(root, relativePath), "utf8"));
}

function fail(message) {
  errors.push(message);
}

function present(value) {
  return typeof value === "string" ? value.trim().length > 0 : Boolean(value);
}

function assertPresent(value, label) {
  if (!present(value)) fail(`${label} is missing`);
}

function sourceLabel(word, suffix) {
  return `${word.id} (${word.word}) ${suffix}`;
}

const unitVocabularyPaths = [
  "content/subjects/english/courses/our-world/level-4/unit-6/vocabulary.json",
  "content/subjects/english/courses/our-world/level-4/unit-7/vocabulary.json",
  "content/subjects/english/courses/our-world/level-4/unit-8/vocabulary.json",
  "content/subjects/english/courses/our-world/level-4/unit-9/vocabulary.json"
];
const vocabularyIndexPath = "content/subjects/english/reference/vocabulary-index.json";
const unitGrammarPaths = [
  "content/subjects/english/courses/our-world/level-4/unit-7/grammar.json",
  "content/subjects/english/courses/our-world/level-4/unit-8/grammar.json"
];
const sanseidoPath = "content/subjects/english/junior-high/sanseido-index.json";

const vocabularyIndex = readJson(vocabularyIndexPath);
const grammarFiles = unitGrammarPaths.map(readJson);
const grammar = { grammarPoints: grammarFiles.flatMap((file) => file.grammarPoints ?? []) };
const sanseido = readJson(sanseidoPath);

const wordsById = new Map();
const allWordIds = new Set();

for (const unitPath of unitVocabularyPaths) {
  const unitVocabulary = readJson(unitPath);
  const unitWordIds = new Set(unitVocabulary.wordIds ?? []);
  const unitWordsSeen = new Set();

  for (const word of unitVocabulary.words ?? []) {
    if (unitWordsSeen.has(word.id)) fail(`${unitPath}: duplicate vocabulary id within unit: ${word.id}`);
    unitWordsSeen.add(word.id);
    allWordIds.add(word.id);

    if (wordsById.has(word.id)) {
      // Same global word appears in multiple units. Merge sources, dedup by tag.
      const existing = wordsById.get(word.id);
      const seenTags = new Set((existing.sources ?? []).map((s) => s.tag));
      for (const source of word.sources ?? []) {
        if (!seenTags.has(source.tag)) {
          existing.sources.push(source);
          seenTags.add(source.tag);
        }
      }
      for (const tag of word.tags ?? []) {
        if (!existing.tags.includes(tag)) existing.tags.push(tag);
      }
    } else {
      // First time seeing this word — clone so we can safely merge later.
      wordsById.set(word.id, {
        ...word,
        sources: [...(word.sources ?? [])],
        tags: [...(word.tags ?? [])]
      });
    }
  }

  for (const id of unitWordIds) {
    if (!unitWordsSeen.has(id)) fail(`${unitPath}: wordIds references missing word: ${id}`);
  }

  for (const word of unitVocabulary.words ?? []) {
    if (!unitWordIds.has(word.id)) fail(`${unitPath}: ${word.id} exists in words[] but not wordIds`);
  }

  for (const listName of ["vocab1WordIds", "vocab2WordIds", "academicWordIds", "contentWordIds", "relatedWordIds"]) {
    for (const id of unitVocabulary[listName] ?? []) {
      if (!unitWordsSeen.has(id)) fail(`${unitPath}: ${listName} references missing word: ${id}`);
    }
  }
}

for (const id of vocabularyIndex.words ?? []) {
  if (!wordsById.has(id)) fail(`vocabulary-index references missing word: ${id}`);
}

for (const id of allWordIds) {
  if (!(vocabularyIndex.words ?? []).includes(id)) fail(`vocabulary-index is missing ${id}`);
}

for (const word of wordsById.values()) {
  assertPresent(word.id, sourceLabel(word, "id"));
  assertPresent(word.type, sourceLabel(word, "type"));
  assertPresent(word.word, sourceLabel(word, "word"));
  assertPresent(word.normalizedWord, sourceLabel(word, "normalizedWord"));
  assertPresent(word.meaning, sourceLabel(word, "meaning"));
  assertPresent(word.example, sourceLabel(word, "example"));
  assertPresent(word.displayEmoji ?? word.emoji, sourceLabel(word, "emoji"));

  if (!Array.isArray(word.sources) || word.sources.length === 0) fail(sourceLabel(word, "sources[] is empty"));
  for (const source of word.sources ?? []) {
    assertPresent(source.subject, sourceLabel(word, "source.subject"));
    assertPresent(source.course, sourceLabel(word, "source.course"));
    assertPresent(source.component, sourceLabel(word, "source.component"));
    assertPresent(source.tag, sourceLabel(word, "source.tag"));
  }

  if (!Array.isArray(word.tags) || word.tags.length === 0) fail(sourceLabel(word, "tags[] is empty"));
  assertPresent(word.japanese?.word, sourceLabel(word, "japanese.word"));
  assertPresent(word.japanese?.reading, sourceLabel(word, "japanese.reading"));
  assertPresent(word.japanese?.meaning, sourceLabel(word, "japanese.meaning"));

  validateWordCardFields(word);
  if (word.type === "academic") validateAcademicWord(word);
}

/* Catches the recurring "looks done but isn't" gaps from Units 6/7: missing
   pronunciation data, missing Japanese translations, and example sentences
   that won't actually highlight the target word on the card. A clean
   tsc/build pass does not catch any of these — they only show up visually,
   so they must be enforced here instead of relying on someone noticing. */
function validateWordCardFields(word) {
  assertPresent(word.ipa, sourceLabel(word, "ipa"));
  if (present(word.ipa) && (word.ipa.startsWith("/") || word.ipa.endsWith("/"))) {
    fail(sourceLabel(word, "ipa must not include the surrounding slashes — the card adds them"));
  }
  assertPresent(word.syllables, sourceLabel(word, "syllables"));

  /* AcademicCard renders academic.examples.{test,school,real} (validated in
     validateAcademicWord below), not the base example/additionalExamples
     fields — so those base fields are inert for academic-type words and
     are not checked here. */
  if (word.type !== "academic") {
    if (present(word.example)) {
      assertPresent(word.exampleJp, sourceLabel(word, "exampleJp"));
      if (!highlightableTextIncludesWord(word.example, word)) {
        fail(sourceLabel(word, `example does not contain a highlightable form of "${word.word}" — check word/normalizedWord vs. the sentence text`));
      }
    }

    const additional = word.additionalExamples ?? [];
    const additionalJp = word.additionalExamplesJp ?? [];
    if (additional.length !== additionalJp.length) {
      fail(sourceLabel(word, "additionalExamples and additionalExamplesJp must have the same length"));
    }
    /* Every non-academic word needs 3 example sentences total (1 base +
       2 additionalExamples), matching the depth Units 6-8 established.
       Unit 9 originally shipped with only the base example on 41/42 words
       and still passed validation, because nothing enforced a minimum here
       — this check exists so that gap can't ship silently again. */
    if (additional.length < 2) {
      fail(sourceLabel(word, "needs at least 2 additionalExamples (3 example sentences total) — see docs/vocab.md"));
    }
    for (const [index, example] of additional.entries()) {
      if (!highlightableTextIncludesWord(example, word)) {
        fail(sourceLabel(word, `additionalExamples[${index}] does not contain a highlightable form of "${word.word}"`));
      }
    }
  }

  for (const [index, sense] of (word.additionalMeanings ?? []).entries()) {
    assertPresent(sense.text, sourceLabel(word, `additionalMeanings[${index}].text`));
    assertPresent(sense.jp, sourceLabel(word, `additionalMeanings[${index}].jp`));
  }
}

/* Mirrors highlightWord() in src/components/reference/WordCard.tsx, which
   searches example text for entry.normalizedWord — never the display "word"
   field, since that often carries an article ("a creature") or joins a
   phrase with underscores ("sea_sponges") that never appears verbatim in a
   sentence. Underscores match either a space or a hyphen in the sentence. */
function highlightableTextIncludesWord(text, word) {
  const key = word.normalizedWord || word.word || "";
  if (!key) return true;
  const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = key.split("_").map(escapeRegex).join("[-\\s]");
  return new RegExp(pattern, "i").test(text);
}

function validateAcademicWord(word) {
  const required = [
    "meaning",
    "jp_meaning",
    "when_to_use",
    "jp_when_to_use",
    "how_to_use",
    "jp_how_to_use",
    "examples",
    "collocations",
    "nonExamples",
    "jp_note",
    "practice_prompt",
    "jp_practice_prompt",
    "miniQuiz"
  ];

  for (const key of required) {
    if (!(key in word)) fail(sourceLabel(word, `academic field ${key}`));
  }

  for (const key of ["jp_word", "jp_reading", "jp_sentence", "jp_meaning", "jp_note", "jp_practice_prompt"]) {
    assertPresent(word[key], sourceLabel(word, key));
  }

  if (!word.tags?.includes("OW4-AC")) fail(sourceLabel(word, "missing OW4-AC tag"));
  for (const source of word.sources ?? []) {
    if (!word.tags?.includes(source.tag)) fail(sourceLabel(word, `missing source tag ${source.tag}`));
  }

  const contexts = new Set((word.when_to_use ?? []).map((item) => item.context));
  const jpContexts = new Set((word.jp_when_to_use ?? []).map((item) => item.context));
  for (const context of ["test", "school", "real-world"]) {
    if (!contexts.has(context)) fail(sourceLabel(word, `missing when_to_use ${context}`));
    if (!jpContexts.has(context)) fail(sourceLabel(word, `missing jp_when_to_use ${context}`));
  }
  if ((word.when_to_use ?? []).length !== 3) fail(sourceLabel(word, "when_to_use must have exactly 3 entries"));
  if ((word.jp_when_to_use ?? []).length !== 3) fail(sourceLabel(word, "jp_when_to_use must have exactly 3 entries"));
  for (const item of word.when_to_use ?? []) assertPresent(item.text, sourceLabel(word, `when_to_use.${item.context}`));
  for (const item of word.jp_when_to_use ?? []) assertPresent(item.text, sourceLabel(word, `jp_when_to_use.${item.context}`));

  assertPresent(word.how_to_use?.structure, sourceLabel(word, "how_to_use.structure"));
  assertPresent(word.jp_how_to_use?.structure, sourceLabel(word, "jp_how_to_use.structure"));
  if (!Array.isArray(word.how_to_use?.patterns) || word.how_to_use.patterns.length === 0) fail(sourceLabel(word, "how_to_use.patterns[] is empty"));

  if (!Array.isArray(word.examples) || word.examples.length < 3) fail(sourceLabel(word, "examples[] must have at least 3 entries"));
  for (const example of word.examples ?? []) {
    if (!["test", "school", "real-world"].includes(example.context)) fail(sourceLabel(word, `bad example context ${example.context}`));
    assertPresent(example.en, sourceLabel(word, "examples.en"));
    assertPresent(example.jp, sourceLabel(word, "examples.jp"));
  }

  if (!Array.isArray(word.collocations) || word.collocations.length < 5 || word.collocations.length > 6) {
    fail(sourceLabel(word, "collocations[] must have 5-6 entries"));
  }

  if (!Array.isArray(word.nonExamples) || word.nonExamples.length < 2 || word.nonExamples.length > 3) {
    fail(sourceLabel(word, "nonExamples[] must have 2-3 entries"));
  }
  for (const item of word.nonExamples ?? []) {
    assertPresent(item.en, sourceLabel(word, "nonExamples.en"));
    assertPresent(item.jp, sourceLabel(word, "nonExamples.jp"));
  }

  if (!Array.isArray(word.miniQuiz) || word.miniQuiz.length === 0) fail(sourceLabel(word, "miniQuiz[] is empty"));
  for (const quiz of word.miniQuiz ?? []) {
    assertPresent(quiz.prompt, sourceLabel(word, "miniQuiz.prompt"));
    if (!Array.isArray(quiz.options) || quiz.options.length < 2) fail(sourceLabel(word, "miniQuiz.options[] must have at least 2 entries"));
    if ("answers" in quiz) fail(sourceLabel(word, "miniQuiz must use options[], not answers[]"));
    if (!Number.isInteger(quiz.correct)) fail(sourceLabel(word, "miniQuiz.correct must be a number"));
    if (Number.isInteger(quiz.correct) && (quiz.correct < 0 || quiz.correct >= (quiz.options ?? []).length)) {
      fail(sourceLabel(word, "miniQuiz.correct is outside options[]"));
    }
    assertPresent(quiz.explanation, sourceLabel(word, "miniQuiz.explanation"));
    assertPresent(quiz.jp, sourceLabel(word, "miniQuiz.jp"));
  }
}

for (const point of grammar.grammarPoints ?? []) {
  assertPresent(point.id, `grammar ${point.id} id`);
  assertPresent(point.title, `grammar ${point.id} title`);
  assertPresent(point.rule, `grammar ${point.id} rule`);
  assertPresent(point.pattern, `grammar ${point.id} pattern`);
  assertPresent(point.tag, `grammar ${point.id} tag`);
  assertPresent(point.japanese?.title, `grammar ${point.id} japanese.title`);
  assertPresent(point.japanese?.rule, `grammar ${point.id} japanese.rule`);
  assertPresent(point.japanese?.pattern, `grammar ${point.id} japanese.pattern`);
}

if (!Array.isArray(sanseido) || sanseido.length === 0) fail("sanseido-index must be a non-empty array");
for (const [index, entry] of (sanseido ?? []).entries()) {
  assertPresent(entry.w, `sanseido[${index}].w`);
  assertPresent(entry.u, `sanseido[${index}].u`);
  if (present(entry.u) && !/^https?:\/\//.test(entry.u)) fail(`sanseido[${index}].u must be an http(s) URL`);
}

// Lesson registration + teacher/learner pairing check
const lessonsDirs = [
  "content/subjects/english/courses/our-world/level-4/unit-7/lessons",
  "content/subjects/english/courses/our-world/level-4/unit-8/lessons",
];
const lessons = [];
for (const lessonsDir of lessonsDirs) {
  if (!fs.existsSync(path.join(root, lessonsDir))) continue;
  for (const file of fs.readdirSync(path.join(root, lessonsDir))) {
    if (!file.endsWith(".json")) continue;
    const lesson = readJson(path.join(lessonsDir, file));
    lessons.push({ ...lesson, file });
  }
}

const lessonsTsPath = "src/data/lessons.ts";
const lessonsTsSource = fs.readFileSync(path.join(root, lessonsTsPath), "utf8");

for (const lesson of lessons) {
  if (lesson.mode === "teacher" && !lesson.file.endsWith(".teacher.json")) {
    fail(`${lesson.file} (${lesson.id}) is a teacher lesson and must use the .teacher.json filename suffix`);
  }

  if (lesson.mode === "learner" && !lesson.file.endsWith(".learner.json")) {
    fail(`${lesson.file} (${lesson.id}) is a learner lesson and must use the .learner.json filename suffix`);
  }

  if (!lessonsTsSource.includes(`/${lesson.file}`)) {
    fail(`${lesson.file} (${lesson.id}) is not imported by ${lessonsTsPath}`);
  }
}

const byComponent = new Map();
for (const lesson of lessons) {
  const key = `${lesson.course}|l${lesson.level}|u${lesson.unit}|${lesson.component}`;
  byComponent.set(key, lesson);
}

for (const lesson of lessons) {
  if (lesson.mode !== "learner") continue;
  if (!lesson.component.endsWith("-app")) {
    fail(`${lesson.id}: learner lesson component "${lesson.component}" must end with "-app" so its buttons surface on the matching teacher card`);
    continue;
  }
  const teacherComponent = lesson.component.slice(0, -"-app".length);
  const teacherKey = `${lesson.course}|l${lesson.level}|u${lesson.unit}|${teacherComponent}`;
  if (!byComponent.has(teacherKey)) {
    fail(`${lesson.id}: learner lesson has no teacher counterpart with component "${teacherComponent}" in the same level/unit`);
  }
}

// Orphan deck check: every ow-l*-u*-*.html in public/lessons/ must have a .teacher.json
const lessonsHtmlDir = path.join(root, "public/lessons");
if (fs.existsSync(lessonsHtmlDir)) {
  const registeredEmbedPaths = new Set(lessons.map((l) => l.source?.embedPath).filter(Boolean));
  for (const file of fs.readdirSync(lessonsHtmlDir)) {
    if (!file.endsWith(".html")) continue;
    const embedPath = `/lessons/${file}`;
    if (!registeredEmbedPaths.has(embedPath)) {
      fail(`${file} exists in public/lessons/ but has no .teacher.json with embedPath "${embedPath}" — it won't appear on the teacher dashboard`);
    }
  }
}

if (errors.length) {
  console.error(`Content validation failed with ${errors.length} issue(s):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log("Content validation passed.");
console.log(`Checked ${wordsById.size} vocabulary cards across ${unitVocabularyPaths.length} unit files, ${grammar.grammarPoints.length} grammar cards, ${lessons.length} lessons, and ${sanseido.length} Sanseido links.`);
