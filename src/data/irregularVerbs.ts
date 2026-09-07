/**
 * irregularVerbs.ts — the Our World 4 end-of-book "Irregular Verbs" table
 * (infinitive / simple past / past participle), wired into Reference.
 *
 * Roughly a third of these verbs already have a real vocabulary card
 * somewhere in the curriculum (tagged `pos: "verb"`); the rest don't, so this
 * list carries its own light-card content (`light`) for those. Matching to
 * an existing card is done here at runtime rather than hardcoded in the JSON
 * — if a verb later gets scanned into a real unit, it upgrades to the real
 * card automatically with no data change needed.
 */

import irregularVerbsData from "../../content/subjects/english/reference/irregular-verbs.json";
import { allWords } from "@/components/reference/ref-data";
import type { WordEntry } from "./reference-shapes";

export type IrregularVerbLight = {
  emoji: string;
  examples: [string, string, string];
};

export type IrregularVerbEntry = {
  id: string;
  infinitive: string;
  past: string;
  pastParticiple: string;
  /** Set only for verbs without a real Reference card yet. */
  light: IrregularVerbLight | null;
  /** The real vocab card for this verb, when one exists. */
  card: WordEntry | null;
  href: string;
};

type RawVerb = {
  id: string;
  infinitive: string;
  past: string;
  pastParticiple: string;
  light?: IrregularVerbLight;
};

function findCard(infinitive: string): WordEntry | null {
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

export const irregularVerbs: IrregularVerbEntry[] = (irregularVerbsData.verbs as RawVerb[]).map((raw) => {
  const card = findCard(raw.infinitive);
  return {
    id: raw.id,
    infinitive: raw.infinitive,
    past: raw.past,
    pastParticiple: raw.pastParticiple,
    light: card ? null : raw.light ?? null,
    card,
    href: card ? `/reference/word/${card.id}` : `/reference/irregular-verb/${raw.id}`
  };
});

export function getIrregularVerbById(id: string): IrregularVerbEntry | undefined {
  return irregularVerbs.find((entry) => entry.id === id);
}

export type PrevNextIrregular = {
  prev: IrregularVerbEntry | null;
  next: IrregularVerbEntry | null;
  index: number;
  total: number;
};

/* Prev/next only walks the light-card verbs — the ones with a real card use
   that card's own prev/next through the full vocabulary list instead. */
export function getIrregularVerbNav(currentId: string): PrevNextIrregular {
  const list = irregularVerbs.filter((entry) => entry.light);
  const i = list.findIndex((entry) => entry.id === currentId);
  if (i < 0) return { prev: null, next: null, index: 0, total: list.length };
  return {
    prev: i > 0 ? list[i - 1] : null,
    next: i < list.length - 1 ? list[i + 1] : null,
    index: i + 1,
    total: list.length
  };
}
