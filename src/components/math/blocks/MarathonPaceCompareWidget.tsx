"use client";

import { useState } from "react";

const MAX_DISTANCE = 9000;
const MAX_TIME = 80;
const TARGET_PRESETS = [2000, 4000, 6000, 8000];

export function MarathonPaceCompareWidget() {
  const [speedLead, setSpeedLead] = useState(250);
  const [speedLast, setSpeedLast] = useState(130);
  const [t, setT] = useState(20);
  const [target, setTarget] = useState(6000);

  const distLead = Math.min(MAX_DISTANCE, speedLead * t);
  const distLast = Math.min(MAX_DISTANCE, speedLast * t);
  const gapNow = distLead - distLast;

  const tLeadAtTarget = target / speedLead;
  const tLastAtTarget = target / speedLast;
  const gapTimeAtTarget = tLastAtTarget - tLeadAtTarget;

  return (
    <div className="math-marathon">
      <div className="math-marathon-speeds">
        <label className="math-marathon-speed-row">
          <span>先頭の選手：{speedLead}m/分</span>
          <input
            type="range"
            min={100}
            max={400}
            step={10}
            value={speedLead}
            onChange={(e) => setSpeedLead(Number(e.target.value))}
            className="math-marathon-slider math-marathon-slider--lead"
          />
        </label>
        <label className="math-marathon-speed-row">
          <span>最後の選手：{speedLast}m/分</span>
          <input
            type="range"
            min={50}
            max={250}
            step={10}
            value={speedLast}
            onChange={(e) => setSpeedLast(Number(e.target.value))}
            className="math-marathon-slider math-marathon-slider--last"
          />
        </label>
      </div>

      <div className="math-marathon-track">
        <div className="math-marathon-lane">
          <span className="math-marathon-lane-label">先頭</span>
          <div className="math-marathon-lane-bar">
            <div className="math-marathon-marker math-marathon-marker--lead" style={{ left: `${(distLead / MAX_DISTANCE) * 100}%` }} />
          </div>
        </div>
        <div className="math-marathon-lane">
          <span className="math-marathon-lane-label">最後</span>
          <div className="math-marathon-lane-bar">
            <div className="math-marathon-marker math-marathon-marker--last" style={{ left: `${(distLast / MAX_DISTANCE) * 100}%` }} />
          </div>
        </div>
      </div>

      <p className="math-marathon-readout">
        {t}分後：先頭 {Math.round(distLead)}m　最後 {Math.round(distLast)}m　差 約{Math.round(gapNow)}m
      </p>
      <input
        type="range"
        min={0}
        max={MAX_TIME}
        step={1}
        value={t}
        onChange={(e) => setT(Number(e.target.value))}
        className="math-marathon-slider math-marathon-slider--time"
        aria-label="スタートからの時間（分）"
      />

      <div className="math-marathon-target">
        <p className="math-marathon-target-q">スタートから何m地点で比べる？</p>
        <div className="math-marathon-target-presets">
          {TARGET_PRESETS.map((d) => (
            <button
              key={d}
              type="button"
              className={`math-marathon-preset${target === d ? " math-marathon-preset--active" : ""}`}
              onClick={() => setTarget(d)}
            >
              {d}m
            </button>
          ))}
        </div>
        <p className="math-marathon-eq">
          {target}m地点：先頭が通過してから約<strong>{gapTimeAtTarget.toFixed(1)}分後</strong>に最後の選手が通過する。
        </p>
      </div>

      <p className="math-marathon-note">2人とも一定の速さで走ると比例とみなすと、速さのちがいから、どの地点でも「差」を予想できるね。</p>
    </div>
  );
}
