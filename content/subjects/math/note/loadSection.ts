import fs from "node:fs";
import path from "node:path";
import { mathNoteChapters } from "./curriculum";
import type { MathNoteBlockQuestionSet, MathNoteSection } from "./types";

const CONTENT_ROOT = path.join(process.cwd(), "content/subjects/math/note/sections");

/** Server-only: a 学習ノート section's content, if it has been authored yet. */
export function loadMathNoteSection(sectionId: string): MathNoteSection | null {
  // Section ids come from the curriculum, never from the URL directly — but be
  // explicit about it rather than trusting the caller with a path segment.
  if (!/^note-[0-9a-z-]+$/i.test(sectionId)) return null;
  const filePath = path.join(CONTENT_ROOT, `${sectionId}.json`);
  if (!fs.existsSync(filePath)) return null;
  return JSON.parse(fs.readFileSync(filePath, "utf-8")) as MathNoteSection;
}

/**
 * Server-only: the question-set block ids of each authored section, keyed by
 * section id.
 *
 * The home page needs per-section progress, but the JSON only exists on the
 * server and the progress map is keyed `<sectionId>::<blockId>` on the client.
 * Hand it the real ids rather than a count: reconstructing them from a naming
 * convention would silently report 0% the first time a section names its sets
 * anything else.
 */
export function loadMathNoteSetIds(): Record<string, string[]> {
  const ids: Record<string, string[]> = {};
  for (const chapter of mathNoteChapters) {
    for (const meta of chapter.sections) {
      if (!meta.authored) continue;
      const section = loadMathNoteSection(meta.id);
      if (!section) continue;
      const blockIds = section.blocks
        .filter((block): block is MathNoteBlockQuestionSet => block.type === "qset")
        .map((block) => block.id);
      if (blockIds.length > 0) ids[meta.id] = blockIds;
    }
  }
  return ids;
}
