// Canonical level/unit structure shared by the Neritan teacher dashboard and
// Leo's library navigator, so both surfaces always agree on which levels are
// unlocked and what each unit's syllabus topic is called. Previously each
// dashboard hardcoded its own copy of this list; keeping one source avoids
// the two pages drifting apart (e.g. different level colors/unit titles).

export const LEVELS = [1, 2, 3, 4, 5, 6];

// Level 4 is where teaching is actively happening today, with Unit 8 as the
// current flagship unit. Levels below are already taught end-to-end; levels
// ahead haven't started yet.
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

export type LevelStatus = "done" | "current" | "locked";

export function getLevelStatus(level: number): LevelStatus {
  if (level < LIVE_LEVEL) return "done";
  if (level > LIVE_LEVEL) return "locked";
  return "current";
}
