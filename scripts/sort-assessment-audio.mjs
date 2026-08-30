// Files ExamView test audio into public/audio/, one folder per unit, and
// checks it against each level's assessment-audio.json manifest.
//
//   node scripts/sort-assessment-audio.mjs --from ~/Downloads/ExamViewAudio
//   node scripts/sort-assessment-audio.mjs --from <dir> --dry-run
//   node scripts/sort-assessment-audio.mjs --check
//
// --from searches subfolders and sorts what it finds by the level in each file
// name, so it can be one level's folder or the parent of several — pointing it
// at the folder holding every level files them all in one go.
//
// The manifest is the source of truth: it says where every track belongs and
// what it is called. This script only moves files into place and reports what
// is missing or unexpected — it never invents a placement. When a new level's
// disc arrives, run --scaffold to draft its manifest from the filenames, then
// read the draft before committing it.

import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

function parseArgs(argv) {
  const args = { level: null, from: null, dryRun: false, check: false, scaffold: false };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--from") args.from = argv[++i];
    else if (arg === "--level") args.level = Number(argv[++i]);
    else if (arg === "--dry-run") args.dryRun = true;
    else if (arg === "--check") args.check = true;
    else if (arg === "--scaffold") args.scaffold = true;
    else if (arg === "--help" || arg === "-h") args.help = true;
    else {
      console.error(`Unknown argument: ${arg}`);
      process.exit(1);
    }
  }
  return args;
}

const args = parseArgs(process.argv.slice(2));

if (args.help) {
  console.log(`Usage:
  --from <dir>   folder holding the .mp3 files, or the parent of several such
                 folders; subfolders are searched (files are copied, not moved)
  --level <n>    Our World level; inferred from each file name when omitted
  --dry-run      report what would happen, change nothing
  --check        verify what is already in public/audio/ against the manifest
  --scaffold     draft a manifest from --from filenames (new levels only)`);
  process.exit(0);
}

// The level is in every filename (ow2e_ev4_ame_...), so a folder can say which
// level it is without being told. Guessing wrong would file a disc into the
// wrong level, so a folder carrying more than one level is an error, not a
// best guess.
function inferLevel(from) {
  if (!fs.existsSync(from)) {
    console.error(`Source folder not found: ${from}`);
    process.exit(1);
  }
  const levels = new Set();
  for (const file of listMp3s(from)) {
    const match = file.match(/^ow2e_ev(\d+)_ame_/i);
    if (match) levels.add(Number(match[1]));
  }
  if (levels.size === 1) return [...levels][0];
  if (levels.size === 0) {
    console.error(`Could not tell which level ${from} holds — no file there is named like ow2e_ev<level>_ame_<track>_0.mp3.`);
    console.error(`Pass --level <n> to say which it is.`);
  } else {
    console.error(`${from} holds more than one level (${[...levels].sort().join(", ")}). Split it, or pass --level <n>.`);
  }
  process.exit(1);
}

// The levels that have a manifest, found the same way the generator and the
// validator find them, so nothing has to be kept in step by hand.
function findManifests(dir = path.join(root, "content/subjects/english/courses"), results = []) {
  if (!fs.existsSync(dir)) return results;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) findManifests(fullPath, results);
    else if (entry.isFile() && entry.name === "assessment-audio.json") {
      results.push(path.relative(root, fullPath));
    }
  }
  return results.sort();
}

function manifestPath(level) {
  return `content/subjects/english/courses/our-world/level-${level}/assessment-audio.json`;
}

