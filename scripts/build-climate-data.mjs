#!/usr/bin/env node
/**
 * scripts/build-climate-data.mjs
 *
 * Regenerates public/components/world-climate.js — the Köppen climate layer
 * used by 気候帯マップ.
 *
 * Source: the `koppen-climate-lookup` package (ISC), which carries the present-day
 * Köppen-Geiger classification published by the Institute for Veterinary Public
 * Health, Universität Wien — https://koeppen-geiger.vu-wien.ac.at/present.htm
 * (Kottek et al. 2006; Rubel & Kottek 2010). A 0.5° land grid, 92,416 cells,
 * all 30 classes.
 *
 * Converted once here and baked into a plain JS file, so the app ships no
 * climate-data dependency and makes no network call at runtime — the same
 * arrangement as world-countries.js. The package is not a package.json
 * dependency; this script fetches it on demand.
 *
 * The grid is run-length encoded along each latitude row, which is what makes
 * it drawable: 92,416 cells collapse to about 9,300 rectangles with no loss of
 * resolution, because climate comes in bands.
 *
 * Usage:
 *   node scripts/build-climate-data.mjs
 */

import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const STEP = 0.5;
const target = path.join(process.cwd(), "public/components/world-climate.js");

/**
 * Köppen letter -> the five 気候帯 as Japanese school geography names them.
 * This is the standard A–E grouping, not a judgement call.
 */
const ZONES = [
  { key: "A", id: "tropical", jp: "熱帯", en: "Tropical", color: "#d9534f", tint: "#fbe6e5" },
  { key: "B", id: "arid", jp: "乾燥帯", en: "Arid", color: "#e0a33e", tint: "#faf0dc" },
  { key: "C", id: "temperate", jp: "温帯", en: "Temperate", color: "#5c9e57", tint: "#e7f1e6" },
  { key: "D", id: "continental", jp: "亜寒帯（冷帯）", en: "Continental", color: "#4d7fc0", tint: "#e5edf8" },
  { key: "E", id: "polar", jp: "寒帯", en: "Polar", color: "#8f8fa8", tint: "#ececf2" }
];

/** Standard Japanese names for each Köppen class. */
const CLASS_JP = {
  Af: "熱帯雨林気候", Am: "熱帯モンスーン気候", Aw: "サバナ気候", As: "サバナ気候",
  BWh: "砂漠気候", BWk: "砂漠気候", BSh: "ステップ気候", BSk: "ステップ気候",
  Cfa: "温暖湿潤気候", Cfb: "西岸海洋性気候", Cfc: "西岸海洋性気候",
  Csa: "地中海性気候", Csb: "地中海性気候", Csc: "地中海性気候",
  Cwa: "温暖冬季少雨気候", Cwb: "温暖冬季少雨気候", Cwc: "温暖冬季少雨気候",
  Dfa: "亜寒帯湿潤気候", Dfb: "亜寒帯湿潤気候", Dfc: "亜寒帯湿潤気候", Dfd: "亜寒帯湿潤気候",
  Dwa: "亜寒帯冬季少雨気候", Dwb: "亜寒帯冬季少雨気候", Dwc: "亜寒帯冬季少雨気候", Dwd: "亜寒帯冬季少雨気候",
  Dsa: "亜寒帯夏季少雨気候", Dsb: "亜寒帯夏季少雨気候", Dsc: "亜寒帯夏季少雨気候",
  ET: "ツンドラ気候", EF: "氷雪気候"
};

const workDir = fs.mkdtempSync(path.join(os.tmpdir(), "leea-climate-"));
try {
  const pkg = fetchPackage("koppen-climate-lookup");
  const bundle = fs.readFileSync(path.join(pkg, "dist/index.mjs"), "utf8");

  const match = bundle.match(/var koppen_default = "([\s\S]*?)";/);
  if (!match) throw new Error("koppen-climate-lookup: could not find the embedded CSV");
  const csv = JSON.parse(`"${match[1]}"`);

  const rows = csv.replace(/\r\n/g, "\n").split("\n").filter((line) => line.trim());
  const header = rows.shift().replace(/^﻿/, "");
  if (header !== "Latitude,Longitude,KoppenClass") throw new Error(`unexpected header: ${header}`);

  const classes = [];
  const classIndex = new Map();
  const byLat = new Map();

  for (const line of rows) {
    const [latText, lonText, code] = line.split(",");
    if (!CLASS_JP[code]) throw new Error(`unknown Köppen class in source data: ${code}`);
    if (!classIndex.has(code)) {
      classIndex.set(code, classes.length);
      classes.push(code);
    }
    const latIdx = Math.round((Number(latText) - STEP / 2 + 90) / STEP);
    const lonIdx = Math.round((Number(lonText) - STEP / 2 + 180) / STEP);
    if (!byLat.has(latIdx)) byLat.set(latIdx, new Map());
    byLat.get(latIdx).set(lonIdx, classIndex.get(code));
  }

  // Run-length encode each row: [latIdx, lonIdx, length, classIdx].
  const runs = [];
  let cellCount = 0;
  for (const latIdx of [...byLat.keys()].sort((a, b) => a - b)) {
    const row = byLat.get(latIdx);
    cellCount += row.size;
    const lons = [...row.keys()].sort((a, b) => a - b);
    let start = null;
    let previous = null;
    let cls = null;
    for (const lonIdx of lons) {
      const value = row.get(lonIdx);
      if (start !== null && value === cls && lonIdx === previous + 1) {
        previous = lonIdx;
        continue;
      }
      if (start !== null) runs.push(latIdx, start, previous - start + 1, cls);
      start = lonIdx;
      previous = lonIdx;
      cls = value;
    }
    if (start !== null) runs.push(latIdx, start, previous - start + 1, cls);
  }

  const runCount = runs.length / 4;
  console.log(`${cellCount} cells at ${STEP}° -> ${runCount} runs (${Math.round((runCount / cellCount) * 100)}%)`);

  fs.writeFileSync(target, render({ runs, classes, cellCount, runCount }));
  console.log(`Wrote ${target} (${Math.round(fs.statSync(target).size / 1024)} KB)`);
} finally {
  fs.rmSync(workDir, { recursive: true, force: true });
}

