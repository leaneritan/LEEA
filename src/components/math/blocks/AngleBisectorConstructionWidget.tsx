"use client";

import { useState } from "react";

const OX = 30;
const OY = 260;
const UNIT = 18;

function toSvg([x, y]: readonly [number, number]) {
  return [OX + x * UNIT, OY - y * UNIT] as const;
}
function add(p: [number, number], q: [number, number]): [number, number] {
  return [p[0] + q[0], p[1] + q[1]];
}
function scale(p: [number, number], k: number): [number, number] {
  return [p[0] * k, p[1] * k];
}
function dist(p: [number, number], q: [number, number]) {
  return Math.hypot(p[0] - q[0], p[1] - q[1]);
}
function intersectCircles(c1: [number, number], r1: number, c2: [number, number], r2: number): [[number, number], [number, number]] {
  const dx = c2[0] - c1[0];
  const dy = c2[1] - c1[1];
  const d = Math.hypot(dx, dy);
  const a = (r1 * r1 - r2 * r2 + d * d) / (2 * d);
  const h = Math.sqrt(Math.max(0, r1 * r1 - a * a));
  const xm = c1[0] + (a * dx) / d;
  const ym = c1[1] + (a * dy) / d;
  return [
    [xm - (h * dy) / d, ym + (h * dx) / d],
    [xm + (h * dy) / d, ym - (h * dx) / d]
  ];
}

const O: [number, number] = [1, 1];
const ANGLE_A = (70 * Math.PI) / 180;
const ANGLE_B = 0;
const A_END: [number, number] = add(O, [9 * Math.cos(ANGLE_A), 9 * Math.sin(ANGLE_A)]);
const B_END: [number, number] = add(O, [9, 0]);

const R1 = 3;
const C: [number, number] = add(O, scale([Math.cos(ANGLE_A), Math.sin(ANGLE_A)], R1));
const D: [number, number] = add(O, [R1, 0]);
const R2 = 4;
const [E1, E2] = intersectCircles(C, R2, D, R2);
const E = dist(E1, O) > dist(E2, O) ? E1 : E2;
const OE_DIST = dist(O, E);
const E_RAY_END: [number, number] = add(O, scale([(E[0] - O[0]) / OE_DIST, (E[1] - O[1]) / OE_DIST], 9));

const STEPS = [
  "∠AOBがある。この二等分線を作図しよう。",
  "① 角の頂点Oを中心とする円をかき、角の2辺との交点をC、Dとする。",
  "② C、Dを中心として、等しい半径の円をかき、その交点をEとする。",
  "③ 半直線OEをひく。これが∠AOBの二等分線！∠AOE＝∠BOEとなるよ。"
];

export function AngleBisectorConstructionWidget() {
  const [step, setStep] = useState(0);
  const maxStep = STEPS.length - 1;

  const oSvg = toSvg(O);
  const aEndSvg = toSvg(A_END);
  const bEndSvg = toSvg(B_END);

  return (
    <div className="math-construct">
      <div className="math-construct-stage">
        <svg viewBox="0 0 260 320" className="math-construct-svg">
          <line x1={oSvg[0]} y1={oSvg[1]} x2={aEndSvg[0]} y2={aEndSvg[1]} stroke="#6d5f47" strokeWidth={2} />
          <line x1={oSvg[0]} y1={oSvg[1]} x2={bEndSvg[0]} y2={bEndSvg[1]} stroke="#6d5f47" strokeWidth={2} />
          <text x={aEndSvg[0] + 4} y={aEndSvg[1] - 4} fontSize={13} fontWeight={900}>
            A
          </text>
          <text x={bEndSvg[0] + 8} y={bEndSvg[1] + 4} fontSize={13} fontWeight={900}>
            B
          </text>
          <circle cx={oSvg[0]} cy={oSvg[1]} r={4} fill="#d6486e" />
          <text x={oSvg[0] - 16} y={oSvg[1] + 6} fontSize={13} fontWeight={900} fill="#d6486e">
            O
          </text>

          {step >= 1 ? (
            <>
              <circle cx={oSvg[0]} cy={oSvg[1]} r={R1 * UNIT} fill="none" stroke="var(--m-accent)" strokeWidth={1.5} />
              <circle cx={toSvg(C)[0]} cy={toSvg(C)[1]} r={3.5} fill="#6d5f47" />
              <text x={toSvg(C)[0] + 6} y={toSvg(C)[1] - 6} fontSize={12} fontWeight={900}>
                C
              </text>
              <circle cx={toSvg(D)[0]} cy={toSvg(D)[1]} r={3.5} fill="#6d5f47" />
              <text x={toSvg(D)[0] - 4} y={toSvg(D)[1] + 16} fontSize={12} fontWeight={900}>
                D
              </text>
            </>
          ) : null}
          {step >= 2 ? (
            <>
              <circle cx={toSvg(C)[0]} cy={toSvg(C)[1]} r={R2 * UNIT} fill="none" stroke="#3a6ea8" strokeWidth={1.5} />
              <circle cx={toSvg(D)[0]} cy={toSvg(D)[1]} r={R2 * UNIT} fill="none" stroke="#3a6ea8" strokeWidth={1.5} />
              <circle cx={toSvg(E)[0]} cy={toSvg(E)[1]} r={3.5} fill="#6d5f47" />
              <text x={toSvg(E)[0] + 8} y={toSvg(E)[1]} fontSize={12} fontWeight={900}>
                E
              </text>
            </>
          ) : null}
          {step >= 3 ? <line x1={oSvg[0]} y1={oSvg[1]} x2={toSvg(E_RAY_END)[0]} y2={toSvg(E_RAY_END)[1]} stroke="#d6486e" strokeWidth={2.5} /> : null}
        </svg>
      </div>

      <p className="math-construct-desc">{STEPS[step]}</p>

      <div className="math-construct-controls">
        <button type="button" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}>
          ← 前
        </button>
        <span>
          ステップ {step}/{maxStep}
        </span>
        <button type="button" onClick={() => setStep((s) => Math.min(maxStep, s + 1))} disabled={step === maxStep}>
          次へ →
        </button>
      </div>
    </div>
  );
}
