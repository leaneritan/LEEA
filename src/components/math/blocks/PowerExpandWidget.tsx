"use client";

import { useState } from "react";
import { normalizeAnswer } from "../../../../content/subjects/math/note/answer";

/**
 * 学習ノート p.28 — 累乗, and the one page in 1章 where the notation *is* the
 * mathematics.
 *
 * －5² and （－5）² are made of the same three characters. The only difference is
 * whether the minus is inside the repeat or outside it, and that difference is
 * the whole answer: －25 against ＋25. The scan of Leo's copy shows it costing
 * him three answers — p.28 問1(3) written as －0.5², p.33 B問題1(1) where he read
 * （－3²） as ＋9, and p.33 B問題1(3) where －4² became ＋16.
 *
 * So the first thing asked here is not "what is it". It is "which number is
 * being repeated". Only once that is settled does the expansion get written
 * out, and the value typed. The reading Leo did *not* choose is then printed
 * next to his answer, because this rule never sticks from one example — it
 * sticks from the pair.
 */

function times(factor: number, count: number) {
  return Array.from({ length: count }, () => (factor < 0 ? `（${fmt(factor)}）` : fmt(factor))).join("×");
}

function fmt(value: number) {
  return value < 0 ? `－${Math.abs(value)}` : `${value}`;
}

/** The exponent as a character, so both halves of the pair are typeset alike —
 *  a <sup> element next to a plain "²" sits at a visibly different height. */
const SUPERSCRIPT: Record<number, string> = { 2: "²", 3: "³", 4: "⁴", 5: "⁵" };
function sup(exponent: number) {
  return SUPERSCRIPT[exponent] ?? `^${exponent}`;
}

type Problem = {
  expression: string;
  factor: number;
  exponent: number;
  minusOutside: boolean;
  value: string;
  otherValue: string;
  note?: string;
};

export function PowerExpandWidget({ problems }: { problems: Problem[] }) {
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [typed, setTyped] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const problem = problems[index];
  const { factor, exponent, minusOutside } = problem;

  // The two readings, always offered in the same order so the choice is about
  // the expression and not about where the button happens to sit.
  const options = [Math.abs(factor), -Math.abs(factor)];
  const otherReading = -Math.abs(factor);

  const pickedRight = picked !== null && options[picked] === factor;
  const answerRight = submitted && normalizeAnswer(typed) === normalizeAnswer(problem.value);

  function go(next: number) {
    setIndex(next);
    setPicked(null);
    setTyped("");
    setSubmitted(false);
  }

  return (
    <div className="math-power">
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

      <p className="math-power-expression">{problem.expression}</p>

      <div className="math-power-step">
        <span className="math-flip-step">①</span>
        {pickedRight ? (
          <span className="math-power-said">
            くり返しかけるのは <strong>{fmt(factor)}</strong>
            {minusOutside ? "（マイナスは外）" : "（マイナスもいっしょに）"}
          </span>
        ) : (
          <span className="math-power-ask">
            くり返しかけるのは、どの数？
            <span className="math-flip-choices">
              {options.map((option, i) => (
                <button
                  className={`math-flip-choice${picked === i ? (options[i] === factor ? " is-right" : " is-wrong") : ""}`}
                  key={option}
                  onClick={() => setPicked(i)}
                  type="button"
                >
                  {fmt(option)}
                </button>
              ))}
            </span>
          </span>
        )}
      </div>

      {picked !== null && !pickedRight ? (
        <p className="math-plot-feedback math-plot-feedback--wrong">
          {factor < 0
            ? `${problem.expression} は（　）の中ぜんぶが ${exponent} 回かかるよ。マイナスもいっしょに ${exponent} 回。`
            : problem.expression.includes("－")
              ? `${problem.expression} には（　）がないね。指数 ${exponent} がかかっているのは ${Math.abs(factor)} だけで、マイナスはそのあと全体につくよ。`
              : `${problem.expression} にマイナスはないよ。くり返しかけるのは ${Math.abs(factor)}。`}
        </p>
      ) : null}

      {pickedRight ? (
        <div className="math-power-step">
          <span className="math-flip-step">②</span>
          <span className="math-flip-eq">
            {problem.expression} ＝{" "}
            {minusOutside ? (
              <>
                －（{times(Math.abs(factor), exponent)}）
              </>
            ) : (
              <>{times(factor, exponent)}</>
            )}
          </span>
        </div>
      ) : null}

      {pickedRight ? (
        <div className="math-power-step">
          <span className="math-flip-step">③</span>
          <span className="math-power-answer">
            <span>計算すると？</span>
            <input
              className={`note-input${submitted ? (answerRight ? " is-correct" : " is-wrong") : ""}`}
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
              <span className={`note-mark${answerRight ? " is-correct" : " is-wrong"}`}>{answerRight ? "○" : "×"}</span>
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
        <div className="math-power-compare">
          <p className={`math-plot-feedback${answerRight ? " math-plot-feedback--correct" : " math-plot-feedback--wrong"}`}>
            {answerRight ? "せいかい！ " : `おしい。答えは ${problem.value}。 `}
            {problem.note ?? ""}
          </p>
          <div className="math-power-pair">
            <div className="math-power-pair-side is-this">
              <span className="math-power-pair-label">この式</span>
              <strong>{problem.expression}</strong>
              <span>＝ {problem.value}</span>
            </div>
            <div className="math-power-pair-side">
              <span className="math-power-pair-label">もし こう書いてあったら</span>
              <strong>
                {minusOutside ? `（${fmt(otherReading)}）` : `－${Math.abs(factor)}`}
                {sup(exponent)}
              </strong>
              <span>＝ {problem.otherValue}</span>
            </div>
          </div>
          <p className="math-power-moral">
            {problem.value === problem.otherValue ? (
              <>
                この式は <strong>{exponent}乗（奇数回）</strong>なので、たまたま どちらの読み方でも同じ答えになる。でも
                <strong>2乗</strong>だと ＋ と － に分かれるよ。
              </>
            ) : (
              <>
                同じ数字でも、<strong>（　）があるかないか</strong>で答えの符号が変わる。まず「どこまでが指数の中か」を見よう。
              </>
            )}
          </p>
        </div>
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
