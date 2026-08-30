import level4Assessment from "../../content/subjects/english/courses/our-world/level-4/assessment-audio.json";

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

const manifests: AssessmentAudio[] = [level4Assessment as AssessmentAudio];

function getManifest(course: string, level: number) {
  return manifests.find((manifest) => manifest.course === course && manifest.level === level);
}

/**
 * The test tracks for one unit — the two ExamView tracks Leo listens to during
 * the test he takes after finishing the unit.
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
