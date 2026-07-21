"use client";

import { useState } from "react";

const PRESETS = [-8, -6, -4, 4, 6, 8];
const TABLE_X = [-6, -4, -3, -2, -1, 1, 2, 3, 4, 6];
const DOMAIN = 8;

function toSvgX(x: number) {
  return 150 + (x / DOMAIN) * 130;
}
function toSvgY(y: number) {
  return 150 - (y / DOMAIN) * 130;
}
function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) {
    [a, b] = [b, a % b];
  }
  return a || 1;
}
function fmtFrac(num: number, den: number) {
  if (den < 0) {
    num = -num;
    den = -den;
  }
  const g = gcd(num, den);
  num /= g;
  den /= g;
  const neg = num < 0;
  num = Math.abs(num);
  const body = den === 1 ? `${num}` : `${num}/${den}`;
  return neg ? `－${body}` : body;
}
function branchPoints(a: number, sign: 1 | -1) {
  const xMin = Math.max(Math.abs(a) / DOMAIN, 0.4);
  const N = 20;
  const pts: string[] = [];
  for (let i = 0; i <= N; i++) {
    const t = i / N;
    const x = sign * xMin * Math.pow(DOMAIN / xMin, t);
    const y = a / x;
    pts.push(`${toSvgX(x).toFixed(1)},${toSvgY(y).toFixed(1)}`);
  }
  return pts.join(" ");
}

export function InverseSlopeExplorerWidget() {
  const [a, setA] = useState(6);

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
            a＝{fmtFrac(p, 1)}
          </button>
        ))}
      </div>

      <div className="math-slope-stage">
        <svg viewBox="0 0 300 300" className="math-slope-svg">
          <line x1={toSvgX(-DOMAIN)} y1={toSvgY(0)} x2={toSvgX(DOMAIN)} y2={toSvgY(0)} stroke="#c9bd9e" strokeWidth={1.5} />
          <line x1={toSvgX(0)} y1={toSvgY(-DOMAIN)} x2={toSvgX(0)} y2={toSvgY(DOMAIN)} stroke="#c9bd9e" strokeWidth={1.5} />
          <polyline points={branchPoints(a, 1)} fill="none" stroke="var(--m-accent)" strokeWidth={2.5} />
          <polyline points={branchPoints(a, -1)} fill="none" stroke="var(--m-accent)" strokeWidth={2.5} />
          <text x={toSvgX(0) + 4} y={14} fontSize={11} fill="#a08e6c">
            y
          </text>
          <text x={288} y={toSvgY(0) - 6} fontSize={11} fill="#a08e6c" textAnchor="end">
            x
          </text>
        </svg>
      </div>

      <p className="math-slope-eq">
        y＝<strong>{fmtFrac(a, 1)}</strong>/x
      </p>

      <div className="math-slope-table">
        <div className="math-slope-row">
          <span className="math-slope-cell math-slope-cell--label">x</span>
          {TABLE_X.map((x) => (
            <span key={x} className="math-slope-cell">
              {fmtFrac(x, 1)}
            </span>
          ))}
        </div>
        <div className="math-slope-row">
          <span className="math-slope-cell math-slope-cell--label">y</span>
          {TABLE_X.map((x) => (
            <span key={x} className="math-slope-cell">
              {fmtFrac(a, x)}
            </span>
          ))}
        </div>
      </div>

      <p className="math-slope-note">
        {a > 0
          ? "xの値が増加すると、yの値は減少する（x＞0、x＜0のどちらの場合も）。"
          : "xの値が増加すると、yの値は増加する（x＞0、x＜0のどちらの場合も）。"}
        　x＝1のときy＝{fmtFrac(a, 1)}、x＝2のときy＝{fmtFrac(a, 2)}（xが2倍→yは1/2倍）。
      </p>
    </div>
  );
}
