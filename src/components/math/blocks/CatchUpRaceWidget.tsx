"use client";

import { useState } from "react";

const BROTHER_RATE = 50; // 弟, 分速50m, departs at t=0
const OLDER_RATE = 70; // 兄, 分速70m, departs at t=4
const HEAD_START = 4;
const MAX_T = 15;
const MAX_D = 800;

const GRAPH_W = 260;
const GRAPH_H = 160;

function tx(t: number) {
  return (t / MAX_T) * GRAPH_W;
}
function dy(d: number) {
  return GRAPH_H - (d / MAX_D) * GRAPH_H;
}

export function CatchUpRaceWidget() {
  const [t, setT] = useState(0);

  const brotherD = BROTHER_RATE * t;
  const olderD = t >= HEAD_START ? OLDER_RATE * (t - HEAD_START) : null;
  const caughtUp = olderD !== null && olderD >= brotherD;

  const brotherPoints = `0,${dy(0)} ${tx(t)},${dy(brotherD)}`;
  const olderPoints = t >= HEAD_START ? `${tx(HEAD_START)},${dy(0)} ${tx(t)},${dy(olderD ?? 0)}` : "";

  return (
    <div className="math-catchup">
      <div className="math-catchup-track">
        <div className="math-catchup-lane">
          <span className="math-catchup-tag">弟</span>
          <div className="math-catchup-bar">
            <span className="math-catchup-dot math-catchup-dot--sib" style={{ left: `${Math.min(100, (brotherD / MAX_D) * 100)}%` }} />
          </div>
        </div>
        <div className="math-catchup-lane">
          <span className="math-catchup-tag">兄</span>
          <div className="math-catchup-bar">
            {olderD !== null ? (
              <span
                className="math-catchup-dot math-catchup-dot--older"
                style={{ left: `${Math.min(100, (olderD / MAX_D) * 100)}%` }}
              />
            ) : null}
          </div>
        </div>
      </div>

      <p className="math-catchup-readout">
        {t}分後：弟は{brotherD}m地点、兄は{olderD !== null ? `${olderD}m地点` : "まだ出発していない"}
        {caughtUp ? "　→　追いついた！" : ""}
      </p>

      <input
        type="range"
        min={0}
        max={MAX_T}
        step={1}
        value={t}
        onChange={(e) => setT(Number(e.target.value))}
        className="math-catchup-slider"
        aria-label="時間（分）"
      />

      <svg viewBox={`0 0 ${GRAPH_W + 30} ${GRAPH_H + 30}`} className="math-catchup-graph">
        <g transform="translate(24,4)">
          <line x1={0} y1={GRAPH_H} x2={GRAPH_W} y2={GRAPH_H} stroke="#a08e6c" strokeWidth={1.5} />
          <line x1={0} y1={0} x2={0} y2={GRAPH_H} stroke="#a08e6c" strokeWidth={1.5} />
          <polyline points={brotherPoints} fill="none" stroke="var(--m-accent)" strokeWidth={2.5} />
          {olderPoints ? <polyline points={olderPoints} fill="none" stroke="#3a6ea8" strokeWidth={2.5} /> : null}
          <circle cx={10} cy={dy(700)} r={2.5} fill="#8a7a5c" />
          <text x={14} y={dy(700) + 3} fontSize={8} fill="#8a7a5c">
            700
          </text>
          <text x={GRAPH_W - 10} y={GRAPH_H + 12} fontSize={9} fill="#6d5f47">
            分
          </text>
          <text x={-16} y={8} fontSize={9} fill="#6d5f47">
            m
          </text>
        </g>
      </svg>
      <p className="math-catchup-legend">
        <span className="math-catchup-swatch math-catchup-swatch--sib" />弟のグラフ
        <span className="math-catchup-swatch math-catchup-swatch--older" />兄のグラフ（2本の線が交わるところが「追いつく」瞬間）
      </p>
    </div>
  );
}
