"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  collectMistakes,
  mistakeWeight,
  pickMistakes,
  readMistakePractice,
  readTestAttempts,
  recordMistakePractice,
  type MistakeItem,
  type MistakePracticeMap
} from "@/data/testAttempts";

// Everything Leo has got wrong in a test, gathered from the sittings and turned
// into something to work on — the same weak-spot idea Reference Practice and the
// Geography maps already use, pointed at test questions instead of words.
//
// This is practice, not a test: it marks as it goes and shows the answer, which
// is exactly what a test must never do. The two are kept apart in the data too —
// getting something right here never rewrites what he scored on the day.

const ROUND_SIZE = 10;

type Phase = "intro" | "asking" | "done";

/** A drilled question, as the round holds it. */
type Card = { item: MistakeItem; choices: string[] | null };

function buildCard(item: MistakeItem): Card {
  // Only offer choices when there are real alternatives to choose between.
  const choices =
    item.options && item.options.length > 1 && item.options.length <= 10
      ? shuffle([...new Set(item.options)])
      : null;
  return { item, choices };
}

function shuffle<T>(list: T[]) {
  const out = [...list];
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function sameAnswer(a: string, b: string) {
  const norm = (value: string) =>
    value
      .toLowerCase()
      .replace(/[‘’ʼ]/g, "'")
      .replace(/[.,!?;:]+$/g, "")
      .replace(/\s+/g, " ")
      .trim();
  return norm(a) === norm(b);
}

export function TestMistakesPage() {
  const [mounted, setMounted] = useState(false);
  const [mistakes, setMistakes] = useState<MistakeItem[]>([]);
  const [practice, setPractice] = useState<MistakePracticeMap>({});
  const [phase, setPhase] = useState<Phase>("intro");
  const [round, setRound] = useState<Card[]>([]);
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [results, setResults] = useState<Array<{ item: MistakeItem; correct: boolean }>>([]);

  const load = useCallback(() => {
    const attempts = readTestAttempts();
    setMistakes(collectMistakes(attempts));
    setPractice(readMistakePractice());
  }, []);

  useEffect(() => {
    setMounted(true);
    load();
  }, [load]);

  const byTest = useMemo(() => {
    const groups = new Map<string, MistakeItem[]>();
    for (const item of mistakes) {
      const list = groups.get(item.testTitle) ?? [];
      list.push(item);
      groups.set(item.testTitle, list);
    }
    return [...groups.entries()];
  }, [mistakes]);

  const startRound = (pool: MistakeItem[]) => {
    if (pool.length === 0) return;
    setRound(pickMistakes(pool, Math.min(ROUND_SIZE, pool.length)).map(buildCard));
    setIndex(0);
    setPicked(null);
    setRevealed(false);
    setResults([]);
    setPhase("asking");
  };

  const answer = (correct: boolean) => {
    const card = round[index];
    // Recorded as it is given, never only at the end — a round left halfway
    // still counts for everything he actually answered.
    setPractice(recordMistakePractice(card.item.key, correct));
    setResults((prev) => [...prev, { item: card.item, correct }]);
    setRevealed(true);
  };

  const next = () => {
    if (index + 1 >= round.length) {
      setPhase("done");
      return;
    }
    setIndex(index + 1);
    setPicked(null);
    setRevealed(false);
  };

  if (!mounted) {
    return (
      <div className="mis-page">
        <header className="mis-head">
          <h1>Mistakes</h1>
        </header>
      </div>
    );
  }

  if (mistakes.length === 0) {
    return (
      <div className="mis-page">
        <header className="mis-head">
          <h1>Mistakes</h1>
          <p>
            Nothing to practise yet. Questions land here once Leo has sat a test and opened its
            result — every one he did not get right, ready to work on.
          </p>
          <Link className="tests-btn" href="/tests">
            Back to tests
          </Link>
        </header>
      </div>
    );
  }

  if (phase === "asking") {
    const card = round[index];
    const { item } = card;
    return (
      <div className="mis-page">
        <div className="mis-bar">
          <button className="tests-btn quiet" onClick={() => setPhase("intro")} type="button">
            ← Stop
          </button>
          <span>
            {index + 1} of {round.length}
          </span>
        </div>

        <article className="mis-card">
          <div className="mis-source">
            {item.testTitle} · Question {item.n} · {item.part}
          </div>
          <h2 className="mis-q">{item.question}</h2>

          {card.choices ? (
            <div className="mis-choices">
              {card.choices.map((choice) => {
                const isAnswer = sameAnswer(choice, item.answer);
                const chosen = picked === choice;
                const cls = !revealed
                  ? chosen
                    ? " picked"
                    : ""
                  : isAnswer
                    ? " right"
                    : chosen
                      ? " wrong"
                      : "";
                return (
                  <button
                    className={`mis-choice${cls}`}
                    disabled={revealed}
                    key={choice}
                    onClick={() => {
                      setPicked(choice);
                      answer(isAnswer);
                    }}
                    type="button"
                  >
                    {choice}
                  </button>
                );
              })}
            </div>
          ) : revealed ? (
            <div className="mis-open">
              <div className="mis-answer">{item.answer}</div>
              <p className="mis-selfmark">Did he get it?</p>
              <div className="mis-selfbtns">
                <button className="tests-btn" onClick={() => answer(false)} type="button">
                  Not yet
                </button>
                <button className="tests-btn primary" onClick={() => answer(true)} type="button">
                  Got it
                </button>
              </div>
            </div>
          ) : (
            <div className="mis-open">
              <p className="mis-think">Say it or write it, then check.</p>
              <button className="tests-btn primary" onClick={() => setRevealed(true)} type="button">
                Show the answer
              </button>
            </div>
          )}

          {revealed && card.choices ? (
            <>
              <div className="mis-answer">{item.answer}</div>
              {item.lastGiven ? <div className="mis-last">Last time he put: {item.lastGiven}</div> : null}
              <button className="tests-btn primary mis-next" onClick={next} type="button">
                {index + 1 >= round.length ? "See how he did" : "Next"}
              </button>
            </>
          ) : null}

          {revealed && !card.choices && results.length > index ? (
            <button className="tests-btn primary mis-next" onClick={next} type="button">
              {index + 1 >= round.length ? "See how he did" : "Next"}
            </button>
          ) : null}
        </article>
      </div>
    );
  }

  if (phase === "done") {
    const got = results.filter((entry) => entry.correct).length;
    return (
      <div className="mis-page">
        <header className="mis-head">
          <h1>
            {got} of {results.length}
          </h1>
          <p>
            {got === results.length
              ? "Every one. Those can come off the list."
              : "The ones he missed stay near the top of the next round."}
          </p>
        </header>
        <ul className="mis-results">
          {results.map((entry, i) => (
            <li className={entry.correct ? "ok" : "no"} key={`${entry.item.key}-${i}`}>
              <span>{entry.correct ? "✔" : "✘"}</span>
              <div>
                <b>{entry.item.question}</b>
                <small>{entry.item.answer}</small>
              </div>
            </li>
          ))}
        </ul>
        <div className="mis-actions">
          <button
            className="tests-btn primary"
            onClick={() => {
              load();
              setPhase("intro");
            }}
            type="button"
          >
            Back to the list
          </button>
        </div>
      </div>
    );
  }

  const live = mistakes.filter((item) => item.lastWrong);
  return (
    <div className="mis-page">
      <header className="mis-head">
        <h1>Mistakes</h1>
        <p>
          Every question Leo has got wrong in a test, gathered from all his sittings. The round
          leans on what he keeps missing — this is practice, so it marks as it goes and shows the
          answer.
        </p>
      </header>

      <div className="mis-start">
        <button className="tests-btn primary" onClick={() => startRound(mistakes)} type="button">
          Practise {Math.min(ROUND_SIZE, mistakes.length)}
        </button>
        {live.length > 0 && live.length !== mistakes.length ? (
          <button className="tests-btn" onClick={() => startRound(live)} type="button">
            Only the {live.length} still wrong
          </button>
        ) : null}
        <Link className="tests-btn quiet" href="/tests">
          Back to tests
        </Link>
      </div>

      {byTest.map(([title, items]) => (
        <section className="mis-group" key={title}>
          <h2>{title}</h2>
          <ul className="mis-list">
            {[...items].sort((a, b) => mistakeWeight(b) - mistakeWeight(a)).map((item) => {
              const drilled = practice[item.key];
              return (
                <li className={item.lastWrong ? "live" : "fixed"} key={item.key}>
                  <div className="mis-list-top">
                    <span className="mis-n">Q{item.n}</span>
                    <span className="mis-part">{item.part}</span>
                    <span className={`mis-state${item.lastWrong ? "" : " ok"}`}>
                      {item.lastWrong ? "wrong last time" : "got it last time"}
                    </span>
                  </div>
                  <div className="mis-list-q">{item.question}</div>
                  <div className="mis-list-a">
                    <span>Answer</span> {item.answer}
                  </div>
                  {item.lastGiven ? (
                    <div className="mis-list-his">
                      <span>He put</span> {item.lastGiven}
                    </div>
                  ) : null}
                  {drilled ? (
                    <div className="mis-list-drill">
                      Practised {drilled.asked}× · {drilled.correct} right
                      {drilled.lastCorrect ? " · right last time" : ""}
                    </div>
                  ) : null}
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}
