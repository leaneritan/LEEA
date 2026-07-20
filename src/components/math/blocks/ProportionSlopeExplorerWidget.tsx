"use client";

import { useState } from "react";

const PRESETS = [-3, -2, -1, 1, 2, 3];
const X_VALUES = [-4, -3, -2, -1, 0, 1, 2, 3, 4];
const DOMAIN_X = 4.5;
const DOMAIN_Y = 14;

function toSvgX(x: number) {
  return 150 + (x / DOMAIN_X) * 130;
}
function toSvgY(y: number) {
  return 150 - (y / DOMAIN_Y) * 130;
}
function fmt(v: number) {
  return v < 0 ? `－${Math.abs(v)}` : `${v}`;
}

export function ProportionSlopeExplorerWidget() {
  const [a, setA] = useState(2);

  const lineX1 = -DOMAIN_X + 0.3;
  const lineX2 = DOMAIN_X - 0.3;

  return (
    <div className="math-slope">
      <div className="math-slope-presets">
        {PRESETS.map((p) => (
          <button
            key={p}
            type="button"
            className={`math-slope-preset${a === p ? " math-slope-preset--active" : ""}`}
            onClick={() => setA(p)}
          >
            a＝{fmt(p)}
          </button>
        ))}
      </div>

      <div className="math-slope-stage">
        <svg viewBox="0 0 300 300" className="math-slope-svg">
          <line x1={toSvgX(-DOMAIN_X)} y1={toSvgY(0)} x2={toSvgX(DOMAIN_X)} y2={toSvgY(0)} stroke="#c9bd9e" strokeWidth={1.5} />
          <line x1={toSvgX(0)} y1={toSvgY(-DOMAIN_Y)} x2={toSvgX(0)} y2={toSvgY(DOMAIN_Y)} stroke="#c9bd9e" strokeWidth={1.5} />
          <line
            x1={toSvgX(lineX1)}
            y1={toSvgY(a * lineX1)}
            x2={toSvgX(lineX2)}
            y2={toSvgY(a * lineX2)}
            stroke="var(--m-accent)"
            strokeWidth={2.5}
          />
          {X_VALUES.map((x) => (
            <circle key={x} cx={toSvgX(x)} cy={toSvgY(a * x)} r={3.5} fill="#3a6ea8" />
          ))}
          <text x={toSvgX(0) + 4} y={14} fontSize={11} fill="#a08e6c">
            y
          </text>
          <text x={288} y={toSvgY(0) - 6} fontSize={11} fill="#a08e6c" textAnchor="end">
            x
          </text>
        </svg>
      </div>

      <p className="math-slope-eq">
        y＝<strong>{fmt(a)}</strong>×x
      </p>

      <div className="math-slope-table">
        <div className="math-slope-row">
          <span className="math-slope-cell math-slope-cell--label">x</span>
          {X_VALUES.map((x) => (
            <span key={x} className="math-slope-cell">
              {fmt(x)}
            </span>
          ))}
        </div>
        <div className="math-slope-row">
          <span className="math-slope-cell math-slope-cell--label">y</span>
          {X_VALUES.map((x) => (
            <span key={x} className="math-slope-cell">
              {fmt(a * x)}
            </span>
          ))}
        </div>
      </div>

      <p className="math-slope-note">
        {a > 0
          ? "xの値が増加すると、yの値も増加する（右上がりの直線）。"
          : "xの値が増加すると、yの値は減少する（右下がりの直線）。"}
        　x＝1のときy＝{fmt(a)}、x＝2のときy＝{fmt(a * 2)}（xが2倍→yも2倍）。
      </p>
    </div>
  );
}
