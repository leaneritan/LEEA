"use client";

import { useState } from "react";
import { normalizeAnswer } from "../../../../content/subjects/math/note/answer";

/**
 * 学習ノート 2章 p.53 — 文字式の利用（ストローでつくる正三角形）.
 *
 * The answer, 2n＋1, is not the hard part. Seeing *why* is, and it cannot be
 * seen from a printed picture of one case: the drawing shows three triangles
 * and the reader is asked to believe a statement about all of them.
 *
 * So the strip is drawn for whatever n Leo chooses, and — this is the point —
 * the straw count is not computed from a formula. Every triangle contributes
 * three edges, the edges are collected, and the duplicates are removed. What is
 * left is the number of straws, because a shared side is one straw and not two.
 * The count on screen is therefore a consequence of the picture rather than a
 * claim about it, and the reason 2 gets added each time is visible: the new
 * triangle brings three sides and one of them is already on the table.
 */

const TOP = 8;
const BOTTOM = 62;
const STEP = 34;
const PAD = 14;

/** Vertices of the strip: alternately bottom and top, half a step apart. */
function point(i: number) {
  return { x: PAD + i * STEP, y: i % 2 === 0 ? BOTTOM : TOP };
}

/**
 * Every edge of every triangle, with duplicates removed. Triangle k is built on
 * vertices k, k+1, k+2, so consecutive triangles necessarily share one side —
 * and that shared side collapses to a single entry here, which is exactly what
 * happens with a real straw.
 */
function strawEdges(n: number) {
  const seen = new Map<string, [number, number]>();
  for (let k = 0; k < n; k++) {
    for (const [a, b] of [
      [k, k + 1],
      [k + 1, k + 2],
      [k, k + 2]
    ] as [number, number][]) {
      seen.set(`${Math.min(a, b)}-${Math.max(a, b)}`, [a, b]);
    }
  }
  return [...seen.values()];
}

export function StrawPatternWidget({
  first,
  perExtra,
  maxN,
  ask,
  answer,
  accept,
  note
}: {
  first: number;
  perExtra: number;
  maxN: number;
  ask: string;
  answer: string;
  accept?: string[];
  note?: string;
}) {
  const [n, setN] = useState(1);
  const [typed, setTyped] = useState("");
  const [submitted, setSubmitted] = useState(false);
  /** Which values of n he has actually looked at — the table fills as he goes. */
  const [seen, setSeen] = useState<number[]>([1]);

  const edges = strawEdges(n);
  const accepted = accept ?? [answer];
  const right = accepted.some((value) => normalizeAnswer(value) === normalizeAnswer(typed));

  function show(next: number) {
    const clamped = Math.max(1, Math.min(maxN, next));
    setN(clamped);
    setSeen((current) => (current.includes(clamped) ? current : [...current, clamped].sort((a, b) => a - b)));
  }

  const width = PAD * 2 + (maxN + 1) * STEP;

  return (
    <div className="math-straw">
      <div className="math-straw-stage">
        <svg
          role="img"
          aria-label={`正三角形を${n}個つなげた形。ストローは${edges.length}本。`}
          viewBox={`0 0 ${width} ${BOTTOM + 12}`}
          style={{ width: "100%", maxWidth: width, display: "block", margin: "0 auto" }}
        >
          {edges.map(([a, b]) => {
            const p = point(a);
            const q = point(b);
            return (
              <line
                key={`${a}-${b}`}
                stroke="var(--m-accent)"
                strokeLinecap="round"
                strokeWidth={5}
                x1={p.x}
                x2={q.x}
                y1={p.y}
                y2={q.y}
              />
            );
          })}
          {Array.from({ length: n + 2 }, (_, i) => {
            const p = point(i);
            return <circle cx={p.x} cy={p.y} fill="#fff" key={i} r={3.5} stroke="var(--m-dark)" strokeWidth={1.5} />;
          })}
        </svg>
      </div>

      <div className="math-straw-bar">
        <button className="math-sieve-btn" disabled={n <= 1} onClick={() => show(n - 1)} type="button">
          − へらす
        </button>
        <span className="math-straw-count">
          正三角形 <strong>{n}</strong> 個　→　ストロー <strong>{edges.length}</strong> 本
        </span>
        <button className="math-sieve-btn" disabled={n >= maxN} onClick={() => show(n + 1)} type="button">
          ＋ ふやす
        </button>
      </div>

      <table className="math-straw-table">
        <tbody>
          <tr>
            <th>三角形</th>
            {seen.map((k) => (
              <td key={k}>{k}個</td>
            ))}
          </tr>
          <tr>
            <th>ストロー</th>
            {seen.map((k) => (
              <td key={k}>{strawEdges(k).length}本</td>
            ))}
          </tr>
        </tbody>
      </table>

      <p className="math-straw-hint">
        1個目は <strong>{first}本</strong>。そこから1個ふえるたびに <strong>{perExtra}本</strong>ずつ。
        3本のうち1本は、となりの三角形とすでに共有しているからだよ。
      </p>

      <div className="math-power-step">
        <span className="math-flip-step">式</span>
        <span className="math-power-answer">
          <span>{ask}</span>
          <input
            className={`note-input${submitted ? (right ? " is-correct" : " is-wrong") : ""}`}
            disabled={submitted}
            onChange={(event) => setTyped(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && typed.trim()) setSubmitted(true);
            }}
            placeholder="n を使った式"
            type="text"
            value={typed}
          />
          {submitted ? (
            <span className={`note-mark${right ? " is-correct" : " is-wrong"}`}>{right ? "○" : "×"}</span>
          ) : (
            <button
              className="math-sieve-btn math-sieve-btn--primary"
              disabled={!typed.trim()}
              onClick={() => setSubmitted(true)}
              type="button"
            >
              こたえる
            </button>
          )}
        </span>
      </div>

      {submitted ? (
        <p className={`math-plot-feedback${right ? " math-plot-feedback--correct" : " math-plot-feedback--wrong"}`}>
          {right ? "せいかい！ " : `答えは ${answer}。 `}
          {note ?? ""}
        </p>
      ) : null}
    </div>
  );
}
