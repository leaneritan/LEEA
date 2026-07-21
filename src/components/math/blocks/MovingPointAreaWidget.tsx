"use client";

import { useState } from "react";

const UNIT = 20; // px per cm
const WIDTH_CM = 10; // BC / AD
const HEIGHT_CM = 6; // AB
const AX = 30;
const AY = 20;

export function MovingPointAreaWidget() {
  const [x, setX] = useState(4);

  const bx = AX;
  const by = AY + HEIGHT_CM * UNIT;
  const cx = AX + WIDTH_CM * UNIT;
  const cy = by;
  const dx = AX + WIDTH_CM * UNIT;
  const dy = AY;
  const px = AX + x * UNIT;
  const py = by;
  const y = 3 * x;

  return (
    <div className="math-movept">
      <div className="math-movept-stage">
        <svg viewBox="0 0 260 170" className="math-movept-svg">
          <polygon points={`${AX},${AY} ${bx},${by} ${px},${py}`} fill="var(--m-accent)" fillOpacity={0.35} stroke="var(--m-accent)" strokeWidth={2} />
          <polygon points={`${AX},${AY} ${dx},${dy} ${cx},${cy} ${bx},${by}`} fill="none" stroke="#6d5f47" strokeWidth={1.5} />
          <circle cx={px} cy={py} r={4} fill="#3a6ea8" />
          <text x={AX - 14} y={AY + 4} fontSize={11} fontWeight={900}>
            A
          </text>
          <text x={dx + 6} y={dy + 4} fontSize={11} fontWeight={900}>
            D
          </text>
          <text x={bx - 14} y={by + 4} fontSize={11} fontWeight={900}>
            B
          </text>
          <text x={cx + 6} y={cy + 4} fontSize={11} fontWeight={900}>
            C
          </text>
          <text x={px} y={py + 16} fontSize={11} fontWeight={900} fill="#3a6ea8" textAnchor="middle">
            P
          </text>
          <text x={(AX + px) / 2} y={by + 30} fontSize={10.5} textAnchor="middle" fill="#6d5f47">
            BP＝{x}cm
          </text>
        </svg>
      </div>

      <div className="math-movept-controls">
        <button type="button" onClick={() => setX((v) => Math.max(0, Math.round((v - 0.5) * 2) / 2))} aria-label="xを0.5cmへらす">
          －
        </button>
        <span>x＝{x}cm</span>
        <button type="button" onClick={() => setX((v) => Math.min(10, Math.round((v + 0.5) * 2) / 2))} aria-label="xを0.5cmふやす">
          ＋
        </button>
      </div>

      <p className="math-movept-eq">
        △ABPの面積＝(1/2)×{x}×6＝<strong>{y}cm²</strong>
      </p>
      <p className="math-movept-note">PがBからCまで動く間、y＝3x（0≦x≦10）が成り立つよ。xを2倍にすると面積も2倍になるね。</p>
    </div>
  );
}
