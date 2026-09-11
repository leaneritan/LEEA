"use client";

import { useEffect, useRef, useState } from "react";
import {
  areChoicesCorrect,
  isScorable,
  isTypedAnswerCorrect,
  partMode
} from "../../../../content/subjects/math/note/answer";
import type {
  MathNoteBlockQuestionSet,
  MathNotePart,
  MathNoteQuestion
} from "../../../../content/subjects/math/note/types";
import { NumberLinePlotWidget } from "../blocks/NumberLinePlotWidget";
import { NumberLinePointsWidget } from "../blocks/NumberLinePointsWidget";

/**
 * One 小問.
 *
 * A workbook is not a book of answers to reveal — Leo already owns a paper copy
 * that does that better. So a part he can be marked on is answered first and
 * shown second, and the score is taken from his FIRST answer, not from however
 * many tries it took. A 記述 part stays a self-check, and a paper-only part
 * gets no button at all.
 */
function NotePart({
  part,
  strictSign,
  onFirstAnswer
}: {
  part: MathNotePart;
  strictSign: boolean;
  onFirstAnswer: (wasRight: boolean) => void;
}) {
  const mode = partMode(part);
  const [typed, setTyped] = useState("");
  const [picked, setPicked] = useState<number[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [revealed, setRevealed] = useState(false);

  const multi = (part.correct ?? []).length > 1;
  const right =
    mode === "typed"
      ? isTypedAnswerCorrect(typed, part, strictSign)
      : mode === "choice"
        ? areChoicesCorrect(picked, part)
        : false;

  function submit() {
    if (submitted) return;
    if (mode === "typed" && !typed.trim()) return;
    if (mode === "choice" && picked.length === 0) return;
    setSubmitted(true);
    onFirstAnswer(right);
  }

  function toggle(index: number) {
    if (submitted) return;
    setPicked((current) =>
      multi
        ? current.includes(index)
          ? current.filter((i) => i !== index)
          : [...current, index]
        : [index]
    );
  }

  return (
    <li className="note-part">
      <div className="note-part-prompt">
        {part.label ? <span className="note-part-label">{part.label}</span> : null}
        {part.prompt ? <span>{part.prompt}</span> : null}
      </div>

      {mode === "typed" ? (
        <div className="note-answer-row">
          <input
            className={`note-input${submitted ? (right ? " is-correct" : " is-wrong") : ""}`}
            disabled={submitted}
            onChange={(event) => setTyped(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") submit();
            }}
            placeholder="答えを入力"
            type="text"
            value={typed}
          />
          {part.unit ? <span className="note-unit">{part.unit}</span> : null}
          {!submitted ? (
            <button className="note-btn note-btn--primary" disabled={!typed.trim()} onClick={submit} type="button">
              こたえる
            </button>
          ) : (
            <span className={`note-mark${right ? " is-correct" : " is-wrong"}`}>{right ? "○" : "×"}</span>
          )}
        </div>
      ) : null}

      {mode === "choice" ? (
        <div className="note-answer-row note-answer-row--choices">
          <div className="note-choices">
            {(part.choices ?? []).map((choice, index) => {
              const chosen = picked.includes(index);
              const isAnswer = (part.correct ?? []).includes(index);
              const variant = submitted
                ? isAnswer
                  ? " is-correct"
                  : chosen
                    ? " is-wrong"
                    : ""
                : chosen
                  ? " is-picked"
                  : "";
              return (
                <button
                  className={`note-choice${variant}`}
                  disabled={submitted}
                  key={choice}
                  onClick={() => toggle(index)}
                  type="button"
                >
                  {submitted && isAnswer ? "○ " : submitted && chosen ? "× " : ""}
                  {choice}
                </button>
              );
            })}
          </div>
          {!submitted ? (
            <button className="note-btn note-btn--primary" disabled={picked.length === 0} onClick={submit} type="button">
              こたえる
            </button>
          ) : null}
        </div>
      ) : null}

      {mode === "self-check" ? (
        <div className="note-answer-row">
          <span className="note-selfcheck">ノートに答えてから、たしかめよう。</span>
          <button className="note-btn" onClick={() => setRevealed((v) => !v)} type="button">
            {revealed ? "答えをかくす" : "答えを見る"}
          </button>
        </div>
      ) : null}

      {mode === "paper" ? <p className="note-paper">ノートでやってみよう。</p> : null}

      {(submitted || revealed) && part.answer ? (
        <p className={`note-explain${submitted && !right ? " is-wrong" : ""}`}>
          {submitted ? (right ? "せいかい！ " : "おしい。 ") : null}
          {part.answer}
          {part.source ? <span className="note-source">{part.source}</span> : null}
        </p>
      ) : null}
    </li>
  );
}

function NoteQuestionCard({
  question,
  onFirstAnswer
}: {
  question: MathNoteQuestion;
  onFirstAnswer: (partIndex: number, wasRight: boolean) => void;
}) {
  const widget = question.widget;
  const line = widget?.numberLine;

  return (
    <li className="note-question">
      <div className="note-question-head">
        <span className="note-question-num">{question.number}</span>
        {question.topic ? <span className="note-question-topic">{question.topic}</span> : null}
        {question.deepen ? <span className="note-question-deepen">理解を深める1問！</span> : null}
        {question.tag ? <span className="note-question-tag">{question.tag}</span> : null}
        {question.textbookRef ? <span className="note-question-ref">{question.textbookRef}</span> : null}
      </div>
      <p className="note-question-prompt">{question.prompt}</p>
      {question.given ? <p className="note-question-given">{question.given}</p> : null}

      {widget && line ? (
        <div className="note-widget">
          {widget.kind === "number-line-points" ? (
            <NumberLinePointsWidget max={line.max} min={line.min} points={line.points} step={line.step} />
          ) : widget.kind === "number-line-plot" ? (
            <NumberLinePlotWidget
              max={line.max}
              min={line.min}
              step={line.step}
              targets={line.points.map((point) => ({ value: point.value, label: point.label }))}
            />
          ) : null}
        </div>
      ) : null}

      {question.parts?.length ? (
        <ul className="note-parts">
          {question.parts.map((part, index) => (
            <NotePart
              key={`${question.number}-${part.label ?? index}`}
              onFirstAnswer={(wasRight) => onFirstAnswer(index, wasRight)}
              part={part}
              strictSign={question.strictSign === true}
            />
          ))}
        </ul>
      ) : null}
    </li>
  );
}

/**
 * An A問題 / B問題 set. Scores itself from first answers once every scorable
 * part has been attempted, so progress is earned by doing the work rather than
 * declared by ticking a box.
 */
export function NoteQuestionSet({
  block,
  done,
  onScored
}: {
  block: MathNoteBlockQuestionSet;
  done: boolean;
  onScored: (correct: number, total: number) => void;
}) {
  const scorableCount = block.questions.reduce(
    (total, question) => total + (question.parts ?? []).filter(isScorable).length,
    0
  );
  const [results, setResults] = useState<Record<string, boolean>>({});
  const answered = Object.keys(results).length;
  const correct = Object.values(results).filter(Boolean).length;
  const reported = useRef(false);

  // Reporting the score has to happen after the render that completes the set,
  // not inside the state updater — React runs updaters during rendering, and
  // calling the parent's setState from there is the "cannot update a component
  // while rendering a different component" warning. The ref keeps it to one
  // report even though `onScored` is a fresh closure every render.
  useEffect(() => {
    if (reported.current || scorableCount === 0) return;
    if (answered < scorableCount) return;
    reported.current = true;
    onScored(correct, scorableCount);
  }, [answered, correct, scorableCount, onScored]);

  function record(questionNumber: number, partIndex: number, wasRight: boolean) {
    const key = `${questionNumber}:${partIndex}`;
    setResults((current) => (key in current ? current : { ...current, [key]: wasRight }));
  }

  return (
    <section className={`math-card note-qset note-qset--${block.label === "A問題" ? "a" : "b"}`}>
      <div className="note-qset-head">
        <span className="note-qset-label">{block.label}</span>
        {done ? <span className="note-qset-done">✓ できた</span> : null}
      </div>
      <ol className="note-questions">
        {block.questions.map((question) => (
          <NoteQuestionCard
            key={question.number}
            onFirstAnswer={(partIndex, wasRight) => record(question.number, partIndex, wasRight)}
            question={question}
          />
        ))}
      </ol>
      {scorableCount > 0 ? (
        <div className={`note-qset-score${answered === scorableCount ? " is-done" : ""}`}>
          こたえた問題：{answered} / {scorableCount}
          {answered === scorableCount ? `　→　${correct} 問せいかい` : null}
        </div>
      ) : null}
    </section>
  );
}
