"use client";

import { useState } from "react";

/**
 * 学習ノート p.30 — 逆数.
 *
 * The book defines it properly: 「2つの数の積が1のとき、一方の数を他方の数の
 * 逆数という」. What survives into practice, though, is usually just "turn the
 * fraction upside down", and with that comes the belief that the sign turns over
 * too. The seal in the margin of p.30 says exactly the opposite —
 * 「符号は変えずに、分子と分母を入れかえればいいよ」 — so this widget asks about
 * the sign *before* the swap, then does the swap, then multiplies the two
 * numbers back together so that the definition, not the trick, is the last thing
 * on screen.
 *
 * －7 and －1 are in the book's own list because they look like they have no
 * 分母 at all; showing them as －7/1 and －1/1 first is what makes the swap
 * possible, and it is why the fraction bar is drawn rather than written "n/d".
 */

type Problem = {
  printed: string;
  asFraction?: string;
  numerator: number;
  denominator: number;
  note?: string;
};

function gcd(a: number, b: number): number {
  return b === 0 ? Math.abs(a) : gcd(b, a % b);
}

function Frac({ n, d, muted }: { n: number; d: number; muted?: boolean }) {
  const negative = n < 0;
  const top = Math.abs(n);
  if (d === 1) {
    return (
      <span className={`math-recip-num${muted ? " is-muted" : ""}`}>
        {negative ? "－" : ""}
        {top}
      </span>
    );
  }
  return (
    <span className={`math-recip-frac${muted ? " is-muted" : ""}`}>
      {negative ? <span className="math-recip-sign">－</span> : null}
      <span className="math-recip-stack">
        <span className="math-recip-top">{top}</span>
        <span className="math-recip-bar" />
        <span className="math-recip-bottom">{d}</span>
      </span>
    </span>
  );
}

export function ReciprocalWidget({ problems }: { problems: Problem[] }) {
  const [index, setIndex] = useState(0);
  const [signPick, setSignPick] = useState<"same" | "flip" | null>(null);
  const [swapped, setSwapped] = useState(false);

  const problem = problems[index];
  const { numerator, denominator } = problem;

  // The reciprocal keeps the sign and swaps the parts, then reduces — －9/10
  // has reciprocal －10/9, which is already lowest terms, but －4/2 would not be.
  const rawTop = denominator * Math.sign(numerator);
  const rawBottom = Math.abs(numerator);
  const g = gcd(Math.abs(rawTop), rawBottom) || 1;
  const recipTop = rawTop / g;
  const recipBottom = rawBottom / g;

  const signRight = signPick === "same";

  function go(next: number) {
    setIndex(next);
    setSignPick(null);
    setSwapped(false);
  }

  return (
    <div className="math-recip">
      <div className="math-walkread-tabs">
        {problems.map((p, i) => (
          <button
            className={`math-walkread-tab${i === index ? " is-active" : ""}`}
            key={p.printed}
            onClick={() => go(i)}
            type="button"
          >
            {p.printed}
          </button>
        ))}
      </div>

      <div className="math-power-step">
        <span className="math-flip-step">①</span>
        <span className="math-flip-eq">
          {problem.printed}
          {problem.asFraction ? (
            <>
              <span className="math-flip-note">分数になおすと</span>
              <Frac d={denominator} n={numerator} />
            </>
          ) : null}
        </span>
      </div>

      <div className="math-power-step">
        <span className="math-flip-step">②</span>
        {signRight ? (
          <span className="math-power-said">
            符号は <strong>そのまま</strong>。入れかえるのは分子と分母だけ。
          </span>
        ) : (
          <span className="math-power-ask">
            逆数にすると、符号はどうなる？
            <span className="math-flip-choices">
              {/* Picking 「そのまま」 collapses this row straight away, so it needs
                  no selected state — only the wrong choice stays on screen. */}
              <button className="math-flip-choice" onClick={() => setSignPick("same")} type="button">
                そのまま
              </button>
              <button
                className={`math-flip-choice${signPick === "flip" ? " is-wrong" : ""}`}
                onClick={() => setSignPick("flip")}
                type="button"
              >
                反対になる
              </button>
            </span>
          </span>
        )}
      </div>

      {signPick === "flip" ? (
        <p className="math-plot-feedback math-plot-feedback--wrong">
          逆数は「かけて1になる数」だったね。符号が反対だと、かけた答えは －1 になってしまう。符号はそのままだよ。
        </p>
      ) : null}

      {signRight ? (
        <div className="math-power-step">
          <span className="math-flip-step">③</span>
          {swapped ? (
            <span className="math-flip-eq">
              <Frac d={denominator} muted n={numerator} />
              <span className="math-recip-arrow">→</span>
              <Frac d={recipBottom} n={recipTop} />
              <span className="math-flip-note">分子と分母を入れかえた</span>
            </span>
          ) : (
            <button className="math-sieve-btn math-sieve-btn--primary" onClick={() => setSwapped(true)} type="button">
              分子と分母を入れかえる
            </button>
          )}
        </div>
      ) : null}

      {swapped ? (
        <div className="math-recip-check">
          <p className="math-recip-check-title">たしかめ ── 積が 1 になる？</p>
          <p className="math-recip-check-eq">
            <Frac d={denominator} n={numerator} />
            <span>×</span>
            <Frac d={recipBottom} n={recipTop} />
            <span>＝</span>
            <strong>1</strong>
          </p>
          <p className="math-plot-feedback math-plot-feedback--correct">
            {problem.printed} の逆数は{" "}
            {recipBottom === 1 ? (recipTop < 0 ? `－${Math.abs(recipTop)}` : `${recipTop}`) : `${recipTop < 0 ? "－" : ""}${Math.abs(recipTop)}/${recipBottom}`}
            。{problem.note ?? ""}
          </p>
        </div>
      ) : null}

      <div className="math-plot-controls">
        {index + 1 < problems.length ? (
          <button
            className="math-sieve-btn math-sieve-btn--primary"
            disabled={!swapped}
            onClick={() => go(index + 1)}
            type="button"
          >
            つぎの数へ
          </button>
        ) : (
          <button className="math-sieve-btn" onClick={() => go(0)} type="button">
            はじめから
          </button>
        )}
      </div>
    </div>
  );
}
