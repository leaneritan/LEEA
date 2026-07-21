"use client";

import { useState } from "react";

const TOTAL = 20;
const RATE = 7 / 5; // people served per minute (7 people in 5 minutes)
const MAX_T = 15;

export function QueueWaitWidget() {
  const [t, setT] = useState(0);

  const served = Math.min(TOTAL, Math.round(RATE * t));
  const remaining = TOTAL - served;
  const minutesPerPerson = 5 / 7;

  let message = `あと${remaining}人`;
  if (remaining === 0) message = "あおいさんが買い終わった！";
  else if (remaining === 1) message = "つぎはあおいさんの番！";

  return (
    <div className="math-queue">
      <div className="math-queue-people">
        {Array.from({ length: TOTAL }, (_, i) => i + 1).map((pos) => {
          const isAoi = pos === TOTAL;
          const isServed = pos <= served;
          return (
            <div
              key={pos}
              className={`math-queue-person${isServed ? " math-queue-person--served" : ""}${isAoi ? " math-queue-person--aoi" : ""}`}
              title={isAoi ? "あおいさん" : `${pos}番目`}
            >
              {isAoi ? "あ" : pos}
            </div>
          );
        })}
      </div>

      <p className="math-queue-readout">
        経過時間 {t}分後 → 並んでいる人数 {remaining}人（あおいさんの位置：{remaining === 0 ? "－" : `${remaining}番目`}）
      </p>
      <p className="math-queue-message">{message}</p>

      <input
        type="range"
        min={0}
        max={MAX_T}
        step={0.5}
        value={t}
        onChange={(e) => setT(Number(e.target.value))}
        className="math-queue-slider"
        aria-label="経過時間（分）"
      />
      <p className="math-queue-note">
        並び始めてから5分後には20人 → 13人になっていた（7人が5分でお会計を終えた）ので、1人あたり約{minutesPerPerson.toFixed(2)}分と見積もり、待ち時間は並んでいる人数に比例するとみなしているよ。
      </p>
    </div>
  );
}
