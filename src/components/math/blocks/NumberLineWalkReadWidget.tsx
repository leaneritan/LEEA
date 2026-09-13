"use client";

import { useState } from "react";

/**
 * 学習ノート p.16 問1 — the book draws two arrows on a number line and asks
 * what addition they show.
 *
 * The point of the page is that adding **is** walking: a same-sign pair keeps
 * going the same way, a different-sign pair walks back over itself. A list of
 * sums teaches the rule; watching the second arrow turn round teaches why the
 * rule is what it is. So the arrows are drawn one at a time, and Leo names the
 * two moves before he is told anything.
 */

const WIDTH = 640;
const HEIGHT = 132;
const LEFT = 28;
const RIGHT = 612;
const AXIS_Y = 96;

function signed(value: number) {
  if (value === 0) return "0";
  return value > 0 ? `＋${value}` : `－${Math.abs(value)}`;
}

function Arrow({
  from,
  to,
  y,
  toX,
  tone
}: {
  from: number;
  to: number;
  y: number;
  toX: (v: number) => number;
  tone: string;
}) {
  const x1 = toX(from);
  const x2 = toX(to);
  const forward = x2 >= x1;
  const head = forward ? -9 : 9;
  return (
    <g>
      <line stroke={tone} strokeWidth={2.5} x1={x1} x2={x2} y1={y} y2={y} />
      <polygon fill={tone} points={`${x2},${y} ${x2 + head},${y - 5} ${x2 + head},${y + 5}`} />
      <line stroke={tone} strokeDasharray="3 3" strokeWidth={1.5} x1={x1} x2={x1} y1={y} y2={AXIS_Y} />
      <line stroke={tone} strokeDasharray="3 3" strokeWidth={1.5} x1={x2} x2={x2} y1={y} y2={AXIS_Y} />
      <text
        fill={tone}
        fontFamily="var(--font-jp)"
        fontSize={13}
        fontWeight={800}
        textAnchor="middle"
        x={(x1 + x2) / 2}
        y={y - 8}
      >
        {signed(to - from)}
      </text>
    </g>
  );
}

function WalkPicture({
  min,
  max,
  moves,
  shown
}: {
  min: number;
  max: number;
  moves: [number, number];
  shown: number;
}) {
  const toX = (v: number) => LEFT + ((v - min) / (max - min)) * (RIGHT - LEFT);
  const afterFirst = moves[0];
  const afterSecond = moves[0] + moves[1];
  const ticks = Array.from({ length: max - min + 1 }, (_, i) => min + i);

  return (
    <svg style={{ width: "100%", maxWidth: 600, display: "block", margin: "0 auto" }} viewBox={`0 0 ${WIDTH} ${HEIGHT}`}>
      <line stroke="#8a7a5c" strokeWidth={2} x1={LEFT} x2={RIGHT} y1={AXIS_Y} y2={AXIS_Y} />
      <g fill="#6d5f47" fontFamily="var(--font-jp)" fontSize={12} textAnchor="middle">
        {ticks.map((tick) => (
          <g key={tick}>
            <line stroke="#8a7a5c" strokeWidth={tick === 0 ? 2.5 : 1.5} x1={toX(tick)} x2={toX(tick)} y1={AXIS_Y - 6} y2={AXIS_Y + 6} />
            <text x={toX(tick)} y={AXIS_Y + 24}>
              {tick === 0 ? "0" : signed(tick)}
            </text>
          </g>
        ))}
      </g>
      {shown >= 1 ? <Arrow from={0} to={afterFirst} toX={toX} tone="#c9804f" y={58} /> : null}
      {shown >= 2 ? <Arrow from={afterFirst} to={afterSecond} toX={toX} tone="#6f8fa8" y={28} /> : null}
      {shown >= 2 ? (
        <circle cx={toX(afterSecond)} cy={AXIS_Y} fill="#a05c30" r={5} />
      ) : null}
    </svg>
  );
}

