#!/usr/bin/env node
/**
 * scripts/build-country-data.mjs
 *
 * Regenerates public/components/world-countries.js — the shared country layer
 * used by the Geography maps.
 *
 * Two sources, converted once here and baked into a plain JS file so the app
 * ships no geodata dependency and makes no network call at runtime:
 *
 *   Borders — Natural Earth 1:110m admin-0 countries (public domain), via the
 *   `world-atlas` package (ISC, (c) Michael Bostock). Converted to SVG paths in
 *   the same baked projection as the coastline (lon0 = -20, lat1 = 62, 8 px/deg)
 *   so buildWorldMap re-projects both together.
 *
 *   Facts — the `world-countries` package (mledoze/countries), licensed
 *   ODbL 1.0. This is share-alike and requires attribution: the generated file
 *   carries the notice, and only the handful of fields the maps actually use
 *   are copied across.
 *
 * Neither package is a package.json dependency; this script fetches them on
 * demand and only when someone re-runs the conversion.
 *
 * Usage:
 *   node scripts/build-country-data.mjs             # 110m (default)
 *   node scripts/build-country-data.mjs --res 50m   # finer borders, ~6x bigger
 */

import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const BAKED_LON0 = -20;
const BAKED_LAT1 = 62;
const BAKED_SCALE = 8;

const resArg = process.argv.indexOf("--res");
const resolution = resArg > -1 ? process.argv[resArg + 1] : "110m";
const target = path.join(process.cwd(), "public/components/world-countries.js");

