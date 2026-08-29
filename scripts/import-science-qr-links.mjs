#!/usr/bin/env node
/**
 * Imports captured 理科 QR links into
 * docs/lesson-plans/science/new-science-1/qr-index.json.
 *
 * The publisher's portal (sw121.tsho.jp) is blocked by the cloud session's
 * egress proxy, so the links have to be captured in a real browser — Claude in
 * Chrome, or by hand — and brought back here. See the README next to the index
 * for the capture prompt.
 *
 * This script exists so that capture is *checked* rather than trusted. The
 * index PDF is the authority on what each item is; the capture is only allowed
 * to supply a `url`. Anything the capture disagrees with is reported and
 * skipped, never silently written over.
 *
 *   node scripts/import-science-qr-links.mjs <capture-file> [--dry-run]
 *
 * The capture file is either JSON (an array of objects) or TSV with a header
 * row. Recognised fields: no, unit, chapter, page, title, kind, url, chapter_url.
 * Only `url` plus enough to identify the row (`no`, or `page` + `title`) is
 * required.
 *
 * `chapter_url` is collected separately, into the index's `chapters` map. The
 * portal navigates by 単元 → 章 in a sidebar, so a 章 may have its own address
 * while individual rows open a viewer with no distinct URL of their own — which
 * is also all math's `digitalCompanion.ts` has. Capturing both means whichever
 * granularity actually exists is recorded, and neither is invented.
 */

import fs from "node:fs";
import path from "node:path";

const INDEX_PATH = "docs/lesson-plans/science/new-science-1/qr-index.json";
/** A captured link must live on the publisher's own domain. */
const ALLOWED_HOST_SUFFIX = ".tsho.jp";

const [, , capturePath, ...flags] = process.argv;
const dryRun = flags.includes("--dry-run");

if (!capturePath) {
  console.error("usage: node scripts/import-science-qr-links.mjs <capture-file> [--dry-run]");
  process.exit(2);
}

/** Full-width/half-width, spaces and punctuation folded, so titles compare fairly. */
function normalise(value) {
  return String(value ?? "")
    .normalize("NFKC")
    .replace(/[\s　]+/g, "")
    .replace(/[（）()【】\[\]「」『』・,、.。/／~〜\-–—]/g, "")
    .toLowerCase();
}

function toPage(value) {
  if (value === null || value === undefined || value === "") return null;
  const digits = String(value).normalize("NFKC").match(/\d+/);
  return digits ? Number(digits[0]) : null;
}

function parseCapture(file) {
  const raw = fs.readFileSync(file, "utf-8");
  const trimmed = raw.trim();

  if (trimmed.startsWith("[") || trimmed.startsWith("{")) {
    const parsed = JSON.parse(trimmed);
    return Array.isArray(parsed) ? parsed : (parsed.items ?? []);
  }

  const lines = trimmed.split(/\r?\n/).filter((line) => line.trim() !== "");
  if (lines.length < 2) return [];
  const header = lines[0].split("\t").map((cell) => cell.trim().toLowerCase());
  return lines.slice(1).map((line) => {
    const cells = line.split("\t");
    return Object.fromEntries(header.map((key, index) => [key, (cells[index] ?? "").trim()]));
  });
}

function validateUrl(value) {
  let url;
  try {
    url = new URL(String(value).trim());
  } catch {
    return { ok: false, reason: "not a URL" };
  }
  if (url.protocol !== "https:" && url.protocol !== "http:") {
    return { ok: false, reason: `unsupported protocol ${url.protocol}` };
  }
  if (url.hostname !== "tsho.jp" && !url.hostname.endsWith(ALLOWED_HOST_SUFFIX)) {
    return { ok: false, reason: `host ${url.hostname} is not the publisher's` };
  }
  return { ok: true, url: url.toString() };
}

const index = JSON.parse(fs.readFileSync(INDEX_PATH, "utf-8"));
const byNo = new Map(index.items.map((item) => [item.no, item]));

const byPageTitle = new Map();
const byTitle = new Map();
for (const item of index.items) {
  const title = normalise(item.title);
  byPageTitle.set(`${item.page}::${title}`, item);
  // Titles repeat across chapters (every 章 has a Before & After シート), so a
  // title-only match is only usable when it is unique in the whole book.
  byTitle.set(title, byTitle.has(title) ? null : item);
}

const captured = parseCapture(capturePath);
const report = { applied: [], unchanged: [], skipped: [], mismatched: [], chapters: 0 };

index.chapters ??= {};

/** 単元 + 章 as the portal names them, e.g. "1/第1章" or "1/学習前". */
function chapterKey(row) {
  const unit = String(row.unit ?? "").replace(/\D/g, "");
  const chapter = String(row.chapter ?? "").trim();
  return unit && chapter ? `${unit}/${chapter}` : null;
}

