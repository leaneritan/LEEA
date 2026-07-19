"use client";

import { useState } from "react";

type Problem = { coeff: number; add: number; target: number };
type State = { coeff: number; leftConst: number; rightConst: number };
type Step = { label: string; apply: (s: State) => State };

const PROBLEMS: Problem[] = [
  { coeff: 2, add: 1, target: 7 },
  { coeff: 3, add: 2, target: 17 },
  { coeff: 4, add: 3, target: 19 }
];

function buildSteps(p: Problem): Step[] {
  return [
    {
      label: `① 両辺から ${p.add} をひく`,
      apply: (s) => ({ ...s, leftConst: s.leftConst - p.add, rightConst: s.rightConst - p.add })
    },
    {
      label: `② 両辺を ${p.coeff} でわる`,
      apply: (s) => ({ coeff: s.coeff / p.coeff, leftConst: 0, rightConst: s.rightConst / p.coeff })
    }
  ];
}

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
  const [problemIndex, setProblemIndex] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);

  const problem = PROBLEMS[problemIndex];
  const steps = buildSteps(problem);
  const start: State = { coeff: problem.coeff, leftConst: problem.add, rightConst: problem.target };
  const state = steps.slice(0, stepIndex).reduce((s, step) => step.apply(s), start);
  const done = stepIndex === steps.length;
  const answer = (problem.target - problem.add) / problem.coeff;

  const leftLabel = `${state.coeff > 0 ? (state.coeff === 1 ? "x" : `${state.coeff}x`) : ""}${
    state.leftConst > 0 ? `＋${state.leftConst}` : ""
  }`;
  const rightLabel = `${state.rightConst}`;

  function nextProblem() {
    setProblemIndex((i) => (i + 1) % PROBLEMS.length);
    setStepIndex(0);
  }

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
          {steps[stepIndex].label}
        </button>
      ) : (
        <div className="math-eqbalance-done">
          <p>てんびんはずっとつり合ったまま、x＝{answer}の形になった！</p>
          <button className="math-eqbalance-btn math-eqbalance-btn--reset" onClick={nextProblem} type="button">
            べつの問題をためす
          </button>
        </div>
      )}
    </div>
  );
}
