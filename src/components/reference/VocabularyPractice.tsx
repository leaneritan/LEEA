"use client";

import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import { allWords } from "./ref-data";
import { useJapanesePreference } from "@/components/AppShell";
import { useKnownWordIds } from "@/components/useKnownWordIds";
import { pickPracticeWords } from "@/data/referenceConfidence";
import type { WordEntry } from "@/data/reference-shapes";

const SESSION_LENGTH = 10;
const OPTION_COUNT = 4;

type QuestionKind = "jp-to-word" | "meaning-to-word";

type Question = {
  wordId: string;
  kind: QuestionKind;
  prompt: string;
  answer: WordEntry;
  options: WordEntry[];
};

type Answered = { wordId: string; correct: boolean };

/** A word can only be asked if it carries the thing the question shows. */
function canAsk(word: WordEntry, kind: QuestionKind) {
  if (kind === "jp-to-word") return Boolean(word.jp?.gloss?.trim());
  return Boolean(word.definition?.trim());
}

function shuffle<T>(items: T[]): T[] {
  const next = items.slice();
  for (let i = next.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next;
}

/**
 * Distractors come from words sharing a part of speech where possible — three
 * random nouns against a verb makes the answer obvious without knowing it.
 */
function buildOptions(answer: WordEntry, pool: WordEntry[]): WordEntry[] {
  const others = pool.filter((word) => word.id !== answer.id && word.word !== answer.word);
  const samePos = shuffle(others.filter((word) => word.pos === answer.pos));
  const rest = shuffle(others.filter((word) => word.pos !== answer.pos));
  return shuffle([answer, ...samePos.concat(rest).slice(0, OPTION_COUNT - 1)]);
}

export function VocabularyPractice() {
  const { confidenceRecords, weakWordIds, recordPracticeResults } = useKnownWordIds();
  const japaneseOn = useJapanesePreference();

  const [questions, setQuestions] = useState<Question[] | null>(null);
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<WordEntry | null>(null);
  const [answers, setAnswers] = useState<Answered[]>([]);

  const askable = useMemo(() => allWords.filter((word) => canAsk(word, "meaning-to-word") || canAsk(word, "jp-to-word")), []);
  const byId = useMemo(() => new Map(allWords.map((word) => [word.id, word])), []);

  const weakWords = useMemo(
    () => weakWordIds.map((id) => byId.get(id)).filter((word): word is WordEntry => Boolean(word)),
    [weakWordIds, byId]
  );

  const start = useCallback(() => {
    const ids = pickPracticeWords(
      askable.map((word) => word.id),
      SESSION_LENGTH,
      confidenceRecords
    );

    const built = ids.reduce<Question[]>((list, wordId) => {
      const answer = byId.get(wordId);
      if (!answer) return list;

      // Japanese prompts only when the toggle is on and the word has a gloss;
      // otherwise fall back to the English definition.
      const wantJapanese = japaneseOn && canAsk(answer, "jp-to-word") && Math.random() < 0.6;
      const kind: QuestionKind = wantJapanese ? "jp-to-word" : "meaning-to-word";
      if (!canAsk(answer, kind)) return list;

      list.push({
        wordId,
        kind,
        prompt: kind === "jp-to-word" ? answer.jp.gloss : answer.definition,
        answer,
        options: buildOptions(answer, askable)
      });
      return list;
    }, []);

    setQuestions(built);
    setIndex(0);
    setPicked(null);
    setAnswers([]);
  }, [askable, byId, confidenceRecords, japaneseOn]);

  const current = questions?.[index] ?? null;
  const finished = Boolean(questions && index >= questions.length);
  const score = answers.filter((answer) => answer.correct).length;

  // Each answer is saved the moment it is given, not at the end of the round.
  // Saving the whole session on the final click meant a round left half-finished
  // — a tab closed, a tap on Back, anything Leo actually does — threw away every
  // answer, from localStorage as well as the cloud. Nine right and one distraction
  // recorded nothing at all. A round is worth what he answered, not what he finished.
  function choose(option: WordEntry) {
    if (!current || picked) return;
    const correct = option.id === current.answer.id;
    setPicked(option);
    setAnswers((list) => [...list, { wordId: current.wordId, correct }]);
    recordPracticeResults([{ wordId: current.wordId, correct }]);
  }

  function next() {
    if (!questions) return;
    setPicked(null);
    setIndex(index + 1);
  }

  if (!questions) {
    return (
      <section className="vp">
        <header className="screen-heading">
          <span>Reference</span>
          <h1>Practice</h1>
          <p>
            Ten questions, drawn from the {askable.length} words in Reference. Words you get wrong — or have never
            been asked — come up more often than the ones you already know.
          </p>
        </header>

        {weakWords.length ? (
          <div className="vp-weak">
            <strong>Words to work on</strong>
            <div>
              {weakWords.slice(0, 12).map((word) => (
                <Link href={`/reference/word/${word.id}`} key={word.id}>
                  {word.word}
                </Link>
              ))}
              {weakWords.length > 12 ? <span className="vp-weak-more">+{weakWords.length - 12} more</span> : null}
            </div>
          </div>
        ) : null}

        <button className="primary-button vp-start" onClick={start} type="button">
          Start practice
        </button>
      </section>
    );
  }

  if (finished) {
    const missed = answers
      .filter((answer) => !answer.correct)
      .map((answer) => byId.get(answer.wordId))
      .filter((word): word is WordEntry => Boolean(word));

    return (
      <section className="vp">
        <header className="screen-heading">
          <span>Reference</span>
          <h1>Practice</h1>
        </header>

        <div className="vp-result">
          <strong>{score} / {answers.length}</strong>
          <p>
            {score === answers.length
              ? "Every one right. These will come up less often now."
              : "The ones you missed will come up sooner next time."}
          </p>
        </div>

        {missed.length ? (
          <div className="vp-weak">
            <strong>Missed this round</strong>
            <div>
              {missed.map((word) => (
                <Link href={`/reference/word/${word.id}`} key={word.id}>
                  {word.word}
                </Link>
              ))}
            </div>
          </div>
        ) : null}

        <div className="vp-actions">
          <button className="primary-button" onClick={start} type="button">
            Practice again
          </button>
          <Link className="ghost-button" href="/reference">
            Back to Reference
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
          {index + 1} / {questions.length}
        </span>
        <div className="vp-progress-bar">
          <i style={{ width: `${(index / questions.length) * 100}%` }} />
        </div>
        <strong>{score} right</strong>
      </div>

      <div className="vp-card">
        <span className="vp-kind">{current.kind === "jp-to-word" ? "この意味の単語は？" : "Which word means this?"}</span>
        <p className="vp-prompt" lang={current.kind === "jp-to-word" ? "ja" : "en"}>
          {current.prompt}
        </p>
      </div>

      <div className="vp-options">
        {current.options.map((option) => {
          const isAnswer = option.id === current.answer.id;
          const isPicked = picked?.id === option.id;
          const state = !picked ? "" : isAnswer ? " is-right" : isPicked ? " is-wrong" : " is-dim";

          return (
            <button
              className={`vp-option${state}`}
              disabled={Boolean(picked)}
              key={option.id}
              onClick={() => choose(option)}
              type="button"
            >
              <b>{option.word}</b>
              <small>{option.pos}</small>
            </button>
          );
        })}
      </div>

      {picked ? (
        <div className={`vp-feedback${picked.id === current.answer.id ? " is-right" : " is-wrong"}`}>
          <strong>
            {current.answer.emoji} {current.answer.word}
          </strong>
          <p>{current.answer.definition}</p>
          {current.answer.jp?.gloss ? <p className="vp-feedback-jp">{current.answer.jp.gloss}</p> : null}
          {current.answer.examples?.[0] ? <p className="vp-feedback-example">{current.answer.examples[0]}</p> : null}
          <button className="primary-button" onClick={next} type="button">
            {index + 1 >= questions.length ? "See result" : "Next"}
          </button>
        </div>
      ) : null}
    </section>
  );
}