for (const row of captured) {
  const raw = row.chapter_url ?? row.chapterurl ?? row.chapterUrl ?? "";
  if (!String(raw).trim()) continue;
  const key = chapterKey(row);
  if (!key) continue;
  const check = validateUrl(raw);
  if (!check.ok) {
    report.skipped.push({ label: `chapter ${key}`, reason: check.reason });
    continue;
  }
  if (index.chapters[key] && index.chapters[key] !== check.url) {
    report.mismatched.push({
      label: `chapter ${key}`,
      no: "-",
      problems: [`chapter url already set to ${index.chapters[key]}, capture says ${check.url}`]
    });
    continue;
  }
  if (index.chapters[key] !== check.url) {
    index.chapters[key] = check.url;
    report.chapters += 1;
  }
}

for (const row of captured) {
  const rawUrl = row.url ?? row.link ?? row.href ?? "";
  // A row that only carried a chapter url is not a per-item failure.
  if (!String(rawUrl).trim() && String(row.chapter_url ?? row.chapterurl ?? "").trim()) continue;
  const label = `${row.no ? `#${row.no} ` : ""}${row.title ?? "(no title)"}`;

  if (!String(rawUrl).trim()) {
    report.skipped.push({ label, reason: "no url captured" });
    continue;
  }

  const check = validateUrl(rawUrl);
  if (!check.ok) {
    report.skipped.push({ label, reason: check.reason, value: String(rawUrl).slice(0, 80) });
    continue;
  }

  const page = toPage(row.page);
  const title = normalise(row.title);
  const no = Number(String(row.no ?? "").replace(/\D/g, ""));

  const item =
    (Number.isInteger(no) && no > 0 ? byNo.get(no) : undefined) ??
    (page !== null && title ? byPageTitle.get(`${page}::${title}`) : undefined) ??
    (title ? byTitle.get(title) ?? undefined : undefined);

  if (!item) {
    report.skipped.push({ label, reason: "no matching item in the QR index" });
    continue;
  }

  // The index PDF is the authority. Disagreement means the capture landed on a
  // different row than it claims, so record it and change nothing.
  const problems = [];
  if (page !== null && item.page !== null && page !== item.page) {
    problems.push(`page: index says ${item.page}, capture says ${page}`);
  }
  if (title && normalise(item.title) !== title) {
    problems.push(`title: index says "${item.title}", capture says "${row.title}"`);
  }
  const unit = String(row.unit ?? "").replace(/\D/g, "");
  if (unit && String(item.unit) !== unit) {
    problems.push(`unit: index says ${item.unit}, capture says ${unit}`);
  }
  if (problems.length) {
    report.mismatched.push({ label, no: item.no, problems });
    continue;
  }

  if (item.url === check.url) {
    report.unchanged.push({ no: item.no });
    continue;
  }
  if (item.url && item.url !== check.url) {
    report.mismatched.push({
      label,
      no: item.no,
      problems: [`url already set to ${item.url}, capture says ${check.url}`]
    });
    continue;
  }

  item.url = check.url;
  report.applied.push({ no: item.no, title: item.title, url: check.url });
}

const resolved = index.items.filter((item) => item.url).length;
index.urlsResolved = resolved === index.items.length;

console.log(`capture rows read : ${captured.length}`);
console.log(`urls applied      : ${report.applied.length}`);
console.log(`already correct   : ${report.unchanged.length}`);
console.log(`skipped           : ${report.skipped.length}`);
console.log(`mismatched        : ${report.mismatched.length}`);
console.log(`chapter urls added: ${report.chapters}`);
console.log(`resolved overall  : ${resolved} / ${index.items.length}`);

for (const entry of report.skipped) {
  console.log(`  skip  ${entry.label} — ${entry.reason}${entry.value ? ` (${entry.value})` : ""}`);
}
for (const entry of report.mismatched) {
  console.log(`  MISMATCH #${entry.no} ${entry.label.replace(/^#\d+\s*/, "")}`);
  for (const problem of entry.problems) console.log(`          ${problem}`);
}

if (dryRun) {
  console.log("\n--dry-run: nothing written.");
} else if (report.applied.length || report.chapters) {
  fs.writeFileSync(INDEX_PATH, `${JSON.stringify(index, null, 2)}\n`, "utf-8");
  console.log(`\nWrote ${path.basename(INDEX_PATH)}.`);
} else {
  console.log("\nNothing to write.");
}

// Mismatches mean the capture and the book disagree — a person has to look.
process.exit(report.mismatched.length ? 1 : 0);
