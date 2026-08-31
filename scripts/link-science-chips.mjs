#!/usr/bin/env node
/**
 * Fills in `url` on the chips of authored 理科 section JSON, from the links
 * recorded in qr-index.json.
 *
 * A chip carries a kind and sits on a block with a textbook page, which is
 * enough to find its QR item — but only when that page has exactly one item of
 * that kind. Where a page has two (p.17 has both 身近な生物の観察 and
 * ルーペの使い方 as 動画), the chip is left alone and reported: a chip that
 * opens the wrong video is worse than a chip that opens nothing.
 *
 *   node scripts/link-science-chips.mjs [--dry-run]
 */

import fs from "node:fs";
import path from "node:path";

const INDEX_PATH = "docs/lesson-plans/science/new-science-1/qr-index.json";
const SECTIONS_DIR = "content/subjects/science/sections";

/** Chip kinds as the app names them → kinds as the publisher's index names them. */
const KIND_TO_INDEX = {
  simulation: "シミュレーション",
  "thinking-tool": "思考ツール",
  worksheet: "ワークシート",
  video: "動画",
  reference: "資料",
  practice: "練習"
};

const dryRun = process.argv.includes("--dry-run");
const index = JSON.parse(fs.readFileSync(INDEX_PATH, "utf-8"));

let linked = 0;
let ambiguous = 0;
let unlinked = 0;

for (const file of fs.readdirSync(SECTIONS_DIR).filter((name) => name.endsWith(".json")).sort()) {
  const filePath = path.join(SECTIONS_DIR, file);
  const section = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  let touched = false;

  for (const block of section.blocks) {
    if (!block.chips?.length || !block.page) continue;
    // A block's page can be a range ("19–20"); the chip belongs to its first page.
    const page = Number(String(block.page).match(/\d+/)?.[0]);
    if (!Number.isFinite(page)) continue;

    for (const chip of block.chips) {
      const indexKind = KIND_TO_INDEX[chip.kind];
      if (!indexKind) continue;

      const matches = index.items.filter((item) => item.page === page && item.kind === indexKind);

      if (matches.length !== 1) {
        if (matches.length > 1) {
          ambiguous += 1;
          console.log(
            `  ambiguous  ${section.id} ${block.id} — p.${page} has ${matches.length} ${indexKind} items: ` +
              matches.map((m) => `#${m.no} ${m.title}`).join(" / ")
          );
        } else {
          unlinked += 1;
          console.log(`  no item    ${section.id} ${block.id} — no ${indexKind} on p.${page}`);
        }
        continue;
      }

      const [item] = matches;
      if (!item.url) {
        unlinked += 1;
        console.log(`  no link    ${section.id} ${block.id} — #${item.no} has no captured url`);
        continue;
      }
      if (chip.url === item.url) continue;

      chip.url = item.url;
      touched = true;
      linked += 1;
      console.log(`  linked     ${section.id} ${block.id} — #${item.no} ${item.title}`);
    }
  }

  if (touched && !dryRun) {
    fs.writeFileSync(filePath, `${JSON.stringify(section, null, 2)}\n`, "utf-8");
  }
}

console.log(`\nlinked: ${linked}   ambiguous (left alone): ${ambiguous}   no link: ${unlinked}`);
if (dryRun) console.log("--dry-run: nothing written.");
