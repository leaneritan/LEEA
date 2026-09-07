/**
 * irregularVerbs.ts — the Our World 4 end-of-book "Irregular Verbs" table
 * (infinitive / simple past / past participle), wired into Reference.
 *
 * Roughly a third of these verbs already have a real vocabulary card
 * somewhere in the curriculum (tagged `pos: "verb"`), and those cards win —
 * they carry the unit sources and lesson links this list can't. The rest
 * carry their own card content here (`light`) in the same shape, so every
 * verb in the table opens the same Word Card either way.
 *
 * Matching to an existing card happens at runtime rather than being
 * hardcoded in the JSON: if a verb later gets scanned into a real unit, it
 * upgrades to that card automatically with no data change needed.
 */

import irregularVerbsData from "../../content/subjects/english/reference/irregular-verbs.json";
import { allWords } from "@/components/reference/ref-data";
import type { WordEntry } from "./reference-shapes";

export type IrregularVerbLight = {
  emoji: string;
  meaning: string;
  ipa: string;
  syllables: string;
  japanese: { word: string; meaning: string; needsReview: boolean };
  examples: string[];
  examplesJp: string[];
};

export type IrregularVerbEntry = {
  id: string;
  infinitive: string;
  past: string;
  pastParticiple: string;
  /** The card to render — a real vocabulary card when one exists, else one built from `light`. */
  card: WordEntry;
  /** True when `card` is a real curriculum card rather than one built from this list. */
  hasVocabularyCard: boolean;
  href: string;
};

type RawVerb = {
  id: string;
  infinitive: string;
  past: string;
  pastParticiple: string;
  light?: IrregularVerbLight;
};

function findVocabularyCard(infinitive: string): WordEntry | null {
  const head = infinitive.split(/\s+/)[0]?.toLowerCase();
  return (
    allWords.find(
      (word) =>
        word.pos === "verb" &&
        (word.normalizedWord.toLowerCase() === infinitive.toLowerCase() ||
          word.normalizedWord.toLowerCase() === head ||
          word.word.toLowerCase() === infinitive.toLowerCase())
    ) ?? null
  );
}

/* Built to match what reference-shapes.ts produces for a scanned word, so
   WordCard can't tell the difference: `japanese.meaning` lands on jp.sentence
   (the 日 row under Meaning) and `japanese.word` on jp.gloss (the hero
   reading), exactly as toWordEntry maps them. */
function buildCard(raw: RawVerb, light: IrregularVerbLight): WordEntry {
  return {
    id: raw.id,
    type: "vocabulary",
    word: raw.infinitive,
    normalizedWord: raw.infinitive,
    emoji: light.emoji,
    pos: "verb",
    syllables: light.syllables,
    pronUS: light.ipa,
    definition: light.meaning,
    senses: [{ text: light.meaning }],
    examples: light.examples,
    examplesJp: light.examplesJp,
    family: [],
    sources: [
      {
        course: "our-world",
        level: 4,
        tag: "Irregular Verbs list",
        lessonId: "tg-verb-time-machine",
        lessonStatus: "live"
      }
    ],
    jp: {
      gloss: light.japanese.word,
      sentence: light.japanese.meaning,
      needsReview: light.japanese.needsReview
    }
  };
}

export const irregularVerbs: IrregularVerbEntry[] = (irregularVerbsData.verbs as RawVerb[]).map((raw) => {
  const vocabularyCard = findVocabularyCard(raw.infinitive);
  const card = vocabularyCard ?? buildCard(raw, raw.light as IrregularVerbLight);
  return {
    id: raw.id,
    infinitive: raw.infinitive,
    past: raw.past,
    pastParticiple: raw.pastParticiple,
    card,
    hasVocabularyCard: Boolean(vocabularyCard),
    href: `/reference/irregular-verb/${raw.id}`
  };
});

export function getIrregularVerbById(id: string): IrregularVerbEntry | undefined {
  return irregularVerbs.find((entry) => entry.id === id);
}

/* Prev/next walks this list, not the 1,000-plus-word global vocabulary —
   browsing a themed list should stay inside that theme. */
export function getIrregularVerbNav(currentId: string) {
  const i = irregularVerbs.findIndex((entry) => entry.id === currentId);
  const toLink = (entry: IrregularVerbEntry) => ({ href: entry.href, label: entry.infinitive });
  return {
    prev: i > 0 ? toLink(irregularVerbs[i - 1]) : null,
    next: i >= 0 && i < irregularVerbs.length - 1 ? toLink(irregularVerbs[i + 1]) : null,
    index: i + 1,
    total: irregularVerbs.length,
    noun: "Verb"
  };
}
