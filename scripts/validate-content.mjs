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

const unit8VocabularyPath = "content/subjects/english/courses/our-world/level-4/unit-8/vocabulary.json";
const vocabularyIndexPath = "content/subjects/english/reference/vocabulary-index.json";
const unit8GrammarPath = "content/subjects/english/courses/our-world/level-4/unit-8/grammar.json";
const sanseidoPath = "content/subjects/english/junior-high/sanseido-index.json";

const vocabulary = readJson(unit8VocabularyPath);
const vocabularyIndex = readJson(vocabularyIndexPath);
const grammar = readJson(unit8GrammarPath);
const sanseido = readJson(sanseidoPath);

const wordIds = new Set(vocabulary.wordIds ?? []);
const wordsById = new Map();

for (const word of vocabulary.words ?? []) {
  if (wordsById.has(word.id)) fail(`duplicate vocabulary id: ${word.id}`);
  wordsById.set(word.id, word);
}

for (const id of wordIds) {
  if (!wordsById.has(id)) fail(`wordIds references missing word: ${id}`);
}

for (const word of vocabulary.words ?? []) {
  if (!wordIds.has(word.id)) fail(`${word.id} exists in words[] but not wordIds`);
}

for (const listName of ["vocab1WordIds", "vocab2WordIds", "academicWordIds", "contentWordIds", "relatedWordIds"]) {
  for (const id of vocabulary[listName] ?? []) {
    if (!wordsById.has(id)) fail(`${listName} references missing word: ${id}`);
  }
}

for (const id of vocabularyIndex.words ?? []) {
  if (!wordsById.has(id)) fail(`vocabulary-index references missing word: ${id}`);
}

for (const id of wordIds) {
  if (!(vocabularyIndex.words ?? []).includes(id)) fail(`vocabulary-index is missing ${id}`);
}

for (const word of vocabulary.words ?? []) {
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

  if (word.type === "academic") validateAcademicWord(word);
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

if (errors.length) {
  console.error(`Content validation failed with ${errors.length} issue(s):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log("Content validation passed.");
console.log(`Checked ${vocabulary.words.length} vocabulary cards, ${grammar.grammarPoints.length} grammar cards, and ${sanseido.length} Sanseido links.`);
