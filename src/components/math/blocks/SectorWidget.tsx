"use client";

import { useState } from "react";

const OX = 150;
const OY = 150;
const UNIT = 15;
const R_CM = 6;

function toSvg(x: number, y: number) {
  return [OX + x * UNIT, OY - y * UNIT] as const;
}

function fmtPi(coefFraction: string) {
  return `${coefFraction}π`;
}

function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) {
    [a, b] = [b, a % b];
  }
  return a || 1;
}
function fracStr(num: number, den: number) {
  const g = gcd(num, den);
  num /= g;
  den /= g;
  if (den === 1) return `${num}`;
  return `${num}/${den}`;
}

export function SectorWidget() {
  const [angle, setAngle] = useState(120);

  const startDeg = 90;
  const endDeg = 90 - angle;
  const startRad = (startDeg * Math.PI) / 180;
  const endRad = (endDeg * Math.PI) / 180;

  const start = toSvg(R_CM * Math.cos(startRad), R_CM * Math.sin(startRad));
  const end = toSvg(R_CM * Math.cos(endRad), R_CM * Math.sin(endRad));
  const largeArc = angle > 180 ? 1 : 0;
  const centerSvg = toSvg(0, 0);

  const arcCoefNum = angle * 2 * R_CM;
  const arcCoefDen = 360;
  const areaCoefNum = angle * R_CM * R_CM;
  const areaCoefDen = 360;

  return (
    <div className="math-sector">
      <div className="math-sector-stage">
        <svg viewBox="0 0 300 300" className="math-sector-svg">
          <circle cx={centerSvg[0]} cy={centerSvg[1]} r={R_CM * UNIT} fill="none" stroke="#c9bd9e" strokeWidth={1.5} />
          <path
            d={`M ${centerSvg[0]},${centerSvg[1]} L ${start[0]},${start[1]} A ${R_CM * UNIT},${R_CM * UNIT} 0 ${largeArc} 1 ${end[0]},${end[1]} Z`}
            fill="var(--m-accent)"
            fillOpacity={0.35}
            stroke="var(--m-accent)"
            strokeWidth={2}
          />
          <circle cx={centerSvg[0]} cy={centerSvg[1]} r={3.5} fill="#6d5f47" />
          <text x={centerSvg[0] - 18} y={centerSvg[1] + 4} fontSize={12} fontWeight={900}>
            O
          </text>
        </svg>
      </div>

      <input
        type="range"
        min={5}
        max={355}
        step={5}
        value={angle}
        onChange={(e) => setAngle(Number(e.target.value))}
        className="math-sector-range"
        aria-label="中心角"
      />

      <p className="math-sector-eq">
        半径6cm、中心角<strong>{angle}°</strong>のおうぎ形
      </p>
      <p className="math-sector-readout">
        弧の長さ＝{fmtPi(fracStr(arcCoefNum, arcCoefDen))}cm　面積＝{fmtPi(fracStr(areaCoefNum, areaCoefDen))}cm²
      </p>
      <p className="math-sector-note">
        円周（12πcm）や円の面積（36πcm²）に、中心角の割合（{angle}/360）をかけると求められるね。中心角が大きくなるほど、弧の長さも面積も同じ割合で大きくなる（比例する）よ。
      </p>
    </div>
  );
}
