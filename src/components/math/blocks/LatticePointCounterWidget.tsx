"use client";

import { useState } from "react";

const A_COEF = 3 / 2; // y = ax, line ①
const B_COEF = 54; // y = b/x, curve ②
const DOMAIN = 60;

const DIVISORS = [1, 2, 3, 6, 9, 18, 27, 54];
const POINTS = [...DIVISORS.map((d) => ({ x: -d, y: -B_COEF / d })).reverse(), ...DIVISORS.map((d) => ({ x: d, y: B_COEF / d }))];

function toSvgX(x: number) {
  return 150 + (x / DOMAIN) * 130;
}
function toSvgY(y: number) {
  return 150 - (y / DOMAIN) * 130;
}
function branchPoints(sign: 1 | -1) {
  const xMin = Math.max(B_COEF / DOMAIN, 0.4);
  const N = 24;
  const pts: string[] = [];
  for (let i = 0; i <= N; i++) {
    const t = i / N;
    const x = sign * xMin * Math.pow(DOMAIN / xMin, t);
    const y = B_COEF / x;
    pts.push(`${toSvgX(x).toFixed(1)},${toSvgY(y).toFixed(1)}`);
  }
  return pts.join(" ");
}

export function LatticePointCounterWidget() {
  const [count, setCount] = useState(0);
  const revealed = POINTS.slice(0, count);

  return (
    <div className="math-lattice">
      <div className="math-lattice-stage">
        <svg viewBox="0 0 300 300" className="math-lattice-svg">
          <line x1={toSvgX(-DOMAIN)} y1={toSvgY(0)} x2={toSvgX(DOMAIN)} y2={toSvgY(0)} stroke="#c9bd9e" strokeWidth={1.5} />
          <line x1={toSvgX(0)} y1={toSvgY(-DOMAIN)} x2={toSvgX(0)} y2={toSvgY(DOMAIN)} stroke="#c9bd9e" strokeWidth={1.5} />
          <line
            x1={toSvgX(-DOMAIN + 2)}
            y1={toSvgY(A_COEF * (-DOMAIN + 2))}
            x2={toSvgX(DOMAIN - 2)}
            y2={toSvgY(A_COEF * (DOMAIN - 2))}
            stroke="#3a6ea8"
            strokeWidth={2}
          />
          <polyline points={branchPoints(1)} fill="none" stroke="var(--m-accent)" strokeWidth={2} />
          <polyline points={branchPoints(-1)} fill="none" stroke="var(--m-accent)" strokeWidth={2} />
          <circle cx={toSvgX(10)} cy={toSvgY(15)} r={4} fill="#3a6ea8" />
          <text x={toSvgX(10) + 6} y={toSvgY(15) - 6} fontSize={11} fontWeight={900} fill="#3a6ea8">
            A(10, 15)
          </text>
          <circle cx={toSvgX(6)} cy={toSvgY(9)} r={4} fill="#d6486e" />
          <text x={toSvgX(6) + 6} y={toSvgY(9) + 14} fontSize={11} fontWeight={900} fill="#d6486e">
            P(6, 9)
          </text>
          {revealed.map((pt) => (
            <circle key={`${pt.x},${pt.y}`} cx={toSvgX(pt.x)} cy={toSvgY(pt.y)} r={4} fill="var(--m-dark)" />
          ))}
        </svg>
      </div>

      <div className="math-lattice-controls">
        <button type="button" onClick={() => setCount((c) => Math.max(0, c - 1))} aria-label="格子点を1つへらす">
          －
        </button>
        <span>格子点：{count}/16</span>
        <button type="button" onClick={() => setCount((c) => Math.min(16, c + 1))} aria-label="格子点を1つふやす">
          ＋
        </button>
      </div>

      {count === 16 ? (
        <p className="math-lattice-verdict">54＝2×3³の正の約数は8個（1,2,3,6,9,18,27,54）。正と負をあわせて、x座標・y座標がともに整数の点は16個あるね。</p>
      ) : (
        <p className="math-lattice-note">＋ボタンを押して、y＝54/x上の「x座標もy座標も整数」になる点を1つずつ見つけていこう。</p>
      )}
    </div>
  );
}
