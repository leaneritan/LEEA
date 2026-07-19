"use client";

import { useState } from "react";

const LOOP_KM = 5;
const SPEED_A = 15; // km/h, clockwise
const SPEED_B = 10; // km/h, counter-clockwise
const MAX_T = 15; // minutes
const CX = 90;
const CY = 90;
const R = 70;

function pointOnCircle(deg: number) {
  const rad = (deg - 90) * (Math.PI / 180);
  return { x: CX + R * Math.cos(rad), y: CY + R * Math.sin(rad) };
}

export function LoopMeetingWidget() {
  const [t, setT] = useState(0);

  const distA = (SPEED_A * t) / 60;
  const distB = (SPEED_B * t) / 60;
  const combined = distA + distB;
  const met = combined >= LOOP_KM;

  const angleA = ((distA / LOOP_KM) * 360) % 360;
  const angleB = (-(distB / LOOP_KM) * 360) % 360;
  const posA = pointOnCircle(angleA);
  const posB = pointOnCircle(angleB);

  return (
    <div className="math-loopmeet">
      <svg viewBox="0 0 180 180" className="math-loopmeet-svg">
        <circle cx={CX} cy={CY} r={R} fill="none" stroke="#e8d9bc" strokeWidth={3} />
        <circle cx={CX} cy={CY - R} r={4} fill="#8a7a5c" />
        <circle cx={posA.x} cy={posA.y} r={7} fill="var(--m-accent)" />
        <circle cx={posB.x} cy={posB.y} r={7} fill="#3a6ea8" />
      </svg>

      <p className="math-loopmeet-readout">
        {t}分後：Aさんは{distA.toFixed(2)}km、Bさんは{distB.toFixed(2)}km進んだ（合計{combined.toFixed(2)}km）
        {met ? "　→　出会った！" : ""}
      </p>

      <input
        type="range"
        min={0}
        max={MAX_T}
        step={0.5}
        value={t}
        onChange={(e) => setT(Number(e.target.value))}
        className="math-loopmeet-slider"
        aria-label="時間（分）"
      />

      <p className="math-loopmeet-legend">
        <span className="math-loopmeet-swatch math-loopmeet-swatch--a" />Aさん（時速15km・右回り）
        <span className="math-loopmeet-swatch math-loopmeet-swatch--b" />Bさん（時速10km・左回り）
      </p>
      <p className="math-loopmeet-note">2人の進んだ道のりの合計が、1周の5kmになったときに出会うよ。</p>
    </div>
  );
}
