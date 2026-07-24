"use client";

import { useState } from "react";

const OX = 30;
const OY = 190;
const UNIT = 18;

function toSvg([x, y]: readonly [number, number]) {
  return [OX + x * UNIT, OY - y * UNIT] as const;
}
function dist(p: [number, number], q: [number, number]) {
  return Math.hypot(p[0] - q[0], p[1] - q[1]);
}

const P: [number, number] = [3, 7];
const LINE_Y = 2;
const P_PRIME: [number, number] = [3, LINE_Y - (P[1] - LINE_Y)];
const FOOT_X = P[0];

export function ShortestPathReflectionWidget() {
  const [ax, setAx] = useState(6);
  const A: [number, number] = [ax, LINE_Y];

  const pa = dist(P, A);
  const ap = dist(A, P_PRIME);
  const sum = pa + ap;
  const minSum = dist(P, P_PRIME);
  const isAtFoot = Math.abs(ax - FOOT_X) < 0.05;

  const pSvg = toSvg(P);
  const pPrimeSvg = toSvg(P_PRIME);
  const aSvg = toSvg(A);
  const lineStart = toSvg([0, LINE_Y]);
  const lineEnd = toSvg([10, LINE_Y]);

  return (
    <div className="math-construct">
      <div className="math-construct-stage">
        <svg viewBox="0 0 260 300" className="math-construct-svg">
          <line x1={lineStart[0]} y1={lineStart[1]} x2={lineEnd[0]} y2={lineEnd[1]} stroke="#6d5f47" strokeWidth={2} />
          <text x={lineEnd[0] + 4} y={lineEnd[1] + 4} fontSize={12} fontWeight={900}>
            ℓ
          </text>
          <line x1={toSvg([FOOT_X, LINE_Y])[0]} y1={toSvg([FOOT_X, LINE_Y])[1]} x2={pSvg[0]} y2={pSvg[1]} stroke="#efe6d3" strokeWidth={1} strokeDasharray="2 3" />
          <line x1={toSvg([FOOT_X, LINE_Y])[0]} y1={toSvg([FOOT_X, LINE_Y])[1]} x2={pPrimeSvg[0]} y2={pPrimeSvg[1]} stroke="#efe6d3" strokeWidth={1} strokeDasharray="2 3" />

          <line x1={pSvg[0]} y1={pSvg[1]} x2={aSvg[0]} y2={aSvg[1]} stroke={isAtFoot ? "#4a6b35" : "#d6486e"} strokeWidth={2.5} />
          <line x1={aSvg[0]} y1={aSvg[1]} x2={pPrimeSvg[0]} y2={pPrimeSvg[1]} stroke={isAtFoot ? "#4a6b35" : "#d6486e"} strokeWidth={2.5} strokeDasharray={isAtFoot ? undefined : "5 4"} />

          <circle cx={pSvg[0]} cy={pSvg[1]} r={4} fill="var(--m-accent)" />
          <text x={pSvg[0] + 8} y={pSvg[1] - 4} fontSize={13} fontWeight={900}>
            P
          </text>
          <circle cx={pPrimeSvg[0]} cy={pPrimeSvg[1]} r={4} fill="#3a6ea8" />
          <text x={pPrimeSvg[0] + 8} y={pPrimeSvg[1] + 4} fontSize={13} fontWeight={900} fill="#3a6ea8">
            P′
          </text>
          <circle cx={aSvg[0]} cy={aSvg[1]} r={4} fill="#d6486e" />
          <text x={aSvg[0] - 6} y={aSvg[1] - 8} fontSize={13} fontWeight={900} fill="#d6486e">
            A
          </text>
        </svg>
      </div>

      <input
        type="range"
        min={0.5}
        max={9.5}
        step={0.1}
        value={ax}
        onChange={(e) => setAx(Number(e.target.value))}
        className="math-construct-range"
        aria-label="点Aの位置"
      />

      <p className="math-construct-desc">
        PA＝{pa.toFixed(2)}　AP′＝{ap.toFixed(2)}　PA＋AP′＝<strong>{sum.toFixed(2)}</strong>
        {isAtFoot ? "　← 最短！PとP′を結ぶ一直線になったね（垂線の足）" : ""}
      </p>
      <p className="math-construct-note">
        点Pを直線ℓについて対称移動させた点がP′。AがどこにあってもPA＝AP′となるので、PA＋AP′がもっとも短くなるのは、P→A→P′が一直線になるとき、つまりAが点Pから直線ℓへの垂線の足になるときだね。
      </p>
    </div>
  );
}
