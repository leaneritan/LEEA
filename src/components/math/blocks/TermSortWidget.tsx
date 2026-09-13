"use client";

import { useState } from "react";

/**
 * 学習ノート p.18–19 and p.22–23 — gathering 正の項 and 負の項.
 *
 * Two 節 turn on the same move. 加法の交換法則・結合法則 says you are *allowed*
 * to reorder; 加法と減法の混じった計算 is where that permission becomes the
 * method: rewrite as an addition, read off the 項, put the positives together
 * and the negatives together, total each side, then combine two numbers instead
 * of five. Doing that by tapping each 項 into its own column is the difference
 * between following the steps and seeing why the steps help — and it is exactly
 * where a long mixed expression stops being frightening.
 */

function signed(value: number) {
  if (value === 0) return "0";
  return value > 0 ? `＋${value}` : `－${Math.abs(value)}`;
}

export function TermSortWidget({
  problems
}: {
  problems: { expression: string; terms: number[] }[];
}) {
  const [index, setIndex] = useState(0);
  const [placed, setPlaced] = useState<Record<number, "pos" | "neg">>({});
  const [revealed, setRevealed] = useState(false);

  const problem = problems[index];
  const terms = problem.terms;

  const positives = terms.filter((t) => t > 0);
  const negatives = terms.filter((t) => t < 0);
  const posTotal = positives.reduce((sum, t) => sum + t, 0);
  const negTotal = negatives.reduce((sum, t) => sum + t, 0);
  const answer = posTotal + negTotal;

  const allPlaced = terms.every((_, i) => i in placed);
  const allRight = terms.every((t, i) => placed[i] === (t > 0 ? "pos" : "neg"));

  function place(termIndex: number, side: "pos" | "neg") {
    if (revealed) return;
    setPlaced((current) => ({ ...current, [termIndex]: side }));
  }

  function go(next: number) {
    setIndex(next);
    setPlaced({});
    setRevealed(false);
  }

  return (
    <div className="math-termsort">
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
      <p className="math-termsort-ask">それぞれの項を、正の項・負の項に分けよう。</p>

      <div className="math-termsort-pool">
        {terms.map((term, i) => {
          const side = placed[i];
          const right = side === (term > 0 ? "pos" : "neg");
          return (
            <div className={`math-termsort-term${side ? (revealed && !right ? " is-wrong" : " is-placed") : ""}`} key={i}>
              <span className="math-termsort-value">{signed(term)}</span>
              <span className="math-termsort-buttons">
                <button
                  className={`math-termsort-pick${side === "pos" ? " is-pos" : ""}`}
                  disabled={revealed}
                  onClick={() => place(i, "pos")}
                  type="button"
                >
                  正
                </button>
                <button
                  className={`math-termsort-pick${side === "neg" ? " is-neg" : ""}`}
                  disabled={revealed}
                  onClick={() => place(i, "neg")}
                  type="button"
                >
                  負
                </button>
              </span>
            </div>
          );
        })}
      </div>

      <div className="math-termsort-columns">
        <div className="math-termsort-column math-termsort-column--pos">
          <h4>正の項</h4>
          <p>{terms.filter((t, i) => placed[i] === "pos").map(signed).join("　") || "—"}</p>
          {revealed ? <span className="math-termsort-total">合計 {signed(posTotal)}</span> : null}
        </div>
        <div className="math-termsort-column math-termsort-column--neg">
          <h4>負の項</h4>
          <p>{terms.filter((t, i) => placed[i] === "neg").map(signed).join("　") || "—"}</p>
          {revealed ? <span className="math-termsort-total">合計 {signed(negTotal)}</span> : null}
        </div>
      </div>

      <div className="math-plot-controls">
        {!revealed ? (
          <button
            className="math-sieve-btn math-sieve-btn--primary"
            disabled={!allPlaced}
            onClick={() => setRevealed(true)}
            type="button"
          >
            まとめて計算する
          </button>
        ) : index + 1 < problems.length ? (
          <button className="math-sieve-btn math-sieve-btn--primary" onClick={() => go(index + 1)} type="button">
            つぎの式へ
          </button>
        ) : (
          <button className="math-sieve-btn" onClick={() => go(0)} type="button">
            もう一度
          </button>
        )}
      </div>

      {revealed ? (
        <p className={`math-plot-feedback${allRight ? " math-plot-feedback--correct" : " math-plot-feedback--wrong"}`}>
          {allRight ? "分け方は せいかい！ " : "赤い項は分け方がちがうよ。 "}
          {signed(posTotal)} と {signed(negTotal)} をたして、答えは <strong>{signed(answer)}</strong>。
          　{terms.length}つの数をいっぺんに計算するかわりに、2つの数の計算にできたね。
        </p>
      ) : null}
    </div>
  );
}
