"use client";

import { useState } from "react";
import { normalizeAnswer } from "../../../../content/subjects/math/note/answer";

/**
 * 学習ノート 2章 p.46 — 代入と式の値.
 *
 * The seal in the margin of p.46 says 「負の数を代入するときは、（　）をつけて
 * 代入するよ」, and that bracket is the whole difficulty. Substituting x＝－4
 * into －x² without it produces something that is no longer the expression: the
 * minus signs run together and the answer comes out of the wrong reading.
 *
 * So the bracket is a decision made *before* any arithmetic, and it is a real
 * decision rather than a ritual — a positive value genuinely does not need one,
 * which is why the book's own list mixes x＝2 in with x＝－3. Answering
 * 「つける」 every time is wrong on those, so the question cannot be passed by
 * habit.
 *
 * This page is 1章節8's 累乗 trap wearing letters. At x＝－4 the book asks for
 * x², －x², （－x)² and －x³, which are 16, －16, 16 and ＋64 — the last one
 * positive, which is the one worth stopping on.
 */

type Problem = {
  expression: string;
  values: { letter: string; value: string; negative: boolean }[];
  substituted: string;
  answer: string;
  accept?: string[];
  note?: string;
};

export function SubstituteWidget({ problems }: { problems: Problem[] }) {
  const [index, setIndex] = useState(0);
  const [bracketPick, setBracketPick] = useState<"yes" | "no" | null>(null);
  const [typed, setTyped] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const problem = problems[index];
  const anyNegative = problem.values.some((v) => v.negative);
  /** Brackets are needed exactly when something negative is going in. */
  const bracketRight = bracketPick === (anyNegative ? "yes" : "no");

  const accept = problem.accept ?? [problem.answer];
  const right = accept.some((value) => normalizeAnswer(value) === normalizeAnswer(typed));

  function go(next: number) {
    setIndex(next);
    setBracketPick(null);
    setTyped("");
    setSubmitted(false);
  }

  return (
    <div className="math-subst">
      <div className="math-walkread-tabs">
        {problems.map((p, i) => (
          <button
            className={`math-walkread-tab${i === index ? " is-active" : ""}`}
            key={p.expression}
            onClick={() => go(i)}
            type="button"
          >
            {p.expression}
          </button>
        ))}
      </div>

      <p className="math-notation-expression">{problem.expression}</p>
      <p className="math-subst-given">
        {problem.values.map((v, i) => (
          <span className={`math-subst-chip${v.negative ? " is-neg" : ""}`} key={v.letter}>
            {v.letter} ＝ {v.value}
            {i + 1 < problem.values.length ? "" : ""}
          </span>
        ))}
      </p>

      <div className="math-power-step">
        <span className="math-flip-step">①</span>
        {bracketRight ? (
          <span className="math-power-said">
            {anyNegative ? (
              <>
                負の数だから <strong>（　）をつけて</strong>代入する
              </>
            ) : (
              <>
                正の数だから <strong>（　）はいらない</strong>
              </>
            )}
          </span>
        ) : (
          <span className="math-power-ask">
            代入するとき、（　）はいる？
            <span className="math-flip-choices">
              <button
                className={`math-flip-choice${bracketPick === "yes" ? (anyNegative ? " is-right" : " is-wrong") : ""}`}
                onClick={() => setBracketPick("yes")}
                type="button"
              >
                （　）をつける
              </button>
              <button
                className={`math-flip-choice${bracketPick === "no" ? (anyNegative ? " is-wrong" : " is-right") : ""}`}
                onClick={() => setBracketPick("no")}
                type="button"
              >
                そのまま書く
              </button>
            </span>
          </span>
        )}
      </div>

      {bracketPick !== null && !bracketRight ? (
        <p className="math-plot-feedback math-plot-feedback--wrong">
          {anyNegative
            ? "代入する数が負だよ。そのまま書くと符号がとなりの記号とくっついて、別の式になってしまう。（　）をつけよう。"
            : "代入する数は正だから、（　）はいらないよ。いつでもつけるわけではない、というのがこの問題のねらい。"}
        </p>
      ) : null}

      {bracketRight ? (
        <div className="math-power-step">
          <span className="math-flip-step">②</span>
          <span className="math-flip-eq">
            {problem.expression} ＝ <mark>{problem.substituted}</mark>
          </span>
        </div>
      ) : null}

      {bracketRight ? (
        <div className="math-power-step">
          <span className="math-flip-step">③</span>
          <span className="math-power-answer">
            <span>計算すると？</span>
            <input
              className={`note-input${submitted ? (right ? " is-correct" : " is-wrong") : ""}`}
              disabled={submitted}
              onChange={(event) => setTyped(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && typed.trim()) setSubmitted(true);
              }}
              placeholder="式の値"
              type="text"
              value={typed}
            />
            {submitted ? (
              <span className={`note-mark${right ? " is-correct" : " is-wrong"}`}>{right ? "○" : "×"}</span>
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
        <p className={`math-plot-feedback${right ? " math-plot-feedback--correct" : " math-plot-feedback--wrong"}`}>
          {right ? "せいかい！ " : `答えは ${problem.answer}。 `}
          {problem.note ?? ""}
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
