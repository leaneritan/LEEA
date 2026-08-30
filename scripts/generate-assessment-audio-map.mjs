import fs from "node:fs";
import path from "node:path";

// The assessment audio the app can see: every level's manifest, plus which of
// its tracks actually have their .mp3 in public/audio/.
//
// Both halves are build-time facts. Levels are found by scanning rather than
// listed here, so a disc for a new level is picked up by dropping its manifest
// in — nothing to remember to register. And a track's availability cannot be
// discovered at runtime: with preload="none" the browser never requests the
// file, so a missing track fires no error event and would render as a dead
// player that does nothing when pressed.
//
// Regenerated on predev/prebuild, gitignored, same arrangement as
// learnerAppMap.json.
const root = process.cwd();
const coursesRoot = path.join(root, "content/subjects/english/courses");
const outFile = path.join(root, "src", "generated", "assessmentAudio.json");

function findManifests(dir, results = []) {
  if (!fs.existsSync(dir)) return results;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) findManifests(fullPath, results);
    else if (entry.isFile() && entry.name === "assessment-audio.json") results.push(fullPath);
  }
  return results;
}

const manifests = [];
const available = [];
let total = 0;

for (const filePath of findManifests(coursesRoot).sort()) {
  const manifest = JSON.parse(fs.readFileSync(filePath, "utf8"));
  manifests.push(manifest);
  for (const track of manifest.tracks ?? []) {
    if (!track.path) continue;
    total += 1;
    if (fs.existsSync(path.join(root, "public", track.path.replace(/^\//, "")))) {
      available.push(track.path);
    }
  }
}

fs.mkdirSync(path.dirname(outFile), { recursive: true });
fs.writeFileSync(outFile, `${JSON.stringify({ manifests, available }, null, 2)}\n`);
console.log(
  `Wrote ${manifests.length} assessment audio manifest(s), ${available.length} of ${total} track(s) present, to ${path.relative(root, outFile)}`
);
