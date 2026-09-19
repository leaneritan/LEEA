"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { isTestComponent, lessons } from "@/data/lessons";
import {
  clearLearnerProgressCloud,
  getLearnerAppProgress,
  syncLearnerProgressWithCloud,
  wipeSittingLocally
} from "@/data/learnerProgress";
import {
  attemptsForTest,
  collectMistakes,
  createPaperAttempt,
  deleteTestAttempt,
  readTestAttempts,
  saveTestAttempt,
  syncTestAttemptsWithCloud,
  type TestAttempt,
  type TestAttemptMap
} from "@/data/testAttempts";
import type { Lesson } from "@/data/types";

// A test is a teacher lesson with a test component (the answer key, the speaking
// script, the rubric) paired with the learner "-app" Leo actually sits. The list
// is derived from the lesson registry rather than kept by hand, so a new test
// appears here the moment it is registered.
type TestPair = { teacher: Lesson; learner?: Lesson };

const KIND_LABEL: Record<string, string> = {
  "unit-quiz": "Quiz",
  mastery: "Mastery Test",
  final: "Final Test"
};

const COURSE_LABEL: Record<string, string> = {
  "our-world": "Our World",
  "joyful-work": "Joyful Work",
  "special-training": "Training Ground"
};

// "Units 7–9 Mastery Test" reads better on a shelf than the lesson's own
// "Test 7–9 — Units 7, 8 and 9". Fall back to the lesson title if a test has
// no assessment block yet.
function testName(teacher: Lesson) {
  const meta = teacher.assessment;
  if (!meta) return teacher.title.replace(/\s+—.*$/, "");
  return `${meta.covers} ${KIND_LABEL[meta.kind] ?? "Test"}`;
}

function buildTestList(): TestPair[] {
  const learners = lessons.filter((lesson) => lesson.mode === "learner" && isTestComponent(lesson.component));
  return lessons
    .filter((lesson) => lesson.mode === "teacher" && isTestComponent(lesson.component))
    .map((teacher) => ({
      teacher,
      // By component as well as by unit: a level's final and its last mastery
      // test both sit at the band-end unit, so unit alone would pair the final's
      // card with the mastery test's app.
      learner: learners.find(
        (item) =>
          item.component === `${teacher.component}-app` &&
          item.course === teacher.course &&
          item.level === teacher.level &&
          item.unit === teacher.unit
      )
    }))
    .sort((a, b) => {
      const levelDiff = (a.teacher.level ?? 0) - (b.teacher.level ?? 0);
      if (levelDiff !== 0) return levelDiff;
      return (a.teacher.unit ?? 0) - (b.teacher.unit ?? 0);
    });
}

function formatTime(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
}

function formatDate(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
}

function todayValue() {
  return new Date().toISOString().slice(0, 10);
}

/**
 * Whether the test app has anything stored for this test at all.
 *
 * Deliberately not "has he finished a page": a sitting exists the moment he
 * answers one question, and that is exactly when wanting to start over is most
 * likely. Keying the reset off completed pages left a part-answered test with
 * no way to clear it from here.
 */
function hasSitting(learner: Lesson) {
  const prefix = learner.source.storagePrefix;
  if (!prefix || typeof window === "undefined") return false;
  try {
    // Answers, ticks, done-keys and a started clock count. `page` and `score`
    // do not: the app writes those on every render, so a blank test that has
    // merely been opened would otherwise look like work in progress.
    return Object.keys(window.localStorage).some((key) => {
      if (!key.startsWith(prefix)) return false;
      const rest = key.slice(prefix.length);
      return /^m\d/.test(rest) || rest === "time-started" || rest === "revealed";
    });
  } catch {
    return false;
  }
}

/**
 * Clears one test app's saved sitting — the same thing the app's own "Take the
 * test again" does, reachable from the shelf. Attempts already filed are NOT
 * touched: they live under their own key precisely so a retake cannot erase
 * what he scored last time.
 */
async function clearSitting(learner: Lesson) {
  // Both copies, through the one definition of what a sitting owns — the app's
  // own keys and the homework flags that sit outside its prefix.
  wipeSittingLocally(learner.source);
  // The cloud row too. Clearing runs out here in the app, not inside the
  // learner app's frame, so nothing was telling Supabase about it: the row
  // stayed whole and the next page that synced hydrated the sitting back.
  await clearLearnerProgressCloud(learner);
}

