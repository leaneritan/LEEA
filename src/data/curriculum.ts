// Canonical level/unit structure shared by the Neritan teacher dashboard and
// Leo's library navigator, so both surfaces always agree on which levels are
// unlocked and what each unit's syllabus topic is called. Previously each
// dashboard hardcoded its own copy of this list; keeping one source avoids
// the two pages drifting apart (e.g. different level colors/unit titles).

export const LEVELS = [1, 2, 3, 4, 5, 6];

// Fallback cursor only. The unit actually being taught is now a setting
// Neritan controls from the teacher menu — see data/currentUnit.ts. These
// values are what a browser sees before one has ever been chosen.
export const LIVE_LEVEL = 4;
export const LIVE_UNIT = 9;

// Unit titles are per level — Our World gives each level its own syllabus, so
// one shared list was wrong for every level except by coincidence. These are
// harvested from the authored unit content (`unitTitle` in each unit's
// vocabulary/grammar JSON) and the level planners' `theme` fields, which are
// the two places the real titles live.
//
// Levels are filled in as units get scanned; anything not listed yet falls
// back to "Unit N" rather than showing another level's topic.
export const UNIT_TITLES_BY_LEVEL: Record<number, Record<number, string>> = {
  1: {},
  2: { 6: "How Are You?", 7: "Awesome Animals", 8: "The World of Work", 9: "Let's Eat" },
  3: { 1: "A Helping Hand", 2: "My Place in the World", 3: "On the Move!", 4: "Our Senses", 5: "Animal Habitats", 6: "What’s for Dinner?", 7: "Feeling Fit", 8: "Let's Celebrate", 9: "My Weekend" },
  4: { 1: "All in Our Family", 2: "Fresh Food", 3: "Long Ago and Today", 4: "Get Well Soon!", 5: "My Favorites", 6: "Wonders of the Sea", 7: "Good Idea!", 8: "That's Really Interesting!", 9: "The Science of Fun" },
  5: { 1: "Extreme Weather" },
  6: {},
};

export const UNITS_PER_LEVEL = 9;

/** Title for one unit, or a neutral "Unit N" when it hasn't been scanned yet. */
export function unitTitle(level: number, unit: number): string {
  return UNIT_TITLES_BY_LEVEL[level]?.[unit] ?? `Unit ${unit}`;
}

/** The nine unit titles for a level, in order — for chip rows. */
export function unitTitlesForLevel(level: number): string[] {
  return Array.from({ length: UNITS_PER_LEVEL }, (_, index) => unitTitle(level, index + 1));
}

// Level status now derives from the unit Neritan sets, not from the fallback
// constants — import `levelStatusFor` from data/currentUnit.ts directly.
// Deliberately not re-exported here: currentUnit.ts imports the fallbacks from
// this file, and re-exporting back creates a require cycle that breaks the
// /leo prerender with "Cannot access 'e' before initialization".
