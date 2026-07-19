"use client";

import { useState } from "react";

type Problem = { a: number; b: number };

const PROBLEMS: Problem[] = [
  { a: 5, b: 3 },
  { a: 2, b: -3 }
];

function fmt(v: number) {
  if (v === 0) return "0";
  return v > 0 ? `＋${v}` : `－${Math.abs(v)}`;
}

const MIN = -10;
const MAX = 10;
const LEFT = 20;
const RIGHT = 620;
const Y = 90;

function toX(v: number) {
  return LEFT + ((v - MIN) / (MAX - MIN)) * (RIGHT - LEFT);
}

export function SubtractionWalkWidget() {
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);

  const { a, b } = PROBLEMS[index];
  const result = a - b;
  const ticks = [MIN, -5, 0, 5, MAX].concat([a, result]).filter((v, i, arr) => arr.indexOf(v) === i);

  return (
    <div className="math-subwalk">
      <div className="math-subwalk-tabs">
        {PROBLEMS.map((p, i) => (
          <button
            type="button"
            key={i}
            className={`math-subwalk-tab${i === index ? " math-subwalk-tab--active" : ""}`}
            onClick={() => {
              setIndex(i);
              setRevealed(false);
            }}
          >
            ({fmt(p.a)})－({fmt(p.b)})
          </button>
        ))}
      </div>

      <svg viewBox={`0 0 640 110`} className="math-subwalk-svg">
        <line x1={LEFT} y1={Y} x2={RIGHT} y2={Y} stroke="#8a7a5c" strokeWidth={2} />
        {ticks.sort((x, y) => x - y).map((t) => (
          <g key={t}>
            <line x1={toX(t)} y1={Y - 4} x2={toX(t)} y2={Y + 4} stroke="#8a7a5c" strokeWidth={1.5} />
            <text x={toX(t)} y={Y + 18} fontSize={11} textAnchor="middle" fill="#6d5f47">
              {fmt(t)}
            </text>
          </g>
        ))}
        {/* 1st move: 0 -> a */}
        <line x1={toX(0)} y1={Y - 24} x2={toX(a)} y2={Y - 24} stroke="var(--m-accent)" strokeWidth={3} markerEnd="url(#arrow-accent)" />
        <text x={(toX(0) + toX(a)) / 2} y={Y - 30} fontSize={12} fontWeight={700} fill="var(--m-accent)" textAnchor="middle">
          {fmt(a)}
        </text>
        {revealed ? (
          <>
            {/* 2nd move: a -> result, using -b */}
            <line x1={toX(a)} y1={Y - 48} x2={toX(result)} y2={Y - 48} stroke="#3a6ea8" strokeWidth={3} markerEnd="url(#arrow-blue)" />
            <text x={(toX(a) + toX(result)) / 2} y={Y - 54} fontSize={12} fontWeight={700} fill="#3a6ea8" textAnchor="middle">
              {fmt(-b)}
            </text>
          </>
        ) : null}
        <circle cx={toX(revealed ? result : a)} cy={Y} r={5} fill="var(--m-dark)" />
        <defs>
          <marker id="arrow-accent" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6 Z" fill="var(--m-accent)" />
          </marker>
          <marker id="arrow-blue" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6 Z" fill="#3a6ea8" />
          </marker>
        </defs>
      </svg>

      {!revealed ? (
        <button className="math-subwalk-btn" onClick={() => setRevealed(true)} type="button">
          ひき算を、たし算になおしてみる
        </button>
      ) : (
        <p className="math-subwalk-eq">
          ({fmt(a)})－({fmt(b)}) ＝ ({fmt(a)})＋({fmt(-b)}) ＝ <strong>{fmt(result)}</strong>
        </p>
      )}
      <p className="math-subwalk-note">{fmt(b)}をひくことは、符号を変えた{fmt(-b)}をたすことと同じだよ。</p>
    </div>
  );
}
