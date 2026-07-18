"use client";

import { useState } from "react";

// Isometric projection of a row of x unit cubes → rod (edge) count 8x+4.
const RX = 26;
const RY = 13; // row direction (rightward-down)
const DX = 22;
const DY = -11; // depth direction (rightward-up)
const UY = -28; // vertical (up)
const OX = 10;
const OY = 48;

function P(i: number, d: number, u: number): [number, number] {
  return [OX + i * RX + d * DX, OY + i * RY + d * DY + u * UY];
}

type Edge = { a: [number, number]; b: [number, number]; kind: "frame" | "vertical" };

function buildEdges(x: number): Edge[] {
  const edges: Edge[] = [];
  // lengthwise rails (row direction), both depths & heights
  for (let d = 0; d <= 1; d++) {
    for (let u = 0; u <= 1; u++) {
      for (let i = 0; i < x; i++) edges.push({ a: P(i, d, u), b: P(i + 1, d, u), kind: "frame" });
    }
  }
  // depth rods
  for (let i = 0; i <= x; i++) {
    for (let u = 0; u <= 1; u++) edges.push({ a: P(i, 0, u), b: P(i, 1, u), kind: "frame" });
  }
  // vertical rods
  for (let i = 0; i <= x; i++) {
    for (let d = 0; d <= 1; d++) edges.push({ a: P(i, d, 0), b: P(i, d, 1), kind: "vertical" });
  }
  return edges;
}

export function CubeRodsWidget() {
  const [x, setX] = useState(3);

  const rods = 8 * x + 4;
  const edges = buildEdges(x);
  const width = OX * 2 + x * RX + DX;
  const height = OY + x * RY + 12;

  return (
    <div className="math-cuberods">
      <div className="math-cuberods-stage">
        <svg viewBox={`0 0 ${width} ${height}`} style={{ maxWidth: "100%", height: "auto", width }}>
          {edges.map((e, i) => (
            <line
              key={i}
              x1={e.a[0]}
              y1={e.a[1]}
              x2={e.b[0]}
              y2={e.b[1]}
              stroke={e.kind === "vertical" ? "#d6486e" : "var(--m-accent)"}
              strokeWidth={3}
              strokeLinecap="round"
            />
          ))}
        </svg>
      </div>

      <div className="math-cuberods-controls">
        <span className="math-cuberods-label">立方体の個数 x</span>
        <div className="math-cuberods-stepper">
          <button type="button" onClick={() => setX((v) => Math.max(1, v - 1))} aria-label="立方体を1個へらす">
            －
          </button>
          <span>{x}</span>
          <button type="button" onClick={() => setX((v) => Math.min(10, v + 1))} aria-label="立方体を1個ふやす">
            ＋
          </button>
        </div>
      </div>

      <p className="math-cuberods-eq">
        棒の本数 ＝ 8 × {x} ＋ 4 ＝ <strong>{rods}本</strong>
      </p>
      <p className="math-cuberods-note">
        <span className="math-cuberods-swatch math-cuberods-swatch--accent" />
        上の面と下の面がそれぞれ（3x＋1）本 ＋
        <span className="math-cuberods-swatch math-cuberods-swatch--pink" />
        縦の棒が（2x＋2）本。だから、立方体が x 個のときは <strong>8x＋4</strong> 本。正方形のときと同じように考えられます。
      </p>
    </div>
  );
}
