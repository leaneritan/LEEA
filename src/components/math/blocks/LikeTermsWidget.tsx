"use client";

import { useState } from "react";

/**
 * 学習ノート 2章 p.48–49 — 同類項をまとめる.
 *
 * This is 1章's term-sort with letters attached. There the piles were 正の項 and
 * 負の項; here they are 文字の項 and 数の項, and the move is identical — split
 * the expression into its 項, gather the ones that belong together, total each
 * pile, then write two things instead of five.
 *
 * Doing it by hand is what stops 8x－6x＋3＋2 from being one intimidating line.
 * It also catches the one slip this page exists to prevent — folding an x term
 * into a bare number — at the moment it is made, rather than at the answer,
 * where a cross says only that something went wrong somewhere.
 */

type Problem = {
  expression: string;
  terms: { display: string; kind: "letter" | "number" }[];
  letterTotal: string;
  numberTotal: string;
  answer: string;
  accept?: string[];
  note?: string;
};

export function LikeTermsWidget({ problems }: { problems: Problem[] }) {
  const [index, setIndex] = useState(0);
  const [placed, setPlaced] = useState<Record<number, "letter" | "number">>({});
  const [revealed, setRevealed] = useState(false);

  const problem = problems[index];
  const terms = problem.terms;

  const allPlaced = terms.every((_, i) => i in placed);
  const allRight = terms.every((t, i) => placed[i] === t.kind);

  function place(termIndex: number, side: "letter" | "number") {
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
      <p className="math-termsort-ask">それぞれの項を、文字の項・数の項に分けよう。</p>

      <div className="math-termsort-pool">
        {terms.map((term, i) => {
          const side = placed[i];
          const right = side === term.kind;
          return (
            <div className={`math-termsort-term${side ? (revealed && !right ? " is-wrong" : " is-placed") : ""}`} key={i}>
              <span className="math-termsort-value">{term.display}</span>
              <span className="math-termsort-buttons">
                <button
                  className={`math-termsort-pick${side === "letter" ? " is-pos" : ""}`}
                  disabled={revealed}
                  onClick={() => place(i, "letter")}
                  type="button"
                >
                  文字
                </button>
                <button
                  className={`math-termsort-pick${side === "number" ? " is-neg" : ""}`}
                  disabled={revealed}
                  onClick={() => place(i, "number")}
                  type="button"
                >
                  数
                </button>
              </span>
            </div>
          );
        })}
      </div>

      <div className="math-termsort-columns">
        <div className="math-termsort-column math-termsort-column--pos">
          <h4>文字の項</h4>
          <p>{terms.filter((_, i) => placed[i] === "letter").map((t) => t.display).join("　") || "—"}</p>
          {revealed ? <span className="math-termsort-total">まとめて {problem.letterTotal}</span> : null}
        </div>
        <div className="math-termsort-column math-termsort-column--neg">
          <h4>数の項</h4>
          <p>{terms.filter((_, i) => placed[i] === "number").map((t) => t.display).join("　") || "—"}</p>
          {revealed ? <span className="math-termsort-total">まとめて {problem.numberTotal}</span> : null}
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
          {problem.letterTotal} と {problem.numberTotal} を合わせて、答えは <strong>{problem.answer}</strong>。
          {problem.note ? `　${problem.note}` : ""}
        </p>
      ) : null}
    </div>
  );
}