function readManifest(level, sources, dryRun = false) {
  const rel = manifestPath(level);
  const abs = path.join(root, rel);
  if (!fs.existsSync(abs)) {
    // A level with no manifest yet is the normal case for a disc arriving for
    // the first time, so draft one from the filenames rather than stopping. It
    // is printed as a per-unit summary for checking; the disc's own track
    // listing is the thing to check it against.
    if (!sources) {
      console.error(`No manifest at ${rel}, and no --from <dir> to draft one from.`);
      process.exit(1);
    }
    console.log(`No manifest for level ${level} yet — drafting one from the filenames.\n`);
    const { draft } = scaffold(level, sources, { write: !dryRun });
    console.log("");
    return draft;  // null when nothing matched — the caller skips the level
  }
  return JSON.parse(fs.readFileSync(abs, "utf8"));
}

// The publisher's numbering: the number before the dot is the unit, and that
// alone decides the folder — review tracks included, so 9.1 through 9.5 all go
// in unit-9/. A band-closing unit (3, 6, 9) ships two tests and so has more
// tracks than the others: .1/.2 are its own test, .3/.4 are the review covering
// the band, and 9.5 is the whole-level review. That distinction lives in the
// title and in `kind`; it does not move the file. 0.0 is the copyright notice.
const BANDS = { 3: [1, 3], 6: [4, 6], 9: [7, 9] };
const LAST_UNIT = 9;

function classify(track, level) {
  const [unitStr, seq] = track.split(".");
  const unit = Number(unitStr);
  if (unit === 0) return { kind: "level", folder: "", title: "Copyright" };
  const folder = `unit-${unit}`;
  if (unit === LAST_UNIT && seq.startsWith("5")) {
    return {
      kind: "checkpoint",
      unit,
      checkpoint: [1, LAST_UNIT],
      folder,
      title: `OW2e EV L${level}U1-${LAST_UNIT} Review Track ${track}`
    };
  }
  if (BANDS[unit] && (seq.startsWith("3") || seq.startsWith("4"))) {
    const [from, to] = BANDS[unit];
    return {
      kind: "checkpoint",
      unit,
      checkpoint: [from, to],
      folder,
      title: `OW2e EV L${level}U${from}-${to} Review Track ${track}`
    };
  }
  const expected = seq.startsWith("1") || seq.startsWith("2");
  return {
    kind: "unit",
    unit,
    folder,
    title: `OW2e EV L${level}U${unit} Track ${track}`,
    unexpected: !expected
  };
}

// ow2e_ev<level>_ame_<track>[_<n>].mp3 — the trailing _<n> varies by disc
// (Level 4 ships _0, Level 2 _2, Levels 1, 3, 5 and 6 none), so it is optional
// and carries nothing. Requiring the `ev<digit>` stem is what keeps the student
// book (sb), workbook (wb), readers (rdr) and placement test (evp) audio out.
function trackFromFilename(file, level) {
  const match = file.match(new RegExp(`^ow2e_ev${level}_ame_(\\d+\\.\\d+[a-z]?)(?:_\\d+)?\\.mp3$`, "i"));
  return match ? match[1] : null;
}

// Every .mp3 at or under a folder, keyed by file name. Searching subfolders
// means --from can be the folder holding one subfolder per level, so all the
// discs go in with one command and one path to get right.
function collectMp3s(dir, found = new Map(), repeats = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) collectMp3s(fullPath, found, repeats);
    else if (entry.isFile() && entry.name.toLowerCase().endsWith(".mp3")) {
      // The same disc can sit in two folders — Level 5's assessment and
      // placement folders hold identically named files. Take the first and
      // count the rest, so a folder that is a copy does not look like extra
      // tracks and does not go unmentioned either.
      if (found.has(entry.name)) repeats.push(entry.name);
      else found.set(entry.name, fullPath);
    }
  }
  return { found, repeats };
}

// Split what was found by the level in each file name. A file the pattern does
// not match has no level to file it under, so it is held aside as unknown
// rather than guessed at.
function groupByLevel(files, forcedLevel = null) {
  const byLevel = new Map();
  const unknown = [];
  for (const [name, fullPath] of files) {
    const match = name.match(/^ow2e_ev(\d+)_ame_/i);
    const level = forcedLevel ?? (match ? Number(match[1]) : null);
    if (!level) {
      unknown.push(name);
      continue;
    }
    if (!byLevel.has(level)) byLevel.set(level, new Map());
    byLevel.get(level).set(name, fullPath);
  }
  return { byLevel, unknown };
}