export function TestsPage() {
  const tests = useMemo(buildTestList, []);
  const levels = useMemo(
    () => Array.from(new Set(tests.map((test) => test.teacher.level ?? 0))).sort((a, b) => a - b),
    [tests]
  );
  const [level, setLevel] = useState<number | "all">("all");
  // Progress lives in localStorage, so it can only be read once mounted —
  // rendering it on the server would flash an empty state over real results.
  const [mounted, setMounted] = useState(false);
  const [attempts, setAttempts] = useState<TestAttemptMap>({});
  const [openHistory, setOpenHistory] = useState<string | null>(null);
  const [paperFor, setPaperFor] = useState<string | null>(null);
  const [resetArmed, setResetArmed] = useState<string | null>(null);
  const [cleared, setCleared] = useState<string | null>(null);

  const refresh = useCallback(() => setAttempts(readTestAttempts()), []);
  useEffect(() => {
    setMounted(true);
    refresh();
    // This is the page about results, and it was reading only this browser's.
    // A test Leo sat on his own device showed here as "Not sat yet" — with no
    // score and, until now, no reset button either. Every other page that
    // reports progress already pulls the cloud copy first; so does this one.
    const learners = tests.map((test) => test.learner).filter((lesson): lesson is Lesson => Boolean(lesson));
    if (learners.length) void syncLearnerProgressWithCloud(learners).then(() => refresh());
    // And the sittings themselves, which live in their own table: a result Leo
    // filed on his device is what the parent came to this page to look at.
    void syncTestAttemptsWithCloud().then(() => refresh());
  }, [refresh, tests]);

  const mistakes = useMemo(() => (mounted ? collectMistakes(attempts) : []), [mounted, attempts]);
  const liveMistakes = mistakes.filter((item) => item.lastWrong).length;

  const shown = level === "all" ? tests : tests.filter((test) => test.teacher.level === level);

  if (tests.length === 0) {
    return (
      <div className="tests-page">
        <header className="tests-head">
          <h1>Tests</h1>
          <p>No tests have been built yet. They appear here as each one is added.</p>
        </header>
      </div>
    );
  }

  return (
    <div className="tests-page">
      <header className="tests-head">
        <h1>Tests</h1>
        <p>
          Every Our World test, with the answer key beside it. Each sitting is kept under its own
          date, so retaking a test never erases what he scored last time — and a test taken on paper
          can be recorded here too.
        </p>
      </header>

      {mounted && mistakes.length > 0 ? (
        <Link className="tests-mistakes-link" href="/tests/mistakes">
          <span className="tests-mistakes-count">{liveMistakes}</span>
          <span>
            <b>Practise his mistakes</b>
            <small>
              {liveMistakes === 0
                ? `All ${mistakes.length} past mistakes were right last time — practise them anyway`
                : `${liveMistakes} still wrong at the last sitting, out of ${mistakes.length} he has missed`}
            </small>
          </span>
        </Link>
      ) : null}

      {levels.length > 1 ? (
        <div className="tests-filter" role="group" aria-label="Filter tests by level">
          <button className={level === "all" ? "active" : ""} onClick={() => setLevel("all")} type="button">
            All levels
          </button>
          {levels.map((item) => (
            <button
              className={level === item ? "active" : ""}
              key={item}
              onClick={() => setLevel(item)}
              type="button"
            >
              Level {item}
            </button>
          ))}
        </div>
      ) : null}

      <div className="tests-grid">
        {shown.map(({ teacher, learner }) => {
          const meta = teacher.assessment;
          const progress = mounted && learner ? getLearnerAppProgress(learner.source) : null;
          const testId = learner?.id ?? teacher.id;
          const history = mounted ? attemptsForTest(testId, attempts) : [];
          const latest = history[0] ?? null;
          const sitting = mounted && learner ? hasSitting(learner) : false;
          const started = (progress?.completedModules ?? 0) > 0;
          const inProgress = sitting && !latest;

          return (
            <article className="tests-card" key={teacher.id}>
              <div className="tests-card-top">
                <span className="tests-kind">{COURSE_LABEL[teacher.course] ?? teacher.course}</span>
                <span className="tests-level">Level {teacher.level}</span>
              </div>

              <h2>{testName(teacher)}</h2>

              {meta ? (
                <p className="tests-facts">
                  {meta.questions} questions · {meta.points} points · {meta.minutes} minutes
                </p>
              ) : null}

              <div className="tests-status">
                {!mounted ? (
                  <span className="tests-pill muted">Checking…</span>
                ) : latest ? (
                  <>
                    <span className="tests-score">
                      {latest.score} <small>/ {latest.total}</small>
                    </span>
                    <span className="tests-pct">{latest.percent}%</span>
                    <span className="tests-pill muted">{formatDate(latest.takenAt)}</span>
                    {latest.medium === "paper" ? <span className="tests-pill open">On paper</span> : null}
                    {latest.durationSec ? (
                      <span className="tests-pill muted">Took {formatTime(latest.durationSec)}</span>
                    ) : null}
                  </>
                ) : inProgress && progress ? (
                  <span className="tests-pill open">
                    {started
                      ? `In progress — ${progress.completedModules} of ${progress.moduleCount} pages`
                      : "Started"}
                  </span>
                ) : (
                  <span className="tests-pill muted">Not sat yet</span>
                )}
              </div>

              {mounted && history.length > 0 ? (
                <button
                  className="tests-history-toggle"
                  onClick={() => setOpenHistory(openHistory === testId ? null : testId)}
                  type="button"
                >
                  {history.length} {history.length === 1 ? "sitting" : "sittings"}
                  {openHistory === testId ? " ▴" : " ▾"}
                </button>
              ) : null}

              {openHistory === testId ? (
                <ol className="tests-history">
                  {history.map((attempt) => (
                    <li key={attempt.id}>
                      <span className="th-date">{formatDate(attempt.takenAt)}</span>
                      <span className="th-medium">{attempt.medium === "paper" ? "paper" : "app"}</span>
                      <span className="th-score">
                        {attempt.score} / {attempt.total} · {attempt.percent}%
                      </span>
                      <button
                        aria-label={`Delete the sitting of ${formatDate(attempt.takenAt)}`}
                        className="th-del"
                        onClick={() => setAttempts(deleteTestAttempt(attempt.id))}
                        type="button"
                      >
                        ✕
                      </button>
                    </li>
                  ))}
                </ol>
              ) : null}

              <div className="tests-actions">
                {learner ? (
                  <Link className="tests-btn primary" href={`/lessons/${learner.id}`}>
                    {inProgress ? "Continue the test" : latest ? "Sit it again" : "Open the test"}
                  </Link>
                ) : null}
                <Link className="tests-btn" href={`/lessons/${teacher.id}`}>
                  Answer key
                </Link>
                <button
                  className="tests-btn quiet"
                  onClick={() => setPaperFor(paperFor === testId ? null : testId)}
                  type="button"
                >
                  Add a paper result
                </button>
                {/* Always offered, never conditional. It used to appear only
                    when THIS browser held a sitting — so on the parent's laptop,
                    for a test Leo sat on his own device, there was simply no
                    reset button at all. It is idempotent and it clears both
                    copies, so the safe thing is for it to always be reachable. */}
                {learner ? (
                  <button
                    className={`tests-btn quiet${resetArmed === testId ? " armed" : ""}`}
                    onClick={() => {
                      if (resetArmed === testId) {
                        void clearSitting(learner).then(refresh);
                        setResetArmed(null);
                        setCleared(testId);
                        window.setTimeout(() => setCleared((cur) => (cur === testId ? null : cur)), 4000);
                        refresh();
                        return;
                      }
                      setResetArmed(testId);
                      window.setTimeout(() => setResetArmed((cur) => (cur === testId ? null : cur)), 5000);
                    }}
                    type="button"
                  >
                    {resetArmed === testId
                      ? "Tap again — clears his answers and the clock"
                      : sitting
                        ? "Reset this test"
                        : "Reset this test (nothing here)"}
                  </button>
                ) : null}
              </div>

              {cleared === testId ? (
                <p className="tests-cleared">
                  Reset — on this device and in the cloud, so any device Leo sat it on clears
                  itself too. He starts from a blank paper and a full clock; the results below are
                  kept.
                </p>
              ) : null}

              {paperFor === testId ? (
                <PaperForm
                  defaultTotal={meta?.points ?? 100}
                  onCancel={() => setPaperFor(null)}
                  onSave={(entry) => {
                    saveTestAttempt(
                      createPaperAttempt({
                        testId,
                        testTitle: testName(teacher),
                        takenAt: new Date(entry.date).toISOString(),
                        score: entry.score,
                        total: entry.total,
                        note: entry.note
                      })
                    );
                    setPaperFor(null);
                    setOpenHistory(testId);
                    refresh();
                  }}
                />
              ) : null}
            </article>
          );
        })}
      </div>

      <OtherPaperTests attempts={attempts} mounted={mounted} onChange={refresh} />
    </div>
  );
}

