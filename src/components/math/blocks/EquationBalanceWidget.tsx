"use client";

import { useState } from "react";

type Step = { label: string; apply: (s: State) => State };

type State = { coeff: number; leftConst: number; rightConst: number };

const START: State = { coeff: 2, leftConst: 1, rightConst: 7 };

const STEPS: Step[] = [
  { label: "① 両辺から 1 をひく", apply: (s) => ({ ...s, leftConst: s.leftConst - 1, rightConst: s.rightConst - 1 }) },
  { label: "② 両辺を 2 でわる", apply: (s) => ({ coeff: s.coeff / 2, leftConst: 0, rightConst: s.rightConst / 2 }) }
];

function Pan({ coeff, units }: { coeff: number; units: number }) {
  const items = [...Array(coeff)].map((_, i) => (
    <span className="math-eqbalance-x" key={`x${i}`}>
      x
    </span>
  ));
  for (let i = 0; i < units; i++) items.push(<span className="math-eqbalance-unit" key={`u${i}`} />);

  return <div className="math-eqbalance-pan">{items.length ? items : <span className="math-eqbalance-empty">0</span>}</div>;
}

export function EquationBalanceWidget() {
  const [stepIndex, setStepIndex] = useState(0);
  const state = STEPS.slice(0, stepIndex).reduce((s, step) => step.apply(s), START);
  const done = stepIndex === STEPS.length;

  const leftLabel = `${state.coeff > 0 ? (state.coeff === 1 ? "x" : `${state.coeff}x`) : ""}${
    state.leftConst > 0 ? `＋${state.leftConst}` : ""
  }`;
  const rightLabel = `${state.rightConst}`;

  return (
    <div className="math-eqbalance">
      <div className="math-eqbalance-stage">
        <svg viewBox="0 0 300 150" className="math-eqbalance-svg">
          <line x1="150" y1="30" x2="150" y2="90" stroke="#8a7a5c" strokeWidth={4} />
          <polygon points="130,90 170,90 150,120" fill="#8a7a5c" />
          <line x1="40" y1="30" x2="260" y2="30" stroke="var(--m-dark)" strokeWidth={5} strokeLinecap="round" />
          <line x1="40" y1="30" x2="40" y2="50" stroke="var(--m-dark)" strokeWidth={2.5} />
          <line x1="260" y1="30" x2="260" y2="50" stroke="var(--m-dark)" strokeWidth={2.5} />
        </svg>
        <div className="math-eqbalance-pans">
          <Pan coeff={state.coeff} units={state.leftConst} />
          <Pan coeff={0} units={state.rightConst} />
        </div>
      </div>

      <p className="math-eqbalance-eq">
        <strong>{leftLabel || "0"}</strong> ＝ <strong>{rightLabel}</strong>
      </p>

      {!done ? (
        <button className="math-eqbalance-btn" onClick={() => setStepIndex((i) => i + 1)} type="button">
          {STEPS[stepIndex].label}
        </button>
      ) : (
        <div className="math-eqbalance-done">
          <p>てんびんはずっとつり合ったまま、x＝3の形になった！</p>
          <button className="math-eqbalance-btn math-eqbalance-btn--reset" onClick={() => setStepIndex(0)} type="button">
            もう一度やってみる
          </button>
        </div>
      )}
    </div>
  );
}
