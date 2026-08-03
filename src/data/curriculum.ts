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
export const LIVE_UNIT = 8;

// Fixed syllabus topics shown on every level's unit chips (product-wide).
export const UNIT_TITLES = [
  "Animals & Habitats",
  "My Town",
  "Food Around the World",
  "Weather & Seasons",
  "Jobs People Do",
  "Sports & Games",
  "The Human Body",
  "That's Really Interesting!",
  "Our Planet"
];

// Level status now derives from the unit Neritan sets, not from the fallback
// constants — import `levelStatusFor` from data/currentUnit.ts directly.
// Deliberately not re-exported here: currentUnit.ts imports the fallbacks from
// this file, and re-exporting back creates a require cycle that breaks the
// /leo prerender with "Cannot access 'e' before initialization".
