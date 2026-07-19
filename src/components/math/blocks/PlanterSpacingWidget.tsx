"use client";

import { useState } from "react";

const COUNT = 10;
const WIDTH_CM = 50;
const TARGET_TOTAL = 2300;
const UNIT_PX = 20; // pixels representing WIDTH_CM, gaps scale relative to this

export function PlanterSpacingWidget() {
  const [gap, setGap] = useState(150);

  const total = WIDTH_CM * COUNT + gap * (COUNT - 1);
  const solved = total === TARGET_TOTAL;
  const gapPx = Math.round(UNIT_PX * (gap / WIDTH_CM));

  return (
    <div className="math-planter">
      <div className="math-planter-track">
        <div className="math-planter-row" style={{ gap: `${gapPx}px` }}>
          {[...Array(COUNT)].map((_, i) => (
            <span className="math-planter-pot" key={i} />
          ))}
        </div>
      </div>

      <div className="math-planter-controls">
        <span className="math-planter-label">間隔 x</span>
        <div className="math-planter-stepper">
          <button type="button" onClick={() => setGap((v) => Math.max(100, v - 10))} aria-label="間隔を10cmせまくする">
            －
          </button>
          <span>{gap}cm</span>
          <button type="button" onClick={() => setGap((v) => Math.min(300, v + 10))} aria-label="間隔を10cmひろげる">
            ＋
          </button>
        </div>
      </div>

      <p className="math-planter-eq">
        50×10＋(10－1)×{gap} ＝ <strong className={solved ? "math-planter-eq--solved" : ""}>{total}</strong>
        <span className="math-planter-target"> （目標：2300）</span>
      </p>
      <p className={`math-planter-feedback${solved ? " math-planter-feedback--solved" : ""}`}>
        {solved ? "ぴったり2300cmになった！間隔は200cmだね。" : "＋・－ボタンで間隔を調整して、2300cmにぴったり合わせてみよう。"}
      </p>
    </div>
  );
}
