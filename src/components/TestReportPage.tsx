"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { seedEvaluations } from "@/data/evaluations";
import {
  readTestAttempts,
  type AttemptQuestionState,
  syncTestAttemptsWithCloud,
  type AttemptRubricRow,
  type TestAttempt,
  type TestAttemptQuestion
} from "@/data/testAttempts";

/**
 * One marked test, as the marked paper.
 *
 * `/tests` answers "what has he sat and what did he score". This answers the
 * question that actually helps: *what did he get wrong, and what should it have
 * been*. It is the same record either way — an app sitting files its own
 * questions, and a paper one is marked by hand — so the same page reads both,
 * and the only difference is that a paper sitting usually carries a comment on
 * each answer.
 *
 * It is built to print. A test result is something a parent keeps, and the
 * print rules in globals.css drop the app chrome so ⌘P gives a clean report.
 */
export function TestReportPage({ attemptId }: { attemptId: string }) {
  const [attempt, setAttempt] = useState<TestAttempt | null>(null);
  const [mounted, setMounted] = useState(false);
  const [openPart, setOpenPart] = useState<string | null>(null);

  useEffect(() => {
    seedEvaluations();
    setAttempt(readTestAttempts()[attemptId] ?? null);
    setMounted(true);
    void syncTestAttemptsWithCloud().then((changed) => {
      if (changed) setAttempt(readTestAttempts()[attemptId] ?? null);
    });
  }, [attemptId]);

  const parts = useMemo(() => groupByPart(attempt?.questions ?? []), [attempt]);
  const missed = useMemo(
    () => (attempt?.questions ?? []).filter((q) => q.state === "wrong" || q.state === "partial"),
    [attempt]
  );
  /* An answer nobody has marked yet. The marking itself lives in the test app —
     `markOne` there is the one thing that decides right or wrong, so a second
     place to set it would be a second truth. This page says how many are
     waiting and shows the way in. */
  const waiting = useMemo(
    () => (attempt?.questions ?? []).filter((q) => q.state === "pending"),
    [attempt]
  );
  const rubricQuestion = useMemo(
    () => (attempt?.questions ?? []).find((q) => q.rubric && q.rubric.length > 0) ?? null,
    [attempt]
  );

  if (!mounted) {
    return (
      <section className="rep-page">
        <p className="rep-empty">Loading the report…</p>
      </section>
    );
  }

  if (!attempt) {
    return (
      <section className="rep-page">
        <h1>Report not found</h1>
        <p className="rep-empty">
          There is no sitting stored under that id on this device. It may have been deleted, or it
          may belong to a browser that has not synced yet.
        </p>
        <Link className="rep-back" href="/tests">
          ← Back to tests
        </Link>
      </section>
    );
  }

  return (
    <section className="rep-page">
      <Link className="rep-back rep-noprint" href="/tests">
        ← Back to tests
      </Link>

      <header className="rep-head">
        <p className="rep-eyebrow">Evaluation report</p>
        <h1>{attempt.testTitle}</h1>
        <dl className="rep-meta">
          <div>
            <dt>Student</dt>
            <dd>Leo</dd>
          </div>
          <div>
            <dt>Date</dt>
            <dd>{formatDate(attempt.takenAt)}</dd>
          </div>
          <div>
            <dt>Taken</dt>
            <dd>{attempt.medium === "paper" ? "On paper" : "In the app"}</dd>
          </div>
          {attempt.durationSec ? (
            <div>
              <dt>Time</dt>
              <dd>{formatTime(attempt.durationSec)}</dd>
            </div>
          ) : null}
        </dl>
      </header>

      <div className={`rep-score${waiting.length ? " is-provisional" : ""}`}>
        <div className="rep-score-big">
          <strong>{trim(attempt.score)}</strong>
          <span>out of {trim(attempt.total)} points</span>
        </div>
        <div className="rep-score-pct">{attempt.percent}%</div>
        <div className="rep-bar" aria-hidden="true">
          <span style={{ width: `${Math.min(100, attempt.percent)}%` }} />
        </div>
        {waiting.length ? (
          /* A score with unmarked answers under it is not the score. Say so on
             the number itself, not only in the call-out below it. */
          <p className="rep-provisional">
            Provisional — {waiting.length} written{" "}
            {waiting.length === 1 ? "answer is" : "answers are"} still to mark, worth up to{" "}
            {trim(waiting.reduce((sum, q) => sum + q.max, 0))} more{" "}
            {waiting.reduce((sum, q) => sum + q.max, 0) === 1 ? "point" : "points"}.
          </p>
        ) : null}
      </div>

      {attempt.note ? <p className="rep-note">{attempt.note}</p> : null}

      {attempt.medium === "app" ? (
        <div className="rep-mark-call rep-noprint">
          <div>
            <strong>
              {waiting.length
                ? `${waiting.length} written ${waiting.length === 1 ? "answer is" : "answers are"} still waiting for your mark`
                : "Every written answer is yours to mark"}
            </strong>
            <p>
              Open the test and scroll to the Answer Section. Each written answer has its own
              0-to-max row there — the ones the app placed included — and your mark overrules it.
              The section opens once every page is finished, the speaking page included.
            </p>
          </div>
          <Link className="rep-mark-go" href={`/lessons/${attempt.testId}`}>
            Mark the written answers →
          </Link>
        </div>
      ) : null}

      <h2 className="rep-h2">By section</h2>
      <table className="rep-parts">
        <thead>
          <tr>
            <th>Section</th>
            <th>Score</th>
            <th>Missed</th>
          </tr>
        </thead>
        <tbody>
          {parts.map((part) => (
            <tr key={part.name}>
              <td>{part.name}</td>
              <td className="rep-num">
                {trim(part.got)} / {trim(part.max)}
              </td>
              <td className="rep-num">
                {part.missed.map((entry, index) => (
                  <span key={entry.n}>
                    {index > 0 ? ", " : ""}
                    <span className={entry.state === "partial" ? "rep-part" : "rep-miss"}>
                      {entry.n}
                    </span>
                  </span>
                ))}
                {part.pending.length ? (
                  <span className="rep-tomark">
                    {part.missed.length ? " · " : ""}
                    {part.pending.length} to mark
                  </span>
                ) : null}
                {!part.missed.length && !part.pending.length ? (
                  <span className="rep-clean">clean</span>
                ) : null}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 className="rep-h2">
        What to go over{" "}
        <span className="rep-count">
          {missed.length} {missed.length === 1 ? "question" : "questions"}
        </span>
      </h2>
      {missed.length === 0 ? (
        <p className="rep-empty">Nothing missed — every question was right.</p>
      ) : (
        <ol className="rep-missed">
          {missed.map((question) => (
            <li key={question.n}>
              <QuestionDetail question={question} />
            </li>
          ))}
        </ol>
      )}

      {rubricQuestion?.rubric ? (
        <>
          <h2 className="rep-h2">
            Writing rubric <span className="rep-count">Question {rubricQuestion.n}</span>
          </h2>
          {rubricQuestion.given ? (
            <blockquote className="rep-wrote">{rubricQuestion.given}</blockquote>
          ) : null}
          <RubricTable question={rubricQuestion} rows={rubricQuestion.rubric} />
          {rubricQuestion.comment ? <p className="rep-note">{rubricQuestion.comment}</p> : null}
        </>
      ) : null}

      <h2 className="rep-h2">Every question</h2>
      <p className="rep-lead rep-noprint">
        Tap a section to read what he wrote, what it should have been, and the marking note.
      </p>
      <div className="rep-all">
        {parts.map((part) => {
          const open = openPart === part.name;
          return (
            <div className={`rep-sec${open ? " is-open" : ""}`} key={part.name}>
              <button
                aria-expanded={open}
                className="rep-sec-top rep-noprint"
                onClick={() => setOpenPart(open ? null : part.name)}
                type="button"
              >
                <span className="rep-sec-name">{part.name}</span>
                <span className="rep-sec-score">
                  {trim(part.got)} / {trim(part.max)}
                  {part.pending.length ? (
                    <span className="rep-tomark"> · {part.pending.length} to mark</span>
                  ) : null}
                </span>
                <span className="rep-sec-chev">{open ? "▴" : "▾"}</span>
              </button>
              <div className="rep-sec-body">
                {part.questions.map((question) => (
                  <QuestionDetail key={question.n} question={question} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function QuestionDetail({ question }: { question: TestAttemptQuestion }) {
  const wrong = question.state === "wrong";
  const partial = question.state === "partial";
  const answer = dedupeAnswer(question.answer);
  return (
    <article className={`rep-q is-${question.state}`}>
      <div className="rep-q-top">
        <span className="rep-q-n">{question.n}</span>
        <span className="rep-q-part">{question.part}</span>
        <span className="rep-q-mark">
          {question.state === "pending" ? (
            /* Not a zero. Nobody has judged this answer yet, and "0 / 4" beside
               a written one is what made a whole grammar section read as
               failed. */
            <>◑ — / {trim(question.max)} · Dad marks this</>
          ) : (
            <>
              {MARK[question.state]} {trim(question.got)} / {trim(question.max)}
            </>
          )}
        </span>
      </div>
      {question.question ? <p className="rep-q-ask">{question.question}</p> : null}
      <dl className="rep-q-ans">
        <div>
          <dt>He wrote</dt>
          <dd className={wrong || partial ? "is-off" : ""}>
            {question.given ? question.given : <em>left blank</em>}
          </dd>
        </div>
        {answer && answer !== question.given ? (
          <div>
            <dt>Answer</dt>
            <dd className="is-key">{answer}</dd>
          </div>
        ) : null}
        {question.correction && question.correction !== question.answer ? (
          <div>
            <dt>Written properly</dt>
            <dd className="is-key">{question.correction}</dd>
          </div>
        ) : null}
      </dl>
      {question.comment ? <p className="rep-q-note">{question.comment}</p> : null}
    </article>
  );
}

function RubricTable({
  question,
  rows
}: {
  question: TestAttemptQuestion;
  rows: AttemptRubricRow[];
}) {
  const got = rows.reduce((sum, row) => sum + (row.score ?? 0), 0);
  const max = rows.reduce((sum, row) => sum + row.max, 0);
  const waiting = rows.filter((row) => row.score === null).length;
  /* The rubric is one instrument; the question is worth what the publisher says.
     They match on a band test and differ on a unit quiz, where a rubric out of
     ten counts for the five points the paper allows. */
  const scaled = Math.abs(max - question.max) > 0.001;
  return (
    <table className="rep-rubric">
      <thead>
        <tr>
          <th>Criterion</th>
          <th>Score</th>
          <th>What cost the marks</th>
          <th>Written properly</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr className={row.score === row.max ? "is-full" : ""} key={row.label}>
            <td>{row.label}</td>
            <td className="rep-num">
              {row.score === null ? (
                <span className="rep-tomark">to mark</span>
              ) : (
                trim(row.score)
              )}{" "}
              / {trim(row.max)}
            </td>
            <td>{row.mistake ? row.mistake : <span className="rep-clean">nothing</span>}</td>
            <td>{row.correction ? row.correction : "—"}</td>
          </tr>
        ))}
      </tbody>
      <tfoot>
        <tr>
          <td>Total</td>
          <td className="rep-num">
            {trim(got)} / {trim(max)}
          </td>
          <td colSpan={2}>
            {waiting ? (
              <span className="rep-tomark">
                {waiting} {waiting === 1 ? "criterion is" : "criteria are"} still to mark.
              </span>
            ) : scaled ? (
              <span className="rep-clean">
                counts {trim(question.got)} / {trim(question.max)} on the test
              </span>
            ) : null}
          </td>
        </tr>
      </tfoot>
    </table>
  );
}

/* ── helpers ──────────────────────────────────────────────────────────── */

/** A partial is its own thing: 8 out of 10 is not a cross. */
const MARK: Record<AttemptQuestionState, string> = {
  right: "✔",
  partial: "◐",
  wrong: "✘",
  pending: "◑"
};

type ReportPart = {
  name: string;
  got: number;
  max: number;
  /** The questions in this section that were not fully right, in the paper's order. */
  missed: { n: string; state: AttemptQuestionState }[];
  /**
   * The questions in this section nobody has marked yet.
   *
   * They are not mistakes and must never be counted as any, but they do hold
   * the section's score down — a grammar section read "0 / 4 — clean", which
   * says the two things that cannot both be true. So the section carries them
   * separately and says how many are still to mark.
   */
  pending: string[];
  questions: TestAttemptQuestion[];
};

/** Sections in the order the paper asked them, which is the order they arrive. */
function groupByPart(questions: TestAttemptQuestion[]): ReportPart[] {
  const order: string[] = [];
  const byName = new Map<string, ReportPart>();

  for (const question of questions) {
    let part = byName.get(question.part);
    if (!part) {
      part = { name: question.part, got: 0, max: 0, missed: [], pending: [], questions: [] };
      byName.set(question.part, part);
      order.push(question.part);
    }
    part.got += question.got;
    part.max += question.max;
    part.questions.push(question);
    if (question.state === "wrong" || question.state === "partial")
      part.missed.push({ n: question.n, state: question.state });
    if (question.state === "pending") part.pending.push(question.n);
  }

  return order.map((name) => byName.get(name) as ReportPart);
}

/**
 * Print every accepted wording once.
 *
 * The publisher prints alternatives for some transformations, and several of
 * its keys exist purely to accept a capital letter — so "The more you practice
 * / the more you practice" reads as though the slash were part of the answer.
 * The engine de-duplicates before it records, but an attempt sat before that
 * shipped has the doubled string baked into its record, so the report has to
 * de-duplicate what it reads too.
 */
function dedupeAnswer(answer: string | undefined) {
  if (!answer || !answer.includes("/")) return answer;
  const seen = new Set<string>();
  const shown: string[] = [];
  for (const piece of answer.split("/")) {
    const text = piece.trim();
    if (!text) continue;
    const key = text
      .toLowerCase()
      .replace(/[\u2018\u2019\u02bc]/g, "'")
      .replace(/[.,!?;:]+$/g, "")
      .replace(/\s+/g, " ")
      .trim();
    if (seen.has(key)) continue;
    seen.add(key);
    shown.push(text);
  }
  return shown.join("  /  ");
}

/** 2.5 stays 2.5; 2.0 reads as 2 — a rubric has halves and a question does not. */
function trim(value: number) {
  return Number.isInteger(value) ? String(value) : String(Number(value.toFixed(2)));
}

function formatDate(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

function formatTime(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${String(secs).padStart(2, "0")}`;
}
