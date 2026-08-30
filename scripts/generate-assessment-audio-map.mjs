import fs from "node:fs";
import path from "node:path";

// Which assessment tracks actually have their .mp3 in public/audio/.
//
// The manifest lists every track on the disc, but the audio is filed in
// separately (scripts/sort-assessment-audio.mjs) and may not be there yet, so
// the unit page has to tell a playable track from one that is still missing.
// It cannot find that out at runtime: with preload="none" the browser never
// requests the file, so a missing track fires no error event and renders as a
// dead player that does nothing when pressed. Files under public/ are static
// and known at build time, so the check belongs here — same arrangement as
// learnerAppMap.json, regenerated on predev/prebuild and never committed.
const root = process.cwd();
const outFile = path.join(root, "src", "generated", "assessmentAudioAvailable.json");

const manifestPaths = ["content/subjects/english/courses/our-world/level-4/assessment-audio.json"];

const available = [];
let total = 0;

for (const relativePath of manifestPaths) {
  const absolute = path.join(root, relativePath);
  if (!fs.existsSync(absolute)) continue;
  const manifest = JSON.parse(fs.readFileSync(absolute, "utf8"));
  for (const track of manifest.tracks ?? []) {
    if (!track.path) continue;
    total += 1;
    if (fs.existsSync(path.join(root, "public", track.path.replace(/^\//, "")))) {
      available.push(track.path);
    }
  }
}

fs.mkdirSync(path.dirname(outFile), { recursive: true });
fs.writeFileSync(outFile, `${JSON.stringify(available, null, 2)}\n`);
console.log(`Wrote ${available.length} of ${total} assessment audio track(s) to ${path.relative(root, outFile)}`);
