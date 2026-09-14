"use client";

import { useState } from "react";

/**
 * 学習ノート p.32–33 — 四則の混じった計算.
 *
 * The POINT box on p.32 is three lines about order: 乗除を先に, かっこの中を先に,
 * 累乗を先に. Nothing in a written answer shows whether they were followed. A
 * right answer and a wrong one are both one line of working, which is why
 * p.33 B問題1(1) and 1(3) in Leo's copy are wrong by 72 and by 18 with no visible
 * slip anywhere — the order went wrong on the first line and everything after it
 * was arithmetic done correctly on the wrong numbers.
 *
 * So this widget never asks for the answer. It asks, at each stage, which part
 * goes next — and then does that part for him and redraws the expression. He
 * gets the order wrong for the price of one sentence instead of the whole
 * question, and the shrinking expression is the picture the POINT box is trying
 * to describe.
 */

type Step = {
  ask?: string;
  options: string[];
  correct: number;
  becomes: string;
  why: string;
};

type Problem = {
  expression: string;
  steps: Step[];
  result: string;
  note?: string;
};

export function OrderStepsWidget({ problems }: { problems: Problem[] }) {
  const [index, setIndex] = useState(0);
  const [stage, setStage] = useState(0);
  const [wrong, setWrong] = useState<number | null>(null);
  /** Whether this run was clean — one wrong pick anywhere and it is not. */
  const [slipped, setSlipped] = useState(false);

  const problem = problems[index];
  const done = stage >= problem.steps.length;
  const step = done ? undefined : problem.steps[stage];
  const shown = stage === 0 ? problem.expression : problem.steps[stage - 1].becomes;

  function pick(option: number) {
    if (!step) return;
    if (option === step.correct) {
      setWrong(null);
      setStage(stage + 1);
    } else {
      setWrong(option);
      setSlipped(true);
    }
  }

  function go(next: number) {
    setIndex(next);
    setStage(0);
    setWrong(null);
    setSlipped(false);
  }

  return (
    <div className="math-order">
      <div className="math-walkread-tabs">
        {problems.map((p, i) => (
          <button
            className={`math-walkread-tab${i === index ? " is-active" : ""}`}
            key={p.expression}
            onClick={() => go(i)}
            type="button"
          >
            式{i + 1}
          </button>
        ))}
      </div>

      <ol className="math-order-trail">
        {problem.steps.slice(0, stage).map((past, i) => (
          <li className="math-order-past" key={i}>
            <span className="math-order-past-eq">{i === 0 ? problem.expression : problem.steps[i - 1].becomes}</span>
            <span className="math-order-past-why">{past.why}</span>
          </li>
        ))}
      </ol>

      <p className="math-order-current">{shown}</p>

      {step ? (
        <div className="math-order-ask">
          <p className="math-termsort-ask">{step.ask ?? "どこを先に計算する？"}</p>
          <div className="math-order-options">
            {step.options.map((option, i) => (
              <button
                className={`math-order-option${wrong === i ? " is-wrong" : ""}`}
                key={option}
                onClick={() => pick(i)}
                type="button"
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {wrong !== null && step ? (
        <p className="math-plot-feedback math-plot-feedback--wrong">{step.why}</p>
      ) : null}

      {done ? (
        <p className={`math-plot-feedback${slipped ? " math-plot-feedback--wrong" : " math-plot-feedback--correct"}`}>
          {slipped ? "順番をまちがえた所があったね。もう一度やってみよう。 " : "順番どおり！ "}
          答えは <strong>{problem.result}</strong>。{problem.note ?? ""}
        </p>
      ) : null}

      <div className="math-plot-controls">
        {done && index + 1 < problems.length ? (
          <button className="math-sieve-btn math-sieve-btn--primary" onClick={() => go(index + 1)} type="button">
            つぎの式へ
          </button>
        ) : null}
        <button className="math-sieve-btn" onClick={() => go(index)} type="button">
          この式をやりなおす
        </button>
      </div>
    </div>
  );
}
