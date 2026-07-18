"use client";

import { useState, type MouseEvent } from "react";

const MIN = -6;
const MAX = 6;
const TOLERANCE = 0.4;
const TARGETS = [
  { value: 3, label: "＋3" },
  { value: -2, label: "－2" },
  { value: 4.5, label: "＋4.5" },
  { value: -3.5, label: "－3.5" },
  { value: -0.5, label: "－1/2" }
];

function pct(value: number) {
  return ((value - MIN) / (MAX - MIN)) * 100;
}

export function NumberLinePlotWidget() {
  const [index, setIndex] = useState(0);
  const [guess, setGuess] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const target = TARGETS[index];
  const correct = checked && guess !== null && Math.abs(guess - target.value) <= TOLERANCE;

  function handleClick(event: MouseEvent<HTMLDivElement>) {
    if (checked) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const fraction = (event.clientX - rect.left) / rect.width;
    const value = MIN + fraction * (MAX - MIN);
    setGuess(Math.max(MIN, Math.min(MAX, Math.round(value * 2) / 2)));
  }

  function check() {
    if (guess === null) return;
    setChecked(true);
    if (Math.abs(guess - target.value) <= TOLERANCE) setScore((s) => s + 1);
  }

  function next() {
    if (index + 1 >= TARGETS.length) {
      setDone(true);
      return;
    }
    setIndex((i) => i + 1);
    setGuess(null);
    setChecked(false);
  }

  function reset() {
    setIndex(0);
    setGuess(null);
    setChecked(false);
    setScore(0);
    setDone(false);
  }

  const ticks = Array.from({ length: MAX - MIN + 1 }, (_, i) => MIN + i);

  return (
    <div className="math-plot">
      {done ? (
        <div className="math-plot-done">
          <p>
            {TARGETS.length}問中 <strong>{score}問</strong> 正解！
          </p>
          <button type="button" className="math-sieve-btn math-sieve-btn--primary" onClick={reset}>
            もう一度
          </button>
        </div>
      ) : (
        <>
          <p className="math-plot-prompt">
            次の数の点を、数直線上でタップしてみましょう：<strong>{target.label}</strong>
          </p>
          <div className="math-plot-line" onClick={handleClick}>
            <div className="math-plot-axis" />
            {ticks.map((tick) => (
              <div className="math-plot-tick" key={tick} style={{ left: `${pct(tick)}%` }}>
                <span className="math-plot-tick-mark" />
                <span className="math-plot-tick-label">{tick}</span>
              </div>
            ))}
            {guess !== null ? (
              <div
                className={`math-plot-marker math-plot-marker--guess${checked ? (correct ? " math-plot-marker--correct" : " math-plot-marker--wrong") : ""}`}
                style={{ left: `${pct(guess)}%` }}
              />
            ) : null}
            {checked && !correct ? <div className="math-plot-marker math-plot-marker--answer" style={{ left: `${pct(target.value)}%` }} /> : null}
          </div>
          <div className="math-plot-controls">
            {!checked ? (
              <button type="button" className="math-sieve-btn math-sieve-btn--primary" onClick={check} disabled={guess === null}>
                決定
              </button>
            ) : (
              <button type="button" className="math-sieve-btn math-sieve-btn--primary" onClick={next}>
                つぎへ
              </button>
            )}
            <span className="math-plot-score">
              {index + 1} / {TARGETS.length}問目　正解数：{score}
            </span>
          </div>
          {checked ? (
            <p className={`math-plot-feedback${correct ? " math-plot-feedback--correct" : " math-plot-feedback--wrong"}`}>
              {correct ? "せいかい！" : `おしい！正しい位置は ${target.label} です。`}
            </p>
          ) : null}
        </>
      )}
    </div>
  );
}
