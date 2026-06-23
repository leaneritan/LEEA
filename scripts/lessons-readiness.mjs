#!/usr/bin/env node
/**
 * scripts/lessons-readiness.mjs
 *
 * Cross-level / cross-unit readiness audit for the /vocab-app,
 * /grammar-app, /reading-app, /writing-app skills.
 *
 * Walks every Our World level + every unit in each level's
 * index.json + each unit's vocabulary.json and prints a matrix
 * showing which (level, unit, component) tuples are ready for
 * a skill invocation — and what's missing for the ones that aren't.
 *
 * Designed for the case Leaneritan flagged: levels get added in any
 * order, including backwards (e.g. Level 3 after Level 4 is already
 * shipped). The audit is repeatable — every time content is added,
 * re-run `npm run readiness` to see what just unlocked.
 *
 * Usage:
 *   node scripts/lessons-readiness.mjs
 *   node scripts/lessons-readiness.mjs --level 3
 *   node scripts/lessons-readiness.mjs --json
 *
 * Exit code 0 if at least one tuple is ready; 1 if nothing is ready
 * (useful in CI to catch a totally broken content tree).
 */

import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, '..');
const COURSES_DIR = resolve(REPO_ROOT, 'content/subjects/english/courses/our-world');
const PLANS_DIR   = resolve(REPO_ROOT, 'docs/lesson-plans/english/our-world');

/* Components the skills cover. Each one declares:
 *   - section: the key under index.json units[N].sections that must exist
 *   - needsWords: which wordId arrays in vocabulary.json must be non-empty
 *   - skill: which skill is responsible
 */
const COMPONENTS = [
  { id: 'opener',    section: 'opener',    needsWords: null,                              skill: 'generate-lesson' },
  { id: 'vocab-1',   section: 'vocab-1',   needsWords: ['vocab1WordIds'],                 skill: 'vocab-app' },
  { id: 'song',      section: 'song',      needsWords: null,                              skill: 'generate-lesson' },
  { id: 'grammar-1', section: 'grammar-1', needsWords: null,                              skill: 'grammar-app' },
  { id: 'vocab-2',   section: 'vocab-2',   needsWords: ['vocab2WordIds'],                 skill: 'vocab-app' },
  { id: 'grammar-2', section: 'grammar-2', needsWords: null,                              skill: 'grammar-app' },
  { id: 'reading',   section: 'reading',   needsWords: ['wordIds'],                       skill: 'reading-app' },
  { id: 'writing',   section: 'writing',   needsWords: ['academicWordIds', 'wordIds'],    skill: 'writing-app' }
];

const argv = process.argv.slice(2);
const ONLY_LEVEL = argv.indexOf('--level') !== -1 ? Number(argv[argv.indexOf('--level') + 1]) : null;
const JSON_OUT   = argv.includes('--json');

/* ── Walk levels ──────────────────────────────────────────────── */
function listLevels() {
  return readdirSync(PLANS_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory() && /^level-\d+$/.test(d.name))
    .map((d) => Number(d.name.slice(6)))
    .sort((a, b) => a - b);
}

function readJSON(path) {
  try { return JSON.parse(readFileSync(path, 'utf8')); }
  catch (e) { return null; }
}

function auditLevel(level) {
  const planDir = resolve(PLANS_DIR, `level-${level}`);
  const indexPath = resolve(planDir, 'index.json');
  const idx = readJSON(indexPath);
  if (!idx) return { level, error: 'index.json missing or invalid', units: [] };

  const units = [];
  const sourceUnits = idx.units || {};
  const unitKeys = Object.keys(sourceUnits).sort((a, b) => parseUnitNum(a) - parseUnitNum(b));
  for (const key of unitKeys) {
    const unitData = sourceUnits[key];
    const unitNum = parseUnitNum(key);
    units.push(auditUnit(level, unitNum, unitData, idx));
  }
  return { level, theme: idx.theme || idx.title || null, units };
}

/* Unit keys come in two flavors: "8" or "u8". Normalize. */
function parseUnitNum(key) {
  const m = String(key).match(/(\d+)/);
  return m ? Number(m[1]) : 0;
}