/* ── recording a paper sitting ────────────────────────────────────────── */

type PaperEntry = { date: string; score: number; total: number; note: string };

function PaperForm({
  defaultTotal,
  onCancel,
  onSave,
  showTitle,
  title,
  onTitleChange
}: {
  defaultTotal: number;
  onCancel: () => void;
  onSave: (entry: PaperEntry) => void;
  showTitle?: boolean;
  title?: string;
  onTitleChange?: (value: string) => void;
}) {
  const [date, setDate] = useState(todayValue());
  const [score, setScore] = useState("");
  const [total, setTotal] = useState(String(defaultTotal));
  const [note, setNote] = useState("");

  const scoreNum = Number(score);
  const totalNum = Number(total);
  const valid =
    date !== "" &&
    score !== "" &&
    Number.isFinite(scoreNum) &&
    Number.isFinite(totalNum) &&
    totalNum > 0 &&
    scoreNum >= 0 &&
    scoreNum <= totalNum &&
    (!showTitle || (title ?? "").trim() !== "");

  return (
    <form
      className="paper-form"
      onSubmit={(event) => {
        event.preventDefault();
        if (!valid) return;
        onSave({ date, score: scoreNum, total: totalNum, note });
      }}
    >
      <p className="paper-form-lead">
        A test he sat on paper. The score and the date are all that is needed — mark it from the
        ExamView key as usual.
      </p>
      {showTitle ? (
        <label>
          Test
          <input
            onChange={(event) => onTitleChange?.(event.target.value)}
            placeholder="e.g. Level 4 Unit 6 Quiz"
            type="text"
            value={title ?? ""}
          />
        </label>
      ) : null}
      <div className="paper-form-row">
        <label>
          Date
          <input onChange={(event) => setDate(event.target.value)} type="date" value={date} />
        </label>
        <label>
          Score
          <input
            inputMode="numeric"
            onChange={(event) => setScore(event.target.value)}
            placeholder="66"
            type="number"
            value={score}
          />
        </label>
        <label>
          Out of
          <input
            inputMode="numeric"
            onChange={(event) => setTotal(event.target.value)}
            type="number"
            value={total}
          />
        </label>
      </div>
      <label>
        Note <span className="paper-form-opt">optional</span>
        <input
          onChange={(event) => setNote(event.target.value)}
          placeholder="What he struggled with"
          type="text"
          value={note}
        />
      </label>
      <div className="paper-form-actions">
        <button className="tests-btn primary" disabled={!valid} type="submit">
          Save this sitting
        </button>
        <button className="tests-btn quiet" onClick={onCancel} type="button">
          Cancel
        </button>
      </div>
    </form>
  );
}