function fetchPackage(spec) {
  console.log(`Fetching ${spec}…`);
  const dir = fs.mkdtempSync(path.join(workDir, "pkg-"));
  execFileSync("npm", ["pack", spec, "--silent"], { cwd: dir, stdio: "inherit" });
  const tgz = fs.readdirSync(dir).find((name) => name.endsWith(".tgz"));
  if (!tgz) throw new Error(`npm pack produced no tarball for ${spec}`);
  execFileSync("tar", ["xzf", tgz], { cwd: dir });
  return path.join(dir, "package");
}

function render({ runs, classes, cellCount, runCount }) {
  const classLines = classes
    .map((code) => {
      const zone = ZONES.find((z) => z.key === code[0]);
      return `  ${JSON.stringify(code)}: { jp: ${JSON.stringify(CLASS_JP[code])}, zone: ${JSON.stringify(zone.id)} }`;
    })
    .join(",\n");

  const zoneLines = ZONES.map(
    (z) =>
      `  { key: ${JSON.stringify(z.key)}, id: ${JSON.stringify(z.id)}, jp: ${JSON.stringify(z.jp)}, ` +
      `en: ${JSON.stringify(z.en)}, color: ${JSON.stringify(z.color)}, tint: ${JSON.stringify(z.tint)} }`
  ).join(",\n");

  return `/**
 * public/components/world-climate.js — GENERATED, do not edit by hand.
 * Regenerate with: node scripts/build-climate-data.mjs
 *
 * Present-day Köppen-Geiger climate classification, from the Institute for
 * Veterinary Public Health, Universität Wien:
 * https://koeppen-geiger.vu-wien.ac.at/present.htm
 * (Kottek, Grieser, Beck, Rudolf & Rubel 2006; Rubel & Kottek 2010), by way of
 * the koppen-climate-lookup package (ISC). Cite the source if you reuse this.
 *
 * ${cellCount} land cells on a ${STEP}° grid, run-length encoded along each
 * latitude row into ${runCount} rectangles — climate comes in bands, so this
 * loses no resolution at all.
 *
 * CLIMATE_RUNS is flat and read four at a time:
 *   latIdx  row index from the south pole, lat = latIdx * ${STEP} - 90
 *   lonIdx  first column, lon = lonIdx * ${STEP} - 180
 *   length  how many ${STEP}° cells the run covers, eastward
 *   clsIdx  index into CLIMATE_CLASS_CODES
 *
 * Exposes window.buildClimateLayer(base, options), plus CLIMATE_ZONES,
 * CLIMATE_CLASSES, CLIMATE_CLASS_CODES and climateAt(lon, lat).
 */
(function () {
  "use strict";

  var STEP = ${STEP};

  /** The five 気候帯, in the order Japanese school geography lists them. */
  var CLIMATE_ZONES = [
${zoneLines}
  ];

  /** Every Köppen class present in the data, with its Japanese name and 帯. */
  var CLIMATE_CLASSES = {
${classLines}
  };

  var CLIMATE_CLASS_CODES = ${JSON.stringify(classes)};

  var CLIMATE_RUNS = ${JSON.stringify(runs)};

  var ZONE_BY_ID = {};
  CLIMATE_ZONES.forEach(function (zone) { ZONE_BY_ID[zone.id] = zone; });

  /** The Köppen class at a point, or null over sea. */
  function climateAt(lon, lat) {
    var latIdx = Math.floor((lat + 90) / STEP);
    var lonIdx = Math.floor((lon + 180) / STEP);
    for (var i = 0; i < CLIMATE_RUNS.length; i += 4) {
      if (CLIMATE_RUNS[i] !== latIdx) continue;
      if (lonIdx < CLIMATE_RUNS[i + 1]) continue;
      if (lonIdx >= CLIMATE_RUNS[i + 1] + CLIMATE_RUNS[i + 2]) continue;
      var code = CLIMATE_CLASS_CODES[CLIMATE_RUNS[i + 3]];
      return { code: code, jp: CLIMATE_CLASSES[code].jp, zone: ZONE_BY_ID[CLIMATE_CLASSES[code].zone] };
    }
    return null;
  }

  /**
   * Draws the climate grid onto a map built by buildWorldMap.
   *
   *   var climate = buildClimateLayer(base, { onPick: fn });
   *
   * Every rectangle is one run, coloured by its 気候帯 and carrying its exact
   * Köppen class, so the map can shade by the five bands while still naming the
   * sub-type under the pointer. Returns { group, setZoneVisible, highlightZone }.
   */
  function buildClimateLayer(base, options) {
    options = options || {};
    var NS = "http://www.w3.org/2000/svg";
    var group = document.createElementNS(NS, "g");
    group.setAttribute("class", "climate-layer");

    var byZone = {};
    CLIMATE_ZONES.forEach(function (zone) {
      var zoneGroup = document.createElementNS(NS, "g");
      zoneGroup.setAttribute("data-zone", zone.id);
      byZone[zone.id] = zoneGroup;
      group.appendChild(zoneGroup);
    });

    for (var i = 0; i < CLIMATE_RUNS.length; i += 4) {
      var lat = CLIMATE_RUNS[i] * STEP - 90;
      var lon = CLIMATE_RUNS[i + 1] * STEP - 180;
      var span = CLIMATE_RUNS[i + 2] * STEP;
      var code = CLIMATE_CLASS_CODES[CLIMATE_RUNS[i + 3]];
      var zone = ZONE_BY_ID[CLIMATE_CLASSES[code].zone];

      var topLeft = base.px(lon, lat + STEP);
      var bottomRight = base.px(lon + span, lat);

      // The grid covers the whole globe, but a map shows a window onto it, and
      // an svg root does not reliably clip what falls outside its viewBox — the
      // rows below the coastline's southern limit showed as a grey bar under
      // Antarctica. Clamp to the map, and drop anything wholly outside it.
      var x0 = Math.max(0, topLeft[0]);
      var y0 = Math.max(0, topLeft[1]);
      var x1 = Math.min(base.width, bottomRight[0] + 0.35);
      var y1 = Math.min(base.height, bottomRight[1] + 0.35);
      if (x1 <= x0 || y1 <= y0) continue;

      var rect = document.createElementNS(NS, "rect");
      rect.setAttribute("x", x0);
      rect.setAttribute("y", y0);
      // A hair of overlap, or antialiasing draws seams between neighbouring runs.
      rect.setAttribute("width", Math.max(0.6, x1 - x0));
      rect.setAttribute("height", Math.max(0.6, y1 - y0));
      rect.setAttribute("data-code", code);
      rect.setAttribute("data-zone", zone.id);
      rect.style.fill = zone.color;
      byZone[zone.id].appendChild(rect);
    }

    if (options.onPick) {
      group.addEventListener("click", function (event) {
        var code = event.target && event.target.getAttribute && event.target.getAttribute("data-code");
        if (!code) return;
        options.onPick({
          code: code,
          jp: CLIMATE_CLASSES[code].jp,
          zone: ZONE_BY_ID[CLIMATE_CLASSES[code].zone]
        });
      });
    }

    // Straight onto the svg, never inside the base group. That group carries a
    // transform that maps the baked path's own coordinate space onto this
    // window, and these rectangles are already in window coordinates from
    // base.px — nesting them there applies that transform a second time and
    // shrinks the whole world into a corner of itself.
    //
    // Being a later sibling also paints it over the land silhouette, which is
    // what colouring the land means, and under anything the map draws after.
    base.svg.appendChild(group);

    return {
      group: group,
      setZoneVisible: function (zoneId, visible) {
        if (byZone[zoneId]) byZone[zoneId].style.display = visible ? "" : "none";
      },
      highlightZone: function (zoneId) {
        CLIMATE_ZONES.forEach(function (zone) {
          byZone[zone.id].style.opacity = !zoneId || zone.id === zoneId ? "1" : "0.18";
        });
      }
    };
  }

  window.buildClimateLayer = buildClimateLayer;
  window.CLIMATE_ZONES = CLIMATE_ZONES;
  window.CLIMATE_CLASSES = CLIMATE_CLASSES;
  window.CLIMATE_CLASS_CODES = CLIMATE_CLASS_CODES;
  window.climateAt = climateAt;
})();
`;
}
