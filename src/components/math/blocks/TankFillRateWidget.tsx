"use client";

import { useState } from "react";

const RATE = 3; // cm per minute
const TARGET = 180; // cm
const MAX_X = 70;
const TUBE_H = 140;

export function TankFillRateWidget() {
  const [x, setX] = useState(10);

  const y = RATE * x;
  const filled = Math.min(y, TARGET);
  const heightPx = (filled / TARGET) * TUBE_H;
  const isFull = y >= TARGET;

  return (
    <div className="math-tankfill">
      <div className="math-tankfill-stage">
        <div className="math-tankfill-tube" style={{ height: TUBE_H }}>
          <div className="math-tankfill-water" style={{ height: `${heightPx}px` }} />
          <div className="math-tankfill-target" style={{ bottom: `${TUBE_H}px` }} />
        </div>
        <div className="math-tankfill-labels">
          <span>0cm</span>
          <span>180cm（満水）</span>
        </div>
      </div>

      <p className="math-tankfill-readout">
        x＝{x}分後：水の深さ y＝3×{x}＝<strong>{y}cm</strong>
        {isFull ? "　→　満水になった！" : ""}
      </p>

      <input
        type="range"
        min={0}
        max={MAX_X}
        step={1}
        value={x}
        onChange={(e) => setX(Number(e.target.value))}
        className="math-tankfill-slider"
        aria-label="時間（分）"
      />
      <p className="math-tankfill-note">1分ごとに3cmずつ水がたまるよ。何分後に満水（180cm）になるか、スライダーで確かめてみよう。</p>
    </div>
  );
}
