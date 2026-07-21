"use client";

import { useState } from "react";

type Mode = "fixedCount" | "fixedLength";

const PHOTO_COUNT = 50;
const SONG_LENGTH = 200;

function mmss(totalSeconds: number) {
  const s = Math.round(totalSeconds);
  const m = Math.floor(s / 60);
  const rem = s % 60;
  return `${m}分${rem}秒`;
}

export function SlideshowRelationWidget() {
  const [mode, setMode] = useState<Mode>("fixedCount");
  const [b, setB] = useState(4);

  const a = PHOTO_COUNT * b;
  const c = SONG_LENGTH / b;
  const barMax = mode === "fixedCount" ? PHOTO_COUNT * 10 : SONG_LENGTH / 1;
  const barValue = mode === "fixedCount" ? a : c;
  const barPercent = Math.min(100, (barValue / barMax) * 100);

  return (
    <div className="math-slideshow">
      <div className="math-slideshow-tabs">
        <button
          type="button"
          className={`math-slideshow-tab${mode === "fixedCount" ? " math-slideshow-tab--active" : ""}`}
          onClick={() => {
            setMode("fixedCount");
            setB(4);
          }}
        >
          写真の枚数を50枚に固定
        </button>
        <button
          type="button"
          className={`math-slideshow-tab${mode === "fixedLength" ? " math-slideshow-tab--active" : ""}`}
          onClick={() => {
            setMode("fixedLength");
            setB(4);
          }}
        >
          曲の長さを200秒に固定
        </button>
      </div>

      <div className="math-slideshow-controls">
        <button type="button" onClick={() => setB((v) => Math.max(1, v - 1))} aria-label="1枚の時間を短くする">
          －
        </button>
        <span>1枚の時間＝{b}秒</span>
        <button type="button" onClick={() => setB((v) => Math.min(10, v + 1))} aria-label="1枚の時間を長くする">
          ＋
        </button>
      </div>

      <div className="math-slideshow-bar-track">
        <div className="math-slideshow-bar-fill" style={{ width: `${barPercent}%` }} />
      </div>

      {mode === "fixedCount" ? (
        <>
          <p className="math-slideshow-eq">
            曲の長さ＝50×{b}＝<strong>{a}秒</strong>（{mmss(a)}）
          </p>
          <p className="math-slideshow-verdict">1枚の時間Bを2倍にすると、曲の長さAも2倍になる（Aは Bに比例する）。</p>
        </>
      ) : (
        <>
          <p className="math-slideshow-eq">
            写真の枚数＝200÷{b}＝<strong>約{c.toFixed(1)}枚</strong>
          </p>
          <p className="math-slideshow-verdict">1枚の時間Bを2倍にすると、写真の枚数Cは1/2倍になる（Cは Bに反比例する）。</p>
        </>
      )}

      <p className="math-slideshow-note">曲の長さをA秒、1枚の時間をB秒、写真の枚数をC枚とすると、A＝BCが成り立つ。1つを決まった数にすると、残り2つの関係は比例したり反比例したりするね。</p>
    </div>
  );
}
