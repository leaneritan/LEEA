"use client";

import { useState } from "react";
import { normalizeAnswer } from "../../../../content/subjects/math/note/answer";

/**
 * 学習ノート 2章 p.50–52 — 分配法則（1次式と数の乗法・除法）.
 *
 * The mistake on this page is always the same one, and the book prints it as a
 * question: p.51 B問2 shows (10a－5)÷5 worked as 2a－5, where the 10 was divided
 * and the －5 was simply carried down. The number outside reached the first term
 * and never arrived at the second.
 *
 * So here the multiplication happens one term at a time. Each term inside the
 * bracket has to be tapped before its product appears, and the answer box does
 * not open until every one has been reached. Forgetting a term is not something
 * that can be marked wrong afterwards — it is something the widget will not let
 * happen, which is the point: the habit being built is 「ぜんぶにかける」.
 */

type Problem = {
  expression: string;
  multiplier: string;
  terms: { term: string; becomes: string }[];
  answer: string;
  accept?: string[];
  note?: string;
};

export function DistributeWidget({ problems }: { problems: Problem[] }) {
  const [index, setIndex] = useState(0);
  const [hit, setHit] = useState<Record<number, boolean>>({});
  const [typed, setTyped] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const problem = problems[index];
  const allHit = problem.terms.every((_, i) => hit[i]);
  const hitCount = problem.terms.filter((_, i) => hit[i]).length;

  const accept = problem.accept ?? [problem.answer];
  const right = accept.some((value) => normalizeAnswer(value) === normalizeAnswer(typed));

  function go(next: number) {
    setIndex(next);
    setHit({});
    setTyped("");
    setSubmitted(false);
  }

  return (
    <div className="math-dist">
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
      <p className="math-termsort-ask">
        {allHit ? "ぜんぶにかけられたね。" : `かっこの中の項を1つずつタップして、${problem.multiplier} をかけよう。（${hitCount} / ${problem.terms.length}）`}
      </p>

      <div className="math-dist-rows">
        {problem.terms.map((t, i) => (
          <button
            className={`math-dist-row${hit[i] ? " is-hit" : ""}`}
            disabled={hit[i]}
            key={t.term}
            onClick={() => setHit((c) => ({ ...c, [i]: true }))}
            type="button"
          >
            <span className="math-dist-mult">{problem.multiplier}</span>
            <span className="math-dist-times">×</span>
            <span className="math-dist-term">{t.term}</span>
            {hit[i] ? (
              <>
                <span className="math-dist-arrow">→</span>
                <span className="math-dist-becomes">{t.becomes}</span>
              </>
            ) : (
              <span className="math-dist-tap">タップ</span>
            )}
          </button>
        ))}
      </div>

      {allHit ? (
        <div className="math-power-step">
          <span className="math-flip-step">＝</span>
          <span className="math-power-answer">
            <span>まとめると？</span>
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
