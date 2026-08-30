import generated from "@/generated/assessmentAudio.json";

export type AssessmentTrack = {
  n: number;
  track: string;
  title: string;
  file: string;
  path: string;
  kind: "unit" | "checkpoint" | "level";
  unit?: number;
  checkpoint?: number[];
};

export type AssessmentAudio = {
  schemaVersion: number;
  course: string;
  level: number;
  album: string;
  publisher: string;
  basePath: string;
  tracks: AssessmentTrack[];
};

// Both come from scripts/generate-assessment-audio-map.mjs, which scans the
// course folders — a new level's manifest is picked up by existing, with no
// import to add here.
const manifests = generated.manifests as AssessmentAudio[];
const availablePaths = new Set(generated.available as string[]);

function getManifest(course: string, level: number) {
  return manifests.find((manifest) => manifest.course === course && manifest.level === level);
}

/** Whether a track's .mp3 was in public/audio/ when the app was built. */
export function isAssessmentTrackAvailable(track: AssessmentTrack) {
  return availablePaths.has(track.path);
}

/**
 * The test tracks for one unit — the ExamView tracks Leo listens to during the
 * test he takes after finishing the unit.
 */
export function getUnitAssessmentTracks(course: string, level: number, unit: number) {
  const manifest = getManifest(course, level);
  if (!manifest) return [];
  return manifest.tracks.filter((track) => track.kind === "unit" && track.unit === unit);
}

/**
 * The review tracks numbered under a unit, or an empty list when it has none.
 * A band-closing unit (3, 6, 9) ships two tests: its own, and the review
 * covering the band — 9.3 reviews Units 7-9, and Unit 9 also carries 9.5, the
 * whole-level review. Both are numbered under the unit and filed with it; only
 * the title tells them apart, which is what the unit page labels them by.
 */
export function getCheckpointAssessmentTracks(course: string, level: number, unit: number) {
  const manifest = getManifest(course, level);
  if (!manifest) return [];
  return manifest.tracks.filter((track) => track.kind === "checkpoint" && track.unit === unit);
}

export function getAssessmentAlbum(course: string, level: number) {
  return getManifest(course, level)?.album;
}

/** Levels that have assessment audio, lowest first. */
export function getAssessmentLevels(course: string) {
  return manifests
    .filter((manifest) => manifest.course === course)
    .map((manifest) => manifest.level)
    .sort((a, b) => a - b);
}

/**
 * A level's tracks grouped by the unit they are filed under, in unit order,
 * with each unit's own test before any review numbered under it. Units with no
 * tracks are left out rather than shown empty.
 */
export function getAssessmentUnits(course: string, level: number) {
  const manifest = getManifest(course, level);
  if (!manifest) return [];

  const byUnit = new Map<number, AssessmentTrack[]>();
  for (const track of manifest.tracks) {
    if (track.kind === "level" || !track.unit) continue;
    if (!byUnit.has(track.unit)) byUnit.set(track.unit, []);
    byUnit.get(track.unit)!.push(track);
  }

  return [...byUnit.entries()]
    .sort(([a], [b]) => a - b)
    .map(([unit, tracks]) => ({
      unit,
      tracks: [
        ...tracks.filter((track) => track.kind === "unit"),
        ...tracks.filter((track) => track.kind === "checkpoint")
      ]
    }));
}

export function countAssessmentTracks(course: string, level: number) {
  const manifest = getManifest(course, level);
  if (!manifest) return { total: 0, available: 0 };
  const total = manifest.tracks.length;
  return { total, available: manifest.tracks.filter(isAssessmentTrackAvailable).length };
}
