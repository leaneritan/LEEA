"use client";

import { useState } from "react";

const OX = 30;
const OY = 190;
const UNIT = 18;

const A: [number, number] = [1, 4];
const B: [number, number] = [9, 4];
const R = 6;
const MID_X = (A[0] + B[0]) / 2;
const HALF = (B[0] - A[0]) / 2;
const H = Math.sqrt(R * R - HALF * HALF);
const P_TOP: [number, number] = [MID_X, A[1] + H];
const P_BOTTOM: [number, number] = [MID_X, A[1] - H];

function toSvg([x, y]: readonly [number, number]) {
  return [OX + x * UNIT, OY - y * UNIT] as const;
}

const STEPS = [
  "線分ABがある。この垂直二等分線を作図しよう。",
  "① 点A、Bを中心として、等しい半径の円をかく。",
  "② 2つの円の交点をP、Qとする。",
  "③ 直線PQをひく。これが線分ABの垂直二等分線！PA＝PBとなる点Pが、この直線上のどこにあってもいえるよ。"
];

export function PerpendicularBisectorConstructionWidget() {
  const [step, setStep] = useState(0);
  const maxStep = STEPS.length - 1;

  const aSvg = toSvg(A);
  const bSvg = toSvg(B);
  const pSvg = toSvg(P_TOP);
  const qSvg = toSvg(P_BOTTOM);

  return (
    <div className="math-construct">
      <div className="math-construct-stage">
        <svg viewBox="0 0 260 300" className="math-construct-svg">
          <line x1={aSvg[0]} y1={aSvg[1]} x2={bSvg[0]} y2={bSvg[1]} stroke="#6d5f47" strokeWidth={2.5} />
          <circle cx={aSvg[0]} cy={aSvg[1]} r={4} fill="#d6486e" />
          <text x={aSvg[0] - 14} y={aSvg[1] + 4} fontSize={13} fontWeight={900}>
            A
          </text>
          <circle cx={bSvg[0]} cy={bSvg[1]} r={4} fill="#d6486e" />
          <text x={bSvg[0] + 8} y={bSvg[1] + 4} fontSize={13} fontWeight={900}>
            B
          </text>

          {step >= 1 ? (
            <>
              <circle cx={aSvg[0]} cy={aSvg[1]} r={R * UNIT} fill="none" stroke="var(--m-accent)" strokeWidth={1.5} />
              <circle cx={bSvg[0]} cy={bSvg[1]} r={R * UNIT} fill="none" stroke="#3a6ea8" strokeWidth={1.5} />
            </>
          ) : null}
          {step >= 2 ? (
            <>
              <circle cx={pSvg[0]} cy={pSvg[1]} r={3.5} fill="#6d5f47" />
              <text x={pSvg[0] + 8} y={pSvg[1] + 4} fontSize={12} fontWeight={900}>
                P
              </text>
              <circle cx={qSvg[0]} cy={qSvg[1]} r={3.5} fill="#6d5f47" />
              <text x={qSvg[0] + 8} y={qSvg[1] + 4} fontSize={12} fontWeight={900}>
                Q
              </text>
            </>
          ) : null}
          {step >= 3 ? <line x1={pSvg[0]} y1={pSvg[1]} x2={qSvg[0]} y2={qSvg[1]} stroke="#d6486e" strokeWidth={2.5} /> : null}
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
