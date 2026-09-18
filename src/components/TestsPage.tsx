"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { lessons } from "@/data/lessons";
import { getAssessmentResult, getLearnerAppProgress } from "@/data/learnerProgress";
import type { Lesson } from "@/data/types";

// A test is a teacher lesson with component "test" (the answer key, the speaking
// script, the rubric) paired with the learner "test-app" Leo actually sits. The
// list is derived from the lesson registry rather than kept by hand, so a new
// test appears here the moment it is registered.
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
  const learners = lessons.filter((lesson) => lesson.mode === "learner" && lesson.component === "test-app");
  return lessons
    .filter((lesson) => lesson.mode === "teacher" && lesson.component === "test")
    .map((teacher) => ({
      teacher,
      learner: learners.find(
        (item) => item.course === teacher.course && item.level === teacher.level && item.unit === teacher.unit
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
  useEffect(() => setMounted(true), []);

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
          Every Our World test, with the answer key beside it. Leo sees no right or wrong while he
          answers; the score opens when he has finished every page.
        </p>
      </header>

      {levels.length > 1 ? (
        <div className="tests-filter" role="group" aria-label="Filter tests by level">
          <button
            className={level === "all" ? "active" : ""}
            onClick={() => setLevel("all")}
            type="button"
          >
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
          const result = mounted && learner ? getAssessmentResult(learner.source) : null;
          const started = (progress?.completedModules ?? 0) > 0;
          const finished = Boolean(result?.done);

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
                ) : finished && result ? (
                  <>
                    <span className="tests-score">
                      {result.score} <small>/ {result.total}</small>
                    </span>
                    <span className="tests-pct">{result.percent}%</span>
                    {result.pending > 0 ? (
                      <span className="tests-pill warn">
                        {result.pending} waiting for you to mark
                      </span>
                    ) : (
                      <span className="tests-pill done">Marked</span>
                    )}
                    {result.timeTakenSec ? (
                      <span className="tests-pill muted">Took {formatTime(result.timeTakenSec)}</span>
                    ) : null}
                  </>
                ) : started && progress ? (
                  <span className="tests-pill open">
                    In progress — {progress.completedModules} of {progress.moduleCount} pages
                  </span>
                ) : (
                  <span className="tests-pill muted">Not started</span>
                )}
              </div>

              <div className="tests-actions">
                {learner ? (
                  <Link className="tests-btn primary" href={`/lessons/${learner.id}`}>
                    {started && !finished ? "Continue the test" : "Open the test"}
                  </Link>
                ) : null}
                <Link className="tests-btn" href={`/lessons/${teacher.id}`}>
                  Answer key
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
