/**
 * reference-units.ts — canonical Our World level/unit counts.
 *
 * Single source of truth for "how many units exist" per Our World level,
 * independent of how many are actually scanned/imported into reference.ts.
 * The Reference Browse scope bar and unit tree both derive their
 * "N of M units imported" meta from this table plus the real imported
 * counts in ref-data.ts's sourceTree — never hardcode either number twice.
 */

export const OUR_WORLD_LEVELS = [1, 2, 3, 4, 5, 6] as const;

/** Total units per Our World level (curriculum shape, not import status). */
export const OUR_WORLD_UNIT_TOTALS: Record<number, number> = {
  1: 8,
  2: 9,
  3: 9,
  4: 9,
  5: 9,
  6: 9
};

export const OUR_WORLD_TOTAL_UNITS = Object.values(OUR_WORLD_UNIT_TOTALS).reduce((sum, n) => sum + n, 0);

/** Level accent colors — must stay consistent with globals.css's
    .refv2-level-dot[data-level] rules and AGENTS.md's documented mapping
    (L1 green, L2 teal, L3 blue, L4 purple, L5 orange, L6 red). */
export const LEVEL_COLORS: Record<number, string> = {
  1: "#5f8a4e",
  2: "#2f9c8e",
  3: "#3f6691",
  4: "#7a5aa6",
  5: "#d08a3a",
  6: "#c0492f"
};

export const LEVEL_TINTS: Record<number, string> = {
  1: "#eef4ea",
  2: "#e6f5f2",
  3: "#e9eff6",
  4: "#f6f3fb",
  5: "#fbf1e4",
  6: "#fbeae6"
};