function auditUnit(level, unit, unitData, levelIdx) {
  const unitDir = resolve(COURSES_DIR, `level-${level}`, `unit-${unit}`);
  const vocabPath = resolve(unitDir, 'vocabulary.json');
  const vocab = existsSync(vocabPath) ? readJSON(vocabPath) : null;

  const pdfOffset = unitData?.pdf_offset ?? levelIdx?.pdf_offset ?? null;
  const rawSections = unitData?.sections || {};
  /* A section is "set" only when its value is a non-empty string. The L1-L6
     scaffold has every key with "" — that's NOT ready. */
  const sections = {};
  for (const [k, v] of Object.entries(rawSections)) {
    if (typeof v === 'string' && v.trim().length > 0) sections[k] = v;
  }
  const supporting = resolve(PLANS_DIR, `level-${level}`, 'supporting');
  const hasSb = existsSync(supporting) && readdirSync(supporting).some((f) => /student.book/i.test(f));
  const hasWb = existsSync(supporting) && readdirSync(supporting).some((f) => /ak.wb/i.test(f));
  const hasAudio = existsSync(supporting) && readdirSync(supporting).some((f) => /audioscript/i.test(f));

  const components = COMPONENTS.map((comp) => {
    const blockers = [];
    if (pdfOffset == null) blockers.push('no pdf_offset on unit OR level');
    if (!sections[comp.section]) blockers.push(`index.json sections.${comp.section} missing`);
    if (!vocab && comp.needsWords) blockers.push('vocabulary.json missing');
    else if (vocab && comp.needsWords) {
      for (const key of comp.needsWords) {
        const arr = vocab[key];
        if (!Array.isArray(arr) || arr.length === 0) blockers.push(`vocabulary.json ${key}[] empty`);
      }
    }
    if (comp.id === 'reading' && !hasSb) blockers.push('Student Book PDF missing in supporting/');
    if (comp.id === 'reading' && !hasWb) blockers.push('Workbook AK PDF missing in supporting/');
    if (comp.id === 'writing' && !hasSb) blockers.push('Student Book PDF missing in supporting/');
    return {
      id: comp.id,
      skill: '/' + comp.skill,
      ready: blockers.length === 0,
      blockers
    };
  });

  return {
    unit,
    theme: unitData?.theme || null,
    pdfOffset,
    hasVocab: !!vocab,
    components
  };
}

/* ── Print ────────────────────────────────────────────────────── */
const C = {
  reset: '\x1b[0m', bold: '\x1b[1m', dim: '\x1b[2m',
  green: '\x1b[32m', yellow: '\x1b[33m', red: '\x1b[31m', cyan: '\x1b[36m',
  grey: '\x1b[90m'
};
function colorize(s, c) { return process.stdout.isTTY ? `${c}${s}${C.reset}` : s; }

function printReport(report) {
  console.log(colorize('🎯 LEEA LESSON READINESS MATRIX', C.bold + C.cyan));
  console.log(colorize(`Generated: ${new Date().toISOString().slice(0, 10)}`, C.dim));
  console.log();

  let totalReady = 0;
  let totalBlocked = 0;

  for (const lvl of report.levels) {
    const header = `LEVEL ${lvl.level}${lvl.theme ? ' — ' + lvl.theme : ''}`;
    console.log(colorize(header, C.bold));
    if (lvl.error) {
      console.log('  ' + colorize('⚠ ' + lvl.error, C.red));
      console.log();
      continue;
    }
    for (const u of lvl.units) {
      const unitLabel = `  Unit ${u.unit}${u.theme ? ' (' + u.theme + ')' : ''}`;
      const noOffset = u.pdfOffset == null;
      console.log(colorize(unitLabel, noOffset ? C.dim : C.reset));
      if (noOffset) {
        console.log(colorize('    · index.json has no pdf_offset for this unit — every component blocks here', C.dim));
        continue;
      }
      for (const c of u.components) {
        const icon = c.ready ? colorize('✅', C.green) : colorize('❌', C.red);
        const label = c.id.padEnd(11);
        const skill = colorize(c.skill, c.ready ? C.green : C.dim);
        const status = c.ready ? colorize('ready', C.green) : colorize(c.blockers[0], C.yellow);
        const more = c.blockers.length > 1 ? colorize(`  +${c.blockers.length - 1} more`, C.dim) : '';
        console.log(`    ${icon} ${label} ${skill}  ${status}${more}`);
        if (c.ready) totalReady++; else totalBlocked++;
      }
    }
    console.log();
  }

  console.log(colorize('SUMMARY', C.bold));
  console.log(`  Ready:   ${colorize(totalReady, C.green)} component tuples`);
  console.log(`  Blocked: ${colorize(totalBlocked, C.yellow)} component tuples`);
  console.log();
  if (totalReady === 0) {
    console.log(colorize('⚠ Nothing is ready — content tree may be broken.', C.red));
  } else {
    console.log(colorize('Run with --json to get machine-readable output, or --level <N> to focus on one level.', C.dim));
  }
}

/* ── Main ─────────────────────────────────────────────────────── */
const targetLevels = listLevels().filter((l) => ONLY_LEVEL == null || l === ONLY_LEVEL);
const report = { generatedAt: new Date().toISOString(), levels: targetLevels.map(auditLevel) };

if (JSON_OUT) {
  console.log(JSON.stringify(report, null, 2));
} else {
  printReport(report);
}

const anyReady = report.levels.some((l) => l.units && l.units.some((u) => u.components && u.components.some((c) => c.ready)));
process.exit(anyReady ? 0 : 1);
