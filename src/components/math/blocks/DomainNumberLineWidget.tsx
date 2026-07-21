"use client";

import { useState } from "react";

type Preset = {
  label: string;
  varName: string;
  lower: number | null;
  lowerOpen: boolean;
  upper: number | null;
  upperOpen: boolean;
  notation: string;
};

const PRESETS: Preset[] = [
  { label: "水そうの深さ", varName: "x", lower: 0, lowerOpen: false, upper: 60, upperOpen: false, notation: "0≦x≦60" },
  { label: "xが4未満", varName: "x", lower: null, lowerOpen: false, upper: 4, upperOpen: true, notation: "x＜4" },
  { label: "問1", varName: "x", lower: 0, lowerOpen: true, upper: 5, upperOpen: false, notation: "0＜x≦5" },
  { label: "問2", varName: "y", lower: 0, lowerOpen: false, upper: 180, upperOpen: false, notation: "0≦y≦180" }
];

function toSvgX(v: number, dispMin: number, dispMax: number) {
  return 20 + ((v - dispMin) / (dispMax - dispMin)) * 260;
}

export function DomainNumberLineWidget() {
  const [index, setIndex] = useState(0);
  const preset = PRESETS[index];

  const finiteVals = [preset.lower, preset.upper].filter((v): v is number => v !== null);
  const span = finiteVals.length === 2 ? finiteVals[1] - finiteVals[0] : Math.max(...finiteVals, 1);
  const pad = Math.max(span * 0.35, 1);
  const dispMin = preset.lower !== null ? preset.lower - pad : (preset.upper as number) - span - pad;
  const dispMax = preset.upper !== null ? preset.upper + pad : (preset.lower as number) + span + pad;

  const lineStartX = preset.lower !== null ? toSvgX(preset.lower, dispMin, dispMax) : toSvgX(dispMin, dispMin, dispMax);
  const lineEndX = preset.upper !== null ? toSvgX(preset.upper, dispMin, dispMax) : toSvgX(dispMax, dispMin, dispMax);

  return (
    <div className="math-domainline">
      <div className="math-domainline-presets">
        {PRESETS.map((p, i) => (
          <button
            key={p.label}
            type="button"
            className={`math-domainline-preset${i === index ? " math-domainline-preset--active" : ""}`}
            onClick={() => setIndex(i)}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="math-domainline-stage">
        <svg viewBox="0 0 300 80" className="math-domainline-svg">
          <line x1={20} y1={40} x2={280} y2={40} stroke="#c9bd9e" strokeWidth={1.5} />
          {preset.lower === null ? (
            <polygon points={`${lineStartX - 8},40 ${lineStartX},35 ${lineStartX},45`} fill="var(--m-accent)" />
          ) : null}
          {preset.upper === null ? (
            <polygon points={`${lineEndX + 8},40 ${lineEndX},35 ${lineEndX},45`} fill="var(--m-accent)" />
          ) : null}
          <line x1={lineStartX} y1={40} x2={lineEndX} y2={40} stroke="var(--m-accent)" strokeWidth={4} />
          {preset.lower !== null ? (
            <>
              <circle
                cx={toSvgX(preset.lower, dispMin, dispMax)}
                cy={40}
                r={6}
                fill={preset.lowerOpen ? "#fff" : "var(--m-accent)"}
                stroke="var(--m-accent)"
                strokeWidth={2.5}
              />
              <text x={toSvgX(preset.lower, dispMin, dispMax)} y={62} fontSize={12} fontWeight={900} textAnchor="middle">
                {preset.lower}
              </text>
            </>
          ) : null}
          {preset.upper !== null ? (
            <>
              <circle
                cx={toSvgX(preset.upper, dispMin, dispMax)}
                cy={40}
                r={6}
                fill={preset.upperOpen ? "#fff" : "var(--m-accent)"}
                stroke="var(--m-accent)"
                strokeWidth={2.5}
              />
              <text x={toSvgX(preset.upper, dispMin, dispMax)} y={62} fontSize={12} fontWeight={900} textAnchor="middle">
                {preset.upper}
              </text>
            </>
          ) : null}
        </svg>
      </div>

      <p className="math-domainline-eq">
        {preset.varName}の変域：<strong>{preset.notation}</strong>
      </p>
      <p className="math-domainline-note">●（ぬりつぶし）はその数をふくむ、○（白ぬき）はその数をふくまない、という意味だよ。</p>
    </div>
  );
}
