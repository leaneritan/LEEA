"use client";

import { useState } from "react";

const PLAYERS = [
  { label: "A", height: 180 },
  { label: "B", height: 177 },
  { label: "C", height: 167 },
  { label: "D", height: 176 },
  { label: "E", height: 178 },
  { label: "F", height: 172 }
];

const TOTAL = PLAYERS.reduce((sum, p) => sum + p.height, 0);
const TRUE_AVG = TOTAL / PLAYERS.length; // 175

function formatSigned(value: number) {
  if (value === 0) return "0";
  return value > 0 ? `＋${value}` : `－${Math.abs(value)}`;
}

export function AverageBaselineWidget() {
  const [baseline, setBaseline] = useState(177);

  const deviations = PLAYERS.map((p) => p.height - baseline);
  const devSum = deviations.reduce((s, d) => s + d, 0);
  const devAvg = devSum / PLAYERS.length;
  const average = baseline + devAvg;

  function step(delta: number) {
    setBaseline((current) => Math.max(140, Math.min(190, current + delta)));
  }

  return (
    <div className="math-avgbase">
      <div className="math-avgbase-players">
        {PLAYERS.map((p, i) => (
          <div className="math-avgbase-player" key={p.label}>
            <span className="math-avgbase-name">{p.label}さん</span>
            <span className="math-avgbase-height">{p.height}</span>
            <span className={`math-avgbase-dev${deviations[i] > 0 ? " math-avgbase-dev--pos" : deviations[i] < 0 ? " math-avgbase-dev--neg" : ""}`}>
              {formatSigned(deviations[i])}
            </span>
          </div>
        ))}
      </div>

      <div className="math-avgbase-controls">
        <span className="math-avgbase-ctl-label">基準</span>
        <div className="math-avgbase-stepper">
          <button type="button" onClick={() => step(-1)} aria-label="基準を1下げる">
            －
          </button>
          <span>{baseline}</span>
          <button type="button" onClick={() => step(1)} aria-label="基準を1上げる">
            ＋
          </button>
        </div>
        <button type="button" className="math-avgbase-preset" onClick={() => setBaseline(177)}>
          はるきさんの基準（177）
        </button>
        <button type="button" className="math-avgbase-preset" onClick={() => setBaseline(100)}>
          あおいさんの基準（100）
        </button>
      </div>

      <div className="math-avgbase-work">
        <p className="math-avgbase-line">
          差の合計 ＝ {deviations.map((d, i) => (i === 0 ? formatSigned(d) : ` ＋ (${formatSigned(d)})`))} ＝ <strong>{formatSigned(devSum)}</strong>
        </p>
        <p className="math-avgbase-line">
          差の平均 ＝ {formatSigned(devSum)} ÷ {PLAYERS.length} ＝ <strong>{formatSigned(devAvg)}</strong>
        </p>
        <p className="math-avgbase-result">
          平均 ＝ 基準 ＋ 差の平均 ＝ {baseline} ＋ ({formatSigned(devAvg)}) ＝ <strong>{average}cm</strong>
        </p>
      </div>

      <p className="math-avgbase-note">
        基準をどこに決めても、平均はいつも <strong>{TRUE_AVG}cm</strong> になります。基準との差（正負の数）が打ち消し合うので、大きな数のままたし算するより楽に計算できます。
      </p>
    </div>
  );
}
