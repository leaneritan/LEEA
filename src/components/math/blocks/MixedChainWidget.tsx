"use client";

import { useState } from "react";
import { normalizeAnswer } from "../../../../content/subjects/math/note/answer";

/**
 * 学習ノート p.31 問1 — 乗法と除法の混じった計算.
 *
 * This one is already an interactive exercise on paper. The book does not print
 * 「計算しなさい」; it prints the skeleton
 *
 *     （－12）÷5×2 ＝ ○( □ × □ × □ ) ＝ □
 *
 * and asks Leo to fill the ○ with a sign and each □ with a number. That shape is
 * the method — 除法を乗法になおす, 積の符号を決める, 積の絶対値を求める, the three
 * arrows the teaching box draws down the side — so the widget is that skeleton
 * rather than a new exercise invented around it.
 *
 * The only change is that a ÷ slot offers the number *and* its 逆数 instead of an
 * empty box. Typing 1/5 proves nothing about whether he knows why; choosing
 * between 5 and 1/5 at the exact spot where the ÷ used to be is the decision the
 * 節 is about, and he makes it once per division rather than once per page.
 */

type Slot = { op: "start" | "×" | "÷"; keep: string; flip: string };

type Problem = {
  expression: string;
  sign: "+" | "-";
  slots: Slot[];
  result: string;
  resultAccept?: string[];
  note?: string;
};

export function MixedChainWidget({ problems }: { problems: Problem[] }) {
  const [index, setIndex] = useState(0);
  const [signPick, setSignPick] = useState<"+" | "-" | null>(null);
  /** Per ÷ slot: has Leo chosen the 逆数 (true) or the number as printed (false)? */
  const [flips, setFlips] = useState<Record<number, boolean>>({});
  const [typed, setTyped] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const problem = problems[index];
  const divisions = problem.slots.map((slot, i) => (slot.op === "÷" ? i : -1)).filter((i) => i >= 0);

  const signRight = signPick === problem.sign;
  const allFlipped = divisions.every((i) => flips[i] === true);
  const flipsAnswered = divisions.every((i) => i in flips);

  const accept = problem.resultAccept ?? [problem.result];
  const resultRight = accept.some((value) => normalizeAnswer(value) === normalizeAnswer(typed));

  function go(next: number) {
    setIndex(next);
    setSignPick(null);
    setFlips({});
    setTyped("");
    setSubmitted(false);
  }

  return (
    <div className="math-chain">
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

      <p className="math-termsort-expression">{problem.expression}</p>

      <div className="math-chain-skeleton">
        <span className="math-chain-eq">＝</span>

        {signRight ? (
          <span className="math-chain-sign is-filled">{problem.sign === "+" ? "＋" : "－"}</span>
        ) : (
          <span className="math-chain-signpick">
            <button
              className={`math-chain-signbtn${signPick === "+" ? (problem.sign === "+" ? " is-right" : " is-wrong") : ""}`}
              onClick={() => setSignPick("+")}
              type="button"
            >
              ＋
            </button>
            <button
              className={`math-chain-signbtn${signPick === "-" ? (problem.sign === "-" ? " is-right" : " is-wrong") : ""}`}
              onClick={() => setSignPick("-")}
              type="button"
            >
              －
            </button>
          </span>
        )}

        <span className="math-chain-group">
          <span className="math-chain-paren">（</span>
          {problem.slots.map((slot, i) => (
            <span className="math-chain-slot" key={i}>
              {/* While a ÷ slot is still a choice, the × that will join it has
                  not been earned yet — printing 「× ÷5 は？」 reads as nonsense. */}
              {i > 0 && !(slot.op === "÷" && flips[i] !== true) ? <span className="math-chain-times">×</span> : null}
              {slot.op === "÷" ? (
                flips[i] === true ? (
                  <span className="math-chain-box is-filled">{slot.flip}</span>
                ) : (
                  <span className="math-chain-pick">
                    <span className="math-chain-pick-label">÷{slot.keep} は？</span>
                    <button
                      className={`math-chain-pickbtn${flips[i] === false ? " is-wrong" : ""}`}
                      onClick={() => setFlips((c) => ({ ...c, [i]: false }))}
                      type="button"
                    >
                      {slot.keep}
                    </button>
                    <button className="math-chain-pickbtn" onClick={() => setFlips((c) => ({ ...c, [i]: true }))} type="button">
                      {slot.flip}
                    </button>
                  </span>
                )
              ) : (
                <span className="math-chain-box is-given">{slot.keep}</span>
              )}
            </span>
          ))}
          <span className="math-chain-paren">）</span>
        </span>
      </div>

      {signPick !== null && !signRight ? (
        <p className="math-plot-feedback math-plot-feedback--wrong">
          負の数の個数を数えてみよう。奇数個なら －、偶数個なら ＋ だよ。
        </p>
      ) : null}

      {flipsAnswered && !allFlipped ? (
        <p className="math-plot-feedback math-plot-feedback--wrong">
          ÷ はそのままでは中に入れられないよ。「わる」は「逆数をかける」と同じ。分子と分母を入れかえた数を選ぼう。
        </p>
      ) : null}

      {signRight && allFlipped ? (
        <div className="math-power-step">
          <span className="math-flip-step">＝</span>
          <span className="math-power-answer">
            <span>計算すると？</span>
            <input
              className={`note-input${submitted ? (resultRight ? " is-correct" : " is-wrong") : ""}`}
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
              <span className={`note-mark${resultRight ? " is-correct" : " is-wrong"}`}>{resultRight ? "○" : "×"}</span>
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
        <p className={`math-plot-feedback${resultRight ? " math-plot-feedback--correct" : " math-plot-feedback--wrong"}`}>
          {resultRight ? "せいかい！ " : `答えは ${problem.result}。 `}
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