const workDir = fs.mkdtempSync(path.join(os.tmpdir(), "leea-country-data-"));
try {
  const atlas = fetchPackage("world-atlas@2");
  const facts = fetchPackage("world-countries");

  const topoPath = path.join(atlas, `countries-${resolution}.json`);
  if (!fs.existsSync(topoPath)) throw new Error(`world-atlas has no countries-${resolution}.json`);

  const shapes = topoToCountryPaths(JSON.parse(fs.readFileSync(topoPath, "utf8")));
  const factsByCcn3 = indexFacts(JSON.parse(fs.readFileSync(path.join(facts, "countries.json"), "utf8")));

  const records = shapes.map((shape) => {
    const fact = shape.id ? factsByCcn3[shape.id] : null;
    // Disputed / limited-recognition areas (N. Cyprus, Somaliland, Kosovo) have
    // geometry but no ISO numeric code, so no fact record. Keep the shape so the
    // map has no holes; the map shows "no details" rather than inventing any.
    if (!fact) return { id: shape.id ?? null, d: shape.d, en: shape.name, jp: shape.name, noFacts: true };
    return {
      id: shape.id,
      d: shape.d,
      cca3: fact.cca3,
      en: fact.en,
      jp: fact.jp,
      cap: fact.cap,
      shu: fact.shu,
      sub: fact.sub,
      area: fact.area,
      lat: fact.lat,
      lon: fact.lon,
      nb: fact.nb
    };
  });

  // Neighbour lists reference countries that may have no polygon at this
  // resolution (Andorra, Monaco, San Marino…). Ship a compact name table for
  // every country so every neighbour can still be named.
  const names = {};
  for (const fact of Object.values(factsByCcn3)) names[fact.cca3] = [fact.en, fact.jp];

  fs.writeFileSync(target, renderModule(records, names, resolution));
  const withFacts = records.filter((record) => !record.noFacts).length;
  console.log(
    `Wrote ${records.length} countries (${withFacts} with facts) to ${path.relative(process.cwd(), target)} ` +
      `(${(fs.statSync(target).size / 1024).toFixed(0)}KB)`
  );
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

/** Decodes quantized TopoJSON into one SVG path per country, in baked pixel space. */
function topoToCountryPaths(topo) {
  const { scale, translate } = topo.transform;

  const arcs = topo.arcs.map((arc) => {
    let x = 0;
    let y = 0;
    return arc.map(([dx, dy]) => {
      x += dx;
      y += dy;
      return [x * scale[0] + translate[0], y * scale[1] + translate[1]];
    });
  });

  function ringPoints(indices) {
    const points = [];
    for (const index of indices) {
      const arc = index < 0 ? arcs[~index].slice().reverse() : arcs[index];
      for (let i = points.length ? 1 : 0; i < arc.length; i++) points.push(arc[i]);
    }
    return points;
  }

  const project = ([lon, lat]) => [
    ((lon - BAKED_LON0) * BAKED_SCALE).toFixed(1),
    ((BAKED_LAT1 - lat) * BAKED_SCALE).toFixed(1)
  ];

  return topo.objects.countries.geometries.map((geometry) => {
    const polygons = geometry.type === "MultiPolygon" ? geometry.arcs : [geometry.arcs];
    let d = "";
    for (const polygon of polygons) {
      for (const ring of polygon) {
        const points = ringPoints(ring);
        if (points.length < 3) continue;
        d += `M${points.map((point) => project(point).join(",")).join("L")}Z`;
      }
    }
    return { id: geometry.id ? String(geometry.id) : null, name: geometry.properties?.name ?? "", d };
  });
}

/**
 * 州 as Japanese school geography divides the world. world-countries gives a
 * region plus a subregion; only the Americas need the subregion to split.
 */
function toShu(region, subregion) {
  if (region === "Asia") return "アジア州";
  if (region === "Europe") return "ヨーロッパ州";
  if (region === "Africa") return "アフリカ州";
  if (region === "Oceania") return "オセアニア州";
  if (region === "Antarctic") return "南極";
  if (region === "Americas") return subregion === "South America" ? "南アメリカ州" : "北アメリカ州";
  return "その他";
}

function indexFacts(countries) {
  const byCcn3 = {};
  for (const country of countries) {
    if (!country.ccn3) continue;
    byCcn3[country.ccn3] = {
      cca3: country.cca3,
      en: country.name?.common ?? "",
      // Capitals are kept in their Latin form — world-countries has no Japanese
      // capital names, and transliterating ~180 of them by hand would be guesswork.
      jp: country.translations?.jpn?.common ?? country.name?.common ?? "",
      cap: Array.isArray(country.capital) ? country.capital[0] ?? "" : "",
      shu: toShu(country.region, country.subregion),
      sub: country.subregion ?? "",
      area: Math.round(country.area ?? 0),
      lat: Array.isArray(country.latlng) ? country.latlng[0] : null,
      lon: Array.isArray(country.latlng) ? country.latlng[1] : null,
      nb: Array.isArray(country.borders) ? country.borders : []
    };
  }
  return byCcn3;
}

function renderModule(records, names, resolution) {
  return `/**
 * world-countries.js — shared country borders + facts for LEEA Geography maps.
 *
 * GENERATED FILE — do not edit by hand.
 * Regenerate with: node scripts/build-country-data.mjs${resolution === "110m" ? "" : ` --res ${resolution}`}
 *
 * Borders: Natural Earth 1:${resolution} admin-0 countries (public domain), via the
 * world-atlas package (ISC, (c) Michael Bostock). Paths are in the same baked
 * projection as world-map.js (lon0 = -20, lat1 = 62, 8 px/deg), so a map built
 * with buildWorldMap can draw them with the same transform.
 *
 * Facts: the world-countries package (github.com/mledoze/countries), licensed
 * under the Open Database License (ODbL) v1.0 —
 * https://opendatacommons.org/licenses/odbl/1.0/. Only the fields the maps use
 * are reproduced here. Any redistribution of this data must keep this notice.
 *
 * Record shape:
 *   id    ISO 3166-1 numeric (the join key), null for areas without one
 *   d     SVG path in baked projection
 *   en    English name        jp   Japanese name
 *   cap   capital (Latin)     shu  州 (アジア州 / ヨーロッパ州 / …)
 *   sub   subregion           area in km2, rounded
 *   lat / lon  approximate centre
 *   nb    neighbouring countries, as cca3 codes
 *   noFacts  true for areas with geometry but no ISO code (disputed/limited
 *            recognition) — shown on the map, but with no fact card
 *
 * Also exports countryName(cca3) -> { en, jp }, which resolves every country
 * including microstates too small to have a polygon at this resolution, so
 * neighbour lists never fall back to raw codes.
 */
(function () {
  var COUNTRIES = ${JSON.stringify(records)};

  // Every country's name, including those too small to draw at this resolution.
  // Keyed by cca3, value [english, japanese].
  var NAMES = ${JSON.stringify(names)};

  var byId = {};
  var byCca3 = {};
  COUNTRIES.forEach(function (country) {
    if (country.id) byId[country.id] = country;
    if (country.cca3) byCca3[country.cca3] = country;
  });

  /** Resolves a cca3 code to { en, jp }, drawable or not. Null if unknown. */
  function countryName(cca3) {
    var entry = NAMES[cca3];
    return entry ? { en: entry[0], jp: entry[1] } : null;
  }

  /**
   * Draws every country as its own clickable path into a new <g>, re-projected
   * onto the window the base map was built with.
   *
   * buildCountryLayer(base, {
   *   className: "country",        // class on each path
   *   onPick: function (country) {}, // click handler, omit for a static layer
   *   fill: function (country) { return "#..."; }  // optional per-country fill
   * })
   *
   * Returns { group, paths } — group is already appended to the base svg.
   */
  function buildCountryLayer(base, options) {
    options = options || {};
    if (!base || !base.svg || !base.el) throw new Error("buildCountryLayer: pass the object returned by buildWorldMap");

    // Same re-projection buildWorldMap applies to the coastline: both data sets
    // are baked in the identical projection, so the transform is identical.
    var transform = base.landPath.parentNode.getAttribute("transform");
    var group = base.el("g", { class: options.layerClass || "country-layer", transform: transform });
    var paths = {};

    COUNTRIES.forEach(function (country) {
      var node = base.el("path", {
        class: options.className || "country",
        d: country.d,
        "data-id": country.id || "",
        "vector-effect": "non-scaling-stroke"
      });
      // Inline style, not a fill attribute: a presentation attribute loses to
      // any matching CSS rule, so setAttribute("fill") would be ignored by a
      // stylesheet that styles .country at all.
      if (options.fill) node.style.fill = options.fill(country);
      if (options.onPick) {
        node.style.cursor = "pointer";
        node.addEventListener("click", function () {
          options.onPick(country);
        });
      }
      group.appendChild(node);
      if (country.id) paths[country.id] = node;
    });

    base.svg.appendChild(group);
    return { group: group, paths: paths };
  }

  window.WORLD_COUNTRIES = COUNTRIES;
  window.WORLD_COUNTRY_NAMES = NAMES;
  window.countryName = countryName;
  window.WORLD_COUNTRY_BY_ID = byId;
  window.WORLD_COUNTRY_BY_CCA3 = byCca3;
  window.buildCountryLayer = buildCountryLayer;
})();
`;
}
