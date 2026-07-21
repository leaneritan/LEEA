"use client";

import { useState } from "react";

type Mat = [[number, number, number], [number, number, number]];

const OX = 40;
const OY = 260;
const UNIT = 22;
const TRI: [number, number][] = [
  [1, 1],
  [3, 1],
  [1, 3]
];
const CENTER: [number, number] = [5, 5];

const IDENTITY: Mat = [
  [1, 0, 0],
  [0, 1, 0]
];

function matMul(m2: Mat, m1: Mat): Mat {
  const a1 = m1[0][0], b1 = m1[0][1], e1 = m1[0][2];
  const c1 = m1[1][0], d1 = m1[1][1], f1 = m1[1][2];
  const a2 = m2[0][0], b2 = m2[0][1], e2 = m2[0][2];
  const c2 = m2[1][0], d2 = m2[1][1], f2 = m2[1][2];
  return [
    [a2 * a1 + b2 * c1, a2 * b1 + b2 * d1, a2 * e1 + b2 * f1 + e2],
    [c2 * a1 + d2 * c1, c2 * b1 + d2 * d1, c2 * e1 + d2 * f1 + f2]
  ];
}
function apply(m: Mat, [x, y]: [number, number]): [number, number] {
  return [m[0][0] * x + m[0][1] * y + m[0][2], m[1][0] * x + m[1][1] * y + m[1][2]];
}
function toSvg([x, y]: [number, number]) {
  return [OX + x * UNIT, OY - y * UNIT] as const;
}

const TRANSLATE_OP: Mat = [
  [1, 0, 2],
  [0, 1, -2]
];
function rotateOp(deg: number, [px, py]: [number, number]): Mat {
  const theta = (deg * Math.PI) / 180;
  const cos = Math.cos(theta);
  const sin = Math.sin(theta);
  return [
    [cos, -sin, px - cos * px + sin * py],
    [sin, cos, py - sin * px - cos * py]
  ];
}
const ROTATE_OP = rotateOp(90, CENTER);
const REFLECT_OP: Mat = [
  [-1, 0, 2 * CENTER[0]],
  [0, 1, 0]
];

const OPS: { key: string; label: string; mat: Mat }[] = [
  { key: "t", label: "平行移動", mat: TRANSLATE_OP },
  { key: "r", label: "回転移動", mat: ROTATE_OP },
  { key: "s", label: "対称移動", mat: REFLECT_OP }
];

export function TransformComboWidget() {
  const [matrix, setMatrix] = useState<Mat>(IDENTITY);
  const [history, setHistory] = useState<string[]>([]);

  const origPts = TRI.map(toSvg);
  const curPts = TRI.map((p) => toSvg(apply(matrix, p)));
  const origStr = origPts.map((p) => p.join(",")).join(" ");
  const curStr = curPts.map((p) => p.join(",")).join(" ");

  function applyOp(op: (typeof OPS)[number]) {
    setMatrix((m) => matMul(op.mat, m));
    setHistory((h) => [...h, op.label]);
  }
  function reset() {
    setMatrix(IDENTITY);
    setHistory([]);
  }

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
          <polygon points={origStr} fill="none" stroke="#c9bd9e" strokeWidth={1.5} strokeDasharray="4 3" />
          <polygon points={curStr} fill="#3a6ea8" fillOpacity={0.35} stroke="#3a6ea8" strokeWidth={2.5} />
        </svg>
      </div>

      <div className="math-transform-combo-buttons">
        {OPS.map((op) => (
          <button key={op.key} type="button" className="math-transform-combo-btn" onClick={() => applyOp(op)}>
            {op.label}
          </button>
        ))}
        <button type="button" className="math-transform-combo-reset" onClick={reset}>
          リセット
        </button>
      </div>

      <p className="math-transform-note">
        {history.length === 0
          ? "点線が元の図形。ボタンを押して、移動を組み合わせてみよう（回転は点(5,5)を中心に90°、対称の軸はx＝5だよ）。"
          : `これまでの移動：${history.join(" → ")}（${history.length}回）`}
      </p>
    </div>
  );
}
