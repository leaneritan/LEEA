// Files a folder of ExamView test audio into public/audio/, one folder per
// unit, and checks it against the level's assessment-audio.json manifest.
//
//   node scripts/sort-assessment-audio.mjs --from ~/Downloads/ExamViewAudio
//   node scripts/sort-assessment-audio.mjs --from <dir> --level 4 --dry-run
//   node scripts/sort-assessment-audio.mjs --check
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
  --from <dir>   folder holding the .mp3 files to file (copied, not moved)
  --level <n>    Our World level; inferred from the filenames when omitted
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

function manifestPath(level) {
  return `content/subjects/english/courses/our-world/level-${level}/assessment-audio.json`;
}

function readManifest(level) {
  const rel = manifestPath(level);
  const abs = path.join(root, rel);
  if (!fs.existsSync(abs)) {
    console.error(`No manifest at ${rel}.`);
    console.error(`Run with --scaffold --from <dir> to draft one from the filenames.`);
    process.exit(1);
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
  return { kind: "unit", unit, folder, title: `OW2e EV L${level}U${unit} Track ${track}` };
}

function trackFromFilename(file, level) {
  const match = file.match(new RegExp(`^ow2e_ev${level}_ame_(\\d+\\.\\d+[a-z]?)_0\\.mp3$`, "i"));
  return match ? match[1] : null;
}

function listMp3s(dir) {
  return fs
    .readdirSync(dir)
    .filter((file) => file.toLowerCase().endsWith(".mp3"))
    .sort();
}

function scaffold(level, from) {
  const files = listMp3s(from);
  if (!files.length) {
    console.error(`No .mp3 files in ${from}.`);
    process.exit(1);
  }
  const base = `/audio/our-world/level-${level}`;
  const unknown = [];
  const tracks = [];
  files.forEach((file) => {
    const track = trackFromFilename(file, level);
    if (!track) {
      unknown.push(file);
      return;
    }
    const placement = classify(track, level);
    const dir = placement.folder ? `${base}/${placement.folder}` : base;
    const entry = { n: tracks.length, track, title: placement.title, file, path: `${dir}/${file}` };
    if (placement.unit) entry.unit = placement.unit;
    if (placement.checkpoint) entry.checkpoint = placement.checkpoint;
    entry.kind = placement.kind;
    tracks.push(entry);
  });

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
      "DRAFT — scaffolded from filenames by scripts/sort-assessment-audio.mjs. Check every title and placement against the disc's own track listing before trusting this file; the numbering rules were read off Level 4 and may not hold here.",
    tracks
  };

  const out = path.join(root, manifestPath(level));
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, JSON.stringify(draft, null, 2) + "\n");
  console.log(`Drafted ${manifestPath(level)} with ${tracks.length} track(s).`);
  if (unknown.length) {
    console.log(`\nNot recognised, left out of the draft — add them by hand:`);
    for (const file of unknown) console.log(`  ${file}`);
  }
  console.log(`\nRead the draft before committing it. Then run --from ${from} to file the audio.`);
}

function publicPathFor(entry) {
  return path.join(root, "public", entry.path.replace(/^\//, ""));
}

function check(manifest) {
  const missing = manifest.tracks.filter((entry) => !fs.existsSync(publicPathFor(entry)));
  const present = manifest.tracks.length - missing.length;
  console.log(`Level ${manifest.level}: ${present} of ${manifest.tracks.length} track(s) in public/audio/.`);
  if (missing.length) {
    console.log(`\nMissing:`);
    for (const entry of missing) console.log(`  ${entry.track}  →  public${entry.path}`);
  }
  return missing;
}

function file(manifest, from, dryRun) {
  if (!fs.existsSync(from)) {
    console.error(`Source folder not found: ${from}`);
    process.exit(1);
  }
  const available = new Set(listMp3s(from));
  const byFile = new Map(manifest.tracks.map((entry) => [entry.file, entry]));

  let copied = 0;
  let already = 0;
  const missing = [];

  for (const entry of manifest.tracks) {
    const target = publicPathFor(entry);
    if (!available.has(entry.file)) {
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
      fs.copyFileSync(path.join(from, entry.file), target);
    }
    copied += 1;
  }

  const unexpected = [...available].filter((f) => !byFile.has(f));

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
    console.log(`\nIn ${from} but not in the manifest — left alone:`);
    for (const f of unexpected) console.log(`  ${f}`);
  }
  return missing.length + unexpected.length;
}

if (args.scaffold) {
  if (!args.from) {
    console.error("--scaffold needs --from <dir>.");
    process.exit(1);
  }
  const level = args.level ?? inferLevel(args.from);
  console.log(`Level ${level}${args.level ? "" : " (from the filenames)"}.`);
  scaffold(level, args.from);
} else {
  const level = args.level ?? (args.from ? inferLevel(args.from) : 4);
  if (args.from && !args.level) console.log(`Level ${level} (from the filenames).`);
  const manifest = readManifest(level);
  if (args.check || !args.from) {
    const missing = check(manifest);
    if (!args.from && !args.check) {
      console.log(`\nTo file a disc into place: --from <folder holding the .mp3 files>`);
    }
    process.exit(missing.length ? 1 : 0);
  }
  const problems = file(manifest, args.from, args.dryRun);
  process.exit(problems ? 1 : 0);
}
