"use client";

import { useState } from "react";

const CX = 150;
const CY = 150;
const R = 110;

function vertex(k: number): [number, number] {
  const angle = (-90 + k * 60) * (Math.PI / 180);
  return [CX + R * Math.cos(angle), CY + R * Math.sin(angle)];
}
function mid(a: [number, number], b: [number, number]): [number, number] {
  return [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
}
function lerp(a: [number, number], b: [number, number], t: number): [number, number] {
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
}
function rotateAround(p: [number, number], k: number): [number, number] {
  const theta = (k * 60 * Math.PI) / 180;
  const dx = p[0] - CX;
  const dy = p[1] - CY;
  return [CX + dx * Math.cos(theta) - dy * Math.sin(theta), CY + dx * Math.sin(theta) + dy * Math.cos(theta)];
}

const VERTICES = Array.from({ length: 6 }, (_, k) => vertex(k));
const O: [number, number] = [CX, CY];

type Preset = { label: string; segments: [[number, number], [number, number]][] };

function buildPresets(): Preset[] {
  const V0 = VERTICES[0];
  const V1 = VERTICES[1];
  return [
    { label: "三角形", segments: [[V0, mid(O, V1)]] },
    { label: "放射", segments: [[O, mid(V0, V1)]] },
    {
      label: "ジグザグ",
      segments: [
        [O, lerp(O, V0, 0.55)],
        [lerp(O, V0, 0.55), mid(V0, V1)]
      ]
    }
  ];
}
const PRESETS = buildPresets();

export function HexTessellationWidget() {
  const [presetIndex, setPresetIndex] = useState(0);
  const preset = PRESETS[presetIndex];

  return (
    <div className="math-hextess">
      <div className="math-hextess-stage">
        <svg viewBox="0 0 300 300" className="math-hextess-svg">
          <polygon points={VERTICES.map((v) => v.join(",")).join(" ")} fill="none" stroke="#c9bd9e" strokeWidth={1.5} />
          {VERTICES.map((v, i) => (
            <line key={`spoke${i}`} x1={CX} y1={CY} x2={v[0]} y2={v[1]} stroke="#efe6d3" strokeWidth={1} />
          ))}
          {Array.from({ length: 6 }, (_, k) => (
            <g key={k}>
              {preset.segments.map((seg, i) => {
                const p1 = rotateAround(seg[0], k);
                const p2 = rotateAround(seg[1], k);
                return <line key={i} x1={p1[0]} y1={p1[1]} x2={p2[0]} y2={p2[1]} stroke={k === 0 ? "#d6486e" : "var(--m-accent)"} strokeWidth={2.5} />;
              })}
            </g>
          ))}
        </svg>
      </div>

      <div className="math-hextess-tabs">
        {PRESETS.map((p, i) => (
          <button key={p.label} type="button" className={`math-hextess-tab${i === presetIndex ? " math-hextess-tab--active" : ""}`} onClick={() => setPresetIndex(i)}>
            {p.label}
          </button>
        ))}
      </div>

      <p className="math-hextess-note">
        赤い線が「もとになる図形」。それを回転の中心（六角形の中心）のまわりに60°ずつ回転移動させて5回くり返すと、正六角形の中がしきつめ模様でうまるね。
      </p>
    </div>
  );
}
