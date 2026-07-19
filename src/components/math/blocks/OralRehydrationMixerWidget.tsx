"use client";

import { useState } from "react";

const BASE_WATER = 1000;
const BASE_SUGAR = 40;
const BASE_SALT = 3;
const MAX_SUGAR = 80;

function round1(n: number) {
  return Math.round(n * 10) / 10;
}

export function OralRehydrationMixerWidget() {
  const [sugar, setSugar] = useState(12);

  const water = round1((sugar * BASE_WATER) / BASE_SUGAR);
  const salt = round1((sugar * BASE_SALT) / BASE_SUGAR);

  const rows = [
    { label: "水", value: water, unit: "g", max: (MAX_SUGAR * BASE_WATER) / BASE_SUGAR, className: "water" },
    { label: "砂糖", value: sugar, unit: "g", max: MAX_SUGAR, className: "sugar" },
    { label: "塩", value: salt, unit: "g", max: (MAX_SUGAR * BASE_SALT) / BASE_SUGAR, className: "salt" }
  ];

  return (
    <div className="math-oralmix">
      <div className="math-oralmix-bars">
        {rows.map((row) => (
          <div className="math-oralmix-row" key={row.label}>
            <span className="math-oralmix-label">{row.label}</span>
            <div className="math-oralmix-track">
              <div className={`math-oralmix-fill math-oralmix-fill--${row.className}`} style={{ width: `${(row.value / row.max) * 100}%` }} />
            </div>
            <span className="math-oralmix-value">
              {row.value}
              {row.unit}
            </span>
          </div>
        ))}
      </div>

      <input
        type="range"
        min={0}
        max={MAX_SUGAR}
        step={1}
        value={sugar}
        onChange={(e) => setSugar(Number(e.target.value))}
        className="math-oralmix-slider"
        aria-label="砂糖の量"
      />
      <p className="math-oralmix-note">
        砂糖の量をスライダーで変えると、水1000:砂糖40:塩3の比を保ったまま、水と塩の量が自動で計算されるよ。砂糖を12gにすると、水と塩がそれぞれ何gになるか確かめてみよう。
      </p>
    </div>
  );
}
