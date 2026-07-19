"use client";

import { useState } from "react";

const RATIO_SAUCE = 2;
const RATIO_KETCHUP = 3;
const MAX_KETCHUP = 240;

export function RatioMixerWidget() {
  const [ketchup, setKetchup] = useState(120);

  const sauce = (ketchup * RATIO_SAUCE) / RATIO_KETCHUP;
  const maxBarWidth = 100; // percent, scaled against MAX_KETCHUP * RATIO_SAUCE/RATIO_KETCHUP roughly

  return (
    <div className="math-ratiomix">
      <div className="math-ratiomix-bars">
        <div className="math-ratiomix-bar-row">
          <span className="math-ratiomix-bar-label">ウスターソース</span>
          <div className="math-ratiomix-bar-track">
            <div
              className="math-ratiomix-bar-fill math-ratiomix-bar-fill--sauce"
              style={{ width: `${Math.min(100, (sauce / ((MAX_KETCHUP * RATIO_SAUCE) / RATIO_KETCHUP)) * maxBarWidth)}%` }}
            />
          </div>
          <span className="math-ratiomix-bar-value">{sauce}mL</span>
        </div>
        <div className="math-ratiomix-bar-row">
          <span className="math-ratiomix-bar-label">ケチャップ</span>
          <div className="math-ratiomix-bar-track">
            <div className="math-ratiomix-bar-fill math-ratiomix-bar-fill--ketchup" style={{ width: `${(ketchup / MAX_KETCHUP) * maxBarWidth}%` }} />
          </div>
          <span className="math-ratiomix-bar-value">{ketchup}mL</span>
        </div>
      </div>

      <input
        type="range"
        min={30}
        max={MAX_KETCHUP}
        step={30}
        value={ketchup}
        onChange={(e) => setKetchup(Number(e.target.value))}
        className="math-ratiomix-slider"
        aria-label="ケチャップの量"
      />

      <p className="math-ratiomix-eq">
        x : {ketchup} ＝ 2 : 3　→　x ＝ <strong>{sauce}</strong>（mL）
      </p>
      <p className="math-ratiomix-note">ケチャップの量をスライダーで変えても、ウスターソースとの比はいつも2:3のままだね。</p>
    </div>
  );
}
