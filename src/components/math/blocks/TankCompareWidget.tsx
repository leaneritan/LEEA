"use client";

import { useState } from "react";

const TANKS = [
  { label: "(1)", area: 30 },
  { label: "(2)", area: 20 },
  { label: "(3)", area: 10 }
];
const RATE = 15; // volume per minute (same for all tanks)
const MAX_H = 12; // cm, visualization cap
const MAX_T = 8;

export function TankCompareWidget() {
  const [t, setT] = useState(4);

  return (
    <div className="math-tankcmp">
      <div className="math-tankcmp-row">
        {TANKS.map((tank) => {
          const h = Math.min(MAX_H, (RATE * t) / tank.area);
          const widthPx = tank.area * 2.4;
          const fillPercent = (h / MAX_H) * 100;
          return (
            <div key={tank.label} className="math-tankcmp-col">
              <div className="math-tankcmp-tank" style={{ width: `${widthPx}px` }}>
                <div className="math-tankcmp-water" style={{ height: `${fillPercent}%` }} />
              </div>
              <p className="math-tankcmp-label">
                {tank.label} 底面積{tank.area}
              </p>
              <p className="math-tankcmp-depth">{h.toFixed(1)}cm</p>
            </div>
          );
        })}
      </div>

      <input
        type="range"
        min={0}
        max={MAX_T}
        step={0.5}
        value={t}
        onChange={(e) => setT(Number(e.target.value))}
        className="math-tankcmp-slider"
        aria-label="経過時間（分）"
      />
      <p className="math-tankcmp-note">
        3つの水そうに毎分同じ量の水を入れても、底面積が大きい(1)ほど深さの増え方はゆっくりで、底面積が小さい(3)ほど深さは速く増える（深さは底面積に反比例するとみなせるね）。
      </p>
    </div>
  );
}
