"use client";

import { useState } from "react";
import { isTypedAnswerCorrect } from "../../../../content/subjects/math/note/answer";

/** The book writes ＋3 and －4.5, never +3 and -4.5. Match it. */
function signed(value: number) {
  if (value === 0) return "0";
  return value > 0 ? `＋${value}` : `－${Math.abs(value)}`;
}

/**
 * Read labelled points off a number line — the inverse of
 * `NumberLinePlotWidget`, and the question 学習ノート p.14 問1 actually asks.
 *
 * Reading a scale is the skill here, so the line is drawn to the book's own
 * geometry (minor ticks at `step`, majors at whole numbers) and the point
 * positions are the measured ones. Answers are typed rather than chosen: the
 * book prints no options, and inventing four would turn "read the scale" into
 * "eliminate three".
 */
export function NumberLinePointsWidget({
  min,
  max,
  step = 0.5,
  points
}: {
  min: number;
  max: number;
  step?: number;
  points: { label: string; value: number }[];
}) {
  const [entries, setEntries] = useState<Record<string, string>>({});
  const [checked, setChecked] = useState(false);

  const pct = (value: number) => ((value - min) / (max - min)) * 100;
  const majors = Array.from({ length: Math.floor(max - min) + 1 }, (_, i) => min + i);
  const minors: number[] = [];
  for (let v = min; v <= max + 1e-9; v += step) {
    if (Math.abs(v - Math.round(v)) > 1e-9) minors.push(Number(v.toFixed(4)));
  }

  const isRight = (point: { label: string; value: number }) =>
    isTypedAnswerCorrect(entries[point.label] ?? "", { accept: [String(point.value)] });

  const score = points.filter(isRight).length;
  const allFilled = points.every((point) => (entries[point.label] ?? "").trim().length > 0);

  function reset() {
    setEntries({});
    setChecked(false);
  }

  return (
    <div className="math-plot math-readline">
      <div className="math-plot-line math-readline-line">
        <div className="math-plot-axis" />
        {minors.map((tick) => (
          <div className="math-readline-minor" key={`m${tick}`} style={{ left: `${pct(tick)}%` }} />
        ))}
        {majors.map((tick) => (
          <div className="math-plot-tick" key={tick} style={{ left: `${pct(tick)}%` }}>
            <span className="math-plot-tick-mark" />
            {tick === min || tick === max || tick === 0 ? (
              <span className="math-plot-tick-label">{signed(tick)}</span>
            ) : null}
          </div>
        ))}
        {points.map((point) => (
          <div className="math-readline-point" key={point.label} style={{ left: `${pct(point.value)}%` }}>
            <span className="math-readline-point-label">{point.label}</span>
            <span className="math-readline-point-dot" />
          </div>
        ))}
      </div>

      <div className="math-readline-inputs">
        {points.map((point) => {
          const right = isRight(point);
          return (
            <label
              className={`math-readline-field${checked ? (right ? " is-correct" : " is-wrong") : ""}`}
              key={point.label}
            >
              <span className="math-readline-field-name">{point.label}</span>
              <input
                disabled={checked}
                inputMode="text"
                onChange={(event) =>
                  setEntries((current) => ({ ...current, [point.label]: event.target.value }))
                }
                placeholder="例：＋2.5"
                type="text"
                value={entries[point.label] ?? ""}
              />
              {checked ? <span className="math-readline-mark">{right ? "○" : "×"}</span> : null}
            </label>
          );
        })}
      </div>

      <div className="math-plot-controls">
        {!checked ? (
          <button
            className="math-sieve-btn math-sieve-btn--primary"
            disabled={!allFilled}
            onClick={() => setChecked(true)}
            type="button"
          >
            答え合わせ
          </button>
        ) : (
          <button className="math-sieve-btn" onClick={reset} type="button">
            もう一度
          </button>
        )}
        {checked ? (
          <span className="math-plot-score">
            {points.length}問中 {score}問 正解
          </span>
        ) : null}
      </div>

      {checked && score < points.length ? (
        <p className="math-plot-feedback math-plot-feedback--wrong">
          正しい答え：
          {points.map((point) => `${point.label} ${signed(point.value)}`).join("、")}
        </p>
      ) : null}
      {checked && score === points.length ? (
        <p className="math-plot-feedback math-plot-feedback--correct">ぜんぶ せいかい！</p>
      ) : null}
    </div>
  );
}
