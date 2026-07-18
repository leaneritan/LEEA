"use client";

import { useState } from "react";

const NUMS = Array.from({ length: 9 }, (_, i) => i + 1);

type Mode = "row" | "diagonal" | "square";

export function KukuTableWidget() {
  const [mode, setMode] = useState<Mode>("row");
  const [selected, setSelected] = useState<{ a: number; b: number } | null>(null);
  const [anchor, setAnchor] = useState<{ a: number; b: number } | null>(null);

  function selectMode(next: Mode) {
    setMode(next);
    setSelected(null);
    setAnchor(null);
  }

  function handleCellClick(a: number, b: number) {
    if (mode === "square") {
      if (a <= 8 && b <= 8) setAnchor({ a, b });
      return;
    }
    if (mode === "row") setSelected({ a, b });
  }

  function cellClass(a: number, b: number) {
    const classes = ["math-kuku-cell"];
    if (mode === "row" && selected) {
      if (a === selected.a && b === selected.b) classes.push("math-kuku-cell--active");
      else if (a === selected.a || b === selected.b) classes.push("math-kuku-cell--highlight");
    }
    if (mode === "diagonal" && a === b) classes.push("math-kuku-cell--highlight");
    if (mode === "square" && anchor) {
      const isTopLeft = a === anchor.a && b === anchor.b;
      const isBottomRight = a === anchor.a + 1 && b === anchor.b + 1;
      const isTopRight = a === anchor.a && b === anchor.b + 1;
      const isBottomLeft = a === anchor.a + 1 && b === anchor.b;
      if (isTopLeft || isBottomRight) classes.push("math-kuku-cell--diag-a");
      if (isTopRight || isBottomLeft) classes.push("math-kuku-cell--diag-b");
    }
    return classes.join(" ");
  }

  const topLeft = anchor ? anchor.a * anchor.b : 0;
  const bottomRight = anchor ? (anchor.a + 1) * (anchor.b + 1) : 0;
  const topRight = anchor ? anchor.a * (anchor.b + 1) : 0;
  const bottomLeft = anchor ? (anchor.a + 1) * anchor.b : 0;

  return (
    <div className="math-kuku">
      <div className="math-kuku-modes">
        <button type="button" className={`math-kuku-mode-btn${mode === "row" ? " math-kuku-mode-btn--active" : ""}`} onClick={() => selectMode("row")}>
          行・列を見る
        </button>
        <button
          type="button"
          className={`math-kuku-mode-btn${mode === "diagonal" ? " math-kuku-mode-btn--active" : ""}`}
          onClick={() => selectMode("diagonal")}
        >
          対角線を見る
        </button>
        <button type="button" className={`math-kuku-mode-btn${mode === "square" ? " math-kuku-mode-btn--active" : ""}`} onClick={() => selectMode("square")}>
          2×2の正方形
        </button>
      </div>

      <div className="math-kuku-grid-wrap">
        <table className="math-kuku-table">
          <thead>
            <tr>
              <th className="math-kuku-corner">a×b</th>
              {NUMS.map((b) => (
                <th key={b}>{b}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {NUMS.map((a) => (
              <tr key={a}>
                <th>{a}</th>
                {NUMS.map((b) => (
                  <td key={b} className={cellClass(a, b)} onClick={() => handleCellClick(a, b)}>
                    {a * b}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="math-kuku-readout">
        {mode === "row" &&
          (selected ? (
            <p>
              <strong>{selected.a}の段</strong>：{NUMS.map((b) => selected.a * b).join("、")} → 1つ増えるごとに {selected.a} ずつ増えています。
            </p>
          ) : (
            <p>マスをタップすると、その行と列のきまりを見比べられます。</p>
          ))}
        {mode === "diagonal" && (
          <p>
            対角線には {NUMS.map((a) => a * a).join("、")} が並んでいます。これはすべて「同じ数を2回かけた数」（平方数）です。
          </p>
        )}
        {mode === "square" &&
          (anchor ? (
            <p>
              <strong>
                {topLeft} × {bottomRight} = {topLeft * bottomRight}
              </strong>
              　と
              <strong>
                {topRight} × {bottomLeft} = {topRight * bottomLeft}
              </strong>
              　→ 斜めの積が等しくなりました！
            </p>
          ) : (
            <p>左上のマスをタップすると、2×2の正方形ができます。斜めの数どうしの積を比べてみましょう。</p>
          ))}
      </div>
    </div>
  );
}
