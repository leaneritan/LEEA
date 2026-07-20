"use client";

import { useState } from "react";

const A = -3;
const TABLE_X = [-3, -2, -1, 0, 1, 2, 3];
const DOMAIN_X = 3.5;
const DOMAIN_Y = 10;

function toSvgX(x: number) {
  return 150 + (x / DOMAIN_X) * 130;
}
function toSvgY(y: number) {
  return 150 - (y / DOMAIN_Y) * 130;
}
function fmt(v: number) {
  return v < 0 ? `－${Math.abs(v)}` : `${v}`;
}

export function ProportionRepresentationLinkWidget() {
  const [x, setX] = useState(1);
  const y = A * x;

  const lineX1 = -DOMAIN_X + 0.3;
  const lineX2 = DOMAIN_X - 0.3;

  return (
    <div className="math-replink">
      <div className="math-replink-table">
        <div className="math-replink-row">
          <span className="math-replink-cell math-replink-cell--label">x</span>
          {TABLE_X.map((v) => (
            <span key={v} className={`math-replink-cell${v === x ? " math-replink-cell--active" : ""}`}>
              {fmt(v)}
            </span>
          ))}
        </div>
        <div className="math-replink-row">
          <span className="math-replink-cell math-replink-cell--label">y</span>
          {TABLE_X.map((v) => (
            <span key={v} className={`math-replink-cell${v === x ? " math-replink-cell--active" : ""}`}>
              {fmt(A * v)}
            </span>
          ))}
        </div>
      </div>

      <p className="math-replink-eq">
        y＝<strong>－3</strong>×x＝<strong>{fmt(y)}</strong>（x＝{fmt(x)}のとき）
      </p>

      <div className="math-replink-stage">
        <svg viewBox="0 0 300 300" className="math-replink-svg">
          <line x1={toSvgX(-DOMAIN_X)} y1={toSvgY(0)} x2={toSvgX(DOMAIN_X)} y2={toSvgY(0)} stroke="#c9bd9e" strokeWidth={1.5} />
          <line x1={toSvgX(0)} y1={toSvgY(-DOMAIN_Y)} x2={toSvgX(0)} y2={toSvgY(DOMAIN_Y)} stroke="#c9bd9e" strokeWidth={1.5} />
          <line
            x1={toSvgX(lineX1)}
            y1={toSvgY(A * lineX1)}
            x2={toSvgX(lineX2)}
            y2={toSvgY(A * lineX2)}
            stroke="var(--m-accent)"
            strokeWidth={2}
          />
          {x !== 0 ? (
            <>
              <line x1={toSvgX(x)} y1={toSvgY(0)} x2={toSvgX(x)} y2={toSvgY(y)} stroke="#3a6ea8" strokeWidth={1.5} strokeDasharray="4 3" />
              <line x1={toSvgX(0)} y1={toSvgY(y)} x2={toSvgX(x)} y2={toSvgY(y)} stroke="#3a6ea8" strokeWidth={1.5} strokeDasharray="4 3" />
            </>
          ) : null}
          <circle cx={toSvgX(x)} cy={toSvgY(y)} r={5} fill="#3a6ea8" stroke="#fff" strokeWidth={1.5} />
          <text
            x={toSvgX(x) + (x >= 2 ? -8 : 8)}
            y={toSvgY(y) - 8}
            fontSize={12}
            fontWeight={900}
            fill="#3a6ea8"
            textAnchor={x >= 2 ? "end" : "start"}
          >
            ({fmt(x)}, {fmt(y)})
          </text>
        </svg>
      </div>

      <div className="math-replink-controls">
        <button type="button" onClick={() => setX((v) => Math.max(-3, v - 1))} aria-label="xを1へらす">
          －
        </button>
        <span>x＝{fmt(x)}</span>
        <button type="button" onClick={() => setX((v) => Math.min(3, v + 1))} aria-label="xを1ふやす">
          ＋
        </button>
      </div>

      <p className="math-replink-note">同じ「－3」が、表では変化のようす、式では比例定数、グラフでは傾きとしてあらわれるね。</p>
    </div>
  );
}
