import fs from "node:fs";
import path from "node:path";
import type { MathSection } from "./types";

const CONTENT_ROOT = path.join(process.cwd(), "content/subjects/math/chapters");

/** Server-only: reads a section's block content from its JSON file, if authored yet. */
export function loadMathSection(chapterId: string, sectionNumber: number): MathSection | null {
  const filePath = path.join(CONTENT_ROOT, chapterId, "sections", `${sectionNumber}.json`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw) as MathSection;
}
