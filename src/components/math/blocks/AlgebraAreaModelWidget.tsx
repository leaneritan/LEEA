"use client";

import { useState } from "react";

type Mode = "add" | "mul" | "dist";

const UNIT = 20; // px per unit width/height

function Stepper({ label, value, onChange, min = 1, max = 9 }: { label: string; value: number; onChange: (v: number) => void; min?: number; max?: number }) {
  return (
    <div className="math-arearea-stepper">
      <span>{label}</span>
      <button type="button" onClick={() => onChange(Math.max(min, value - 1))} aria-label={`${label}をへらす`}>
        －
      </button>
      <span className="math-arearea-stepper-val">{value}</span>
      <button type="button" onClick={() => onChange(Math.min(max, value + 1))} aria-label={`${label}をふやす`}>
        ＋
      </button>
    </div>
  );
}

export function AlgebraAreaModelWidget() {
  const [mode, setMode] = useState<Mode>("add");
  const [m, setM] = useState(3);
  const [n, setN] = useState(6);
  const [times, setTimes] = useState(3);
  const [a, setA] = useState(5);
  const [b, setB] = useState(3);
  const [c, setC] = useState(2);

  const H = 44;

  return (
    <div className="math-arearea">
      <div className="math-arearea-tabs">
        <button type="button" className={`math-arearea-tab${mode === "add" ? " math-arearea-tab--active" : ""}`} onClick={() => setMode("add")}>
          たし算
        </button>
        <button type="button" className={`math-arearea-tab${mode === "mul" ? " math-arearea-tab--active" : ""}`} onClick={() => setMode("mul")}>
          かけ算
        </button>
        <button type="button" className={`math-arearea-tab${mode === "dist" ? " math-arearea-tab--active" : ""}`} onClick={() => setMode("dist")}>
          分配法則
        </button>
      </div>

      {mode === "add" ? (
        <div className="math-arearea-panel">
          <div className="math-arearea-stage">
            <svg viewBox={`0 0 ${(m + n) * UNIT + 20} ${H + 24}`} className="math-arearea-svg">
              <rect x={4} y={4} width={m * UNIT} height={H} fill="var(--m-accent)" fillOpacity={0.35} stroke="var(--m-accent)" strokeWidth={2} />
              <rect x={4 + m * UNIT} y={4} width={n * UNIT} height={H} fill="#3a6ea8" fillOpacity={0.35} stroke="#3a6ea8" strokeWidth={2} />
              <text x={4 + (m * UNIT) / 2} y={H / 2 + 8} textAnchor="middle" fontSize={13} fontWeight={900}>
                {m}x
              </text>
              <text x={4 + m * UNIT + (n * UNIT) / 2} y={H / 2 + 8} textAnchor="middle" fontSize={13} fontWeight={900}>
                {n}x
              </text>
            </svg>
          </div>
          <div className="math-arearea-controls">
            <Stepper label="m" value={m} onChange={setM} />
            <Stepper label="n" value={n} onChange={setN} />
          </div>
          <p className="math-arearea-eq">
            {m}x ＋ {n}x ＝ ({m}＋{n})x ＝ <strong>{m + n}x</strong>
          </p>
          <p className="math-arearea-note">高さがxの2つの長方形を横につなげると、幅は{m}＋{n}になるね。</p>
        </div>
      ) : null}

      {mode === "mul" ? (
        <div className="math-arearea-panel">
          <div className="math-arearea-stage">
            <svg viewBox={`0 0 ${times * a * UNIT + 20} ${H + 24}`} className="math-arearea-svg">
              {[...Array(times)].map((_, i) => (
                <rect
                  key={i}
                  x={4 + i * a * UNIT}
                  y={4}
                  width={a * UNIT}
                  height={H}
                  fill="var(--m-accent)"
                  fillOpacity={0.3}
                  stroke="var(--m-accent)"
                  strokeWidth={2}
                />
              ))}
              <text x={4 + (times * a * UNIT) / 2} y={H / 2 + 8} textAnchor="middle" fontSize={13} fontWeight={900}>
                {a}a を{times}こ
              </text>
            </svg>
          </div>
          <div className="math-arearea-controls">
            <Stepper label="a" value={a} onChange={setA} max={8} />
            <Stepper label="回数" value={times} onChange={setTimes} max={6} />
          </div>
          <p className="math-arearea-eq">
            {a}a × {times} ＝ <strong>{a * times}a</strong>
          </p>
          <p className="math-arearea-note">幅{a}の長方形を{times}こ横にならべると、全体の幅は{a}×{times}になるね。</p>
        </div>
      ) : null}

      {mode === "dist" ? (
        <div className="math-arearea-panel">
          <div className="math-arearea-stage">
            <svg viewBox={`0 0 ${(b + c) * UNIT + 20} ${a * UNIT + 24}`} className="math-arearea-svg">
              <rect x={4} y={4} width={b * UNIT} height={a * UNIT} fill="var(--m-accent)" fillOpacity={0.35} stroke="var(--m-accent)" strokeWidth={2} />
              <rect x={4 + b * UNIT} y={4} width={c * UNIT} height={a * UNIT} fill="#3a6ea8" fillOpacity={0.35} stroke="#3a6ea8" strokeWidth={2} />
              <text x={4 + (b * UNIT) / 2} y={(a * UNIT) / 2 + 8} textAnchor="middle" fontSize={12} fontWeight={900}>
                {a}×{b}＝{a * b}
              </text>
              <text x={4 + b * UNIT + (c * UNIT) / 2} y={(a * UNIT) / 2 + 8} textAnchor="middle" fontSize={12} fontWeight={900}>
                {a}×{c}＝{a * c}
              </text>
            </svg>
          </div>
          <div className="math-arearea-controls">
            <Stepper label="a" value={a} onChange={setA} max={6} />
            <Stepper label="b" value={b} onChange={setB} max={6} />
            <Stepper label="c" value={c} onChange={setC} max={6} />
          </div>
          <p className="math-arearea-eq">
            {a}×({b}＋{c}) ＝ {a}×{b} ＋ {a}×{c} ＝ <strong>{a * b + a * c}</strong>
          </p>
          <p className="math-arearea-note">大きい長方形（幅{b}＋{c}）の面積は、2つに分けた長方形の面積の合計と同じだね。</p>
        </div>
      ) : null}
    </div>
  );
}
