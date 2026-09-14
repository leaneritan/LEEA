"use client";

import { useState } from "react";
import { normalizeAnswer } from "../../../../content/subjects/math/note/answer";

/**
 * 学習ノート p.26 POINT and p.31 — 積の符号と絶対値.
 *
 * The book states the rule as two lines: 負の数が奇数個 → 積の符号は －,
 * 偶数個 → ＋, and 積の絶対値は、それぞれの数の絶対値の積. Written out like that
 * it is two separate jobs, and a four-factor product such as
 * （－4）×（－2）×（－9）×（－1） only goes wrong when they are attempted as one.
 *
 * So that is how it is asked here. Leo marks which factors are negative — the
 * counting is the part the rule is actually about — the widget reads the sign
 * off the parity, and only then is the absolute value wanted. A wrong count is
 * caught before it becomes a wrong answer, which is the difference between
 * knowing where the slip was and just seeing a red cross.
 */

type Problem = {
  expression: string;
  factors: { display: string; negative: boolean }[];
  magnitude: string;
  magnitudeAsk?: string;
  magnitudeAccept?: string[];
  note?: string;
};

export function SignCountWidget({ problems }: { problems: Problem[] }) {
  const [index, setIndex] = useState(0);
  const [marked, setMarked] = useState<Record<number, boolean>>({});
  const [checked, setChecked] = useState(false);
  const [typed, setTyped] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const problem = problems[index];
  const trueNegatives = problem.factors.filter((f) => f.negative).length;
  const markedCount = problem.factors.filter((_, i) => marked[i]).length;
  const countRight = problem.factors.every((f, i) => Boolean(marked[i]) === f.negative);
  const isEven = trueNegatives % 2 === 0;
  const sign = isEven ? "＋" : "－";

  const accept = problem.magnitudeAccept ?? [problem.magnitude];
  const magnitudeRight = accept.some((value) => normalizeAnswer(value) === normalizeAnswer(typed));
  const fullAnswer = `${sign}${problem.magnitude}`;

  function go(next: number) {
    setIndex(next);
    setMarked({});
    setChecked(false);
    setTyped("");
    setSubmitted(false);
  }

  return (
    <div className="math-signcount">
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

      <p className="math-termsort-expression">{problem.expression}</p>
      <p className="math-termsort-ask">負の数をタップして印をつけよう。</p>

      <div className="math-signcount-factors">
        {problem.factors.map((factor, i) => {
          const isMarked = Boolean(marked[i]);
          const state = checked ? (isMarked === factor.negative ? " is-right" : " is-wrong") : isMarked ? " is-marked" : "";
          return (
            <button
              className={`math-signcount-factor${state}`}
              disabled={checked}
              key={`${factor.display}-${i}`}
              onClick={() => setMarked((current) => ({ ...current, [i]: !current[i] }))}
              type="button"
            >
              {factor.display}
              {isMarked ? <span className="math-signcount-flag">負</span> : null}
            </button>
          );
        })}
      </div>

      {!checked ? (
        <div className="math-plot-controls">
          <button className="math-sieve-btn math-sieve-btn--primary" onClick={() => setChecked(true)} type="button">
            負の数はこれ！（{markedCount}個）
          </button>
        </div>
      ) : null}

      {checked ? (
        <div className="math-signcount-rule">
          <p className={countRight ? "math-plot-feedback math-plot-feedback--correct" : "math-plot-feedback math-plot-feedback--wrong"}>
            {countRight
              ? `数え方は せいかい！ 負の数は ${trueNegatives}個。`
              : `赤い数を見なおそう。ほんとうは 負の数は ${trueNegatives}個 だよ。`}
          </p>
          <p className="math-signcount-chain">
            負の数 <strong>{trueNegatives}個</strong> → <strong>{isEven ? "偶数個" : "奇数個"}</strong> → 符号は{" "}
            <strong className={isEven ? "is-pos" : "is-neg"}>{sign}</strong>
          </p>
        </div>
      ) : null}

      {checked ? (
        <div className="math-power-step">
          <span className="math-flip-step">次</span>
          <span className="math-power-answer">
            <span>{problem.magnitudeAsk ?? "絶対値の積は？"}</span>
            <input
              className={`note-input${submitted ? (magnitudeRight ? " is-correct" : " is-wrong") : ""}`}
              disabled={submitted}
              onChange={(event) => setTyped(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && typed.trim()) setSubmitted(true);
              }}
              placeholder="絶対値"
              type="text"
              value={typed}
            />
            {submitted ? (
              <span className={`note-mark${magnitudeRight ? " is-correct" : " is-wrong"}`}>
                {magnitudeRight ? "○" : "×"}
              </span>
            ) : (
              <button
                className="math-sieve-btn math-sieve-btn--primary"
                disabled={!typed.trim()}
                onClick={() => setSubmitted(true)}
                type="button"
              >
                こたえる
              </button>
            )}
          </span>
        </div>
      ) : null}

      {submitted ? (
        <p className={`math-plot-feedback${magnitudeRight && countRight ? " math-plot-feedback--correct" : " math-plot-feedback--wrong"}`}>
          符号 {sign} と 絶対値 {problem.magnitude} を合わせて、答えは <strong>{fullAnswer}</strong>。{problem.note ?? ""}
        </p>
      ) : null}

      <div className="math-plot-controls">
        {index + 1 < problems.length ? (
          <button
            className="math-sieve-btn math-sieve-btn--primary"
            disabled={!submitted}
            onClick={() => go(index + 1)}
            type="button"
          >
            つぎの式へ
          </button>
        ) : (
          <button className="math-sieve-btn" onClick={() => go(0)} type="button">
            はじめから
          </button>
        )}
      </div>
    </div>
  );
}
