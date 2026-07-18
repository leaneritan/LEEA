"use client";

import { useState } from "react";

const FIRST_MOVE = 3;
const MIN = -12;
const MAX = 12;
const WIDTH = 640;
const HEIGHT = 180;
const LEFT = 20;
const RIGHT = 620;
const Y = 120;

function formatSigned(value: number) {
  if (value === 0) return "0";
  return value > 0 ? `＋${value}` : `－${Math.abs(value)}`;
}

function toX(value: number) {
  return LEFT + ((value - MIN) / (MAX - MIN)) * (RIGHT - LEFT);
}

export function NumberLineWalkWidget() {
  const [secondMove, setSecondMove] = useState(5);

  const afterFirst = FIRST_MOVE;
  const afterSecond = FIRST_MOVE + secondMove;
  const ticks = Array.from({ length: MAX - MIN + 1 }, (_, i) => MIN + i).filter((v) => v % 3 === 0 || v === afterFirst || v === afterSecond);

  function step(delta: number) {
    setSecondMove((current) => {
      const next = current + delta;
      const lo = MIN - FIRST_MOVE;
      const hi = MAX - FIRST_MOVE;
      return Math.min(hi, Math.max(lo, next));
    });
  }

  return (
    <div className="math-walk">
      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} style={{ width: "100%", maxWidth: 600, display: "block", margin: "0 auto" }}>
        <line x1={LEFT} y1={Y} x2={RIGHT} y2={Y} stroke="#8a7a5c" strokeWidth={2} />
        <polygon points={`${RIGHT},${Y} ${RIGHT - 10},${Y - 5} ${RIGHT - 10},${Y + 5}`} fill="#8a7a5c" />
        <g fontFamily="var(--font-jp)" fontSize={12} fill="#6d5f47" textAnchor="middle">
          {ticks.map((tick) => (
            <g key={tick}>
              <line x1={toX(tick)} y1={Y - 5} x2={toX(tick)} y2={Y + 5} stroke="#8a7a5c" strokeWidth={2} />
              <text x={toX(tick)} y={Y + 22}>
                {formatSigned(tick)}
              </text>
            </g>
          ))}
          <text x={LEFT + 20} y={Y + 40} fontWeight={700}>
            西
          </text>
          <text x={RIGHT - 20} y={Y + 40} fontWeight={700}>
            東
          </text>
        </g>
        {/* first move: A -> +3 */}
        <path
          d={`M ${toX(0)} ${Y - 20} Q ${(toX(0) + toX(afterFirst)) / 2} ${Y - 44} ${toX(afterFirst) - 2} ${Y - 22}`}
          fill="none"
          stroke="var(--m-accent)"
          strokeWidth={2.5}
        />
        <polygon points={`${toX(afterFirst)},${Y - 20} ${toX(afterFirst) - 10},${Y - 26} ${toX(afterFirst) - 6},${Y - 16}`} fill="var(--m-accent)" />
        <text x={(toX(0) + toX(afterFirst)) / 2} y={Y - 48} fontSize={12} fontWeight={700} fill="var(--m-dark)" textAnchor="middle" fontFamily="var(--font-jp)">
          ＋3
        </text>
        {/* second move: +3 -> +3+secondMove */}
        <path
          d={`M ${toX(afterFirst)} ${Y - 60} Q ${(toX(afterFirst) + toX(afterSecond)) / 2} ${Y - 84} ${toX(afterSecond) + (afterSecond > afterFirst ? -2 : 2)} ${Y - 62}`}
          fill="none"
          stroke="#1f8a82"
          strokeWidth={2.5}
        />
        <polygon
          points={`${toX(afterSecond)},${Y - 60} ${toX(afterSecond) + (afterSecond > afterFirst ? -10 : 10)},${Y - 66} ${toX(afterSecond) + (afterSecond > afterFirst ? -6 : 6)},${Y - 56}`}
          fill="#1f8a82"
        />
        <text x={(toX(afterFirst) + toX(afterSecond)) / 2} y={Y - 88} fontSize={12} fontWeight={700} fill="#1f8a82" textAnchor="middle" fontFamily="var(--font-jp)">
          {formatSigned(secondMove)}
        </text>
        <circle cx={toX(afterSecond)} cy={Y} r={5} fill="var(--m-dark)" />
      </svg>

      <div className="math-walk-controls">
        <span className="math-walk-eq">
          (＋3) + ({formatSigned(secondMove)}) = <strong>{formatSigned(afterSecond)}</strong>
        </span>
        <div className="math-walk-stepper">
          <button type="button" onClick={() => step(-1)} aria-label="西へ1m">
            －
          </button>
          <span>{formatSigned(secondMove)}</span>
          <button type="button" onClick={() => step(1)} aria-label="東へ1m">
            ＋
          </button>
        </div>
        <div className="math-walk-presets">
          <button type="button" className="math-walk-preset" onClick={() => setSecondMove(5)}>
            □に＋5
          </button>
          <button type="button" className="math-walk-preset" onClick={() => setSecondMove(-5)}>
            □に－5
          </button>
        </div>
      </div>
      <p className="math-walk-note">
        {secondMove >= 0
          ? `＋3の地点から、さらに東へ${secondMove}m移動しています。`
          : `＋3の地点から、西へ${Math.abs(secondMove)}m移動しています。`}
      </p>
    </div>
  );
}
