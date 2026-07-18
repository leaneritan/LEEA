"use client";

import { useState } from "react";

const ROWS = ["自然数", "整数", "数"] as const;
const COLS = ["加法", "減法", "乗法", "除法"] as const;

const CLOSED_UNDER: Record<string, boolean> = {
  "自然数-加法": true,
  "自然数-減法": false,
  "自然数-乗法": true,
  "自然数-除法": false,
  "整数-加法": true,
  "整数-減法": true,
  "整数-乗法": true,
  "整数-除法": false,
  "数-加法": true,
  "数-減法": true,
  "数-乗法": true,
  "数-除法": true
};

type Mark = "○" | "×" | null;

export function NumberRangeGridWidget() {
  const [marks, setMarks] = useState<Record<string, Mark>>({});
  const [checked, setChecked] = useState(false);

  function cycle(key: string) {
    if (checked) return;
    setMarks((current) => {
      const value = current[key];
      const next: Mark = value === "○" ? "×" : value === "×" ? null : "○";
      return { ...current, [key]: next };
    });
  }

  function reset() {
    setMarks({});
    setChecked(false);
  }

  let correctCount = 0;
  for (const row of ROWS) {
    for (const col of COLS) {
      const key = `${row}-${col}`;
      const expected = CLOSED_UNDER[key] ? "○" : "×";
      if (marks[key] === expected) correctCount += 1;
    }
  }

  return (
    <div className="math-rangegrid">
      <div className="math-rangegrid-scroll">
        <table className="math-rangegrid-table">
          <thead>
            <tr>
              <th />
              {COLS.map((col) => (
                <th key={col}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row) => (
              <tr key={row}>
                <th>{row}</th>
                {COLS.map((col) => {
                  const key = `${row}-${col}`;
                  const mark = marks[key] ?? null;
                  const expected = CLOSED_UNDER[key] ? "○" : "×";
                  const isCorrect = checked && mark === expected;
                  const isWrong = checked && mark !== expected;
                  return (
                    <td
                      key={col}
                      className={`math-rangegrid-cell${isCorrect ? " math-rangegrid-cell--correct" : ""}${isWrong ? " math-rangegrid-cell--wrong" : ""}`}
                      onClick={() => cycle(key)}
                    >
                      {checked ? expected : mark}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="math-rangegrid-controls">
        {!checked ? (
          <button type="button" className="math-sieve-btn math-sieve-btn--primary" onClick={() => setChecked(true)}>
            答え合わせ
          </button>
        ) : (
          <button type="button" className="math-sieve-btn math-sieve-btn--primary" onClick={reset}>
            もう一度
          </button>
        )}
        {checked ? (
          <span className="math-rangegrid-score">{correctCount} / 12問正解</span>
        ) : (
          <span className="math-rangegrid-hint">セルをタップして ○（いつでもできる）／×（できないことがある）を入れましょう</span>
        )}
      </div>
    </div>
  );
}
