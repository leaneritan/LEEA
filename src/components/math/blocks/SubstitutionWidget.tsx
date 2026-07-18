"use client";

import { useState } from "react";

function paren(x: number) {
  return x < 0 ? `（－${Math.abs(x)}）` : `${x}`;
}

export function SubstitutionWidget() {
  const [x, setX] = useState(-3);

  const rods = 1 + 3 * x;
  const expr2 = 5 - 4 * x;

  return (
    <div className="math-subst">
      <div className="math-subst-controls">
        <span className="math-subst-label">x に代入する数</span>
        <div className="math-subst-stepper">
          <button type="button" onClick={() => setX((v) => Math.max(-9, v - 1))} aria-label="1へらす">
            －
          </button>
          <span>{x}</span>
          <button type="button" onClick={() => setX((v) => Math.min(9, v + 1))} aria-label="1ふやす">
            ＋
          </button>
        </div>
      </div>

      <div className="math-subst-rows">
        <div className="math-subst-row">
          <span className="math-subst-form">1 ＋ 3x</span>
          <span className="math-subst-work">
            ＝ 1 ＋ 3 × {paren(x)} ＝ <strong>{rods}</strong>
          </span>
        </div>
        <div className="math-subst-row">
          <span className="math-subst-form">5 － 4x</span>
          <span className="math-subst-work">
            ＝ 5 － 4 × {paren(x)} ＝ <strong>{expr2}</strong>
          </span>
        </div>
      </div>

      <p className="math-subst-note">
        文字 x を数におきかえることを<strong>代入</strong>、代入して計算した結果を<strong>式の値</strong>といいます。負の数を代入するときは、かっこをつけます。
      </p>
    </div>
  );
}
