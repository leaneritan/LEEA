"use client";

import { useState } from "react";

const A = 12;
const STEPS = [-4, -3, -2, -1, 1, 2, 3, 4];
const DOMAIN = 13;

function toSvgX(x: number) {
  return 150 + (x / DOMAIN) * 130;
}
function toSvgY(y: number) {
  return 150 - (y / DOMAIN) * 130;
}
function fmt(v: number) {
  return v < 0 ? `－${Math.abs(v)}` : `${v}`;
}
function branchPoints(sign: 1 | -1) {
  const xMin = Math.max(A / DOMAIN, 0.4);
  const N = 20;
  const pts: string[] = [];
  for (let i = 0; i <= N; i++) {
    const t = i / N;
    const x = sign * xMin * Math.pow(DOMAIN / xMin, t);
    const y = A / x;
    pts.push(`${toSvgX(x).toFixed(1)},${toSvgY(y).toFixed(1)}`);
  }
  return pts.join(" ");
}

export function InverseRepresentationLinkWidget() {
  const [idx, setIdx] = useState(4); // STEPS[4] === 1
  const x = STEPS[idx];
  const y = A / x;

  return (
    <div className="math-replink">
      <div className="math-replink-table">
        <div className="math-replink-row">
          <span className="math-replink-cell math-replink-cell--label">x</span>
          {STEPS.map((v) => (
            <span key={v} className={`math-replink-cell${v === x ? " math-replink-cell--active" : ""}`}>
              {fmt(v)}
            </span>
          ))}
        </div>
        <div className="math-replink-row">
          <span className="math-replink-cell math-replink-cell--label">y</span>
          {STEPS.map((v) => (
            <span key={v} className={`math-replink-cell${v === x ? " math-replink-cell--active" : ""}`}>
              {fmt(A / v)}
            </span>
          ))}
        </div>
      </div>

      <p className="math-replink-eq">
        y＝<strong>12</strong>÷x＝<strong>{fmt(y)}</strong>（x＝{fmt(x)}のとき）
      </p>

      <div className="math-replink-stage">
        <svg viewBox="0 0 300 300" className="math-replink-svg">
          <line x1={toSvgX(-DOMAIN)} y1={toSvgY(0)} x2={toSvgX(DOMAIN)} y2={toSvgY(0)} stroke="#c9bd9e" strokeWidth={1.5} />
          <line x1={toSvgX(0)} y1={toSvgY(-DOMAIN)} x2={toSvgX(0)} y2={toSvgY(DOMAIN)} stroke="#c9bd9e" strokeWidth={1.5} />
          <polyline points={branchPoints(1)} fill="none" stroke="var(--m-accent)" strokeWidth={2} />
          <polyline points={branchPoints(-1)} fill="none" stroke="var(--m-accent)" strokeWidth={2} />
          <line x1={toSvgX(x)} y1={toSvgY(0)} x2={toSvgX(x)} y2={toSvgY(y)} stroke="#3a6ea8" strokeWidth={1.5} strokeDasharray="4 3" />
          <line x1={toSvgX(0)} y1={toSvgY(y)} x2={toSvgX(x)} y2={toSvgY(y)} stroke="#3a6ea8" strokeWidth={1.5} strokeDasharray="4 3" />
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
        <button type="button" onClick={() => setIdx((i) => Math.max(0, i - 1))} aria-label="xを1つ前へ">
          －
        </button>
        <span>x＝{fmt(x)}</span>
        <button type="button" onClick={() => setIdx((i) => Math.min(STEPS.length - 1, i + 1))} aria-label="xを1つ次へ">
          ＋
        </button>
      </div>

      <p className="math-replink-note">比例定数12は、表ではx×yの値、式ではx＝1のときのyの値、グラフでは点(1, 12)の高さとしてあらわれるね。</p>
    </div>
  );
}