/**
 * Paper tests that have no digital counterpart — the units and levels never
 * built here. They are the reason this section exists: the shelf above can only
 * show tests that exist as lessons, and most of what Leo has sat does not.
 */
function OtherPaperTests({
  attempts,
  mounted,
  onChange
}: {
  attempts: TestAttemptMap;
  mounted: boolean;
  onChange: () => void;
}) {
  const [adding, setAdding] = useState(false);
  const [title, setTitle] = useState("");

  const known = new Set(
    lessons.filter((lesson) => isTestComponent(lesson.component)).map((lesson) => lesson.id)
  );
  const loose: TestAttempt[] = mounted
    ? Object.values(attempts)
        .filter((attempt) => !known.has(attempt.testId))
        .sort((a, b) => (a.takenAt < b.takenAt ? 1 : -1))
    : [];

  return (
    <section className="tests-other">
      <div className="tests-other-head">
        <h2>Other paper tests</h2>
        <button className="tests-btn quiet" onClick={() => setAdding((value) => !value)} type="button">
          {adding ? "Cancel" : "Add a paper test"}
        </button>
      </div>
      <p className="tests-other-lead">
        Tests that have no digital version here — earlier units, other levels, anything sat from the
        ExamView printout. Recorded by name so the scores stay together.
      </p>

      {adding ? (
        <PaperForm
          defaultTotal={100}
          onCancel={() => setAdding(false)}
          onSave={(entry) => {
            saveTestAttempt(
              createPaperAttempt({
                testId: `paper:${title.trim().toLowerCase().replace(/\s+/g, "-")}`,
                testTitle: title.trim(),
                takenAt: new Date(entry.date).toISOString(),
                score: entry.score,
                total: entry.total,
                note: entry.note
              })
            );
            setTitle("");
            setAdding(false);
            onChange();
          }}
          onTitleChange={setTitle}
          showTitle
          title={title}
        />
      ) : null}

      {mounted && loose.length > 0 ? (
        <table className="tests-other-table">
          <tbody>
            {loose.map((attempt) => (
              <tr key={attempt.id}>
                <td>{formatDate(attempt.takenAt)}</td>
                <td className="tot-name">
                  {attempt.testTitle}
                  {attempt.note ? <small>{attempt.note}</small> : null}
                </td>
                <td className="tot-score">
                  {attempt.score} / {attempt.total} · {attempt.percent}%
                </td>
                <td>
                  <button
                    aria-label={`Delete ${attempt.testTitle}`}
                    className="th-del"
                    onClick={() => {
                      deleteTestAttempt(attempt.id);
                      onChange();
                    }}
                    type="button"
                  >
                    ✕
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : mounted && !adding ? (
        <p className="tests-other-empty">Nothing recorded yet.</p>
      ) : null}
    </section>
  );
}
