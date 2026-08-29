import fs from "node:fs";
import path from "node:path";
import { scienceUnits } from "./curriculum";
import { isScienceStatefulBlock, type ScienceSection } from "./types";

const CONTENT_ROOT = path.join(process.cwd(), "content/subjects/science/sections");

/** Server-only: reads a section's block content from its JSON file, if authored yet. */
export function loadScienceSection(sectionId: string): ScienceSection | null {
  // Section ids are authored by hand in curriculum.ts, but this path is built
  // from one, so keep a traversal guard here rather than trusting the caller.
  if (!/^[a-z0-9-]+$/.test(sectionId)) return null;
  const filePath = path.join(CONTENT_ROOT, `${sectionId}.json`);
  if (!fs.existsSync(filePath)) return null;
  return JSON.parse(fs.readFileSync(filePath, "utf-8")) as ScienceSection;
}

/**
 * Server-only: how many tickable blocks each authored section holds, keyed by
 * section id. The home page needs to show how far through a section Leo is, and
 * the JSON only exists on the server — but the progress map is keyed
 * `<sectionId>::<blockId>`, so a count is enough for the client to do the rest.
 */
export function loadScienceBlockCounts(): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const unit of scienceUnits) {
    for (const chapter of unit.chapters) {
      for (const section of chapter.sections) {
        const full = loadScienceSection(section.id);
        if (!full) continue;
        const total = full.blocks.filter(isScienceStatefulBlock).length;
        if (total > 0) counts[section.id] = total;
      }
    }
  }
  return counts;
}
