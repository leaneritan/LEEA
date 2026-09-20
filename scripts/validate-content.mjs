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
  "content/subjects/english/courses/our-world/level-1/unit-1/vocabulary.json",
  "content/subjects/english/courses/our-world/level-1/unit-2/vocabulary.json",
  "content/subjects/english/courses/our-world/level-1/unit-3/vocabulary.json",
  "content/subjects/english/courses/our-world/level-1/unit-4/vocabulary.json",
  "content/subjects/english/courses/our-world/level-1/unit-5/vocabulary.json",
  "content/subjects/english/courses/our-world/level-1/unit-6/vocabulary.json",
  "content/subjects/english/courses/our-world/level-1/unit-7/vocabulary.json",
  "content/subjects/english/courses/our-world/level-1/unit-8/vocabulary.json",
  "content/subjects/english/courses/our-world/level-1/unit-9/vocabulary.json",
  "content/subjects/english/courses/our-world/level-2/unit-1/vocabulary.json",
  "content/subjects/english/courses/our-world/level-2/unit-2/vocabulary.json",
  "content/subjects/english/courses/our-world/level-2/unit-3/vocabulary.json",
  "content/subjects/english/courses/our-world/level-2/unit-4/vocabulary.json",
  "content/subjects/english/courses/our-world/level-3/unit-1/vocabulary.json",
  "content/subjects/english/courses/our-world/level-3/unit-2/vocabulary.json",
  "content/subjects/english/courses/our-world/level-3/unit-3/vocabulary.json",
  "content/subjects/english/courses/our-world/level-5/unit-1/vocabulary.json",
  "content/subjects/english/courses/our-world/level-5/unit-2/vocabulary.json",
  "content/subjects/english/courses/our-world/level-3/unit-4/vocabulary.json",
  "content/subjects/english/courses/our-world/level-3/unit-5/vocabulary.json",
  "content/subjects/english/courses/our-world/level-3/unit-6/vocabulary.json",
  "content/subjects/english/courses/our-world/level-3/unit-7/vocabulary.json",
  "content/subjects/english/courses/our-world/level-3/unit-8/vocabulary.json",
  "content/subjects/english/courses/our-world/level-3/unit-9/vocabulary.json",
  "content/subjects/english/courses/our-world/level-4/unit-1/vocabulary.json",
  "content/subjects/english/courses/our-world/level-4/unit-2/vocabulary.json",
  "content/subjects/english/courses/our-world/level-4/unit-3/vocabulary.json",
  "content/subjects/english/courses/our-world/level-4/unit-4/vocabulary.json",
  "content/subjects/english/courses/our-world/level-4/unit-5/vocabulary.json",
  "content/subjects/english/courses/our-world/level-4/unit-6/vocabulary.json",
  "content/subjects/english/courses/our-world/level-4/unit-7/vocabulary.json",
  "content/subjects/english/courses/our-world/level-4/unit-8/vocabulary.json",
  "content/subjects/english/courses/our-world/level-4/unit-9/vocabulary.json",
  "content/subjects/english/courses/our-world/level-2/unit-9/vocabulary.json",
  "content/subjects/english/courses/our-world/level-2/unit-8/vocabulary.json",
  "content/subjects/english/courses/our-world/level-2/unit-7/vocabulary.json",
  "content/subjects/english/courses/our-world/level-2/unit-6/vocabulary.json",
  "content/subjects/english/courses/our-world/level-2/unit-5/vocabulary.json"
];
const vocabularyIndexPath = "content/subjects/english/reference/vocabulary-index.json";
const unitGrammarPaths = [
  "content/subjects/english/courses/our-world/level-1/unit-1/grammar.json",
  "content/subjects/english/courses/our-world/level-1/unit-2/grammar.json",
  "content/subjects/english/courses/our-world/level-1/unit-3/grammar.json",
  "content/subjects/english/courses/our-world/level-1/unit-4/grammar.json",
  "content/subjects/english/courses/our-world/level-1/unit-5/grammar.json",
  "content/subjects/english/courses/our-world/level-1/unit-6/grammar.json",
  "content/subjects/english/courses/our-world/level-1/unit-7/grammar.json",
  "content/subjects/english/courses/our-world/level-1/unit-8/grammar.json",
  "content/subjects/english/courses/our-world/level-1/unit-9/grammar.json",
  "content/subjects/english/courses/our-world/level-2/unit-1/grammar.json",
  "content/subjects/english/courses/our-world/level-2/unit-2/grammar.json",
  "content/subjects/english/courses/our-world/level-2/unit-3/grammar.json",
  "content/subjects/english/courses/our-world/level-2/unit-4/grammar.json",
  "content/subjects/english/courses/our-world/level-5/unit-1/grammar.json",
  "content/subjects/english/courses/our-world/level-5/unit-2/grammar.json",
  "content/subjects/english/courses/our-world/level-2/unit-9/grammar.json",
  "content/subjects/english/courses/our-world/level-2/unit-8/grammar.json",
  "content/subjects/english/courses/our-world/level-2/unit-7/grammar.json",
  "content/subjects/english/courses/our-world/level-2/unit-6/grammar.json",
  "content/subjects/english/courses/our-world/level-3/unit-1/grammar.json",
  "content/subjects/english/courses/our-world/level-3/unit-2/grammar.json",
  "content/subjects/english/courses/our-world/level-3/unit-3/grammar.json",
  "content/subjects/english/courses/our-world/level-3/unit-4/grammar.json",
  "content/subjects/english/courses/our-world/level-3/unit-5/grammar.json",
  "content/subjects/english/courses/our-world/level-3/unit-6/grammar.json",
  "content/subjects/english/courses/our-world/level-3/unit-7/grammar.json",
  "content/subjects/english/courses/our-world/level-3/unit-8/grammar.json",
  "content/subjects/english/courses/our-world/level-3/unit-9/grammar.json",
  "content/subjects/english/courses/our-world/level-4/unit-1/grammar.json",
  "content/subjects/english/courses/our-world/level-4/unit-2/grammar.json",
  "content/subjects/english/courses/our-world/level-4/unit-3/grammar.json",
  "content/subjects/english/courses/our-world/level-4/unit-4/grammar.json",
  "content/subjects/english/courses/our-world/level-4/unit-5/grammar.json",
  "content/subjects/english/courses/our-world/level-4/unit-6/grammar.json",
  "content/subjects/english/courses/our-world/level-4/unit-7/grammar.json",
  "content/subjects/english/courses/our-world/level-4/unit-8/grammar.json",
  "content/subjects/english/courses/our-world/level-4/unit-9/grammar.json"
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

/* Duplicated from src/data/verbForms.ts (this script runs under plain node,
   which can't import the TS file directly) — keep in sync if that file's
   irregular list or conjugation rules change. Only used here to let verb
   example sentences legitimately use past/past-participle forms without
   failing the highlight check below. */
const IRREGULAR_VERBS_FOR_VALIDATION = {
  be: ["was/were", "been"], begin: ["began", "begun"], bend: ["bent", "bent"], bite: ["bit", "bitten"], break: ["broke", "broken"],
  bring: ["brought", "brought"], build: ["built", "built"], buy: ["bought", "bought"],
  catch: ["caught", "caught"], choose: ["chose", "chosen"], come: ["came", "come"],
  cut: ["cut", "cut"], dig: ["dug", "dug"], do: ["did", "done"], draw: ["drew", "drawn"],
  drink: ["drank", "drunk"], drive: ["drove", "driven"], eat: ["ate", "eaten"],
  fall: ["fell", "fallen"], feel: ["felt", "felt"], feed: ["fed", "fed"], find: ["found", "found"],
  rise: ["rose", "risen"],
  fly: ["flew", "flown"], forget: ["forgot", "forgotten"], get: ["got", "gotten"],
  give: ["gave", "given"], go: ["went", "gone"], grow: ["grew", "grown"], hang: ["hung", "hung"],
  have: ["had", "had"], hear: ["heard", "heard"], hide: ["hid", "hidden"],
  hold: ["held", "held"], keep: ["kept", "kept"], know: ["knew", "known"],
  leave: ["left", "left"], lose: ["lost", "lost"], make: ["made", "made"],
  meet: ["met", "met"], pay: ["paid", "paid"], pedal: ["pedaled", "pedaled"], put: ["put", "put"],
  read: ["read", "read"], ride: ["rode", "ridden"], run: ["ran", "run"],
  say: ["said", "said"], see: ["saw", "seen"], sell: ["sold", "sold"],
  send: ["sent", "sent"], sing: ["sang", "sung"], sit: ["sat", "sat"],
  sleep: ["slept", "slept"], slide: ["slid", "slid"], speak: ["spoke", "spoken"], spend: ["spent", "spent"],
  spin: ["spun", "spun"], stand: ["stood", "stood"], swim: ["swam", "swum"], swing: ["swung", "swung"],
  take: ["took", "taken"], teach: ["taught", "taught"], tell: ["told", "told"], travel: ["traveled", "traveled"],
  think: ["thought", "thought"], throw: ["threw", "thrown"],
  understand: ["understood", "understood"], wake: ["woke", "woken"],
  wear: ["wore", "worn"], win: ["won", "won"], write: ["wrote", "written"],
  visit: ["visited", "visited"]
};
const VOWELS_FOR_VALIDATION = new Set(["a", "e", "i", "o", "u"]);
function conjugateRegularPastForValidation(verb) {
  if (verb.endsWith("e")) return `${verb}d`;
  if (verb.endsWith("y") && verb.length > 1 && !VOWELS_FOR_VALIDATION.has(verb[verb.length - 2])) {
    return `${verb.slice(0, -1)}ied`;
  }
  if (
    verb.length >= 3 &&
    !VOWELS_FOR_VALIDATION.has(verb[verb.length - 1]) &&
    VOWELS_FOR_VALIDATION.has(verb[verb.length - 2]) &&
    !VOWELS_FOR_VALIDATION.has(verb[verb.length - 3]) &&
    !["w", "x", "y"].includes(verb[verb.length - 1])
  ) {
    return `${verb}${verb[verb.length - 1]}ed`;
  }
  return `${verb}ed`;
}
function getVerbFormsForValidation(word) {
  const [head, ...rest] = word.toLowerCase().split(/\s+/);
  const suffix = rest.length > 0 ? ` ${rest.join(" ")}` : "";
  const irregular = IRREGULAR_VERBS_FOR_VALIDATION[head];
  if (irregular) return { past: `${irregular[0]}${suffix}`, pastParticiple: `${irregular[1]}${suffix}` };
  const past = `${conjugateRegularPastForValidation(head)}${suffix}`;
  return { past, pastParticiple: past };
}

/* Mirrors highlightWord() in src/components/reference/WordCard.tsx, which
   searches example text for entry.normalizedWord — never the display "word"
   field, since that often carries an article ("a creature") or joins a
   phrase with underscores ("sea_sponges") that never appears verbatim in a
   sentence. Underscores match either a space or a hyphen in the sentence.
   For verb-type words, past/past-participle forms are also accepted, since
   an irregular verb's past tense ("fell", "spun", "took") shares no
   substring with the base word. */

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
  const serializedWord = JSON.stringify(word);
  for (const weakPhrase of ["helps us study Unit", "part of Unit", "The useful is", "reviewed problem with Leo", "reviewed solution with Leo"]) {
    if (serializedWord.includes(weakPhrase)) {
      fail(sourceLabel(word, `contains generic placeholder phrase "${weakPhrase}"`));
    }
  }
  for (const [field, value] of [
    ["displayEmoji", word.displayEmoji ?? word.emoji],
    ["ipa", word.ipa],
    ["japanese.word", word.japanese?.word],
    ["japanese.reading", word.japanese?.reading],
    ["japanese.meaning", word.japanese?.meaning],
    ["exampleJp", word.exampleJp],
    ["additionalExamplesJp", (word.additionalExamplesJp ?? []).join(" ")]
  ]) {
    if (typeof value === "string" && value.includes("?")) {
      fail(sourceLabel(word, `${field} contains literal "?" replacement characters`));
    }
  }

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

function highlightableTextIncludesWord(text, word) {
  const key = word.normalizedWord || word.word || "";
  if (!key) return true;
  const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const toPattern = (candidate) => candidate.split(/[_\s]+/).map(escapeRegex).join("[-\\s]");

  const candidates = [key];
  const pos = (word.partOfSpeech || word.pos || "").toLowerCase();
  if (/\bverb\b/.test(pos)) {
    const forms = getVerbFormsForValidation(key);
    candidates.push(forms.past, forms.pastParticiple);
  }

  const pattern = candidates.map(toPattern).join("|");
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

  const hasAcademicTag = word.sources?.some((s) => word.tags?.includes(`OW${s.level}-AC`));
  if (!hasAcademicTag) fail(sourceLabel(word, "missing OW<level>-AC tag"));
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

  /* GrammarCard.tsx's highlightGrammarPhrase() looks up the highlight for a
     sample sentence by exact text match against examples[].sentence. Any
     sentence in tab1_samples or tab2_levelup.mixed_samples with no matching
     examples[] entry silently renders with no color-coded phrase — no error,
     no warning, just a card that looks slightly wrong. Unit 6 shipped with 4
     such gaps (2 per grammar point) that went unnoticed until this check was
     added, so this is enforced rather than left as a documentation note. */
  const sampleTexts = new Set([
    ...(point.tab1_samples ?? []).map((s) => s.text),
    ...(point.tab2_levelup?.mixed_samples ?? []).map((s) => s.text)
  ]);
  const exampleTexts = new Set((point.examples ?? []).map((e) => e.sentence));
  for (const text of sampleTexts) {
    if (!exampleTexts.has(text)) {
      fail(`grammar ${point.tag}: sample sentence "${text}" has no matching examples[] entry — it will render with no highlighted phrase`);
    }
  }
}

if (!Array.isArray(sanseido) || sanseido.length === 0) fail("sanseido-index must be a non-empty array");
for (const [index, entry] of (sanseido ?? []).entries()) {
  assertPresent(entry.w, `sanseido[${index}].w`);
  assertPresent(entry.u, `sanseido[${index}].u`);
  if (present(entry.u) && !/^https?:\/\//.test(entry.u)) fail(`sanseido[${index}].u must be an http(s) URL`);
}

// Lesson registration + teacher/learner pairing check
const lessonsDirs = [
  "content/subjects/english/courses/our-world/level-4/unit-6/lessons",
  "content/subjects/english/courses/our-world/level-4/unit-7/lessons",
  "content/subjects/english/courses/our-world/level-4/unit-8/lessons",
  "content/subjects/english/courses/our-world/level-4/unit-9/lessons",
  "content/subjects/english/courses/our-world/level-5/unit-1/lessons",
  // Checkpoint lessons after each three-unit band live beside the units, not inside them.
  "content/subjects/english/courses/our-world/level-4/checkpoint-7-9/lessons",
  "content/subjects/english/courses/our-world/level-4/checkpoint-1-9/lessons",
  "content/subjects/english/courses/special-training/lessons",
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

/* ── marked paper tests ───────────────────────────────────────────────────
   An evaluation is a sitting committed to the repo (see src/data/evaluations.ts).
   The failure it guards against is the quiet one: a file written, never imported,
   and therefore never seen anywhere in the app. */
const evaluationsTsPath = "src/data/evaluations.ts";
const evaluationsTsSource = fs.readFileSync(path.join(root, evaluationsTsPath), "utf8");
const evaluationIds = new Map();

function checkEvaluationsIn(dir) {
  const absolute = path.join(root, dir);
  if (!fs.existsSync(absolute)) return;
  for (const name of fs.readdirSync(absolute).sort()) {
    if (!name.endsWith(".json")) continue;
    const where = `${dir}/${name}`;
    let attempt;
    try {
      attempt = JSON.parse(fs.readFileSync(path.join(absolute, name), "utf8"));
    } catch (error) {
      fail(`${where} is not valid JSON: ${error.message}`);
      continue;
    }

    if (!evaluationsTsSource.includes(`/${name}`)) {
      fail(`${where} is not imported by ${evaluationsTsPath}, so nothing in the app can see it`);
    }
    if (!String(attempt.id || "").startsWith("eval-")) {
      fail(`${where}: id "${attempt.id}" must begin with "eval-" so a seeded sitting is recognisable`);
    }
    if (evaluationIds.has(attempt.id)) {
      fail(`${where}: id "${attempt.id}" is already used by ${evaluationIds.get(attempt.id)}`);
    }
    evaluationIds.set(attempt.id, where);
    if (attempt.medium !== "paper") {
      fail(`${where}: medium is "${attempt.medium}" — an evaluation is a paper sitting`);
    }

    const questions = Array.isArray(attempt.questions) ? attempt.questions : [];
    if (questions.length === 0) fail(`${where} has no questions, so its report would be empty`);

    const got = questions.reduce((sum, q) => sum + (q.got || 0), 0);
    const max = questions.reduce((sum, q) => sum + (q.max || 0), 0);
    if (attempt.score !== got) fail(`${where}: score is ${attempt.score} but the questions add up to ${got}`);
    if (attempt.total !== max) fail(`${where}: total is ${attempt.total} but the questions add up to ${max}`);
    const percent = max ? Math.round((got / max) * 100) : 0;
    if (attempt.percent !== percent) fail(`${where}: percent is ${attempt.percent} but ${got}/${max} is ${percent}%`);

    /* The test it was sat against, when it has a digital counterpart. Its points
       must match, or /tests would show a paper sitting out of 80 beside an app
       sitting out of something else and call them the same test. */
    const paired = lessons.find((lesson) => lesson.id === attempt.testId);
    if (attempt.testId && !attempt.testId.startsWith("paper:") && !paired) {
      fail(`${where}: testId "${attempt.testId}" is not a registered lesson`);
    }
    const teacherOf = paired
      ? lessons.find(
          (lesson) =>
            lesson.mode === "teacher" &&
            lesson.component === String(paired.component).replace(/-app$/, "") &&
            lesson.level === paired.level &&
            lesson.unit === paired.unit
        )
      : null;
    if (teacherOf?.assessment?.points !== undefined && teacherOf.assessment.points !== max) {
      fail(
        `${where}: adds up to ${max} points but ${teacherOf.id} is a ${teacherOf.assessment.points}-point test`
      );
    }

    for (const q of questions) {
      if (q.rubric) {
        const rGot = q.rubric.reduce((sum, row) => sum + (row.score || 0), 0);
        const rMax = q.rubric.reduce((sum, row) => sum + (row.max || 0), 0);
        if (rGot !== q.got) fail(`${where}: Q${q.n} scored ${q.got} but its rubric adds up to ${rGot}`);
        if (rMax !== q.max) fail(`${where}: Q${q.n} is out of ${q.max} but its rubric adds up to ${rMax}`);
      }
    }
  }
}

for (const lessonsDir of lessonsDirs) {
  checkEvaluationsIn(lessonsDir.replace(/\/lessons$/, "/evaluations"));
}
for (const courseDir of new Set(lessonsDirs.map((d) => d.replace(/\/(unit|checkpoint)-[^/]+\/lessons$/, "")))) {
  checkEvaluationsIn(`${courseDir}/evaluations`);
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

// Every `test` lesson declares what it is and how long the publisher allows for
// it. The ranges are the publisher's own, from the lesson planner: a unit quiz
// is 15-20 minutes, a three-unit mastery test 20-30, the nine-unit final 30-35.
// /tests renders its cards from this block, so a test without one is a card with
// no shape — and a minutes value outside the range is almost always a typo.
const ASSESSMENT_MINUTES = {
  "unit-quiz": [15, 20],
  mastery: [20, 30],
  final: [30, 35]
};

for (const lesson of lessons) {
  if (lesson.mode !== "teacher" || !["quiz", "test", "final-test"].includes(lesson.component)) continue;
  const meta = lesson.assessment;
  if (!meta) {
    fail(`${lesson.id}: a test lesson needs an "assessment" block (kind, covers, units, minutes, questions, points) — /tests builds its card from it. See docs/tests.md.`);
    continue;
  }
  const range = ASSESSMENT_MINUTES[meta.kind];
  if (!range) {
    fail(`${lesson.id}: assessment.kind "${meta.kind}" is not one of ${Object.keys(ASSESSMENT_MINUTES).join(", ")}`);
  } else if (typeof meta.minutes !== "number" || meta.minutes < range[0] || meta.minutes > range[1]) {
    fail(`${lesson.id}: assessment.minutes is ${meta.minutes}, but the publisher allows ${range[0]}-${range[1]} for a ${meta.kind}`);
  }
  for (const field of ["covers", "questions", "points"]) {
    if (meta[field] === undefined || meta[field] === "") fail(`${lesson.id}: assessment.${field} is missing`);
  }
  if (!Array.isArray(meta.units) || meta.units.length === 0) {
    fail(`${lesson.id}: assessment.units must list the units the test covers`);
  }
}

// A test is now its questions file plus a shell that names it, so the data can
// be checked against what the lesson JSON claims. These three used to be
// hand-kept in three places at once — the assessment block, the learner
// lesson's moduleLabels, and the questions themselves — and nothing noticed
// when they drifted.
function readTestData(learner) {
  const shellPath = path.join(root, "public", learner.source?.embedPath?.replace(/^\//, "") ?? "");
  if (!fs.existsSync(shellPath)) return null;
  const shell = fs.readFileSync(shellPath, "utf8");
  const named = /window\.LEEA_TEST\s*=\s*'([^']+)'/.exec(shell);
  if (!named) {
    fail(`${learner.id}: its page does not name a questions file (window.LEEA_TEST = '/tests/...'). See docs/tests.md.`);
    return null;
  }
  const dataPath = path.join(root, "public", named[1].replace(/^\//, ""));
  if (!fs.existsSync(dataPath)) {
    fail(`${learner.id}: its page points at ${named[1]}, which does not exist`);
    return null;
  }
  try {
    return { path: named[1], data: JSON.parse(fs.readFileSync(dataPath, "utf8")) };
  } catch (error) {
    fail(`${named[1]}: is not valid JSON — ${error.message}`);
    return null;
  }
}

const PART_KINDS = new Set(["select", "buttons", "multi", "text", "writing", "speaking"]);

for (const teacher of lessons) {
  if (teacher.mode !== "teacher" || !["quiz", "test", "final-test"].includes(teacher.component)) continue;
  const learner = lessons.find(
    (item) =>
      item.mode === "learner"
      && item.component === `${teacher.component}-app`
      && item.course === teacher.course
      && item.level === teacher.level
      && item.unit === teacher.unit
  );
  if (!learner) continue;                 // the learner-pairing rule above reports this
  const found = readTestData(learner);
  if (!found) continue;
  const { path: dataPath, data } = found;
  const where = (message) => fail(`${dataPath}: ${message}`);

  // The app and the registry have to agree about where the sitting is stored,
  // or the teacher card reads one place while the test writes another.
  if (data.storagePrefix !== learner.source.storagePrefix)
    where(`storagePrefix is "${data.storagePrefix}" but ${learner.id} says "${learner.source.storagePrefix}"`);
  if (data.homeworkId !== learner.source.homeworkId)
    where(`homeworkId is "${data.homeworkId}" but ${learner.id} says "${learner.source.homeworkId}"`);
  if (data.lessonId !== learner.id)
    where(`lessonId is "${data.lessonId}" but the learner lesson is "${learner.id}" — attempts are filed under this`);

  const parts = Array.isArray(data.parts) ? data.parts : [];
  if (!parts.length) where("has no parts");
  if (parts.length !== learner.source.moduleCount)
    where(`has ${parts.length} parts but ${learner.id} says moduleCount ${learner.source.moduleCount}`);
  const labels = learner.source.moduleLabels ?? [];
  parts.forEach((part, index) => {
    if (!PART_KINDS.has(part.kind)) where(`part ${index + 1} has kind "${part.kind}", which the engine does not render`);
    if (labels[index] !== undefined && labels[index] !== part.name)
      where(`part ${index + 1} is "${part.name}" but ${learner.id} labels it "${labels[index]}"`);
    // Every picture is referenced absolutely, because a learner app renders
    // from srcdoc against a <base href> at the site root.
    // A writing part is marked criterion by criterion, so its criteria carry
    // the weights — and they have to add up to what the question is worth, or
    // a fully-marked rubric would not reach full marks.
    if (part.kind === "writing") {
      const rubric = Array.isArray(part.rubric) ? part.rubric : [];
      if (!rubric.length) where(`part ${index + 1} is a writing part with no rubric to mark it against`);
      const weights = rubric.reduce((sum, row) => sum + (typeof row === "object" ? row.max ?? 0 : 0), 0);
      if (rubric.some((row) => typeof row !== "object")) {
        where(`part ${index + 1} has a rubric written as plain strings — each criterion needs { label, max, says }`);
      } else if (Math.abs(weights - part.pts) > 1e-9) {
        where(`part ${index + 1} is worth ${part.pts} points but its rubric criteria add up to ${weights}`);
      }
      for (const row of rubric) {
        if (typeof row === "object" && (!row.label || !row.says))
          where(`part ${index + 1} has a rubric criterion missing a label or its description`);
      }
      // The publisher marks a criterion on a band grid, not a range: the ten-point
      // writing prints 2.5 / 2 / 1.5 / 1, highest first, with no zero. A scale that
      // does not start at the criterion's own weight would make full marks
      // unreachable, and one that is not descending is not the printed grid.
      const scale = part.rubricScale;
      if (scale !== undefined) {
        const weights = new Set(rubric.map((row) => row.max));
        if (!Array.isArray(scale) || scale.length < 2)
          where(`part ${index + 1} has a rubricScale that is not a list of bands`);
        else if (weights.size === 1 && Math.abs(scale[0] - [...weights][0]) > 1e-9)
          where(`part ${index + 1}'s rubricScale tops out at ${scale[0]} but each criterion is worth ${[...weights][0]} — full marks would be unreachable`);
        else if (scale.some((band, i) => i > 0 && band >= scale[i - 1]))
          where(`part ${index + 1}'s rubricScale must run highest first, the way the paper prints its columns`);
        else if (scale.some((band) => band < 0))
          where(`part ${index + 1}'s rubricScale has a negative band`);
      }
    }
    const pictures = part.images ?? (part.image ? [{ src: part.image }] : []);
    for (const picture of pictures) {
      if (!picture.src.startsWith("/")) where(`part ${index + 1} has a relative picture path "${picture.src}"`);
      else if (!fs.existsSync(path.join(root, "public", picture.src.replace(/^\//, ""))))
        where(`part ${index + 1} points at a picture that is not in the repo: ${picture.src}`);
    }
  });

  const points = parts.reduce((sum, part) => sum + (part.questions ? part.questions.length * part.pts : part.pts), 0);
  const numbers = new Set();
  for (const part of parts) {
    if (part.questions) for (const question of part.questions) numbers.add(String(question.n).split(".")[0]);
    else numbers.add(String(part.n));
  }
  const meta = teacher.assessment ?? {};
  if (meta.points !== undefined && points !== meta.points)
    where(`the questions add up to ${points} points but ${teacher.id} claims ${meta.points}`);
  if (meta.questions !== undefined && numbers.size !== meta.questions)
    where(`the questions cover ${numbers.size} numbers but ${teacher.id} claims ${meta.questions}`);
  if (data.minutes !== meta.minutes)
    where(`allows ${data.minutes} minutes but ${teacher.id} claims ${meta.minutes}`);
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

// Non-blocking font check: every lesson HTML file is embedded inside an <iframe>
// (teacher decks via src=, learner apps via srcdoc= with a cloud-sync bridge script
// injected before the lesson's own script). A render-blocking cross-origin
// stylesheet <link> can stall that iframe's entire document parser indefinitely if
// the request never resolves (blocked network, slow DNS, an ad/privacy blocker on
// the domain) — silently breaking every script on the page with no console error.
// Fullscreen/direct navigation to the same file does not hit this failure mode,
// which is why it is easy to miss when testing a lesson on its own. Load any
// Google Fonts stylesheet non-blocking: media="print" onload="this.media='all'",
// with a <noscript> fallback.
for (const dir of ["public/lessons", "public/learn"]) {
  const dirPath = path.join(root, dir);
  if (!fs.existsSync(dirPath)) continue;
  for (const file of fs.readdirSync(dirPath)) {
    if (!file.endsWith(".html")) continue;
    const html = fs.readFileSync(path.join(dirPath, file), "utf8");
    // Strip <noscript> fallback links — those intentionally omit media="print".
    const htmlWithoutNoscript = html.replace(/<noscript>[\s\S]*?<\/noscript>/gi, "");
    const linkTags = htmlWithoutNoscript.match(/<link\b[^>]*>/gi) || [];
    for (const tag of linkTags) {
      if (!/fonts\.googleapis\.com/i.test(tag)) continue;
      if (!/rel=["']stylesheet["']/i.test(tag)) continue; // preconnect links are fine
      if (/media=["']print["']/i.test(tag)) continue; // already non-blocking
      fail(
        `${dir}/${file} loads a Google Fonts stylesheet as a render-blocking <link> — every lesson is embedded in an <iframe>, and a stalled font request can hang the whole document parser. Use media="print" onload="this.media='all'" with a <noscript> fallback (see any fixed lesson file for the pattern).`
      );
    }
  }
}

// ---------------------------------------------------------------------------
// 特訓レッスン: the registry and the section links must agree.
//
// These are two lists describing the same lessons, kept in step by hand, and
// they drifted: two lessons were linked from a 節 with a ✏️ 特訓レッスン button
// but missing from specialLessons.ts, so they existed inside a section while
// the 特訓レッスン list — the only page showing what practice exists at all —
// did not know about them.
// ---------------------------------------------------------------------------
const specialLessonsSource = fs.readFileSync(
  path.join(root, "content/subjects/math/specialLessons.ts"),
  "utf-8"
);

const registeredLessons = new Map();
for (const block of specialLessonsSource.split(/\n\s*\{\s*\n/).slice(1)) {
  const id = block.match(/id:\s*"([^"]+)"/)?.[1];
  if (!id) continue;
  registeredLessons.set(id, {
    embedPath: block.match(/embedPath:\s*"([^"]+)"/)?.[1],
    sections: [...block.matchAll(/"(math-[\w-]+)"/g)].map((m) => m[1])
  });
}

const mathSectionDir = path.join(root, "content/subjects/math/chapters");
const specialLinks = new Map();
if (fs.existsSync(mathSectionDir)) {
  for (const chapter of fs.readdirSync(mathSectionDir)) {
    const sectionsDir = path.join(mathSectionDir, chapter, "sections");
    if (!fs.existsSync(sectionsDir)) continue;
    for (const file of fs.readdirSync(sectionsDir).filter((f) => f.endsWith(".json"))) {
      const section = JSON.parse(fs.readFileSync(path.join(sectionsDir, file), "utf-8"));
      for (const block of section.blocks ?? []) {
        if (block.type !== "lesson-link") continue;

        const target = path.join(root, "public", block.href.replace(/^\//, ""));
        if (!fs.existsSync(target)) {
          fail(`${section.id}: lesson-link ${block.id} points at ${block.href}, which does not exist.`);
        }

        // Only the 特訓レッスン-labelled links belong in the registry; the
        // 説明モード ones are textbook companions, not standalone practice.
        if (!block.label.includes("特訓レッスン")) continue;
        const slug = block.href.split("/").pop().replace(/\.html$/, "");
        specialLinks.set(slug, section.id);
      }
    }
  }
}

for (const [slug, sectionId] of specialLinks) {
  const entry = registeredLessons.get(slug);
  if (!entry) {
    fail(
      `${sectionId} links "${slug}" as a 特訓レッスン, but there is no entry with that id in content/subjects/math/specialLessons.ts — so it never appears on /math/free. Add one, with sections: ["${sectionId}"].`
    );
    continue;
  }
  if (!entry.sections.includes(sectionId)) {
    fail(
      `specialLessons.ts entry "${slug}" does not list ${sectionId} in its sections, but that section links it. Add it so the two stay in step.`
    );
  }
}

for (const [id, entry] of registeredLessons) {
  if (entry.embedPath) {
    const target = path.join(root, "public", entry.embedPath.replace(/^\//, ""));
    if (!fs.existsSync(target)) {
      fail(`specialLessons.ts entry "${id}" has embedPath ${entry.embedPath}, but that file does not exist.`);
    }
  }
  for (const sectionId of entry.sections) {
    if (specialLinks.get(id) !== sectionId) {
      fail(
        `specialLessons.ts entry "${id}" claims to appear in ${sectionId}, but that section has no 特訓レッスン link to it.`
      );
    }
  }
}

// Assessment audio — the ExamView test tracks. The manifest is the source of
// truth for where each track lives; the audio itself is filed into public/audio
// by scripts/sort-assessment-audio.mjs and may legitimately not be there yet, so
// a missing .mp3 is not an error. What must hold is that the manifest is
// internally consistent and that every path it claims sits under the level's
// basePath in the folder its placement implies — otherwise the unit page would
// point a player at a URL nothing will ever be filed to.
function findAssessmentAudioManifests(dir, results = []) {
  if (!fs.existsSync(dir)) return results;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) findAssessmentAudioManifests(fullPath, results);
    else if (entry.isFile() && entry.name === "assessment-audio.json") {
      results.push(path.relative(root, fullPath));
    }
  }
  return results;
}

// Found by scanning, not listed, so a new level's manifest is checked the
// moment it lands rather than whenever someone remembers to register it.
const assessmentAudioPaths = findAssessmentAudioManifests(
  path.join(root, "content/subjects/english/courses")
).sort();

for (const relativePath of assessmentAudioPaths) {
  const manifest = readJson(relativePath);
  const label = `${relativePath}`;
  assertPresent(manifest.basePath, `${label} basePath`);

  // A manifest with no tracks records a level as known and empty, which reads
  // as "this level has no test audio" rather than "nothing was recognised".
  // Levels 1-3 and 6 were committed in exactly that state once.
  if (!manifest.tracks?.length) {
    fail(`${label} has no tracks. Delete it, or fill it in — an empty manifest claims the level has no assessment audio.`);
  }

  const seenTracks = new Set();
  const seenPaths = new Set();

  for (const track of manifest.tracks ?? []) {
    const where = `${label} track ${track.track ?? "(unnumbered)"}`;
    assertPresent(track.track, `${where} track number`);
    assertPresent(track.title, `${where} title`);
    assertPresent(track.file, `${where} file`);
    assertPresent(track.path, `${where} path`);

    if (seenTracks.has(track.track)) fail(`${where} is listed twice.`);
    seenTracks.add(track.track);
    if (seenPaths.has(track.path)) fail(`${where} reuses path ${track.path}.`);
    seenPaths.add(track.path);

    if (track.path && !track.path.startsWith(`${manifest.basePath}/`)) {
      fail(`${where} has path ${track.path}, which is outside the manifest basePath ${manifest.basePath}.`);
    }
    if (track.path && track.file && !track.path.endsWith(`/${track.file}`)) {
      fail(`${where} has path ${track.path}, which does not end in its file name ${track.file}.`);
    }

    // Filing is by unit alone — the number before the dot. Review tracks are
    // no exception: 9.3 is the Units 7-9 review but still lives in unit-9/,
    // because that is how the publisher numbers and how Leo looks for it.
    const numberedUnit = Number(String(track.track).split(".")[0]);
    const expectedDir = numberedUnit ? `${manifest.basePath}/unit-${numberedUnit}` : manifest.basePath;
    if (track.path && track.file && track.path !== `${expectedDir}/${track.file}`) {
      fail(
        `${where} is numbered under unit ${numberedUnit} so it belongs at ${expectedDir}/${track.file}, but the manifest puts it at ${track.path}.`
      );
    }
    if (numberedUnit && track.unit !== numberedUnit) {
      fail(`${where} is numbered under unit ${numberedUnit} but the manifest records unit ${track.unit}.`);
    }

    if (track.kind === "unit" && !Number.isInteger(track.unit)) {
      fail(`${where} is kind "unit" but has no unit number.`);
    }
    if (track.kind === "checkpoint" && (track.checkpoint?.length !== 2 || track.checkpoint[0] > track.checkpoint[1])) {
      fail(`${where} is kind "checkpoint" but its band ${JSON.stringify(track.checkpoint)} is not a [from, to] pair.`);
    }
    if (!["unit", "checkpoint", "level"].includes(track.kind)) {
      fail(`${where} has unknown kind "${track.kind}".`);
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
