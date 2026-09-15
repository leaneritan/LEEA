"use client";

import { useState } from "react";
import { normalizeAnswer } from "../../../../content/subjects/math/note/answer";

/**
 * 学習ノート 2章 p.42–43 — 文字を使った式の表し方.
 *
 * The POINT box prints six rules, and the trouble with them is that they all
 * fire at once. Turning b×a×3×a into 3a²b uses four of the six, so a wrong
 * answer marked with a bare × leaves Leo knowing he is wrong and nothing about
 * which rule he skipped. That is the same problem 節7's sign-count had, and it
 * gets the same treatment: keep the parts visible and attributable.
 *
 * The rule list therefore sits under the question the whole time. Answering
 * lights up the rules this particular expression turns on, and each lit rule
 * carries a line saying what it meant *here* — 「a が2個だから a²」 rather than
 * the general statement he has already read. The box becomes the exercise
 * instead of the preamble to it.
 */

type Problem = {
  expression: string;
  answer: string;
  accept?: string[];
  rulesUsed: number[];
  howApplied: string[];
  note?: string;
};

export function NotationRulesWidget({ rules, problems }: { rules: string[]; problems: Problem[] }) {
  const [index, setIndex] = useState(0);
  const [typed, setTyped] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const problem = problems[index];
  const accept = problem.accept ?? [problem.answer];
  const right = accept.some((value) => normalizeAnswer(value) === normalizeAnswer(typed));

  /** rule index → the gloss for this problem, or undefined when it does not fire. */
  const applied = new Map(problem.rulesUsed.map((rule, i) => [rule, problem.howApplied[i]]));

  function go(next: number) {
    setIndex(next);
    setTyped("");
    setSubmitted(false);
  }

  return (
    <div className="math-notation">
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

      <div className="math-power-answer math-notation-answer">
        <span>文字式の表し方で書くと？</span>
        <input
          className={`note-input${submitted ? (right ? " is-correct" : " is-wrong") : ""}`}
          disabled={submitted}
          onChange={(event) => setTyped(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && typed.trim()) setSubmitted(true);
          }}
          placeholder="答え"
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
      </div>

      {submitted ? (
        <p className={`math-plot-feedback${right ? " math-plot-feedback--correct" : " math-plot-feedback--wrong"}`}>
          {right ? "せいかい！ " : `答えは ${problem.answer}。 `}
          {problem.note ?? ""}
        </p>
      ) : null}

      <div className="math-notation-rules">
        <p className="math-notation-rules-title">
          {submitted ? "この式で使ったきまり" : "文字を使った式の表し方（6つのきまり）"}
        </p>
        <ol className="math-notation-rulelist">
          {rules.map((rule, i) => {
            const gloss = applied.get(i);
            const lit = submitted && gloss !== undefined;
            return (
              <li className={`math-notation-rule${lit ? " is-used" : submitted ? " is-dim" : ""}`} key={rule}>
                <span className="math-notation-rule-text">{rule}</span>
                {lit ? <span className="math-notation-rule-gloss">{gloss}</span> : null}
              </li>
            );
          })}
        </ol>
      </div>

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
