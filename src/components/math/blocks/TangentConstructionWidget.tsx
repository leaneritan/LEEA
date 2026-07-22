"use client";

import { useState } from "react";

const OX = 30;
const OY = 220;
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

const O: [number, number] = [5, 5];
const CIRCLE_R = 4;
const ANGLE = (40 * Math.PI) / 180;
const U: [number, number] = [Math.cos(ANGLE), Math.sin(ANGLE)];
const V: [number, number] = [-Math.sin(ANGLE), Math.cos(ANGLE)];
const A: [number, number] = add(O, scale(U, CIRCLE_R));

const R1 = 1.5;
const C: [number, number] = add(A, scale(U, -R1));
const D: [number, number] = add(A, scale(U, R1));
const R2 = 2.5;
const H = Math.sqrt(R2 * R2 - R1 * R1);
const E: [number, number] = add(A, scale(V, H));
const TANGENT_1: [number, number] = add(A, scale(V, 3));
const TANGENT_2: [number, number] = add(A, scale(V, -3));

const STEPS = [
  "円Oと、その周上の点Aがある。点Aを通る接線を作図しよう。円の接線は、接点を通る半径に垂直だったね。半径OAを、Aを通る直線とみなして、Aを通る垂線を作図する方法を使うよ。",
  "① 点Aを中心とする円をかき、直線OAとの交点をC、Dとする。",
  "② C、Dを中心として、等しい半径の円をかき、その交点をEとする。",
  "③ 直線AEをひく。これが点Aを通る円Oの接線！半径OAに垂直になっているね。"
];

export function TangentConstructionWidget() {
  const [step, setStep] = useState(0);
  const maxStep = STEPS.length - 1;

  const oSvg = toSvg(O);
  const aSvg = toSvg(A);

  return (
    <div className="math-construct">
      <div className="math-construct-stage">
        <svg viewBox="0 0 260 320" className="math-construct-svg">
          <circle cx={oSvg[0]} cy={oSvg[1]} r={CIRCLE_R * UNIT} fill="none" stroke="#6d5f47" strokeWidth={2} />
          <line x1={oSvg[0]} y1={oSvg[1]} x2={aSvg[0]} y2={aSvg[1]} stroke="#6d5f47" strokeWidth={1.5} strokeDasharray="4 3" />
          <circle cx={oSvg[0]} cy={oSvg[1]} r={4} fill="#6d5f47" />
          <text x={oSvg[0] - 16} y={oSvg[1] + 5} fontSize={13} fontWeight={900}>
            O
          </text>
          <circle cx={aSvg[0]} cy={aSvg[1]} r={4} fill="#d6486e" />
          <text x={aSvg[0] + 8} y={aSvg[1] - 4} fontSize={13} fontWeight={900} fill="#d6486e">
            A
          </text>

          {step >= 1 ? (
            <>
              <circle cx={aSvg[0]} cy={aSvg[1]} r={R1 * UNIT} fill="none" stroke="var(--m-accent)" strokeWidth={1.5} />
              <circle cx={toSvg(C)[0]} cy={toSvg(C)[1]} r={3} fill="#6d5f47" />
              <text x={toSvg(C)[0] - 16} y={toSvg(C)[1] + 4} fontSize={12} fontWeight={900}>
                C
              </text>
              <circle cx={toSvg(D)[0]} cy={toSvg(D)[1]} r={3} fill="#6d5f47" />
              <text x={toSvg(D)[0] + 6} y={toSvg(D)[1] + 4} fontSize={12} fontWeight={900}>
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
          {step >= 3 ? <line x1={toSvg(TANGENT_1)[0]} y1={toSvg(TANGENT_1)[1]} x2={toSvg(TANGENT_2)[0]} y2={toSvg(TANGENT_2)[1]} stroke="#d6486e" strokeWidth={2.5} /> : null}
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
