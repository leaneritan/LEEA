"use client";

import { useState } from "react";

/**
 * 学習ノート p.23 B問1 — the 3x3 square where every row, column and diagonal
 * has the same sum.
 *
 * On paper this is a page of crossings-out. Here each line reports itself as
 * soon as its three cells are filled, so a wrong guess is visible where it goes
 * wrong rather than at the end, and the way in — find the line with only one
 * blank — is something Leo can discover by watching which line lights up.
 */

const LINES: { name: string; cells: [number, number, number] }[] = [
  { name: "上の横", cells: [0, 1, 2] },
  { name: "まん中の横", cells: [3, 4, 5] },
  { name: "下の横", cells: [6, 7, 8] },
  { name: "左の縦", cells: [0, 3, 6] },
  { name: "まん中の縦", cells: [1, 4, 7] },
  { name: "右の縦", cells: [2, 5, 8] },
  { name: "ななめ ↘", cells: [0, 4, 8] },
  { name: "ななめ ↙", cells: [2, 4, 6] }
];

function parse(raw: string): number | null {
  const cleaned = raw
    .replace(/[！-～]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0xfee0))
    .replace(/[−‐‑‒–—ー－]/g, "-")
    .replace(/[\s　]/g, "");
  if (!/^[+-]?\d+$/.test(cleaned)) return null;
  return Number(cleaned);
}

function signed(value: number) {
  if (value === 0) return "0";
  return value > 0 ? `＋${value}` : `－${Math.abs(value)}`;
}

/**
 * In the grid itself the book prints a positive without its sign — "2", not
 * "＋2" — so the printed cells must read the same way, or the page on screen
 * stops matching the page in his hands.
 */
function asPrinted(value: number) {
  return value < 0 ? `－${Math.abs(value)}` : `${value}`;
}

export function MagicSquareWidget({
  cells,
  answers
}: {
  cells: (number | null)[];
  answers: number[];
}) {
  const [entries, setEntries] = useState<Record<number, string>>({});
  const [checked, setChecked] = useState(false);

  const valueAt = (i: number): number | null => (cells[i] !== null ? cells[i] : parse(entries[i] ?? ""));
  const blanks = cells.map((c, i) => (c === null ? i : -1)).filter((i) => i >= 0);
  const allFilled = blanks.every((i) => valueAt(i) !== null);
  const target = answers[0] + answers[1] + answers[2];

  const lineState = LINES.map((line) => {
    const values = line.cells.map(valueAt);
    if (values.some((v) => v === null)) return { ...line, sum: null as number | null, ok: false };
    const sum = values.reduce((total, v) => total! + v!, 0)!;
    return { ...line, sum, ok: sum === target };
  });

  const solved = lineState.every((l) => l.ok);

  return (
    <div className="math-magic">
      <table className="math-magic-grid">
        <tbody>
          {[0, 1, 2].map((row) => (
            <tr key={row}>
              {[0, 1, 2].map((col) => {
                const i = row * 3 + col;
                const given = cells[i] !== null;
                const wrong = checked && !given && valueAt(i) !== null && valueAt(i) !== answers[i];
                return (
                  <td className={given ? "is-given" : ""} key={col}>
                    {given ? (
                      <span>{asPrinted(cells[i]!)}</span>
                    ) : (
                      <input
                        className={wrong ? "is-wrong" : ""}
                        inputMode="text"
                        onChange={(event) => {
                          setEntries((current) => ({ ...current, [i]: event.target.value }));
                          setChecked(false);
                        }}
                        placeholder="?"
                        type="text"
                        value={entries[i] ?? ""}
                      />
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>

      <ul className="math-magic-lines">
        {lineState.map((line) => (
          <li className={line.sum === null ? "" : line.ok ? "is-ok" : "is-bad"} key={line.name}>
            <span>{line.name}</span>
            <strong>{line.sum === null ? "—" : signed(line.sum)}</strong>
          </li>
        ))}
      </ul>

      <div className="math-plot-controls">
        <button
          className="math-sieve-btn math-sieve-btn--primary"
          disabled={!allFilled}
          onClick={() => setChecked(true)}
          type="button"
        >
          答え合わせ
        </button>
        <button
          className="math-sieve-btn"
          onClick={() => {
            setEntries({});
            setChecked(false);
          }}
          type="button"
        >
          消す
        </button>
      </div>

      {solved ? (
        <p className="math-plot-feedback math-plot-feedback--correct">
          ぜんぶの列が {signed(target)} でそろったね！
        </p>
      ) : checked ? (
        <p className="math-plot-feedback math-plot-feedback--wrong">
          まだそろっていない列があるよ。3つのうち2つが入っている列をさがすと、のこり1つが決まるよ。
        </p>
      ) : (
        <p className="math-magic-hint">
          ヒント：{asPrinted(cells[0]!)}、{asPrinted(cells[4]!)}、{asPrinted(cells[8]!)} がそろっている ななめ ↘ から、列の合計がわかるよ。
        </p>
      )}
    </div>
  );
}
