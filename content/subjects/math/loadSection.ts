import fs from "node:fs";
import path from "node:path";
import { mathChapters } from "./curriculum";
import type { MathSection } from "./types";

const CONTENT_ROOT = path.join(process.cwd(), "content/subjects/math/chapters");

/** Server-only: reads a section's block content from its JSON file, if authored yet. */
export function loadMathSection(chapterId: string, sectionNumber: number): MathSection | null {
  const filePath = path.join(CONTENT_ROOT, chapterId, "sections", `${sectionNumber}.json`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw) as MathSection;
}

/** Server-only: counts non-textbook "おまけレッスン" (lesson-link blocks) per section, keyed by section id. Sections with none are omitted. */
export function loadMathExtraLessonCounts(): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const chapter of mathChapters) {
    for (const section of chapter.sections) {
      const full = loadMathSection(chapter.id, section.number);
      const count = full ? full.blocks.filter((block) => block.type === "lesson-link").length : 0;
      if (count > 0) counts[section.id] = count;
    }
  }
  return counts;
}
