"use client";

import { useState } from "react";

// The three classmates' expressions for the rod count of x squares (p.75),
// which all simplify to 3x + 1.
const EXPRESSIONS = [
  { who: "はるきさん", label: "1 ＋ 3x", f: (x: number) => 1 + 3 * x },
  { who: "ゆうまさん", label: "x ＋（x＋1）＋x", f: (x: number) => x + (x + 1) + x },
  { who: "りおさん", label: "4x －（x－1）", f: (x: number) => 4 * x - (x - 1) }
];

export function EquivalentExpressionsWidget() {
  const [x, setX] = useState(5);

  const values = EXPRESSIONS.map((e) => e.f(x));
  const allEqual = values.every((v) => v === values[0]);

  return (
    <div className="math-equiv">
      <div className="math-equiv-controls">
        <span className="math-equiv-label">正方形の個数 x</span>
        <div className="math-equiv-stepper">
          <button type="button" onClick={() => setX((v) => Math.max(1, v - 1))} aria-label="1へらす">
            －
          </button>
          <span>{x}</span>
          <button type="button" onClick={() => setX((v) => Math.min(20, v + 1))} aria-label="1ふやす">
            ＋
          </button>
        </div>
      </div>

      <div className="math-equiv-rows">
        {EXPRESSIONS.map((e, i) => (
          <div className="math-equiv-row" key={e.who}>
            <span className="math-equiv-who">{e.who}</span>
            <span className="math-equiv-form">{e.label}</span>
            <span className="math-equiv-val">＝ {values[i]}</span>
          </div>
        ))}
      </div>

      <p className={`math-equiv-verdict${allEqual ? " math-equiv-verdict--yes" : ""}`}>
        {allEqual ? `3つの式は、どれも ${values[0]} で同じ！` : "…"} どれも計算すると <strong>3x＋1</strong> になるので、形はちがっても同じ式です。
      </p>
    </div>
  );
}
