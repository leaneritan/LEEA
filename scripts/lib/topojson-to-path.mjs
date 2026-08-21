/**
 * scripts/lib/topojson-to-path.mjs
 *
 * Shared TopoJSON → SVG path conversion for the generated map components
 * (public/components/world-map.js and world-countries.js).
 *
 * The one non-obvious job here is the antimeridian. Natural Earth stores
 * Russia, Fiji and Antarctica with rings whose longitude wraps past ±180°.
 * Projected naively, the wrapping segment is drawn as a straight line from one
 * edge of the map to the other — a stray horizontal streak across the ocean at
 * that latitude. Rings are split at the crossing instead, with a point
 * interpolated onto the ±180° edge so each piece still meets the map border
 * cleanly, which is how a world map shows Chukotka on the far left.
 */

/** Decodes quantized TopoJSON arcs into absolute [lon, lat] pairs. */
export function decodeArcs(topo) {
  const { scale, translate } = topo.transform;
  return topo.arcs.map((arc) => {
    let x = 0;
    let y = 0;
    return arc.map(([dx, dy]) => {
      x += dx;
      y += dy;
      return [x * scale[0] + translate[0], y * scale[1] + translate[1]];
    });
  });
}

/**
 * Stitches a ring's arc indices into one point list. Arcs share their
 * endpoints, so every arc after the first drops its leading point.
 */
export function ringPoints(indices, arcs) {
  const points = [];
  for (const index of indices) {
    const arc = index < 0 ? arcs[~index].slice().reverse() : arcs[index];
    for (let i = points.length ? 1 : 0; i < arc.length; i++) points.push(arc[i]);
  }
  return points;
}

/**
 * Splits a [lon, lat] ring wherever it jumps across the antimeridian, adding
 * the boundary point to each side. Returns one or more point lists.
 */
export function splitRingAtAntimeridian(points) {
  const parts = [];
  let current = [];

  for (let i = 0; i < points.length; i++) {
    const point = points[i];

    if (i > 0) {
      const previous = points[i - 1];
      const deltaLon = point[0] - previous[0];

      if (Math.abs(deltaLon) > 180) {
        // Going east over +180 gives a large negative delta, and vice versa.
        const exitEdge = deltaLon < 0 ? 180 : -180;
        const enterEdge = -exitEdge;
        // Unwrap the next longitude so the crossing is a straight line, then
        // find where it meets the edge and carry that latitude to both pieces.
        const unwrappedLon = point[0] + (deltaLon < 0 ? 360 : -360);
        const span = unwrappedLon - previous[0];
        // Natural Earth already splits some rings (Antarctica, Fiji) exactly on
        // ±180, so the "crossing" can be edge-to-edge with zero span. That is a
        // seam, not a wrap: the latitude is the same on both sides, and
        // interpolating would divide zero by zero.
        const t = span === 0 ? 0 : (exitEdge - previous[0]) / span;
        const edgeLat = previous[1] + t * (point[1] - previous[1]);

        current.push([exitEdge, edgeLat]);
        parts.push(current);
        current = [[enterEdge, edgeLat]];
      }
    }

    current.push(point);
  }

  if (current.length) parts.push(current);
  return parts;
}

/**
 * Turns a geometry's rings into an SVG path string.
 * `project` maps [lon, lat] to [x, y] strings or numbers.
 */
export function ringsToPath(rings, project) {
  let d = "";
  for (const ring of rings) {
    for (const part of splitRingAtAntimeridian(ring)) {
      if (part.length < 3) continue;
      for (const [lon, lat] of part) assertPoint(lon, lat);
      d += `M${part.map((point) => project(point).join(",")).join("L")}Z`;
    }
  }
  return d;
}

/**
 * Fails the build rather than writing a broken path. A NaN coordinate renders
 * as nothing and an out-of-range latitude as a streak across the map — both
 * are invisible in the generator output and obvious only on screen.
 */
function assertPoint(lon, lat) {
  if (!Number.isFinite(lon) || !Number.isFinite(lat)) {
    throw new Error(`non-finite coordinate produced: [${lon}, ${lat}]`);
  }
  if (lat > 90.5 || lat < -90.5 || lon > 180.5 || lon < -180.5) {
    throw new Error(`coordinate outside the globe: [${lon}, ${lat}]`);
  }
}

/** The polygon rings of a TopoJSON geometry, as point lists. */
export function geometryRings(geometry, arcs) {
  const polygons = geometry.type === "MultiPolygon" ? geometry.arcs : [geometry.arcs];
  return polygons.flatMap((polygon) => polygon.map((ring) => ringPoints(ring, arcs)));
}
