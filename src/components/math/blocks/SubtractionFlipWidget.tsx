"use client";

import { useState } from "react";

/**
 * 学習ノート p.20 — 「正の数、負の数をひくことは、その数の符号を変えて加える
 * ことと同じである」.
 *
 * That sentence is the whole 節, and it is the one most easily reduced to a
 * trick ("two minuses make a plus") that collapses the moment the numbers get
 * awkward. So here Leo performs the flip himself — he taps the sign of the
 * number being subtracted, watches the whole expression rewrite into an
 * addition, and only then walks it on the number line. The rule is something he
 * does, in the order the book derives it, rather than a phrase he repeats.
 */

const WIDTH = 640;
const HEIGHT = 96;
const LEFT = 28;
const RIGHT = 612;
const AXIS_Y = 58;

function signed(value: number) {
  if (value === 0) return "0";
  return value > 0 ? `＋${value}` : `－${Math.abs(value)}`;
}

export function SubtractionFlipWidget({
  min,
  max,
  problems
}: {
  min: number;
  max: number;
  problems: { a: number; b: number }[];
}) {
  const [index, setIndex] = useState(0);
  const [stage, setStage] = useState<0 | 1 | 2>(0);
  const [wrongFlip, setWrongFlip] = useState(false);

  const { a, b } = problems[index];
  const flipped = -b;
  const result = a + flipped;

  const toX = (v: number) => LEFT + ((v - min) / (max - min)) * (RIGHT - LEFT);
  const ticks = Array.from({ length: max - min + 1 }, (_, i) => min + i);

  function pickFlip(choice: number) {
    if (stage > 0) return;
    if (choice === flipped) {
      setStage(1);
      setWrongFlip(false);
    } else {
      setWrongFlip(true);
    }
  }

  function go(next: number) {
    setIndex(next);
    setStage(0);
    setWrongFlip(false);
  }

  return (
    <div className="math-flip">
      <div className="math-walkread-tabs">
        {problems.map((p, i) => (
          <button
            className={`math-walkread-tab${i === index ? " is-active" : ""}`}
            key={`${p.a}-${p.b}`}
            onClick={() => go(i)}
            type="button"
          >
            {signed(p.a)}−({signed(p.b)})
          </button>
        ))}
      </div>

      <div className="math-flip-rows">
        <div className="math-flip-row">
          <span className="math-flip-step">①</span>
          <span className="math-flip-eq">
            （{signed(a)}）− （{signed(b)}）
          </span>
        </div>

        <div className={`math-flip-row${stage >= 1 ? " is-done" : ""}`}>
          <span className="math-flip-step">②</span>
          {stage === 0 ? (
            <span className="math-flip-ask">
              ひく数 <strong>{signed(b)}</strong> の符号を変えると？
              <span className="math-flip-choices">
                {[b, -b]
                  .filter((v, i, arr) => arr.indexOf(v) === i)
                  .map((choice) => (
                    <button
                      className="math-flip-choice"
                      key={choice}
                      onClick={() => pickFlip(choice)}
                      type="button"
                    >
                      {signed(choice)}
                    </button>
                  ))}
              </span>
            </span>
          ) : (
            <span className="math-flip-eq">
              ＝（{signed(a)}）＋（<mark>{signed(flipped)}</mark>）
              <span className="math-flip-note">ひく → 符号を変えてたす</span>
            </span>
          )}
        </div>

        {stage >= 1 ? (
          <div className={`math-flip-row${stage >= 2 ? " is-done" : ""}`}>
            <span className="math-flip-step">③</span>
            {stage === 1 ? (
              <button className="math-sieve-btn math-sieve-btn--primary" onClick={() => setStage(2)} type="button">
                数直線で歩いてみる
              </button>
            ) : (
              <span className="math-flip-eq">
                ＝ <strong>{signed(result)}</strong>
              </span>
            )}
          </div>
        ) : null}
      </div>

      {wrongFlip ? (
        <p className="math-plot-feedback math-plot-feedback--wrong">
          符号を「変える」から、{signed(b)} は {signed(flipped)} になるよ。
        </p>
      ) : null}

      {stage >= 2 ? (
        <svg style={{ width: "100%", maxWidth: 600, display: "block", margin: "6px auto 0" }} viewBox={`0 0 ${WIDTH} ${HEIGHT}`}>
          <line stroke="#8a7a5c" strokeWidth={2} x1={LEFT} x2={RIGHT} y1={AXIS_Y} y2={AXIS_Y} />
          <g fill="#6d5f47" fontFamily="var(--font-jp)" fontSize={12} textAnchor="middle">
            {ticks.map((tick) => (
              <g key={tick}>
                <line
                  stroke="#8a7a5c"
                  strokeWidth={tick === 0 ? 2.5 : 1.5}
                  x1={toX(tick)}
                  x2={toX(tick)}
                  y1={AXIS_Y - 6}
                  y2={AXIS_Y + 6}
                />
                <text x={toX(tick)} y={AXIS_Y + 24}>
                  {tick === 0 ? "0" : signed(tick)}
                </text>
              </g>
            ))}
          </g>
          <line stroke="#c9804f" strokeWidth={2.5} x1={toX(0)} x2={toX(a)} y1={34} y2={34} />
          <polygon
            fill="#c9804f"
            points={`${toX(a)},34 ${toX(a) + (a >= 0 ? -9 : 9)},29 ${toX(a) + (a >= 0 ? -9 : 9)},39`}
          />
          <line stroke="#6f8fa8" strokeWidth={2.5} x1={toX(a)} x2={toX(result)} y1={16} y2={16} />
          <polygon
            fill="#6f8fa8"
            points={`${toX(result)},16 ${toX(result) + (flipped >= 0 ? -9 : 9)},11 ${toX(result) + (flipped >= 0 ? -9 : 9)},21`}
          />
          <circle cx={toX(result)} cy={AXIS_Y} fill="#a05c30" r={5} />
        </svg>
      ) : null}

      {stage >= 2 ? (
        <div className="math-flip-controls">
          <p className="math-plot-feedback math-plot-feedback--correct">
            {signed(a)} から {signed(b)} をひくのは、{signed(a)} に {signed(flipped)} をたすのと同じ。答えは {signed(result)}。
          </p>
          {index + 1 < problems.length ? (
            <button className="math-sieve-btn math-sieve-btn--primary" onClick={() => go(index + 1)} type="button">
              つぎの式へ
            </button>
          ) : (
            <button className="math-sieve-btn" onClick={() => go(0)} type="button">
              もう一度
            </button>
          )}
        </div>
      ) : null}
    </div>
  );
}
