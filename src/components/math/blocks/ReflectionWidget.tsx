"use client";

import { useState } from "react";

const OX = 40;
const OY = 260;
const UNIT = 22;
const TRI = { A: [2, 7], B: [1, 2], C: [4, 3] } as const;

function toSvg([x, y]: readonly [number, number]) {
  return [OX + x * UNIT, OY - y * UNIT] as const;
}
function reflect([x, y]: readonly [number, number], k: number): [number, number] {
  return [2 * k - x, y];
}

export function ReflectionWidget() {
  const [k, setK] = useState(5.5);

  const orig = { A: toSvg(TRI.A), B: toSvg(TRI.B), C: toSvg(TRI.C) };
  const refl = { A: toSvg(reflect(TRI.A, k)), B: toSvg(reflect(TRI.B, k)), C: toSvg(reflect(TRI.C, k)) };
  const axisX = OX + k * UNIT;

  const origPts = `${orig.A.join(",")} ${orig.B.join(",")} ${orig.C.join(",")}`;
  const reflPts = `${refl.A.join(",")} ${refl.B.join(",")} ${refl.C.join(",")}`;

  const gridLines = [];
  for (let i = 0; i <= 10; i++) {
    gridLines.push(<line key={`v${i}`} x1={OX + i * UNIT} y1={OY - 220} x2={OX + i * UNIT} y2={OY} stroke="#efe6d3" strokeWidth={1} />);
    gridLines.push(<line key={`h${i}`} x1={OX} y1={OY - i * UNIT} x2={OX + 220} y2={OY - i * UNIT} stroke="#efe6d3" strokeWidth={1} />);
  }

  return (
    <div className="math-transform">
      <div className="math-transform-stage">
        <svg viewBox="0 0 300 300" className="math-transform-svg">
          {gridLines}
          <line x1={axisX} y1={20} x2={axisX} y2={OY} stroke="#d6486e" strokeWidth={2} />
          <line x1={orig.A[0]} y1={orig.A[1]} x2={refl.A[0]} y2={refl.A[1]} stroke="#c9bd9e" strokeWidth={1} strokeDasharray="3 3" />
          <line x1={orig.B[0]} y1={orig.B[1]} x2={refl.B[0]} y2={refl.B[1]} stroke="#c9bd9e" strokeWidth={1} strokeDasharray="3 3" />
          <line x1={orig.C[0]} y1={orig.C[1]} x2={refl.C[0]} y2={refl.C[1]} stroke="#c9bd9e" strokeWidth={1} strokeDasharray="3 3" />
          <polygon points={origPts} fill="none" stroke="var(--m-accent)" strokeWidth={2} />
          <polygon points={reflPts} fill="#3a6ea8" fillOpacity={0.3} stroke="#3a6ea8" strokeWidth={2} />
          <text x={axisX + 4} y={30} fontSize={12} fontWeight={900} fill="#d6486e">
            ℓ
          </text>
          <text x={orig.A[0] - 12} y={orig.A[1] - 4} fontSize={12} fontWeight={900}>
            A
          </text>
          <text x={orig.B[0] - 14} y={orig.B[1] + 4} fontSize={12} fontWeight={900}>
            B
          </text>
          <text x={orig.C[0] - 4} y={orig.C[1] - 8} fontSize={12} fontWeight={900}>
            C
          </text>
          <text x={refl.A[0] + 6} y={refl.A[1] - 4} fontSize={12} fontWeight={900} fill="#3a6ea8">
            A′
          </text>
          <text x={refl.B[0] + 6} y={refl.B[1] + 4} fontSize={12} fontWeight={900} fill="#3a6ea8">
            B′
          </text>
          <text x={refl.C[0] + 6} y={refl.C[1] - 8} fontSize={12} fontWeight={900} fill="#3a6ea8">
            C′
          </text>
        </svg>
      </div>

      <label className="math-transform-slider-row">
        <span>対称の軸ℓの位置：x＝{k}</span>
        <input type="range" min={2.5} max={8} step={0.5} value={k} onChange={(e) => setK(Number(e.target.value))} className="math-transform-range" />
      </label>

      <p className="math-transform-note">
        直線ℓを対称の軸として△ABCを対称移動させると△A′B′C′になる。線分AA′、BB′、CC′は、どれも軸ℓと垂直に交わり、ℓによって長さを2等分されているね。
      </p>
    </div>
  );
}
