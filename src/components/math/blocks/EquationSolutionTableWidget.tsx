"use client";

import { useState } from "react";

const CANDIDATES = [30, 35, 40, 45, 50];
const TARGET = 18000;

function leftSide(x: number) {
  return 400 * x + 2000;
}

export function EquationSolutionTableWidget() {
  const [tried, setTried] = useState<number[]>([]);

  function tryValue(x: number) {
    setTried((current) => (current.includes(x) ? current : [...current, x]));
  }

  const allTried = tried.length === CANDIDATES.length;
  const solution = CANDIDATES.find((x) => leftSide(x) === TARGET);

  return (
    <div className="math-subcheck">
      <p className="math-subcheck-eq">
        400 × x ＋ 2000 <span className="math-subcheck-vs">?</span> 18000
      </p>
      <div className="math-subcheck-buttons">
        {CANDIDATES.map((x) => (
          <button
            className={`math-subcheck-btn${tried.includes(x) ? " math-subcheck-btn--tried" : ""}`}
            key={x}
            onClick={() => tryValue(x)}
            type="button"
          >
            x＝{x}
          </button>
        ))}
      </div>

      <div className="math-subcheck-rows">
        {tried
          .slice()
          .sort((a, b) => a - b)
          .map((x) => {
            const l = leftSide(x);
            const sign = l < TARGET ? "＜" : l > TARGET ? "＞" : "＝";
            const correct = l === TARGET;
            return (
              <div className={`math-subcheck-row${correct ? " math-subcheck-row--correct" : ""}`} key={x}>
                <span>x＝{x}</span>
                <span>
                  400×{x}＋2000＝{l}
                </span>
                <span className="math-subcheck-sign">{sign}</span>
                <span>18000</span>
                {correct ? <span className="math-subcheck-tag">解！</span> : null}
              </div>
            );
          })}
      </div>

      {allTried ? (
        <p className="math-subcheck-summary">
          x＝{solution}のときだけ左辺＝右辺になったね。だから、方程式 400x＋2000＝18000 の解は x＝{solution} だよ。
        </p>
      ) : (
        <p className="math-subcheck-hint">上のボタンを全部おして、どのxのときに左辺と右辺が等しくなるか調べてみよう。</p>
      )}
    </div>
  );
}
