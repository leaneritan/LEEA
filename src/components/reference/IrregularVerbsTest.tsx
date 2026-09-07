"use client";

import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import { useKnownWordIds } from "@/components/useKnownWordIds";
import { irregularVerbs, type IrregularVerbEntry } from "@/data/irregularVerbs";
import { pickPracticeWords } from "@/data/referenceConfidence";

const SESSION_LENGTH = 12;

type Field = "past" | "pastParticiple";
type Result = { verbId: string; correct: boolean };

function confidenceId(verb: IrregularVerbEntry) {
  return verb.card?.id ?? verb.id;
}

/** "was/were" accepts either word; everything else is a single exact answer. */
function isCorrect(input: string, target: string) {
  const given = input.trim().toLowerCase();
  if (!given) return false;
  return target
    .split("/")
    .some((option) => option.trim().toLowerCase() === given);
}

export function IrregularVerbsTest() {
  const { confidenceRecords, recordPracticeResults } = useKnownWordIds();

  const [queue, setQueue] = useState<IrregularVerbEntry[] | null>(null);
  const [index, setIndex] = useState(0);
  const [past, setPast] = useState("");
  const [pastParticiple, setPastParticiple] = useState("");
  const [checked, setChecked] = useState<{ past: boolean; pastParticiple: boolean } | null>(null);
  const [results, setResults] = useState<Result[]>([]);

  const byId = useMemo(() => new Map(irregularVerbs.map((verb) => [verb.id, verb])), []);

  const start = useCallback(() => {
    const ids = pickPracticeWords(
      irregularVerbs.map((verb) => verb.id),
      SESSION_LENGTH,
      confidenceRecords
    );
    setQueue(ids.map((id) => byId.get(id)).filter((verb): verb is IrregularVerbEntry => Boolean(verb)));
    setIndex(0);
    setPast("");
    setPastParticiple("");
    setChecked(null);
    setResults([]);
  }, [byId, confidenceRecords]);

  const current = queue?.[index] ?? null;
  const finished = Boolean(queue && index >= queue.length);
  const score = results.filter((result) => result.correct).length;

  function check() {
    if (!current || checked) return;
    const pastRight = isCorrect(past, current.past);
    const ppRight = isCorrect(pastParticiple, current.pastParticiple);
    setChecked({ past: pastRight, pastParticiple: ppRight });
    const correct = pastRight && ppRight;
    setResults((list) => [...list, { verbId: current.id, correct }]);
    recordPracticeResults([{ wordId: confidenceId(current), correct }]);
  }

  function next() {
    if (!queue) return;
    setPast("");
    setPastParticiple("");
    setChecked(null);
    setIndex(index + 1);
  }

  if (!queue) {
    return (
      <section className="vp">
        <header className="screen-heading">
          <span>Reference · Irregular Verbs</span>
          <h1>Test</h1>
          <p>
            {SESSION_LENGTH} verbs. You&rsquo;ll see the infinitive and type the simple past and the past participle
            yourself — no multiple choice. Verbs you miss come up more often next time.
          </p>
        </header>
        <button className="primary-button vp-start" onClick={start} type="button">
          Start test
        </button>
        <Link className="ghost-button irrv-test-back" href="/reference/irregular-verbs">
          Back to the list
        </Link>
      </section>
    );
  }

  if (finished) {
    const missed = results
      .filter((result) => !result.correct)
      .map((result) => byId.get(result.verbId))
      .filter((verb): verb is IrregularVerbEntry => Boolean(verb));

    return (
      <section className="vp">
        <header className="screen-heading">
          <span>Reference · Irregular Verbs</span>
          <h1>Test</h1>
        </header>

        <div className="vp-result">
          <strong>
            {score} / {results.length}
          </strong>
          <p>
            {score === results.length
              ? "Every verb right. These will come up less often now."
              : "The ones you missed will come up sooner next time."}
          </p>
        </div>

        {missed.length ? (
          <div className="vp-weak">
            <strong>Missed this round</strong>
            <div>
              {missed.map((verb) => (
                <Link href={verb.href} key={verb.id}>
                  {verb.infinitive} — {verb.past}, {verb.pastParticiple}
                </Link>
              ))}
            </div>
          </div>
        ) : null}

        <div className="vp-actions">
          <button className="primary-button" onClick={start} type="button">
            Test again
          </button>
          <Link className="ghost-button" href="/reference/irregular-verbs">
            Back to Irregular Verbs
          </Link>
        </div>
      </section>
    );
  }

  if (!current) return null;

  return (
    <section className="vp">
      <div className="vp-progress">
        <span>
          {index + 1} / {queue.length}
        </span>
        <div className="vp-progress-bar">
          <i style={{ width: `${(index / queue.length) * 100}%` }} />
        </div>
        <strong>{score} right</strong>
      </div>

      <div className="vp-card irrv-test-card">
        <span className="vp-kind">Infinitive</span>
        <p className="vp-prompt">{current.infinitive}</p>
      </div>

      <div className="irrv-test-fields">
        <label className="irrv-test-field">
          <span>Simple past</span>
          <input
            autoComplete="off"
            className={checkedClass(checked, "past")}
            disabled={Boolean(checked)}
            onChange={(event) => setPast(event.target.value)}
            onKeyDown={(event) => event.key === "Enter" && check()}
            type="text"
            value={past}
          />
          {checked && !checked.past ? <small>{current.past}</small> : null}
        </label>
        <label className="irrv-test-field">
          <span>Past participle</span>
          <input
            autoComplete="off"
            className={checkedClass(checked, "pastParticiple")}
            disabled={Boolean(checked)}
            onChange={(event) => setPastParticiple(event.target.value)}
            onKeyDown={(event) => event.key === "Enter" && check()}
            type="text"
            value={pastParticiple}
          />
          {checked && !checked.pastParticiple ? <small>{current.pastParticiple}</small> : null}
        </label>
      </div>

      {!checked ? (
        <button className="primary-button irrv-test-check" onClick={check} type="button">
          Check
        </button>
      ) : (
        <div className={`vp-feedback${checked.past && checked.pastParticiple ? " is-right" : " is-wrong"}`}>
          <strong>
            {current.infinitive} → {current.past} → {current.pastParticiple}
          </strong>
          {current.light?.examples?.[1] ? <p className="vp-feedback-example">{current.light.examples[1]}</p> : null}
          <button className="primary-button" onClick={next} type="button">
            {index + 1 >= queue.length ? "See result" : "Next"}
          </button>
        </div>
      )}
    </section>
  );
}

function checkedClass(checked: { past: boolean; pastParticiple: boolean } | null, field: Field) {
  if (!checked) return "irrv-test-input";
  return `irrv-test-input${checked[field] ? " is-right" : " is-wrong"}`;
}
