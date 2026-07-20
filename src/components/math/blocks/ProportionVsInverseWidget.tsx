"use client";

import { useState } from "react";

type Mode = "proportion" | "inverse";

const UNIT = 16; // px per cm
const HEIGHT_FIXED = 4; // for proportion mode
const AREA_FIXED = 18; // for inverse mode

export function ProportionVsInverseWidget() {
  const [mode, setMode] = useState<Mode>("proportion");
  const [width, setWidth] = useState(3);

  const height = mode === "proportion" ? HEIGHT_FIXED : AREA_FIXED / width;
  const area = mode === "proportion" ? HEIGHT_FIXED * width : AREA_FIXED;

  return (
    <div className="math-propinv">
      <div className="math-propinv-tabs">
        <button
          type="button"
          className={`math-propinv-tab${mode === "proportion" ? " math-propinv-tab--active" : ""}`}
          onClick={() => {
            setMode("proportion");
            setWidth(3);
          }}
        >
          比例（高さ一定）
        </button>
        <button
          type="button"
          className={`math-propinv-tab${mode === "inverse" ? " math-propinv-tab--active" : ""}`}
          onClick={() => {
            setMode("inverse");
            setWidth(3);
          }}
        >
          反比例（面積一定）
        </button>
      </div>

      <div className="math-propinv-stage">
        <svg viewBox={`0 0 ${20 * UNIT} ${10 * UNIT}`} className="math-propinv-svg">
          <rect
            x={10}
            y={10}
            width={width * UNIT}
            height={Math.min(height, 9) * UNIT}
            fill="var(--m-accent)"
            fillOpacity={0.35}
            stroke="var(--m-accent)"
            strokeWidth={2}
          />
          <text x={10 + (width * UNIT) / 2} y={10 + Math.min(height, 9) * UNIT + 16} textAnchor="middle" fontSize={12} fontWeight={900}>
            x＝{width}cm
          </text>
          <text x={10 + width * UNIT + 8} y={10 + (Math.min(height, 9) * UNIT) / 2 + 4} fontSize={12} fontWeight={900}>
            y＝{Math.round(height * 100) / 100}cm
          </text>
        </svg>
      </div>

      <div className="math-propinv-controls">
        <button type="button" onClick={() => setWidth((w) => Math.max(1, w - 1))} aria-label="xを1cmへらす">
          －
        </button>
        <span>x＝{width}cm</span>
        <button type="button" onClick={() => setWidth((w) => Math.min(mode === "proportion" ? 9 : 18, w + 1))} aria-label="xを1cmふやす">
          ＋
        </button>
      </div>

      {mode === "proportion" ? (
        <p className="math-propinv-eq">
          y＝4×x（高さ4cm固定）　面積＝<strong>{area}cm²</strong>
        </p>
      ) : (
        <p className="math-propinv-eq">
          y＝18÷x（面積18cm²固定）　高さ＝<strong>{Math.round(height * 100) / 100}cm</strong>
        </p>
      )}
      <p className="math-propinv-note">
        {mode === "proportion"
          ? "xを大きくすると、yも同じ割合で大きくなるね（比例）。"
          : "xを大きくすると、面積が変わらないようにyは小さくなるね（反比例）。"}
      </p>
    </div>
  );
}
