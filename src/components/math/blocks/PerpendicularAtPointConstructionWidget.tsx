"use client";

import { useState } from "react";

const OX = 30;
const OY = 190;
const UNIT = 18;

function toSvg([x, y]: readonly [number, number]) {
  return [OX + x * UNIT, OY - y * UNIT] as const;
}

const LINE_Y = 2;
const O: [number, number] = [5, LINE_Y];
const R1 = 3;
const C: [number, number] = [O[0] - R1, LINE_Y];
const D: [number, number] = [O[0] + R1, LINE_Y];
const R2 = 4;
const H = Math.sqrt(R2 * R2 - R1 * R1);
const E: [number, number] = [O[0], LINE_Y + H];
const LINE_TOP: [number, number] = [O[0], LINE_Y + H + 1];
const LINE_BOTTOM: [number, number] = [O[0], LINE_Y - H - 1];

const STEPS = [
  "直線AB上に点Oがある。Oを通り、ABに垂直な直線を作図しよう。直線ABを、Oを頂点とする180°の角（∠AOB）とみなして考えるよ。",
  "① 点Oを中心とする円をかき、直線ABとの交点をC、Dとする。",
  "② C、Dを中心として、等しい半径の円をかき、その交点をEとする。",
  "③ 直線OEをひく。これがOを通るABの垂線！角の二等分線の作図と、まったく同じ考え方だね。"
];

export function PerpendicularAtPointConstructionWidget() {
  const [step, setStep] = useState(0);
  const maxStep = STEPS.length - 1;

  const oSvg = toSvg(O);
  const lineStart = toSvg([0, LINE_Y]);
  const lineEnd = toSvg([10, LINE_Y]);

  return (
    <div className="math-construct">
      <div className="math-construct-stage">
        <svg viewBox="0 0 260 300" className="math-construct-svg">
          <line x1={lineStart[0]} y1={lineStart[1]} x2={lineEnd[0]} y2={lineEnd[1]} stroke="#6d5f47" strokeWidth={2} />
          <text x={lineStart[0] - 16} y={lineStart[1] + 4} fontSize={13} fontWeight={900}>
            A
          </text>
          <text x={lineEnd[0] + 6} y={lineEnd[1] + 4} fontSize={13} fontWeight={900}>
            B
          </text>
          <circle cx={oSvg[0]} cy={oSvg[1]} r={4} fill="#d6486e" />
          <text x={oSvg[0] - 6} y={oSvg[1] + 20} fontSize={13} fontWeight={900} fill="#d6486e">
            O
          </text>

          {step >= 1 ? (
            <>
              <circle cx={oSvg[0]} cy={oSvg[1]} r={R1 * UNIT} fill="none" stroke="var(--m-accent)" strokeWidth={1.5} />
              <circle cx={toSvg(C)[0]} cy={toSvg(C)[1]} r={3.5} fill="#6d5f47" />
              <text x={toSvg(C)[0] - 4} y={toSvg(C)[1] + 20} fontSize={12} fontWeight={900}>
                C
              </text>
              <circle cx={toSvg(D)[0]} cy={toSvg(D)[1]} r={3.5} fill="#6d5f47" />
              <text x={toSvg(D)[0] - 4} y={toSvg(D)[1] + 20} fontSize={12} fontWeight={900}>
                D
              </text>
            </>
          ) : null}
          {step >= 2 ? (
            <>
              <circle cx={toSvg(C)[0]} cy={toSvg(C)[1]} r={R2 * UNIT} fill="none" stroke="#3a6ea8" strokeWidth={1.5} />
              <circle cx={toSvg(D)[0]} cy={toSvg(D)[1]} r={R2 * UNIT} fill="none" stroke="#3a6ea8" strokeWidth={1.5} />
              <circle cx={toSvg(E)[0]} cy={toSvg(E)[1]} r={3.5} fill="#6d5f47" />
              <text x={toSvg(E)[0] + 8} y={toSvg(E)[1] - 4} fontSize={12} fontWeight={900}>
                E
              </text>
            </>
          ) : null}
          {step >= 3 ? <line x1={toSvg(LINE_TOP)[0]} y1={toSvg(LINE_TOP)[1]} x2={toSvg(LINE_BOTTOM)[0]} y2={toSvg(LINE_BOTTOM)[1]} stroke="#d6486e" strokeWidth={2.5} /> : null}
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