function scaffold(level, sources, { write = true } = {}) {
  const files = [...sources.keys()].sort();
  const base = `/audio/our-world/level-${level}`;
  const unknown = [];
  const flagged = [];
  const tracks = [];

  const seen = new Map();
  const duplicates = [];

  for (const file of files) {
    const track = trackFromFilename(file, level);
    if (!track) {
      unknown.push(file);
      continue;
    }
    if (seen.has(track)) {
      duplicates.push(`${track}: keeping ${seen.get(track)}, ignoring ${file}`);
      continue;
    }
    seen.set(track, file);
    const placement = classify(track, level);
    if (placement.unexpected) flagged.push(track);
    const dir = placement.folder ? `${base}/${placement.folder}` : base;
    const entry = { n: tracks.length, track, title: placement.title, file, path: `${dir}/${file}` };
    if (placement.unit) entry.unit = placement.unit;
    if (placement.checkpoint) entry.checkpoint = placement.checkpoint;
    entry.kind = placement.kind;
    tracks.push(entry);
  }

  const draft = {
    schemaVersion: 1,
    subject: "english",
    course: "our-world",
    level,
    kind: "assessment",
    album: `Our World 2e Level ${level} ExamView Audio`,
    publisher: "National Geographic Learning",
    basePath: base,
    _note:
      "Scaffolded from the disc's filenames by scripts/sort-assessment-audio.mjs, using the numbering rules read off Level 4: the number before the dot is the unit and decides the folder; .1/.2 are that unit's own test; .3/.4 on a band-closing unit are the band review; 9.5 is the whole-level review; 0.0 is the copyright notice. Titles are generated to match the publisher's ID3 pattern, not read from the files — check them against the disc's own track listing if a row on the unit page looks wrong.",
    tracks
  };

  if (!tracks.length) {
    // An empty manifest is worse than none: it records a level as known and
    // having nothing, and the validator has nothing to object to. Say what was
    // actually found instead, and write nothing.
    console.log(`Level ${level}: none of the ${sources.size} file(s) are named the way this script expects.`);
    console.log(`  Expected names like ow2e_ev${level}_ame_1.1_0.mp3. Found, for example:`);
    for (const name of unknown.slice(0, 5)) console.log(`    ${name}`);
    if (unknown.length > 5) console.log(`    ... and ${unknown.length - 5} more`);
    console.log(`  No manifest written for level ${level}.`);
    return { draft: null, unknown, flagged };
  }

  if (write) {
    const out = path.join(root, manifestPath(level));
    fs.mkdirSync(path.dirname(out), { recursive: true });
    fs.writeFileSync(out, JSON.stringify(draft, null, 2) + "\n");
  }

  console.log(
    `${write ? "Drafted" : "Would draft"} ${manifestPath(level)} from ${tracks.length} file(s):\n`
  );
  summarise(tracks);
  if (unknown.length) {
    console.log(`\nNot named like ExamView audio, so left out — add them by hand if they belong:`);
    for (const file of unknown) console.log(`  ${file}`);
  }
  if (duplicates.length) {
    console.log(`\n  Two files claim the same track — the disc appears more than once.`);
    console.log(`  One of each is used; check they are the same recording:`);
    for (const line of duplicates) console.log(`    ${line}`);
  }
  if (flagged.length) {
    console.log(`\n! These are numbered in a way Level 4's rules do not cover, so each`);
    console.log(`  was filed under its own unit as an ordinary test track. Check them`);
    console.log(`  against the disc's track listing: ${flagged.join(", ")}`);
  }
  return { draft, unknown, flagged };
}

