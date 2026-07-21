"use client";

import { useState } from "react";

type Challenge = { a: number; label: string; points: [number, number][]; choices: string[] };

const DOMAIN = 12;

function fmt(v: number) {
  return v < 0 ? `－${Math.abs(v)}` : `${v}`;
}
function eqLabel(a: number) {
  return a < 0 ? `y＝－${Math.abs(a)}/x` : `y＝${a}/x`;
}

const CHALLENGES: Challenge[] = [
  { a: 8, label: eqLabel(8), points: [[2, 4], [4, 2]], choices: [eqLabel(-8), eqLabel(8), eqLabel(6), eqLabel(4)] },
  { a: -12, label: eqLabel(-12), points: [[3, -4], [4, -3]], choices: [eqLabel(12), eqLabel(-6), eqLabel(-12), eqLabel(-4)] },
  { a: 6, label: eqLabel(6), points: [[1, 6], [2, 3]], choices: [eqLabel(-6), eqLabel(3), eqLabel(12), eqLabel(6)] },
  { a: -10, label: eqLabel(-10), points: [[2, -5], [5, -2]], choices: [eqLabel(10), eqLabel(-5), eqLabel(-10), eqLabel(-2)] }
];

function toSvgX(x: number) {
  return 150 + (x / DOMAIN) * 130;
}
function toSvgY(y: number) {
  return 150 - (y / DOMAIN) * 130;
}
function branchPoints(a: number, sign: 1 | -1) {
  const xMin = Math.max(Math.abs(a) / DOMAIN, 0.4);
  const N = 20;
  const pts: string[] = [];
  for (let i = 0; i <= N; i++) {
    const t = i / N;
    const x = sign * xMin * Math.pow(DOMAIN / xMin, t);
    const y = a / x;
    pts.push(`${toSvgX(x).toFixed(1)},${toSvgY(y).toFixed(1)}`);
  }
  return pts.join(" ");
}

export function InverseGraphChallengeWidget() {
  const [index, setIndex] = useState(0);
  const [guess, setGuess] = useState<string | null>(null);
  const challenge = CHALLENGES[index];

  function next() {
    setIndex((i) => (i + 1) % CHALLENGES.length);
    setGuess(null);
  }

  return (
    <div className="math-gchallenge">
      <p className="math-gchallenge-intro">教科書の問題とはちがう、あたらしいグラフで練習してみよう（第{index + 1}問）。</p>
      <div className="math-gchallenge-stage">
        <svg viewBox="0 0 300 300" className="math-gchallenge-svg">
          <line x1={toSvgX(-DOMAIN)} y1={toSvgY(0)} x2={toSvgX(DOMAIN)} y2={toSvgY(0)} stroke="#c9bd9e" strokeWidth={1.5} />
          <line x1={toSvgX(0)} y1={toSvgY(-DOMAIN)} x2={toSvgX(0)} y2={toSvgY(DOMAIN)} stroke="#c9bd9e" strokeWidth={1.5} />
          <polyline points={branchPoints(challenge.a, 1)} fill="none" stroke="var(--m-accent)" strokeWidth={2.5} />
          <polyline points={branchPoints(challenge.a, -1)} fill="none" stroke="var(--m-accent)" strokeWidth={2.5} />
          {challenge.points.map(([x, y]) => (
            <g key={`${x},${y}`}>
              <circle cx={toSvgX(x)} cy={toSvgY(y)} r={4.5} fill="#3a6ea8" />
              <text x={toSvgX(x) + (x >= 0 ? 7 : -7)} y={toSvgY(y) - 7} fontSize={11} fontWeight={900} fill="#3a6ea8" textAnchor={x >= 0 ? "start" : "end"}>
                ({fmt(x)}, {fmt(y)})
              </text>
            </g>
          ))}
        </svg>
      </div>

      <p className="math-gchallenge-q">このグラフの反比例の式はどれ？（点の座標をヒントに考えよう）</p>
      <div className="math-gchallenge-choices">
        {challenge.choices.map((choice) => {
          const isCorrect = choice === challenge.label;
          const isPicked = guess === choice;
          let cls = "math-gchallenge-choice";
          if (guess && isCorrect) cls += " math-gchallenge-choice--correct";
          else if (guess && isPicked && !isCorrect) cls += " math-gchallenge-choice--wrong";
          return (
            <button key={choice} type="button" className={cls} onClick={() => setGuess(choice)}>
              {choice}
            </button>
          );
        })}
      </div>

      {guess ? (
        <p className={`math-gchallenge-feedback${guess === challenge.label ? " math-gchallenge-feedback--correct" : ""}`}>
          {guess === challenge.label
            ? `正解！点(${challenge.points[0][0]}, ${fmt(challenge.points[0][1])})を通るから、y＝a/x にx＝${challenge.points[0][0]}、y＝${fmt(challenge.points[0][1])}を代入するとa＝${fmt(challenge.a)}。`
            : `もう一度、点の座標からx×yの値（＝比例定数a）を計算してみよう。`}
        </p>
      ) : null}

      <button type="button" className="math-gchallenge-next" onClick={next}>
        次の問題へ
      </button>
    </div>
  );
}
