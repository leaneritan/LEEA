"use client";

import { useMemo, useState } from "react";

const TOTAL = 100;
const NUMBERS = Array.from({ length: TOTAL }, (_, i) => i + 1);

function computeIsPrime(limit: number): boolean[] {
  const sieve = new Array(limit + 1).fill(true);
  sieve[0] = false;
  sieve[1] = false;
  for (let i = 2; i * i <= limit; i++) {
    if (sieve[i]) {
      for (let j = i * i; j <= limit; j += i) sieve[j] = false;
    }
  }
  return sieve;
}

type CellState = "default" | "crossed" | "prime-correct" | "prime-wrong" | "composite-wrong";

export function PrimeSieveWidget() {
  const isPrime = useMemo(() => computeIsPrime(TOTAL), []);
  const [crossedOut, setCrossedOut] = useState<Set<number>>(new Set());
  const [checked, setChecked] = useState(false);

  function toggle(n: number) {
    if (checked) return;
    setCrossedOut((prev) => {
      const next = new Set(prev);
      if (next.has(n)) next.delete(n);
      else next.add(n);
      return next;
    });
  }

  function reset() {
    setCrossedOut(new Set());
    setChecked(false);
  }

  function cellState(n: number): CellState {
    const marked = crossedOut.has(n);
    if (!checked) return marked ? "crossed" : "default";
    if (isPrime[n]) return marked ? "prime-wrong" : "prime-correct";
    return marked ? "crossed" : "composite-wrong";
  }

  const foundPrimes = checked ? NUMBERS.filter((n) => isPrime[n] && !crossedOut.has(n)).length : null;

  return (
    <div className="math-sieve">
      <div className="math-sieve-toolbar">
        <button type="button" className="math-sieve-btn" onClick={reset}>
          リセット
        </button>
        <button type="button" className="math-sieve-btn math-sieve-btn--primary" onClick={() => setChecked(true)} disabled={checked}>
          答え合わせ
        </button>
        <span className="math-sieve-result">{checked ? `見つけた素数：${foundPrimes} / 25個` : `消した数：${crossedOut.size}個`}</span>
      </div>
      <div className="math-sieve-grid">
        {NUMBERS.map((n) => (
          <button type="button" key={n} className={`math-sieve-cell math-sieve-cell--${cellState(n)}`} onClick={() => toggle(n)} disabled={checked}>
            {n}
          </button>
        ))}
      </div>
      <p className="math-sieve-legend">
        {checked
          ? "金色＝素数のまま残せた数、グレー＝正しく消せた数。赤い枠は消し忘れ・消しすぎです。"
          : "1から100までのマスをタップして、素数でない数を消していきましょう。"}
      </p>
    </div>
  );
}
