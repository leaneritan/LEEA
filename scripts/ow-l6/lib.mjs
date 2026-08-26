import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
export const LEVEL = 6;
export const COURSE_DIR = "content/subjects/english/courses/our-world";
export const LEVEL_DIR = `${COURSE_DIR}/level-${LEVEL}`;

/** Level 6 is red in the locked level colour progression (docs/design-decisions.md). */
export const LEVEL_COLOR = "#c0492f";

export const UNITS = [1, 2, 3, 4, 5, 6, 7, 8, 9];

export function readJson(rel) {
  return JSON.parse(fs.readFileSync(path.join(ROOT, rel), "utf8"));
}

export function writeJson(rel, value) {
  const file = path.join(ROOT, rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);
}

export function writeText(rel, value) {
  const file = path.join(ROOT, rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, value);
}

/** `a life jacket` -> `life_jacket`, `hang-gliding` -> `hang_gliding`. */
export function wordId(word, normalized) {
  const base = (normalized || word)
    .toLowerCase()
    .replace(/^(a|an|the)\s+/, "")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
  return `global_${base}`;
}

/** Strip a leading article so the reference card can highlight the word in a sentence. */
export function normalize(word, override) {
  if (override) return override;
  return word.replace(/^(a|an|the)\s+/i, "").toLowerCase();
}

export function componentTag(unit, code) {
  return `OW${LEVEL}-U${unit}-${code}`;
}

export const COMPONENT_TAG_CODES = {
  opener: "OP",
  "vocab-1": "V1",
  song: "SG",
  "grammar-1": "G1",
  "vocab-2": "V2",
  "grammar-2": "G2",
  reading: "RD",
  writing: "WR"
};

export function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/** Inline data for a <script> block: JSON is safe apart from `</script>`. */
export function inlineJson(value) {
  return JSON.stringify(value).replace(/<\//g, "<\\/");
}

export function titleCase(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}
