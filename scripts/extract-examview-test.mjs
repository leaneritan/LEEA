#!/usr/bin/env node
/**
 * extract-examview-test.mjs — turn one ExamView test export (.rtf) into the two
 * things a digital test is built from: the text (questions + answer key) and the
 * pictures.
 *
 * ExamView exports the test as RTF. The pictures are not files inside it — each
 * one is a Windows Metafile wrapping a single 8-bit DIB, stored as hex in a
 * `\pict` group. LibreOffice refuses the export outright, so nothing here shells
 * out to a converter: the DIB is lifted straight out of the metafile and written
 * as an indexed PNG (zlib is in Node, and an 8-bit DIB is already a PLTE palette
 * plus rows of indices). That is lossless and needs no dependency, which matters
 * because this has to keep working for every test that follows.
 *
 * Usage:
 *   node scripts/extract-examview-test.mjs <file.rtf> --out <dir> [--slug <slug>]
 *
 * Writes <dir>/<slug>.txt and <dir>/<slug>-pN.png (N in source order).
 * See docs/tests.md for what to do with them.
 */

import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";

// ---------------------------------------------------------------- RTF parsing

/** Find the `{`…`}` group containing index `at`, balanced and escape-aware. */
function groupBounds(rtf, at) {
  const start = rtf.lastIndexOf("{", at);
  if (start < 0) return null;
  let depth = 0;
  for (let i = start; i < rtf.length; i++) {
    const c = rtf[i];
    if (i > 0 && rtf[i - 1] === "\\") continue;
    if (c === "{") depth++;
    else if (c === "}" && --depth === 0) return { start, end: i + 1 };
  }
  return null;
}

/** Pull every `\pict` group out, returning the stripped RTF and the raw images. */
function splitPictures(rtf) {
  const pictures = [];
  let out = rtf;
  for (;;) {
    const at = out.indexOf("\\pict");
    if (at < 0) break;
    const bounds = groupBounds(out, at);
    if (!bounds) break;
    const group = out.slice(bounds.start, bounds.end);
    // Strip the control words (\pict, \picw…, \picbpp8) with their numeric
    // arguments before keeping hex characters — `picbpp8` ends in a digit that
    // would otherwise be read as the first nibble and shift the whole image.
    const hex = group.replace(/\\[a-zA-Z]+-?\d*\s?/g, "").replace(/[^0-9a-fA-F]/g, "");
    pictures.push(Buffer.from(hex.slice(0, hex.length - (hex.length % 2)), "hex"));
    out = `${out.slice(0, bounds.start)}\n[[IMAGE ${pictures.length}]]\n${out.slice(bounds.end)}`;
  }
  return { rtf: out, pictures };
}

/** Drop a control destination we never want in the text (font tables and such). */
function dropDestination(rtf, marker) {
  let out = rtf;
  for (;;) {
    const at = out.indexOf(marker);
    if (at < 0) return out;
    const bounds = groupBounds(out, at);
    if (!bounds) return out;
    out = out.slice(0, bounds.start) + out.slice(bounds.end);
  }
}

const CONTROL_TEXT = {
  par: "\n", line: "\n", row: "\n", pard: "\n", sect: "\n",
  tab: "\t", cell: "\t",
  emdash: "—", endash: "–", bullet: "•",
  lquote: "‘", rquote: "’", ldblquote: "“", rdblquote: "”",
};

