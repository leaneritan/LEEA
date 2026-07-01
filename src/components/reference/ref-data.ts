/**
 * ref-data.ts — UI-ready selectors for the new Reference surfaces.
 *
 * Transforms the existing VocabularyItem / GrammarPoint exports into the
 * design-time shapes (WordEntry / AcademicEntry / GrammarEntry) via the
 * adapters in src/data/reference-shapes.ts. Per-unit filtered exports are
 * derived here so each surface (Browse, Search, cards) imports only what
 * it needs.
 */

import { grammarPoints, unitTitles, vocabularyItems } from "@/data/reference";
import {
  toAcademicEntry,
  toGrammarEntry,
  toWordEntry,
  type AcademicEntry,
  type GrammarEntry,
  type WordEntry
} from "@/data/reference-shapes";

/* ─── all words (vocab + academic + content + glossary + related) ─── */
export const allWords: WordEntry[] = vocabularyItems.map(toWordEntry);

export function getWordById(id: string): WordEntry | undefined {
  return allWords.find((entry) => entry.id === id);
}

export function getWordNav(currentId: string): PrevNext<WordEntry> {
  const list = allWords.filter((entry) => entry.type !== "academic");
  const i = list.findIndex((entry) => entry.id === currentId);
  if (i < 0) return { prev: null, next: null, index: 0, total: list.length };
  return {
    prev: i > 0 ? list[i - 1] : null,
    next: i < list.length - 1 ? list[i + 1] : null,
    index: i + 1,
    total: list.length
  };
}

/* ─── academic-only (richer card) ─── */
export const academicWords: AcademicEntry[] = vocabularyItems
  .map(toAcademicEntry)
  .filter((entry): entry is AcademicEntry => entry !== null);

export function getAcademicById(id: string): AcademicEntry | undefined {
  return academicWords.find((entry) => entry.id === id);
}

/* ─── grammar points ─── */
export const allGrammar: GrammarEntry[] = grammarPoints.map(toGrammarEntry);

export function getGrammarEntryById(id: string): GrammarEntry | undefined {
  return allGrammar.find((entry) => entry.grammarId === id);
}

/* ─── source-tree shape: course → level → unit → groups ─── */
export type TreeUnit = {
  unit: number;
  unitTitle: string;
  vocabGroups: Array<{ label: string; words: WordEntry[] }>;
  grammar: GrammarEntry[];
};
export type TreeLevel = {
  level: number;
  units: TreeUnit[];
  active: boolean;
};
export type TreeCourse = {
  course: "our-world" | "joyful-work" | "junior-high";
  label: string;
  color: string;
  levels: TreeLevel[];
};

/* Build the source tree dynamically from what's in the data. We only show
   units that actually have words/grammar — no empty placeholders. */
export const sourceTree: TreeCourse[] = buildSourceTree();

function buildSourceTree(): TreeCourse[] {
  /* Our World — group by level, then unit */
  const byUnit = new Map<string, { level: number; unit: number; unitTitle: string; words: WordEntry[]; grammar: GrammarEntry[] }>();

  for (const word of allWords) {
    for (const source of word.sources) {
      if (source.course !== "our-world" || source.level == null || source.unit == null) continue;
      const key = `${source.level}-${source.unit}`;
      const bucket =
        byUnit.get(key) ?? {
          level: source.level,
          unit: source.unit,
          unitTitle: "",
          words: [],
          grammar: []
        };
      if (!bucket.words.includes(word)) bucket.words.push(word);
      byUnit.set(key, bucket);
    }
  }

  for (const grammar of allGrammar) {
    if (grammar.course !== "our-world") continue;
    const key = `${grammar.level}-${grammar.unit}`;
    const bucket =
      byUnit.get(key) ?? {
        level: grammar.level,
        unit: grammar.unit,
        unitTitle: "",
        words: [],
        grammar: []
      };
    if (!bucket.grammar.includes(grammar)) bucket.grammar.push(grammar);
    byUnit.set(key, bucket);
  }

  const levels = new Map<number, TreeLevel>(
    Array.from({ length: 6 }, (_, index) => [index + 1, { level: index + 1, units: [], active: index + 1 === 4 }])
  );
  for (const bucket of byUnit.values()) {
    bucket.unitTitle = unitTitles[`${bucket.level}-${bucket.unit}`] ?? `Unit ${bucket.unit}`;
    const level =
      levels.get(bucket.level) ?? { level: bucket.level, units: [], active: bucket.level === 4 };
    level.units.push({
      unit: bucket.unit,
      unitTitle: bucket.unitTitle,
      vocabGroups: groupWordsByComponent(bucket.words),
      grammar: bucket.grammar
    });
    levels.set(bucket.level, level);
  }
  for (const level of levels.values()) level.units.sort((a, b) => a.unit - b.unit);

  const ow: TreeCourse = {
    course: "our-world",
    label: "Our World",
    color: "var(--ref-course-ow)",
    levels: Array.from(levels.values()).sort((a, b) => a.level - b.level)
  };

  return [ow];
}

