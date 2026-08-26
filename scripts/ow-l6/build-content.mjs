/* Expands each unit's authored source data into the repo's real reference
   schemas: content/.../level-6/unit-<n>/vocabulary.json and grammar.json.

   Academic words are deliberately NOT re-authored here. Almost every academic
   word a Level 6 unit needs already exists as a rich card in another level, and
   src/data/reference.ts merges cards by id — so re-authoring one would just be
   discarded. Instead the builder clones the existing card and appends the Level
   6 source + tag, which is exactly what "one global card, many unit sources"
   means. Words in `academic-extra.mjs` are the handful Level 6 introduces that
   no earlier level has. */
import fs from "node:fs";
import path from "node:path";
import { ROOT, LEVEL, LEVEL_DIR, COMPONENT_TAG_CODES, componentTag, normalize, readJson, wordId, writeJson } from "./lib.mjs";
import ACADEMIC_EXTRA from "./data/academic-extra.mjs";

/* Every already-scanned unit file, so an academic word taught again in Level 6
   can be cloned from wherever it was first authored. */
function loadExistingWords() {
  const byId = new Map();
  const courseRoot = path.join(ROOT, "content/subjects/english/courses/our-world");
  for (const levelDir of fs.readdirSync(courseRoot)) {
    if (!levelDir.startsWith("level-") || levelDir === `level-${LEVEL}`) continue;
    const unitsRoot = path.join(courseRoot, levelDir);
    for (const unitDir of fs.readdirSync(unitsRoot)) {
      const file = path.join(unitsRoot, unitDir, "vocabulary.json");
      if (!fs.existsSync(file)) continue;
      for (const word of JSON.parse(fs.readFileSync(file, "utf8")).words ?? []) {
        if (!byId.has(word.id)) byId.set(word.id, word);
      }
    }
  }
  return byId;
}

function source(unit, component) {
  return {
    subject: "english",
    course: "our-world",
    level: LEVEL,
    unit,
    component,
    tag: componentTag(unit, COMPONENT_TAG_CODES[component]),
    lessonStatus: "draft"
  };
}

function buildWord(entry, { unit, component, type, themeTag }) {
  const normalized = normalize(entry.w, entry.norm);
  const [firstExample, ...rest] = entry.ex;
  return {
    id: entry.id ?? wordId(entry.w, entry.norm),
    type,
    word: entry.w,
    normalizedWord: normalized,
    displayEmoji: entry.emoji,
    emojiDescription: entry.emojiDesc ?? `${normalized} icon`,
    partOfSpeech: entry.pos,
    syllables: entry.syl,
    ipa: entry.ipa,
    meaning: entry.mean,
    example: firstExample[0],
    exampleJp: firstExample[1],
    additionalExamples: rest.map((pair) => pair[0]),
    additionalExamplesJp: rest.map((pair) => pair[1]),
    japanese: { word: entry.jw, reading: entry.jr, meaning: entry.jm, needsReview: true },
    sources: [source(unit, component)],
    tags: [type, ...(type === "vocabulary" ? ["target", component] : []), themeTag, componentTag(unit, COMPONENT_TAG_CODES[component])]
  };
}

/* An academic card taught again in Level 6: keep the authored card, add this
   unit as another source so it shows up under Level 6 in Reference too. */
function cloneAcademic(existing, unit) {
  const tag = componentTag(unit, "G1");
  const clone = JSON.parse(JSON.stringify(existing));
  clone.sources = [
    ...clone.sources,
    { subject: "english", course: "our-world", level: LEVEL, unit, component: "grammar-1", tag, lessonStatus: "draft" }
  ];
  clone.tags = [...new Set([...clone.tags, `OW${LEVEL}-AC`, tag])];
  return clone;
}

