"use client";

import { useState } from "react";

type Mode = "square" | "rectangle";

const UNIT = 14;
const SAMPLE_WIDTHS = [2, 5, 8];

export function FunctionCheckWidget() {
  const [mode, setMode] = useState<Mode>("square");
  const [size, setSize] = useState(4);

  return (
    <div className="math-funccheck">
      <div className="math-funccheck-tabs">
        <button type="button" className={`math-funccheck-tab${mode === "square" ? " math-funccheck-tab--active" : ""}`} onClick={() => setMode("square")}>
          正方形
        </button>
        <button
          type="button"
          className={`math-funccheck-tab${mode === "rectangle" ? " math-funccheck-tab--active" : ""}`}
          onClick={() => setMode("rectangle")}
        >
          長方形（縦だけ決める）
        </button>
      </div>

      {mode === "square" ? (
        <div className="math-funccheck-panel">
          <svg viewBox="0 0 140 140" className="math-funccheck-svg">
            <rect x={10} y={10} width={size * UNIT} height={size * UNIT} fill="var(--m-accent)" fillOpacity={0.35} stroke="var(--m-accent)" strokeWidth={2} />
          </svg>
          <div className="math-funccheck-controls">
            <button type="button" onClick={() => setSize((s) => Math.max(1, s - 1))} aria-label="1辺を短くする">
              －
            </button>
            <span>1辺＝{size}cm</span>
            <button type="button" onClick={() => setSize((s) => Math.min(8, s + 1))} aria-label="1辺を長くする">
              ＋
            </button>
          </div>
          <p className="math-funccheck-eq">
            面積＝{size}×{size}＝<strong>{size * size}cm²</strong>（いつでもただ1つに決まる）
          </p>
          <p className="math-funccheck-verdict math-funccheck-verdict--yes">1辺の長さを決めると、面積はただ1つに決まる → 面積は1辺の長さの関数である。</p>
        </div>
      ) : (
        <div className="math-funccheck-panel">
          <div className="math-funccheck-multi">
            {SAMPLE_WIDTHS.map((w) => (
              <svg key={w} viewBox="0 0 140 90" className="math-funccheck-svg-sm">
                <rect x={10} y={10} width={w * UNIT} height={size * 6} fill="#3a6ea8" fillOpacity={0.3} stroke="#3a6ea8" strokeWidth={2} />
                <text x={10} y={10 + size * 6 + 16} fontSize={11} fontWeight={700}>
                  横{w}cm × 縦{size}cm ＝ {w * size}cm²
                </text>
              </svg>
            ))}
          </div>
          <div className="math-funccheck-controls">
            <button type="button" onClick={() => setSize((s) => Math.max(1, s - 1))} aria-label="縦を短くする">
              －
            </button>
            <span>縦＝{size}cm（横は自由）</span>
            <button type="button" onClick={() => setSize((s) => Math.min(6, s + 1))} aria-label="縦を長くする">
              ＋
            </button>
          </div>
          <p className="math-funccheck-verdict math-funccheck-verdict--no">
            縦を{size}cmに決めても、横がわからないと面積は決まらない → 面積は縦の長さだけの関数ではない。
          </p>
        </div>
      )}
    </div>
  );
}
