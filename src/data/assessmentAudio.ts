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
 * The review tracks for the band a unit closes, or an empty list when the unit
 * does not close one. ExamView numbers its review tracks under the band's last
 * unit (3.3 is the Units 1-3 review), which is the same convention LEEA uses
 * for checkpoint lessons — so Unit 3, 6 and 9 each carry a review alongside
 * their own test, and the other units carry none.
 */
export function getCheckpointAssessmentTracks(course: string, level: number, unit: number) {
  const manifest = getManifest(course, level);
  if (!manifest) return [];
  return manifest.tracks.filter((track) => track.kind === "checkpoint" && track.checkpoint?.[1] === unit);
}

export function getAssessmentAlbum(course: string, level: number) {
  return getManifest(course, level)?.album;
}