function buildAcademicFromExtra(entry, unit) {
  const tag = componentTag(unit, "G1");
  const normalized = normalize(entry.w, entry.norm);
  return {
    id: entry.id ?? wordId(entry.w, entry.norm),
    type: "academic",
    word: entry.w,
    normalizedWord: normalized,
    displayEmoji: entry.emoji,
    emojiDescription: entry.emojiDesc ?? `${normalized} icon`,
    partOfSpeech: entry.pos,
    syllables: entry.syl,
    ipa: entry.ipa,
    meaning: entry.mean,
    japanese: { word: entry.w, reading: entry.jr, meaning: entry.jm, needsReview: true },
    sources: [{ subject: "english", course: "our-world", level: LEVEL, unit, component: "grammar-1", tag, lessonStatus: "draft" }],
    tags: ["academic", `OW${LEVEL}-AC`, "grammar-1", tag],
    jp_word: entry.w,
    jp_reading: entry.jr,
    jp_sentence: entry.w,
    jp_meaning: entry.jm,
    jp_note: entry.jnote,
    category: entry.category ?? "study language",
    when_to_use: entry.when.map(([context, text]) => ({ context, text })),
    jp_when_to_use: entry.when.map(([context, , jp]) => ({ context, text: jp })),
    how_to_use: { structure: entry.how, patterns: entry.colloc },
    jp_how_to_use: { structure: entry.jhow, patterns: entry.colloc, needsReview: true },
    examples: entry.ex.map(([context, en, jp]) => ({ context, en, jp })),
    collocations: entry.colloc,
    nonExamples: entry.nonEx.map(([en, jp]) => ({ en, jp })),
    practice_prompt: entry.prompt[0],
    jp_practice_prompt: entry.prompt[1],
    miniQuiz: [
      {
        prompt: entry.quiz.prompt,
        options: entry.quiz.options,
        correct: entry.quiz.correct,
        explanation: entry.quiz.explanation,
        jp: entry.quiz.jp
      }
    ],
    example: entry.ex[0][1],
    exampleJp: entry.ex[0][2],
    additionalExamples: entry.ex.slice(1).map(([, en]) => en),
    additionalExamplesJp: entry.ex.slice(1).map(([, , jp]) => jp)
  };
}

export function buildVocabulary(data, existingWords) {
  const themeTag = data.slug;
  const vocab1 = data.v1.words.map((entry) => buildWord(entry, { unit: data.unit, component: "vocab-1", type: "vocabulary", themeTag }));
  const vocab2 = data.v2.words.map((entry) => buildWord(entry, { unit: data.unit, component: "vocab-2", type: "vocabulary", themeTag }));
  const content = (data.content ?? []).map((entry) => buildWord(entry, { unit: data.unit, component: "reading", type: "content", themeTag }));

  const academic = data.academic.map((key) => {
    const id = key.startsWith("global_") ? key : `global_${key}`;
    const existing = existingWords.get(id);
    if (existing) return cloneAcademic(existing, data.unit);
    const extra = ACADEMIC_EXTRA[key];
    if (!extra) throw new Error(`Unit ${data.unit}: academic word "${key}" is neither an existing card nor in academic-extra.mjs`);
    return buildAcademicFromExtra(extra, data.unit);
  });

  const words = [...vocab1, ...vocab2, ...academic, ...content];
  const seen = new Set();
  const unique = words.filter((word) => (seen.has(word.id) ? false : (seen.add(word.id), true)));

  return {
    schemaVersion: 1,
    subject: "english",
    course: "our-world",
    level: LEVEL,
    unit: data.unit,
    unitTitle: data.title,
    source: {
      type: "student-book-audioscript-scan",
      file: "supporting/ow2e_ame_sb_level6_audioscript_website.docx",
      verified: true,
      note: `Scanned Our World Level 6 Unit ${data.unit} from the Student's Book audio script (TR ${data.v1.tr} Vocabulary 1, TR ${data.v2.tr} Vocabulary 2, TR ${data.g1.tr}/${data.g2.tr} Grammar boxes, TR ${data.reading.tr} Reading). The Level 6 planner.pdf is a Git LFS pointer in this checkout.`
    },
    wordIds: unique.map((word) => word.id),
    vocab1WordIds: vocab1.map((word) => word.id),
    vocab2WordIds: vocab2.map((word) => word.id),
    academicWordIds: academic.map((word) => word.id),
    contentWordIds: content.map((word) => word.id),
    relatedWordIds: [],
    words: unique
  };
}