export function NumberLineWalkReadWidget({
  min,
  max,
  example,
  problems
}: {
  min: number;
  max: number;
  example?: { moves: [number, number] };
  problems: { label: string; moves: [number, number] }[];
}) {
  const [index, setIndex] = useState(0);
  const [first, setFirst] = useState<"+" | "-" | null>(null);
  const [second, setSecond] = useState<"+" | "-" | null>(null);
  const [sum, setSum] = useState("");
  const [checked, setChecked] = useState(false);
  const [score, setScore] = useState<Record<number, boolean>>({});

  const problem = problems[index];
  const [a, b] = problem.moves;
  const total = a + b;

  const signOk = (picked: "+" | "-" | null, value: number) => (value >= 0 ? picked === "+" : picked === "-");
  const sumOk = Number(sum.replace(/[＋+]/g, "").replace(/[−－ー-]/g, "-").trim()) === total;
  const allOk = signOk(first, a) && signOk(second, b) && sumOk;

  function check() {
    if (checked || first === null || second === null || !sum.trim()) return;
    setChecked(true);
    setScore((current) => (index in current ? current : { ...current, [index]: allOk }));
  }

  function go(next: number) {
    setIndex(next);
    setFirst(null);
    setSecond(null);
    setSum("");
    setChecked(false);
  }

  const answered = Object.keys(score).length;
  const correct = Object.values(score).filter(Boolean).length;

  return (
    <div className="math-walkread">
      {example ? (
        <div className="math-walkread-example">
          <span className="math-walkread-example-tag">例</span>
          <WalkPicture max={max} min={min} moves={example.moves} shown={2} />
          <p className="math-walkread-example-eq">
            （{signed(example.moves[0])}）＋（{signed(example.moves[1])}）＝ {signed(example.moves[0] + example.moves[1])}
          </p>
        </div>
      ) : null}

      <div className="math-walkread-tabs">
        {problems.map((p, i) => (
          <button
            className={`math-walkread-tab${i === index ? " is-active" : ""}${
              i in score ? (score[i] ? " is-correct" : " is-wrong") : ""
            }`}
            key={p.label}
            onClick={() => go(i)}
            type="button"
          >
            {p.label}
          </button>
        ))}
      </div>

      <WalkPicture max={max} min={min} moves={problem.moves} shown={checked ? 2 : 2} />

      <p className="math-walkread-ask">この図が表している加法を書こう。</p>

      <div className="math-walkread-eq">
        <span>（</span>
        <span className="math-walkread-signpair">
          {(["+", "-"] as const).map((s) => (
            <button
              className={`math-walkread-sign${first === s ? " is-picked" : ""}${
                checked && signOk(s, a) ? " is-correct" : ""
              }`}
              disabled={checked}
              key={s}
              onClick={() => setFirst(s)}
              type="button"
            >
              {s === "+" ? "＋" : "－"}
            </button>
          ))}
        </span>
        <span className="math-walkread-num">{Math.abs(a)}</span>
        <span>）＋（</span>
        <span className="math-walkread-signpair">
          {(["+", "-"] as const).map((s) => (
            <button
              className={`math-walkread-sign${second === s ? " is-picked" : ""}${
                checked && signOk(s, b) ? " is-correct" : ""
              }`}
              disabled={checked}
              key={s}
              onClick={() => setSecond(s)}
              type="button"
            >
              {s === "+" ? "＋" : "－"}
            </button>
          ))}
        </span>
        <span className="math-walkread-num">{Math.abs(b)}</span>
        <span>）＝</span>
        <input
          className={`math-walkread-input${checked ? (sumOk ? " is-correct" : " is-wrong") : ""}`}
          disabled={checked}
          onChange={(event) => setSum(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") check();
          }}
          placeholder="答え"
          type="text"
          value={sum}
        />
      </div>

      <div className="math-walkread-controls">
        {!checked ? (
          <button
            className="math-sieve-btn math-sieve-btn--primary"
            disabled={first === null || second === null || !sum.trim()}
            onClick={check}
            type="button"
          >
            こたえる
          </button>
        ) : index + 1 < problems.length ? (
          <button className="math-sieve-btn math-sieve-btn--primary" onClick={() => go(index + 1)} type="button">
            つぎへ
          </button>
        ) : (
          <button className="math-sieve-btn" onClick={() => go(0)} type="button">
            もう一度
          </button>
        )}
        <span className="math-plot-score">
          {answered} / {problems.length}問　正解 {correct}
        </span>
      </div>

      {checked ? (
        <p className={`math-plot-feedback${allOk ? " math-plot-feedback--correct" : " math-plot-feedback--wrong"}`}>
          {allOk ? "せいかい！ " : "おしい。 "}
          （{signed(a)}）＋（{signed(b)}）＝ {signed(total)}。
          {a * b > 0
            ? "　同じ向きに2回進むから、絶対値をたして、向き（符号）はそのまま。"
            : "　とちゅうで向きが変わるから、絶対値の大きい方から小さい方をひいて、大きい方の符号をつける。"}
        </p>
      ) : null}
    </div>
  );
}
