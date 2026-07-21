"use client";

import { useState } from "react";

const OX = 40;
const OY = 260;
const UNIT = 22;
const TRI = { A: [2, 7], B: [1, 2], C: [5, 3] } as const;

function toSvg([x, y]: readonly [number, number]) {
  return [OX + x * UNIT, OY - y * UNIT] as const;
}

function fmt(v: number) {
  return v < 0 ? `－${Math.abs(v)}` : `${v}`;
}

export function TranslationWidget() {
  const [dx, setDx] = useState(3);
  const [dy, setDy] = useState(2);

  const orig = { A: toSvg(TRI.A), B: toSvg(TRI.B), C: toSvg(TRI.C) };
  const moved = {
    A: toSvg([TRI.A[0] + dx, TRI.A[1] + dy]),
    B: toSvg([TRI.B[0] + dx, TRI.B[1] + dy]),
    C: toSvg([TRI.C[0] + dx, TRI.C[1] + dy])
  };

  const origPts = `${orig.A.join(",")} ${orig.B.join(",")} ${orig.C.join(",")}`;
  const movedPts = `${moved.A.join(",")} ${moved.B.join(",")} ${moved.C.join(",")}`;

  const gridLines = [];
  for (let i = 0; i <= 10; i++) {
    gridLines.push(
      <line key={`v${i}`} x1={OX + i * UNIT} y1={OY - 220} x2={OX + i * UNIT} y2={OY} stroke="#efe6d3" strokeWidth={1} />
    );
    gridLines.push(<line key={`h${i}`} x1={OX} y1={OY - i * UNIT} x2={OX + 220} y2={OY - i * UNIT} stroke="#efe6d3" strokeWidth={1} />);
  }

  return (
    <div className="math-transform">
      <div className="math-transform-stage">
        <svg viewBox="0 0 300 300" className="math-transform-svg">
          {gridLines}
          <polygon points={origPts} fill="none" stroke="var(--m-accent)" strokeWidth={2} />
          <polygon points={movedPts} fill="#3a6ea8" fillOpacity={0.3} stroke="#3a6ea8" strokeWidth={2} />
          <line x1={orig.A[0]} y1={orig.A[1]} x2={moved.A[0]} y2={moved.A[1]} stroke="#d6486e" strokeWidth={1.5} strokeDasharray="4 3" />
          <text x={orig.A[0] - 12} y={orig.A[1] - 4} fontSize={12} fontWeight={900}>
            A
          </text>
          <text x={orig.B[0] - 14} y={orig.B[1] + 4} fontSize={12} fontWeight={900}>
            B
          </text>
          <text x={orig.C[0] + 8} y={orig.C[1] + 4} fontSize={12} fontWeight={900}>
            C
          </text>
          <text x={moved.A[0] + 6} y={moved.A[1] - 6} fontSize={12} fontWeight={900} fill="#3a6ea8">
            A′
          </text>
          <text x={moved.B[0] - 16} y={moved.B[1] + 14} fontSize={12} fontWeight={900} fill="#3a6ea8">
            B′
          </text>
          <text x={moved.C[0] + 8} y={moved.C[1] + 4} fontSize={12} fontWeight={900} fill="#3a6ea8">
            C′
          </text>
        </svg>
      </div>

      <div className="math-transform-sliders">
        <label className="math-transform-slider-row">
          <span>右へ（横）：{fmt(dx)}</span>
          <input type="range" min={-1} max={5} step={1} value={dx} onChange={(e) => setDx(Number(e.target.value))} className="math-transform-range" />
        </label>
        <label className="math-transform-slider-row">
          <span>上へ（縦）：{fmt(dy)}</span>
          <input type="range" min={-1} max={3} step={1} value={dy} onChange={(e) => setDy(Number(e.target.value))} className="math-transform-range" />
        </label>
      </div>

      <p className="math-transform-note">
        △ABCを右へ{fmt(dx)}、上へ{fmt(dy)}だけ平行移動させると△A′B′C′になる。線分AA′、BB′、CC′は、すべて平行で長さが等しいね。
      </p>
    </div>
  );
}
