"use client";

import { useState } from "react";

type Method = "m1" | "m2";

const OX = 30;
const OY = 190;
const UNIT = 18;

const P: [number, number] = [5, 7];
const LINE_Y = 2;

// Method 1
const A1: [number, number] = [1, 2];
const B1: [number, number] = [8, 2];
const R_A1 = Math.hypot(P[0] - A1[0], P[1] - A1[1]);
const R_B1 = Math.hypot(P[0] - B1[0], P[1] - B1[1]);
const P_PRIME: [number, number] = [5, -3]; // reflection of P across LINE_Y

// Method 2
const R1 = 6;
const SQRT11 = Math.sqrt(R1 * R1 - (P[1] - LINE_Y) * (P[1] - LINE_Y));
const A2: [number, number] = [P[0] - SQRT11, LINE_Y];
const B2: [number, number] = [P[0] + SQRT11, LINE_Y];
const R2 = 5.5;
const Q_Y = LINE_Y - Math.sqrt(R2 * R2 - SQRT11 * SQRT11);
const Q: [number, number] = [5, Q_Y];

function toSvg([x, y]: readonly [number, number]) {
  return [OX + x * UNIT, OY - y * UNIT] as const;
}

const STEPS_M1 = [
  "点Pと直線ℓがある。ℓ上にない点Pから、ℓへの垂線を作図しよう。",
  "① 直線ℓ上に適当な2点A、Bをとる。",
  "② Aを中心として半径APの円をかく。",
  "③ Bを中心として半径BPの円をかく。",
  "④ 2つの円の交点（Pともう1つの点）を通る直線をひく。これが求める垂線！"
];
const STEPS_M2 = [
  "点Pと直線ℓがある。はるきさんの方法で垂線を作図しよう。",
  "① 点Pを中心として直線ℓに交わる円をかき、ℓとの交点をA、Bとする。",
  "② A、Bを中心として等しい半径の円をかき、その交点の1つをQとする。",
  "③ 直線PQをひく。これが求める垂線！"
];

export function PerpendicularConstructionWidget() {
  const [method, setMethod] = useState<Method>("m1");
  const [step, setStep] = useState(0);

  const steps = method === "m1" ? STEPS_M1 : STEPS_M2;
  const maxStep = steps.length - 1;

  const pSvg = toSvg(P);
  const lineStart = toSvg([0, LINE_Y]);
  const lineEnd = toSvg([10, LINE_Y]);

  function switchMethod(m: Method) {
    setMethod(m);
    setStep(0);
  }

  return (
    <div className="math-construct">
      <div className="math-construct-tabs">
        <button type="button" className={`math-construct-tab${method === "m1" ? " math-construct-tab--active" : ""}`} onClick={() => switchMethod("m1")}>
          方法①
        </button>
        <button type="button" className={`math-construct-tab${method === "m2" ? " math-construct-tab--active" : ""}`} onClick={() => switchMethod("m2")}>
          方法②（はるきさんの考え）
        </button>
      </div>

      <div className="math-construct-stage">
        <svg viewBox="0 0 260 300" className="math-construct-svg">
          <line x1={lineStart[0]} y1={lineStart[1]} x2={lineEnd[0]} y2={lineEnd[1]} stroke="#6d5f47" strokeWidth={2} />
          <text x={lineEnd[0] + 4} y={lineEnd[1] + 4} fontSize={12} fontWeight={900}>
            ℓ
          </text>
          <circle cx={pSvg[0]} cy={pSvg[1]} r={4} fill="#d6486e" />
          <text x={pSvg[0] + 8} y={pSvg[1] - 6} fontSize={13} fontWeight={900} fill="#d6486e">
            P
          </text>

          {method === "m1" ? (
            <>
              {step >= 1 ? (
                <>
                  <circle cx={toSvg(A1)[0]} cy={toSvg(A1)[1]} r={3.5} fill="#6d5f47" />
                  <text x={toSvg(A1)[0] - 4} y={toSvg(A1)[1] + 16} fontSize={12} fontWeight={900}>
                    A
                  </text>
                  <circle cx={toSvg(B1)[0]} cy={toSvg(B1)[1]} r={3.5} fill="#6d5f47" />
                  <text x={toSvg(B1)[0] - 4} y={toSvg(B1)[1] + 16} fontSize={12} fontWeight={900}>
                    B
                  </text>
                </>
              ) : null}
              {step >= 2 ? <circle cx={toSvg(A1)[0]} cy={toSvg(A1)[1]} r={R_A1 * UNIT} fill="none" stroke="var(--m-accent)" strokeWidth={1.5} /> : null}
              {step >= 3 ? <circle cx={toSvg(B1)[0]} cy={toSvg(B1)[1]} r={R_B1 * UNIT} fill="none" stroke="#3a6ea8" strokeWidth={1.5} /> : null}
              {step >= 4 ? (
                <>
                  <line x1={toSvg(P)[0]} y1={toSvg(P)[1]} x2={toSvg(P_PRIME)[0]} y2={toSvg(P_PRIME)[1]} stroke="#d6486e" strokeWidth={2.5} />
                  <circle cx={toSvg(P_PRIME)[0]} cy={toSvg(P_PRIME)[1]} r={3.5} fill="#6d5f47" />
                </>
              ) : null}
            </>
          ) : (
            <>
              {step >= 1 ? (
                <>
                  <circle cx={pSvg[0]} cy={pSvg[1]} r={R1 * UNIT} fill="none" stroke="var(--m-accent)" strokeWidth={1.5} />
                  <circle cx={toSvg(A2)[0]} cy={toSvg(A2)[1]} r={3.5} fill="#6d5f47" />
                  <text x={toSvg(A2)[0] - 4} y={toSvg(A2)[1] + 16} fontSize={12} fontWeight={900}>
                    A
                  </text>
                  <circle cx={toSvg(B2)[0]} cy={toSvg(B2)[1]} r={3.5} fill="#6d5f47" />
                  <text x={toSvg(B2)[0] - 4} y={toSvg(B2)[1] + 16} fontSize={12} fontWeight={900}>
                    B
                  </text>
                </>
              ) : null}
              {step >= 2 ? (
                <>
                  <circle cx={toSvg(A2)[0]} cy={toSvg(A2)[1]} r={R2 * UNIT} fill="none" stroke="#3a6ea8" strokeWidth={1.5} />
                  <circle cx={toSvg(B2)[0]} cy={toSvg(B2)[1]} r={R2 * UNIT} fill="none" stroke="#3a6ea8" strokeWidth={1.5} />
                  <circle cx={toSvg(Q)[0]} cy={toSvg(Q)[1]} r={3.5} fill="#6d5f47" />
                  <text x={toSvg(Q)[0] + 8} y={toSvg(Q)[1] + 4} fontSize={12} fontWeight={900}>
                    Q
                  </text>
                </>
              ) : null}
              {step >= 3 ? <line x1={toSvg(P)[0]} y1={toSvg(P)[1]} x2={toSvg(Q)[0]} y2={toSvg(Q)[1]} stroke="#d6486e" strokeWidth={2.5} /> : null}
            </>
          )}
        </svg>
      </div>

      <p className="math-construct-desc">{steps[step]}</p>

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
