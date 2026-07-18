"use client";

import { useState } from "react";

const SQUARE = 44; // px per square cell
const PAD = 10;

export function MatchstickSquaresWidget() {
  const [n, setN] = useState(3);

  const rods = 1 + 3 * n;
  const width = PAD * 2 + n * SQUARE;
  const height = PAD * 2 + SQUARE;

  // vertical rods: n+1 of them (left end + one after each square)
  const verticals = Array.from({ length: n + 1 }, (_, i) => PAD + i * SQUARE);

  return (
    <div className="math-matchstick">
      <div className="math-matchstick-stage">
        <svg viewBox={`0 0 ${width} ${height}`} style={{ maxWidth: "100%", height: "auto", width: width }}>
          {/* top and bottom horizontal rods, per square */}
          {Array.from({ length: n }, (_, i) => {
            const x = PAD + i * SQUARE;
            return (
              <g key={`h-${i}`}>
                <line x1={x} y1={PAD} x2={x + SQUARE} y2={PAD} stroke="var(--m-accent)" strokeWidth={4} strokeLinecap="round" />
                <line x1={x} y1={PAD + SQUARE} x2={x + SQUARE} y2={PAD + SQUARE} stroke="var(--m-accent)" strokeWidth={4} strokeLinecap="round" />
              </g>
            );
          })}
          {/* vertical rods: leftmost is the "+1", the rest belong to each square group */}
          {verticals.map((x, i) => (
            <line
              key={`v-${i}`}
              x1={x}
              y1={PAD}
              x2={x}
              y2={PAD + SQUARE}
              stroke={i === 0 ? "#d6486e" : "var(--m-accent)"}
              strokeWidth={4}
              strokeLinecap="round"
            />
          ))}
        </svg>
      </div>

      <div className="math-matchstick-controls">
        <span className="math-matchstick-label">正方形の個数 x</span>
        <div className="math-matchstick-stepper">
          <button type="button" onClick={() => setN((v) => Math.max(1, v - 1))} aria-label="正方形を1個へらす">
            －
          </button>
          <span>{n}</span>
          <button type="button" onClick={() => setN((v) => Math.min(12, v + 1))} aria-label="正方形を1個ふやす">
            ＋
          </button>
        </div>
      </div>

      <p className="math-matchstick-eq">
        棒の本数 ＝ 1 ＋ 3 × {n} ＝ <strong>{rods}本</strong>
      </p>
      <p className="math-matchstick-note">
        <span className="math-matchstick-swatch math-matchstick-swatch--pink" />
        左はしの1本 ＋
        <span className="math-matchstick-swatch math-matchstick-swatch--accent" />
        1つの正方形につき3本のまとまりが {n}個。だから、正方形が x 個のときは <strong>1＋3x</strong> 本。
      </p>
    </div>
  );
}
