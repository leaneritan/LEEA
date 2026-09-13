/**
 * Marking a typed 数学 answer.
 *
 * Leo types on a tablet, so an answer arrives with whatever keyboard he had:
 * ＋ and －, a katakana ー for a minus sign, full-width digits, stray spaces,
 * 、 instead of a comma. None of those are mathematical mistakes and none of
 * them should be marked as one — so normalise first, then compare.
 *
 * Numeric comparison is the second pass: "+14", "14" and "14.0" are the same
 * number, and so are "-8/3" and "-2.666…". A question that exists to teach
 * ＋/－ notation opts out of that with `strictSign`, because there "7" for "+7"
 * is exactly the mistake being corrected.
 */

import type { MathNotePart } from "./types";

const FULL_WIDTH = /[！-～]/g;

/** Every dash-like character a keyboard might produce for a minus sign. */
const DASHES = /[−‐‑‒–—ー－]/g;

export function normalizeAnswer(input: string): string {
  return input
    .replace(FULL_WIDTH, (c) => String.fromCharCode(c.charCodeAt(0) - 0xfee0))
    .replace(DASHES, "-")
    .replace(/[、､]/g, ",")
    .replace(/[\s　]/g, "")
    .replace(/,+$/, "")
    .toLowerCase();
}

const NUMERIC = /^[+-]?\d+(?:\.\d+)?(?:\/\d+(?:\.\d+)?)?$/;

/** The value of a token, or null when it is not a plain number or fraction. */
function numericValue(token: string): number | null {
  if (!NUMERIC.test(token)) return null;
  const negative = token.startsWith("-");
  const body = token.replace(/^[+-]/, "");
  const [numerator, denominator] = body.split("/");
  const value = denominator ? Number(numerator) / Number(denominator) : Number(numerator);
  if (!Number.isFinite(value)) return null;
  return negative ? -value : value;
}

function tokensMatch(given: string, want: string, strictSign: boolean): boolean {
  if (given === want) return true;
  if (strictSign) return false;
  const a = numericValue(given);
  const b = numericValue(want);
  if (a === null || b === null) return false;
  return Math.abs(a - b) < 1e-9;
}

function split(value: string): string[] {
  return value.split(",").filter(Boolean);
}

function listsMatch(given: string, want: string, unordered: boolean, strictSign: boolean): boolean {
  const a = split(given);
  const b = split(want);
  if (a.length !== b.length) return false;
  if (!unordered) return a.every((token, i) => tokensMatch(token, b[i], strictSign));

  const remaining = [...b];
  return a.every((token) => {
    const hit = remaining.findIndex((candidate) => tokensMatch(token, candidate, strictSign));
    if (hit === -1) return false;
    remaining.splice(hit, 1);
    return true;
  });
}

export function isTypedAnswerCorrect(raw: string, part: MathNotePart, strictSign = false): boolean {
  const given = normalizeAnswer(raw);
  if (!given) return false;
  return (part.accept ?? []).some((candidate) =>
    listsMatch(given, normalizeAnswer(candidate), part.unordered === true, strictSign)
  );
}

export function areChoicesCorrect(picked: number[], part: MathNotePart): boolean {
  const correct = part.correct ?? [];
  return picked.length === correct.length && correct.every((index) => picked.includes(index));
}

/** How a part is answered, so the renderer and the scorer agree on what counts. */
export type MathNotePartMode = "typed" | "choice" | "self-check" | "paper";

export function partMode(part: MathNotePart): MathNotePartMode {
  if (part.accept?.length) return "typed";
  if (part.choices?.length && part.correct?.length) return "choice";
  if (part.answer) return "self-check";
  return "paper";
}

/** Parts that score. A self-check or paper part never counts against Leo. */
export function isScorable(part: MathNotePart): boolean {
  const mode = partMode(part);
  return mode === "typed" || mode === "choice";
}