// A per-unit summary of a drafted manifest, so it can be checked against the
// disc without reading the JSON.
function summarise(tracks) {
  const byUnit = new Map();
  for (const track of tracks) {
    const key = track.unit ?? 0;
    if (!byUnit.has(key)) byUnit.set(key, []);
    byUnit.get(key).push(track);
  }

  for (const unit of [...byUnit.keys()].sort((a, b) => a - b)) {
    const rows = byUnit.get(unit);
    if (unit === 0) {
      console.log(`  level-wide  ${rows.map((t) => t.track).join(", ")}  (copyright)`);
      continue;
    }

    const own = rows.filter((t) => t.kind === "unit").map((t) => t.track);
    const bands = new Map();
    for (const review of rows.filter((t) => t.kind === "checkpoint")) {
      const band = `${review.checkpoint[0]}-${review.checkpoint[1]}`;
      if (!bands.has(band)) bands.set(band, []);
      bands.get(band).push(review.track);
    }

    const parts = [`test ${own.join(", ") || "(none)"}`];
    for (const [band, list] of bands) parts.push(`review of units ${band}: ${list.join(", ")}`);
    console.log(`  unit ${String(unit).padEnd(2)}     ${parts.join("   +   ")}`);
  }
}

function publicPathFor(entry) {
  return path.join(root, "public", entry.path.replace(/^\//, ""));
}

function check(manifest) {
  const missing = manifest.tracks.filter((entry) => !fs.existsSync(publicPathFor(entry)));
  const present = manifest.tracks.length - missing.length;
  console.log(`Level ${manifest.level}: ${present} of ${manifest.tracks.length} track(s) in public/audio/.`);
  if (missing.length) {
    // A whole level missing is the ordinary state before its disc is filed, so
    // list a few and count the rest rather than printing 27 identical lines.
    const shown = missing.slice(0, 6);
    console.log(`  missing: ${shown.map((entry) => entry.track).join(", ")}${missing.length > shown.length ? `, and ${missing.length - shown.length} more` : ""}`);
    if (missing.length <= shown.length) {
      for (const entry of missing) console.log(`    → public${entry.path}`);
    }
  }
  return missing;
}

function file(manifest, sources, dryRun) {
  const byFile = new Map(manifest.tracks.map((entry) => [entry.file, entry]));

  let copied = 0;
  let already = 0;
  const missing = [];

  for (const entry of manifest.tracks) {
    const target = publicPathFor(entry);
    if (!sources.has(entry.file)) {
      if (!fs.existsSync(target)) missing.push(entry);
      continue;
    }
    if (fs.existsSync(target)) {
      already += 1;
      continue;
    }
    if (dryRun) {
      console.log(`would copy  ${entry.file}  →  public${entry.path}`);
    } else {
      fs.mkdirSync(path.dirname(target), { recursive: true });
      fs.copyFileSync(sources.get(entry.file), target);
    }
    copied += 1;
  }

  const unexpected = [...sources.keys()].filter((f) => !byFile.has(f)).sort();

  console.log(
    dryRun
      ? `\nDry run: ${copied} to copy, ${already} already in place.`
      : `\nFiled ${copied} track(s); ${already} were already in place.`
  );
  if (missing.length) {
    console.log(`\nStill missing from the disc — the manifest expects these:`);
    for (const entry of missing) console.log(`  ${entry.file}  (track ${entry.track})`);
  }
  if (unexpected.length) {
    console.log(`\nFound but not in the manifest — left alone:`);
    for (const f of unexpected) console.log(`  ${f}`);
  }
  return missing.length + unexpected.length;
}

function levelsFrom(from, forcedLevel) {
  if (!fs.existsSync(from)) {
    console.error(`Source folder not found: ${from}`);
    console.error(`Check the spelling — or point --from at the folder that holds the level folders.`);
    process.exit(1);
  }
  const { found, repeats } = collectMp3s(from);
  const { byLevel, unknown } = groupByLevel(found, forcedLevel);
  if (!byLevel.size) {
    console.error(`No ExamView audio found in ${from} or its subfolders.`);
    console.error(`Files should be named like ow2e_ev4_ame_1.1_0.mp3; pass --level <n> if yours are not.`);
    if (unknown.length) console.error(`${unknown.length} .mp3 file(s) there did not match that pattern.`);
    process.exit(1);
  }
  const levels = [...byLevel.keys()].sort((a, b) => a - b);
  console.log(
    `Found level ${levels.join(", ")}${forcedLevel ? "" : " (from the filenames)"} — ` +
      levels.map((level) => `${byLevel.get(level).size} file(s) for level ${level}`).join(", ") +
      "."
  );
  if (unknown.length) {
    console.log(`Ignoring ${unknown.length} .mp3 file(s) not named like ExamView audio.`);
  }
  if (repeats.length) {
    console.log(`Ignoring ${repeats.length} repeat(s) of a file already found in another folder.`);
  }
  return { byLevel, levels };
}

if (args.scaffold) {
  if (!args.from) {
    console.error("--scaffold needs --from <dir>.");
    process.exit(1);
  }
  const { byLevel, levels } = levelsFrom(args.from, args.level);
  for (const level of levels) {
    console.log("");
    scaffold(level, byLevel.get(level));
  }
} else if (!args.from) {
  // Nothing to file: report every level there is a manifest for, so one
  // command answers "what is actually in place?" across the whole library.
  const manifests = findManifests();
  if (!manifests.length) {
    console.log("No assessment audio manifests yet.");
    process.exit(0);
  }
  let missing = 0;
  for (const relativePath of manifests) {
    missing += check(JSON.parse(fs.readFileSync(path.join(root, relativePath), "utf8"))).length;
  }
  if (!args.check) console.log(`\nTo file a disc into place: --from <folder holding the .mp3 files>`);
  process.exit(missing ? 1 : 0);
} else {
  const { byLevel, levels } = levelsFrom(args.from, args.level);
  let problems = 0;
  const skipped = [];
  const shortfalls = [];

  for (const level of levels) {
    console.log(`\n── Level ${level} ──`);
    const sources = byLevel.get(level);
    const manifest = readManifest(level, sources, args.dryRun);
    if (!manifest) {
      skipped.push({ level, names: [...sources.keys()] });
      problems += 1;
      continue;
    }
    problems += args.check ? check(manifest).length : file(manifest, sources, args.dryRun);

    // Files present for this level that the manifest has no entry for. On a
    // freshly drafted manifest this means the naming pattern did not match
    // them, which is the difference between a complete level and a partial one.
    const known = new Set(manifest.tracks.map((entry) => entry.file));
    const unmatched = [...sources.keys()].filter((name) => !known.has(name));
    if (unmatched.length) shortfalls.push({ level, unmatched });
  }

  if (skipped.length || shortfalls.length) {
    console.log(`\n${"=".repeat(60)}`);
    console.log(`Not everything was filed.\n`);
    for (const { level, names } of skipped) {
      console.log(`  Level ${level}: none of its ${names.length} file(s) matched the expected naming,`);
      console.log(`    so no manifest was written. For example:`);
      for (const name of names.slice(0, 5)) console.log(`      ${name}`);
      if (names.length > 5) console.log(`      ... and ${names.length - 5} more`);
    }
    for (const { level, unmatched } of shortfalls) {
      console.log(`  Level ${level}: ${unmatched.length} file(s) not in the manifest, so not filed:`);
      for (const name of unmatched.slice(0, 8)) console.log(`      ${name}`);
      if (unmatched.length > 8) console.log(`      ... and ${unmatched.length - 8} more`);
    }
    console.log(`\nSend these file names on — the naming pattern needs widening to cover them.`);
  }

  process.exit(problems ? 1 : 0);
}
