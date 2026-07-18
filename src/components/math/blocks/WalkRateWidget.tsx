"use client";

import { useState } from "react";

function formatSigned(value: number) {
  return value >= 0 ? `＋${value}` : `－${Math.abs(value)}`;
}

export function WalkRateWidget() {
  const [rate, setRate] = useState(4);
  const [time, setTime] = useState(2);

  const position = rate * time;
  const direction = rate > 0 ? "東" : "西";
  const whenLabel = time > 0 ? "後" : "前";
  const timeAbs = Math.abs(time);

  return (
    <div className="math-walkrate">
      <div className="math-walkrate-controls">
        <div className="math-walkrate-group">
          <span className="math-walkrate-label">向き</span>
          <div className="math-walkrate-toggle">
            <button type="button" className={`math-walkrate-btn${rate === 4 ? " math-walkrate-btn--active" : ""}`} onClick={() => setRate(4)}>
              東へ時速4km
            </button>
            <button type="button" className={`math-walkrate-btn${rate === -4 ? " math-walkrate-btn--active" : ""}`} onClick={() => setRate(-4)}>
              西へ時速4km
            </button>
          </div>
        </div>
        <div className="math-walkrate-group">
          <span className="math-walkrate-label">いつ</span>
          <div className="math-walkrate-toggle">
            <button type="button" className={`math-walkrate-btn${time === 2 ? " math-walkrate-btn--active" : ""}`} onClick={() => setTime(2)}>
              2時間後
            </button>
            <button type="button" className={`math-walkrate-btn${time === -2 ? " math-walkrate-btn--active" : ""}`} onClick={() => setTime(-2)}>
              2時間前
            </button>
          </div>
        </div>
      </div>

      <div className="math-walkrate-line">
        <div className="math-walkrate-axis" />
        {[-8, -4, 0, 4, 8].map((tick) => (
          <div className="math-walkrate-tick" key={tick} style={{ left: `${((tick + 10) / 20) * 100}%` }}>
            <span />
            <em>{tick}</em>
          </div>
        ))}
        <div className="math-walkrate-marker" style={{ left: `${((position + 10) / 20) * 100}%` }} />
      </div>

      <p className="math-walkrate-eq">
        ({formatSigned(rate)}) × ({formatSigned(time)}) = <strong>{formatSigned(position)}</strong>
      </p>
      <p className="math-walkrate-note">
        {direction}へ時速{Math.abs(rate)}kmで歩いているとき、現在から{timeAbs}時間{whenLabel}の位置は、現在より{formatSigned(position)}kmの地点です。
      </p>
    </div>
  );
}