/** Flatten RTF to plain text. Handles \uN unicode, \'hh cp1252, and escapes. */
function rtfToText(rtf) {
  const out = [];
  for (let i = 0; i < rtf.length; ) {
    const c = rtf[i];
    if (c === "{" || c === "}" || c === "\r" || c === "\n") { i++; continue; }
    if (c !== "\\") { out.push(c); i++; continue; }

    const escaped = /^\\([\\{}])/.exec(rtf.slice(i, i + 2));
    if (escaped) { out.push(escaped[1]); i += 2; continue; }

    const byte = /^\\'([0-9a-fA-F]{2})/.exec(rtf.slice(i, i + 4));
    if (byte) {
      out.push(Buffer.from([parseInt(byte[1], 16)]).toString("latin1"));
      i += 4;
      continue;
    }

    const word = /^\\([a-zA-Z]+)(-?\d+)? ?/.exec(rtf.slice(i, i + 40));
    if (!word) { i++; continue; }
    i += word[0].length;
    if (word[1] === "u") {
      out.push(String.fromCharCode(((Number(word[2]) % 65536) + 65536) % 65536));
      if (rtf[i] === "?") i++; // the ASCII fallback char that follows \uN
      continue;
    }
    if (CONTROL_TEXT[word[1]]) out.push(CONTROL_TEXT[word[1]]);
  }
  return out.join("").replace(/[ \t]+\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim();
}

// ------------------------------------------------------------- WMF → PNG

/** Locate the BITMAPINFOHEADER of the single DIB a picture metafile wraps. */
function findDib(buf) {
  for (let i = 0; i + 40 <= buf.length; i++) {
    if (buf.readUInt32LE(i) !== 40) continue;
    const width = buf.readInt32LE(i + 4);
    const height = buf.readInt32LE(i + 8);
    const planes = buf.readUInt16LE(i + 12);
    const bpp = buf.readUInt16LE(i + 14);
    const compression = buf.readUInt32LE(i + 16);
    if (planes !== 1 || compression !== 0) continue;
    if (![1, 4, 8, 24, 32].includes(bpp)) continue;
    if (width <= 0 || width > 20000 || height === 0 || Math.abs(height) > 20000) continue;
    const used = buf.readUInt32LE(i + 32);
    return { at: i, width, height, bpp, colors: used || (bpp <= 8 ? 1 << bpp : 0) };
  }
  return null;
}

/**
 * Undo a centre-stretch.
 *
 * Word (and so ExamView's export) sometimes fits a picture to its frame by
 * duplicating one band of pixels at the exact middle of the image rather than
 * resampling it — the photo comes out with a visible seam, a strip of repeated
 * scanlines across the centre and a matching strip of repeated columns down it.
 * Dropping those duplicates restores the original bitmap exactly, because every
 * removed line is byte-identical to the one before it.
 *
 * The test is deliberately narrow: a run of identical lines, short, centred on
 * both axes at once. A photo can easily have one flat band (a sky, the white
 * gutter between two pictures) — having one on each axis, both straddling the
 * middle, is the stretch and nothing else. Picture 1 of the Level 4 final test
 * has centred duplicate columns from its white gutters and is left alone,
 * because its duplicate rows sit nowhere near the middle.
 */
function centreRun(lineAt, count, limit) {
  let start = 0;
  for (let i = 1; i <= count; i++) {
    if (i < count && lineAt(i).equals(lineAt(i - 1))) continue;
    if (i - start > 1) {
      const run = { from: start, to: i - 1 };
      const middle = (run.from + run.to) / 2;
      if (Math.abs(middle - (count - 1) / 2) <= 1 && run.to - run.from < limit) return run;
    }
    start = i;
  }
  return null;
}

/** Rows as buffers, top-down, one index or RGB triple per pixel. */
function unstretch(rows, width, pixelSize) {
  const height = rows.length;
  const rowRun = centreRun((y) => rows[y], height, height / 8);
  const column = (x) => {
    const out = Buffer.alloc(height * pixelSize);
    for (let y = 0; y < height; y++) rows[y].copy(out, y * pixelSize, x * pixelSize, (x + 1) * pixelSize);
    return out;
  };
  const columns = [];
  for (let x = 0; x < width; x++) columns.push(column(x));
  const colRun = centreRun((x) => columns[x], width, width / 8);
  if (!rowRun || !colRun) return null;

  const keepColumns = [];
  for (let x = 0; x < width; x++) if (x <= colRun.from || x > colRun.to) keepColumns.push(x);
  const kept = [];
  for (let y = 0; y < height; y++) {
    if (y > rowRun.from && y <= rowRun.to) continue;
    const row = Buffer.alloc(keepColumns.length * pixelSize);
    keepColumns.forEach((x, i) => rows[y].copy(row, i * pixelSize, x * pixelSize, (x + 1) * pixelSize));
    kept.push(row);
  }
  return { rows: kept, width: keepColumns.length, dropped: { rows: rowRun.to - rowRun.from, columns: colRun.to - colRun.from } };
}

function pngChunk(type, data) {
  const head = Buffer.alloc(8);
  head.writeUInt32BE(data.length, 0);
  head.write(type, 4, "ascii");
  const crcSource = Buffer.concat([head.subarray(4), data]);
  const tail = Buffer.alloc(4);
  tail.writeInt32BE(crc32(crcSource) | 0, 0);
  return Buffer.concat([head, data, tail]);
}

const CRC_TABLE = (() => {
  const table = new Int32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c;
  }
  return table;
})();

function crc32(buf) {
  let c = -1;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ -1) >>> 0;
}

/**
 * Write the DIB as an indexed (bpp <= 8) or truecolour PNG. DIB rows are
 * bottom-up and padded to 4 bytes; BGR order becomes RGB.
 */
