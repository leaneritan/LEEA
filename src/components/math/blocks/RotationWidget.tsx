"use client";

import { useState } from "react";

type Dir = "ccw" | "cw";

const OX = 40;
const OY = 260;
const UNIT = 22;
const O = [5, 5] as const;
const TRI = { A: [5, 8.5], B: [7.5, 6], C: [3, 4] } as const;

function toSvg([x, y]: readonly [number, number]) {
  return [OX + x * UNIT, OY - y * UNIT] as const;
}
function rotate([x, y]: readonly [number, number], deg: number, dir: Dir): [number, number] {
  const theta = ((dir === "ccw" ? 1 : -1) * deg * Math.PI) / 180;
  const dx = x - O[0];
  const dy = y - O[1];
  return [O[0] + dx * Math.cos(theta) - dy * Math.sin(theta), O[1] + dx * Math.sin(theta) + dy * Math.cos(theta)];
}

export function RotationWidget() {
  const [deg, setDeg] = useState(120);
  const [dir, setDir] = useState<Dir>("ccw");

  const orig = { A: toSvg(TRI.A), B: toSvg(TRI.B), C: toSvg(TRI.C) };
  const rot = {
    A: toSvg(rotate(TRI.A, deg, dir)),
    B: toSvg(rotate(TRI.B, deg, dir)),
    C: toSvg(rotate(TRI.C, deg, dir))
  };
  const oSvg = toSvg(O);

  const origPts = `${orig.A.join(",")} ${orig.B.join(",")} ${orig.C.join(",")}`;
  const rotPts = `${rot.A.join(",")} ${rot.B.join(",")} ${rot.C.join(",")}`;

  const r = 1.3 * UNIT;
  const startAngle = Math.atan2(-(orig.A[1] - oSvg[1]), orig.A[0] - oSvg[0]);
  const thetaRad = ((dir === "ccw" ? 1 : -1) * deg * Math.PI) / 180;
  const endAngle = startAngle + thetaRad;
  const arcStart = [oSvg[0] + r * Math.cos(startAngle), oSvg[1] - r * Math.sin(startAngle)];
  const arcEnd = [oSvg[0] + r * Math.cos(endAngle), oSvg[1] - r * Math.sin(endAngle)];
  const largeArc = deg > 180 ? 1 : 0;
  const sweep = dir === "ccw" ? 0 : 1;

  const gridLines = [];
  for (let i = 0; i <= 10; i++) {
    gridLines.push(<line key={`v${i}`} x1={OX + i * UNIT} y1={OY - 220} x2={OX + i * UNIT} y2={OY} stroke="#efe6d3" strokeWidth={1} />);
    gridLines.push(<line key={`h${i}`} x1={OX} y1={OY - i * UNIT} x2={OX + 220} y2={OY - i * UNIT} stroke="#efe6d3" strokeWidth={1} />);
  }

  return (
    <div className="math-transform">
      <div className="math-transform-stage">
        <svg viewBox="0 0 300 300" className="math-transform-svg">
          {gridLines}
          <line x1={oSvg[0]} y1={oSvg[1]} x2={orig.A[0]} y2={orig.A[1]} stroke="#c9bd9e" strokeWidth={1} strokeDasharray="3 3" />
          <line x1={oSvg[0]} y1={oSvg[1]} x2={rot.A[0]} y2={rot.A[1]} stroke="#c9bd9e" strokeWidth={1} strokeDasharray="3 3" />
          <path d={`M ${arcStart[0]},${arcStart[1]} A ${r},${r} 0 ${largeArc} ${sweep} ${arcEnd[0]},${arcEnd[1]}`} fill="none" stroke="#d6486e" strokeWidth={1.5} />
          <polygon points={origPts} fill="none" stroke="var(--m-accent)" strokeWidth={2} />
          <polygon points={rotPts} fill="#3a6ea8" fillOpacity={0.3} stroke="#3a6ea8" strokeWidth={2} />
          <circle cx={oSvg[0]} cy={oSvg[1]} r={4} fill="#6d5f47" />
          <text x={oSvg[0] + 6} y={oSvg[1] + 14} fontSize={11} fontWeight={900} fill="#6d5f47">
            O
          </text>
          <text x={orig.A[0] - 4} y={orig.A[1] - 8} fontSize={12} fontWeight={900}>
            A
          </text>
          <text x={orig.B[0] - 16} y={orig.B[1] + 4} fontSize={12} fontWeight={900}>
            B
          </text>
          <text x={orig.C[0] + 8} y={orig.C[1] + 4} fontSize={12} fontWeight={900}>
            C
          </text>
          <text x={rot.A[0] + 6} y={rot.A[1] - 6} fontSize={12} fontWeight={900} fill="#3a6ea8">
            A′
          </text>
          <text x={rot.B[0] - 18} y={rot.B[1] + 4} fontSize={12} fontWeight={900} fill="#3a6ea8">
            B′
          </text>
          <text x={rot.C[0] + 8} y={rot.C[1] + 4} fontSize={12} fontWeight={900} fill="#3a6ea8">
            C′
          </text>
        </svg>
      </div>

      <div className="math-transform-tabs">
        <button type="button" className={`math-transform-tab${dir === "ccw" ? " math-transform-tab--active" : ""}`} onClick={() => setDir("ccw")}>
          反時計回り
        </button>
        <button type="button" className={`math-transform-tab${dir === "cw" ? " math-transform-tab--active" : ""}`} onClick={() => setDir("cw")}>
          時計回り
        </button>
      </div>

      <label className="math-transform-slider-row">
        <span>回転の角度：{deg}°</span>
        <input type="range" min={0} max={330} step={30} value={deg} onChange={(e) => setDeg(Number(e.target.value))} className="math-transform-range" />
      </label>

      <p className="math-transform-note">
        点Oを中心として△ABCを{dir === "ccw" ? "反時計回り" : "時計回り"}に{deg}°だけ回転移動させると△A′B′C′になる。OA＝OA′、OB＝OB′、OC＝OC′で、∠AOA′＝∠BOB′＝∠COC′＝{deg}°だね。
      </p>
    </div>
  );
}
