"use client";

import { useState } from "react";

type Challenge = { a: number; label: string; points: [number, number][]; choices: string[] };

const DOMAIN = 5;

function fmt(v: number) {
  return v < 0 ? `－${Math.abs(v)}` : `${v}`;
}
function eqLabel(a: number) {
  const abs = Math.abs(a) === 1 ? "" : `${Math.abs(a)}`;
  return a < 0 ? `y＝－${abs}x` : `y＝${abs}x`;
}

const CHALLENGES: Challenge[] = [
  { a: 2, label: eqLabel(2), points: [[1, 2], [2, 4]], choices: [eqLabel(-2), eqLabel(2), eqLabel(4), "y＝1/2 x"] },
  { a: -3, label: eqLabel(-3), points: [[1, -3], [-1, 3]], choices: [eqLabel(3), eqLabel(-1), eqLabel(-3), "y＝－1/3 x"] },
  { a: -1, label: eqLabel(-1), points: [[1, -1], [-2, 2]], choices: [eqLabel(1), eqLabel(-2), "y＝2x", eqLabel(-1)] },
  { a: 3, label: eqLabel(3), points: [[1, 3], [-1, -3]], choices: [eqLabel(-3), "y＝1/3 x", eqLabel(3), eqLabel(1)] }
];

function toSvgX(x: number) {
  return 150 + (x / DOMAIN) * 130;
}
function toSvgY(y: number) {
  return 150 - (y / DOMAIN) * 130;
}

export function ProportionGraphChallengeWidget() {
  const [index, setIndex] = useState(0);
  const [guess, setGuess] = useState<string | null>(null);
  const challenge = CHALLENGES[index];

  const lineX1 = -DOMAIN + 0.3;
  const lineX2 = DOMAIN - 0.3;

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
          <line x1={toSvgX(lineX1)} y1={toSvgY(challenge.a * lineX1)} x2={toSvgX(lineX2)} y2={toSvgY(challenge.a * lineX2)} stroke="var(--m-accent)" strokeWidth={2.5} />
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

      <p className="math-gchallenge-q">このグラフの比例の式はどれ？（点の座標をヒントに考えよう）</p>
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
            ? `正解！点(${challenge.points[0][0]}, ${fmt(challenge.points[0][1])})を通るから、y＝ax にx＝${challenge.points[0][0]}、y＝${fmt(challenge.points[0][1])}を代入するとa＝${fmt(challenge.a)}。`
            : `もう一度、点の座標からy＝ax×xの値＝yの値になるaをさがしてみよう。`}
        </p>
      ) : null}

      <button type="button" className="math-gchallenge-next" onClick={next}>
        次の問題へ
      </button>
    </div>
  );
}
