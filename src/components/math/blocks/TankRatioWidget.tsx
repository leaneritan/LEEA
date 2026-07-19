"use client";

import { useState } from "react";

const START_A = 42;
const START_B = 15;
const RATE = 3;
const MAX_HEIGHT = 100; // px, scaled against a reference max liters
const REF_MAX_L = 70;

export function TankRatioWidget() {
  const [t, setT] = useState(0);

  const a = START_A + RATE * t;
  const b = START_B + RATE * t;
  const ratio = a / b;
  const isTarget = Math.abs(ratio - 4) < 0.05;

  const heightA = Math.max(0, Math.min(MAX_HEIGHT, (a / REF_MAX_L) * MAX_HEIGHT));
  const heightB = Math.max(0, Math.min(MAX_HEIGHT, (b / REF_MAX_L) * MAX_HEIGHT));

  return (
    <div className="math-tankratio">
      <div className="math-tankratio-tanks">
        <div className="math-tankratio-tank">
          <div className="math-tankratio-tube" style={{ height: MAX_HEIGHT }}>
            <div className="math-tankratio-fill math-tankratio-fill--a" style={{ height: `${heightA}px` }} />
          </div>
          <span className="math-tankratio-tag">A：{a}L</span>
        </div>
        <div className="math-tankratio-tank">
          <div className="math-tankratio-tube" style={{ height: MAX_HEIGHT }}>
            <div className="math-tankratio-fill math-tankratio-fill--b" style={{ height: `${heightB}px` }} />
          </div>
          <span className="math-tankratio-tag">B：{b}L</span>
        </div>
      </div>

      <p className={`math-tankratio-readout${isTarget ? " math-tankratio-readout--hit" : ""}`}>
        {t === 0 ? "いま" : t > 0 ? `${t}分後` : `${Math.abs(t)}分前`}：Aの水はBの{ratio.toFixed(2)}倍
        {isTarget ? "　→　ちょうど4倍！" : ""}
      </p>

      <input
        type="range"
        min={-5}
        max={10}
        step={1}
        value={t}
        onChange={(e) => setT(Number(e.target.value))}
        className="math-tankratio-slider"
        aria-label="時間（分）。マイナスは「〜分前」"
      />
      <p className="math-tankratio-note">
        スライダーを右（未来）に動かしても、Aの水はBの4倍にはならないよ。マイナス側（過去）に動かして、いつ4倍だったか探してみよう。
      </p>
    </div>
  );
}