function dibToPng(buf, dib) {
  const { at, bpp, colors } = dib;
  let width = dib.width;
  const bottomUp = dib.height > 0;
  const height = Math.abs(dib.height);
  const paletteAt = at + 40;
  const pixelsAt = paletteAt + colors * 4;
  const srcStride = Math.ceil((width * bpp) / 32) * 4;

  const indexed = bpp <= 8;
  const pixelSize = indexed ? 1 : 3;

  // Top-down rows, one byte per index or three per pixel.
  let rows = [];
  for (let y = 0; y < height; y++) {
    const srcRow = pixelsAt + (bottomUp ? height - 1 - y : y) * srcStride;
    if (bpp < 8) {
      const packed = Math.ceil((width * bpp) / 8);
      rows.push(Buffer.from(buf.subarray(srcRow, srcRow + packed)));
      continue;
    }
    const row = Buffer.alloc(width * pixelSize);
    for (let x = 0; x < width; x++) {
      if (indexed) row[x] = buf[srcRow + x];
      else {
        const step = bpp / 8;
        row[x * 3 + 0] = buf[srcRow + x * step + 2];
        row[x * 3 + 1] = buf[srcRow + x * step + 1];
        row[x * 3 + 2] = buf[srcRow + x * step + 0];
      }
    }
    rows.push(row);
  }

  let note = "";
  if (bpp >= 8) {
    const fixed = unstretch(rows, width, pixelSize);
    if (fixed) {
      rows = fixed.rows;
      width = fixed.width;
      note = `  (un-stretched: dropped ${fixed.dropped.rows} duplicate rows, ${fixed.dropped.columns} columns)`;
    }
  }

  const dstStride = bpp < 8 ? Math.ceil((width * bpp) / 8) : width * pixelSize;
  const raw = Buffer.alloc((dstStride + 1) * rows.length);
  rows.forEach((row, y) => {
    const dstRow = y * (dstStride + 1);
    raw[dstRow] = 0; // filter: none
    row.copy(raw, dstRow + 1);
  });

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(rows.length, 4);
  ihdr[8] = indexed ? bpp : 8;         // bit depth
  ihdr[9] = indexed ? 3 : 2;           // colour type: 3 indexed, 2 truecolour
  const chunks = [pngChunk("IHDR", ihdr)];

  if (indexed) {
    const plte = Buffer.alloc(colors * 3);
    for (let i = 0; i < colors; i++) {
      plte[i * 3 + 0] = buf[paletteAt + i * 4 + 2];
      plte[i * 3 + 1] = buf[paletteAt + i * 4 + 1];
      plte[i * 3 + 2] = buf[paletteAt + i * 4 + 0];
    }
    chunks.push(pngChunk("PLTE", plte));
  }

  chunks.push(pngChunk("IDAT", zlib.deflateSync(raw, { level: 9 })));
  chunks.push(pngChunk("IEND", Buffer.alloc(0)));
  return {
    png: Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), ...chunks]),
    width,
    height: rows.length,
    note
  };
}

// ------------------------------------------------------------------- CLI

const argv = process.argv.slice(2);
const source = argv.find((a) => !a.startsWith("--"));
const readFlag = (name) => {
  const at = argv.indexOf(`--${name}`);
  return at >= 0 ? argv[at + 1] : undefined;
};

if (!source) {
  console.error("usage: node scripts/extract-examview-test.mjs <file.rtf> --out <dir> [--slug <slug>]");
  process.exit(1);
}

const outDir = readFlag("out") ?? path.dirname(source);
const slug = readFlag("slug") ?? path.basename(source, path.extname(source));

const rtf = fs.readFileSync(source, "latin1");
const { rtf: withoutPictures, pictures } = splitPictures(rtf);
let stripped = withoutPictures;
for (const marker of ["\\fonttbl", "\\colortbl", "\\stylesheet", "\\*\\"]) {
  stripped = dropDestination(stripped, marker);
}

fs.mkdirSync(outDir, { recursive: true });

const textPath = path.join(outDir, `${slug}.txt`);
fs.writeFileSync(textPath, `${rtfToText(stripped)}\n`);
console.log(`text   ${textPath}`);

pictures.forEach((picture, i) => {
  const dib = findDib(picture);
  if (!dib) {
    console.warn(`image ${i + 1}: no DIB found in the metafile — skipped`);
    return;
  }
  const pngPath = path.join(outDir, `${slug}-p${i + 1}.png`);
  const out = dibToPng(picture, dib);
  fs.writeFileSync(pngPath, out.png);
  console.log(`image  ${pngPath}  ${out.width}x${out.height}  ${dib.bpp}-bit${out.note}`);
});

if (pictures.length === 0) console.log("image  none found");