function buildGrammarPoint(point, data) {
  const id = `ow_l${LEVEL}_u${data.unit}_${point.component === "grammar-1" ? "g1" : "g2"}_${point.key}`;
  const tag = componentTag(data.unit, point.component === "grammar-1" ? "G1" : "G2");
  const allSamples = [
    ...point.samples,
    ...point.levelup.rules.flatMap((rule) => rule.examples),
    ...point.levelup.mixed
  ];
  const seen = new Set();
  const examples = allSamples
    .filter((sample) => (seen.has(sample.t) ? false : (seen.add(sample.t), true)))
    .map((sample) => ({ sentence: sample.t, highlight: sample.h }));

  return {
    id,
    type: "grammar",
    subject: "english",
    course: "our-world",
    level: LEVEL,
    unit: data.unit,
    component: point.component,
    lessonId: `ow-l${LEVEL}-u${data.unit}-${point.component}`,
    lessonStatus: "draft",
    tag,
    title: point.title,
    shortName: point.short,
    rule: point.rule,
    pattern: point.pattern,
    chart: {
      title: point.title,
      intro_examples: point.intro.map((item) => ({ text: item.t, jp: item.jp })),
      rows: point.rows,
      note_rule: point.noteRule,
      note_exception: point.noteException,
      note_exception_detail: point.noteExceptionDetail,
      table: point.table
    },
    tab1_samples: point.samples.map((sample) => ({ text: sample.t, jp: sample.jp })),
    tab2_levelup: {
      rules: point.levelup.rules.map((rule) => ({
        title: rule.title,
        jp_title: rule.jpTitle,
        subtitle: rule.sub,
        jp_subtitle: rule.jpSub,
        transforms: rule.transforms.map(([from, to]) => ({ from, to })),
        examples: rule.examples.map((example) => ({ text: example.t, jp: example.jp }))
      })),
      mixed_samples: point.levelup.mixed.map((sample) => ({ text: sample.t, jp: sample.jp }))
    },
    tab3_quiz: point.quiz.map((item) => ({
      stem: item.stem,
      answers: item.answers,
      correct: item.correct,
      explanation: { title: item.explTitle, body: item.explBody },
      jp: item.jp
    })),
    tab4_master: point.master.map((item) => ({
      type: item.type ?? "mcq",
      stem: item.stem,
      answers: item.answers,
      correct: item.correct,
      explanation: { title: item.explTitle, body: item.explBody },
      jp: item.jp
    })),
    japanese: { title: point.jpTitle, rule: point.jpRule, pattern: point.jpPattern, needsReview: true },
    examples,
    tags: ["grammar", point.component, data.slug, tag],
    source: {
      subject: "english",
      course: "our-world",
      level: LEVEL,
      unit: data.unit,
      component: point.component,
      tag,
      lessonStatus: "draft"
    },
    highlightRole: point.role
  };
}

export function buildGrammar(data) {
  const points = [buildGrammarPoint(data.g1, data), buildGrammarPoint(data.g2, data)];
  return {
    schemaVersion: 1,
    subject: "english",
    course: "our-world",
    level: LEVEL,
    unit: data.unit,
    unitTitle: data.title,
    source: {
      type: "student-book-audioscript-scan",
      file: "supporting/ow2e_ame_sb_level6_audioscript_website.docx",
      verified: true,
      note: `Grammar boxes copied verbatim from TR ${data.g1.tr} and TR ${data.g2.tr}.`
    },
    grammarPointIds: points.map((point) => point.id),
    grammarPoints: points
  };
}

export function buildAllContent(units) {
  const existingWords = loadExistingWords();
  const written = [];
  for (const data of units) {
    const dir = `${LEVEL_DIR}/unit-${data.unit}`;
    writeJson(`${dir}/vocabulary.json`, buildVocabulary(data, existingWords));
    writeJson(`${dir}/grammar.json`, buildGrammar(data));
    written.push(dir);
  }
  return written;
}

/* Every Level 6 word has to reach the global vocabulary index or the reference
   validator fails — the index is the flat list every browse view reads. */
export function syncVocabularyIndex(units) {
  const indexPath = "content/subjects/english/reference/vocabulary-index.json";
  const index = readJson(indexPath);
  const known = new Set(index.words);
  const knownFiles = new Set(index.sourceFiles);
  for (const data of units) {
    const relative = `${LEVEL_DIR}/unit-${data.unit}/vocabulary.json`;
    if (!knownFiles.has(relative)) {
      index.sourceFiles.push(relative);
      knownFiles.add(relative);
    }
    const unitVocabulary = readJson(relative);
    for (const id of unitVocabulary.wordIds) {
      if (!known.has(id)) {
        index.words.push(id);
        known.add(id);
      }
    }
  }
  writeJson(indexPath, index);
  return index.words.length;
}
