import fs from "node:fs";
import path from "node:path";
import { mathChapters } from "./curriculum";
import type { MathBlockLessonLink, MathSection } from "./types";

const CONTENT_ROOT = path.join(process.cwd(), "content/subjects/math/chapters");

/** Server-only: reads a section's block content from its JSON file, if authored yet. */
export function loadMathSection(chapterId: string, sectionNumber: number): MathSection | null {
  const filePath = path.join(CONTENT_ROOT, chapterId, "sections", `${sectionNumber}.json`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw) as MathSection;
}

/** One おまけレッスン, flattened for listing outside the section page it lives on. */
export type MathExtraLessonSummary = {
  /** The lesson-link block's id, so the section page can be opened scrolled to it. */
  blockId: string;
  heading: string;
  label: string;
  href: string;
  page?: string;
};

/**
 * Server-only: the non-textbook "おまけレッスン" (lesson-link blocks) of every
 * section, keyed by section id. Sections with none are omitted.
 *
 * These used to be returned as bare counts, which is why the curriculum home
 * could say a chapter had five extra lessons but offer no way to reach any of
 * them: each one sits inline at its own textbook page, and those pages are
 * thousands of pixels down a section. Return the lessons themselves so they can
 * be listed and opened directly.
 */
export function loadMathExtraLessons(): Record<string, MathExtraLessonSummary[]> {
  const lessons: Record<string, MathExtraLessonSummary[]> = {};
  for (const chapter of mathChapters) {
    for (const section of chapter.sections) {
      const full = loadMathSection(chapter.id, section.number);
      if (!full) continue;
      const found = full.blocks
        .filter((block): block is MathBlockLessonLink => block.type === "lesson-link")
        .map((block) => ({
          blockId: block.id,
          heading: block.heading,
          label: block.label,
          href: block.href,
          page: block.page
        }));
      if (found.length > 0) lessons[section.id] = found;
    }
  }
  return lessons;
}

/**
 * Server-only: how many tickable problems each authored section holds, keyed by
 * section id. The home page needs to say how far through a section Leo is, and
 * the JSON content only exists on the server — but the progress map is keyed
 * `<sectionId>::<blockId>` and only practice and quickcheck blocks are ever
 * ticked, so a count is enough for the client to work out the rest.
 */
export function loadMathPracticeCounts(): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const chapter of mathChapters) {
    for (const section of chapter.sections) {
      const full = loadMathSection(chapter.id, section.number);
      if (!full) continue;
      const total = full.blocks.filter(
        (block) => block.type === "practice" || block.type === "quickcheck"
      ).length;
      if (total > 0) counts[section.id] = total;
    }
  }
  return counts;
}
