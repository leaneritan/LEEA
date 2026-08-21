#!/usr/bin/env node
/**
 * scripts/build-world-map-path.mjs
 *
 * Regenerates the baked coastline inside public/components/world-map.js.
 *
 * Source: Natural Earth 1:110m land (public domain), distributed as TopoJSON
 * in the `world-atlas` package (ISC, (c) Michael Bostock). We convert it once,
 * here, into a flat SVG path string and bake that into the component — so the
 * app ships no TopoJSON decoder, no geodata dependency, and no network call at
 * runtime. `world-atlas` is deliberately NOT a package.json dependency; this
 * script fetches it on demand and only when someone re-runs the conversion.
 *
 * Usage:
 *   node scripts/build-world-map-path.mjs            # 110m (default)
 *   node scripts/build-world-map-path.mjs --res 50m  # finer coastline
 *
 * The path is baked in the projection lon0 = -20, lat1 = 62, scale = 8 px/deg —
 * the original 古代文明マップ window. buildWorldMap re-projects it onto any
 * other window, so this constant must not change without regenerating.
 */

import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { decodeArcs, geometryRings, ringsToPath } from "./lib/topojson-to-path.mjs";

const BAKED_LON0 = -20;
const BAKED_LAT1 = 62;
const BAKED_SCALE = 8;

const resArg = process.argv.indexOf("--res");
const resolution = resArg > -1 ? process.argv[resArg + 1] : "110m";
const target = path.join(process.cwd(), "public/components/world-map.js");

const workDir = fs.mkdtempSync(path.join(os.tmpdir(), "leea-world-atlas-"));
try {
  console.log(`Fetching world-atlas (land-${resolution})…`);
  execFileSync("npm", ["pack", "world-atlas@2", "--silent"], { cwd: workDir, stdio: "inherit" });
  const tgz = fs.readdirSync(workDir).find((name) => name.endsWith(".tgz"));
  if (!tgz) throw new Error("npm pack produced no tarball");
  execFileSync("tar", ["xzf", tgz], { cwd: workDir });

  const topoPath = path.join(workDir, "package", `land-${resolution}.json`);
  if (!fs.existsSync(topoPath)) throw new Error(`world-atlas has no land-${resolution}.json`);

  const d = topoToPath(JSON.parse(fs.readFileSync(topoPath, "utf8")));

  const source = fs.readFileSync(target, "utf8");
  const next = source.replace(/var WORLD_LAND_PATH = "[^"]+";/, `var WORLD_LAND_PATH = "${d}";`);
  if (next === source) throw new Error("could not find WORLD_LAND_PATH in world-map.js");

  fs.writeFileSync(target, next);
  console.log(`Wrote ${d.length} path chars to ${path.relative(process.cwd(), target)}`);
} finally {
  fs.rmSync(workDir, { recursive: true, force: true });
}

/** Decodes quantized TopoJSON and projects it into the baked pixel space. */
function topoToPath(topo) {
  const arcs = decodeArcs(topo);

  const project = ([lon, lat]) => [
    ((lon - BAKED_LON0) * BAKED_SCALE).toFixed(1),
    ((BAKED_LAT1 - lat) * BAKED_SCALE).toFixed(1)
  ];

  const collection = topo.objects.land;
  const geometries = collection.type === "GeometryCollection" ? collection.geometries : [collection];

  return geometries.map((geometry) => ringsToPath(geometryRings(geometry, arcs), project)).join("");
}
