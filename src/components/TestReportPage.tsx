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

      <div className="rep-score">
        <div className="rep-score-big">
          <strong>{trim(attempt.score)}</strong>
          <span>out of {trim(attempt.total)} points</span>
        </div>
        <div className="rep-score-pct">{attempt.percent}%</div>
        <div className="rep-bar" aria-hidden="true">
          <span style={{ width: `${Math.min(100, attempt.percent)}%` }} />
        </div>
      </div>

      {attempt.note ? <p className="rep-note">{attempt.note}</p> : null}

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
                {part.missed.length ? (
                  part.missed.map((entry, index) => (
                    <span key={entry.n}>
                      {index > 0 ? ", " : ""}
                      <span className={entry.state === "partial" ? "rep-part" : "rep-miss"}>
                        {entry.n}
                      </span>
                    </span>
                  ))
                ) : (
                  <span className="rep-clean">clean</span>
                )}
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
          <RubricTable rows={rubricQuestion.rubric} />
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
  return (
    <article className={`rep-q is-${question.state}`}>
      <div className="rep-q-top">
        <span className="rep-q-n">{question.n}</span>
        <span className="rep-q-part">{question.part}</span>
        <span className="rep-q-mark">
          {MARK[question.state]} {trim(question.got)} / {trim(question.max)}
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
        {question.answer && question.answer !== question.given ? (
          <div>
            <dt>Answer</dt>
            <dd className="is-key">{question.answer}</dd>
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

function RubricTable({ rows }: { rows: AttemptRubricRow[] }) {
  const got = rows.reduce((sum, row) => sum + row.score, 0);
  const max = rows.reduce((sum, row) => sum + row.max, 0);
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
              {trim(row.score)} / {trim(row.max)}
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
          <td colSpan={2} />
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
  pending: "…"
};

type ReportPart = {
  name: string;
  got: number;
  max: number;
  /** The questions in this section that were not fully right, in the paper's order. */
  missed: { n: string; state: AttemptQuestionState }[];
  questions: TestAttemptQuestion[];
};

/** Sections in the order the paper asked them, which is the order they arrive. */
function groupByPart(questions: TestAttemptQuestion[]): ReportPart[] {
  const order: string[] = [];
  const byName = new Map<string, ReportPart>();

  for (const question of questions) {
    let part = byName.get(question.part);
    if (!part) {
      part = { name: question.part, got: 0, max: 0, missed: [], questions: [] };
      byName.set(question.part, part);
      order.push(question.part);
    }
    part.got += question.got;
    part.max += question.max;
    part.questions.push(question);
    if (question.state === "wrong" || question.state === "partial")
      part.missed.push({ n: question.n, state: question.state });
  }

  return order.map((name) => byName.get(name) as ReportPart);
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