function groupWordsByComponent(words: WordEntry[]): TreeUnit["vocabGroups"] {
  const groups: Record<string, WordEntry[]> = {
    "Vocabulary 1": [],
    "Vocabulary 2": [],
    Academic: [],
    Glossary: []
  };
  for (const word of words) {
    /* A word's source tag tells you WHERE in the planner it appeared
       (vocab-1 page, vocab-2 page, reading section, etc.). It does NOT
       tell you what KIND of word it is. The planner often introduces
       Content Vocabulary on the same spread as Vocabulary 1 / 2 — those
       content words get the -V1 / -V2 tag too. The Vocabulary 1 / 2
       buckets in the source tree must only show the actual target
       vocabulary (type "vocabulary"), not the content words from those
       spreads. Otherwise the counts inflate (e.g. U6 V2 shows 9 instead
       of 5, U7 V2 shows 8 instead of 5). Content + related go to
       Glossary regardless of which section they appeared in. */
    const isAcademic = word.type === "academic";
    const isVocab = word.type === "vocabulary";
    const hasV1 = isVocab && word.sources.some((s) => s.tag.endsWith("-V1"));
    const hasV2 = isVocab && word.sources.some((s) => s.tag.endsWith("-V2"));
    if (isAcademic) groups.Academic.push(word);
    else if (hasV1) groups["Vocabulary 1"].push(word);
    else if (hasV2) groups["Vocabulary 2"].push(word);
    else groups.Glossary.push(word);
  }
  return Object.entries(groups)
    .filter(([, list]) => list.length > 0)
    .map(([label, list]) => ({ label, words: list }));
}

/* ─── known split — for I Know / I Don't Know cuts ─── */
export function splitKnown(words: WordEntry[], knownSet: Set<string>) {
  const known: WordEntry[] = [];
  const unknown: WordEntry[] = [];
  for (const word of words) {
    if (knownSet.has(word.id)) known.push(word);
    else unknown.push(word);
  }
  return { known, unknown };
}

/* ─── prev/next helpers for card navigation ─── */
export type PrevNext<T> = {
  prev: T | null;
  next: T | null;
  index: number;       // 1-based position
  total: number;
};

/* Academic prev/next within the full academic list (order = content order). */
export function getAcademicNav(currentId: string): PrevNext<AcademicEntry> {
  const list = academicWords;
  const i = list.findIndex((entry) => entry.id === currentId);
  if (i < 0) return { prev: null, next: null, index: 0, total: list.length };
  return {
    prev: i > 0 ? list[i - 1] : null,
    next: i < list.length - 1 ? list[i + 1] : null,
    index: i + 1,
    total: list.length
  };
}

/* Grammar prev/next within the SAME unit only (matches design: "Grammar 3 of 3 · Unit 8"). */
export function getGrammarNav(currentId: string): PrevNext<GrammarEntry> {
  const current = getGrammarEntryById(currentId);
  if (!current) return { prev: null, next: null, index: 0, total: 0 };
  const peers = allGrammar.filter(
    (entry) => entry.course === current.course && entry.level === current.level && entry.unit === current.unit
  );
  const i = peers.findIndex((entry) => entry.grammarId === currentId);
  return {
    prev: i > 0 ? peers[i - 1] : null,
    next: i < peers.length - 1 ? peers[i + 1] : null,
    index: i + 1,
    total: peers.length
  };
}

/* ─── group words by source course (for I Know chips) ─── */
export function groupByCourse(words: WordEntry[]) {
  const groups: Record<string, WordEntry[]> = {
    "our-world": [],
    "joyful-work": [],
    "junior-high": []
  };
  for (const word of words) {
    const primary = word.sources[0]?.course ?? "our-world";
    groups[primary]?.push(word);
  }
  return [
    { key: "our-world", label: "Our World", color: "var(--ref-course-ow)", words: groups["our-world"] },
    { key: "joyful-work", label: "Joyful Work", color: "var(--ref-course-jw)", words: groups["joyful-work"] },
    { key: "junior-high", label: "Junior High", color: "var(--ref-course-jh)", words: groups["junior-high"] }
  ].filter((group) => group.words.length > 0);
}
