"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  assignLesson as assignLessonRecord,
  readAssignments,
  readAssignmentsFromCloud,
  unassignLesson as unassignLessonRecord,
  type AssignmentMap
} from "@/data/assignments";
import { getLearnerAppProgress, syncLearnerProgressWithCloud, type LearnerAppProgress } from "@/data/learnerProgress";
import {
  createLessonProgressRecord,
  readLessonProgress,
  saveLessonProgressRecord,
  syncLessonProgressWithCloud,
  type LessonProgressMap
} from "@/data/lessonProgress";
import { learnerLessons, teacherLessons } from "@/data/lessons";
import type { Lesson } from "@/data/types";

const tgTeacherLessons = teacherLessons.filter((lesson) => lesson.course === "special-training");
const tgLearnerLessons = learnerLessons.filter((lesson) => lesson.course === "special-training");

function findLearnerCounterpart(teacherLesson: Lesson) {
  return tgLearnerLessons.find((lesson) => lesson.component === `${teacherLesson.component}-app`);
}

export function TrainingGroundPage() {
  const [progress, setProgress] = useState<LessonProgressMap>({});
  const [assignments, setAssignments] = useState<AssignmentMap>({});
  const [progressVersion, setProgressVersion] = useState(0);

  useEffect(() => {
    function refresh() {
      setProgress(readLessonProgress());
      void syncLessonProgressWithCloud(readLessonProgress()).then(setProgress);
      setAssignments(readAssignments(learnerLessons));
      void readAssignmentsFromCloud(learnerLessons).then(setAssignments);
      void syncLearnerProgressWithCloud(learnerLessons).then((changed) => {
        if (changed) setProgressVersion((current) => current + 1);
      });
      setProgressVersion((current) => current + 1);
    }
    refresh();
    window.addEventListener("storage", refresh);
    window.addEventListener("focus", refresh);
    return () => {
      window.removeEventListener("storage", refresh);
      window.removeEventListener("focus", refresh);
    };
  }, []);

  const appProgress = useMemo(() => {
    progressVersion;
    return Object.fromEntries(tgLearnerLessons.map((lesson) => [lesson.id, getLearnerAppProgress(lesson.source)]));
  }, [progressVersion]);

  const sessions = tgTeacherLessons.map((lesson, index) => ({
    number: String(index + 1).padStart(2, "0"),
    lesson,
    learner: findLearnerCounterpart(lesson),
    done: progress[lesson.id]?.status === "done"
  }));

  const sessionsDone = sessions.filter((session) => session.done).length;
  const learnerScores = tgLearnerLessons
    .map((lesson) => appProgress[lesson.id]?.score)
    .filter((score): score is number => typeof score === "number");
  const avgAccuracy = learnerScores.length ? `${Math.round(learnerScores.reduce((sum, s) => sum + s, 0) / learnerScores.length)}%` : "—";
  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const playedThisWeek = sessions.filter((session) => {
    const completedAt = progress[session.lesson.id]?.completedAt;
    return completedAt ? new Date(completedAt).getTime() >= weekAgo : false;
  }).length;

  const nextSession = sessions.find((session) => !session.done);

  function setLessonDone(lessonId: string, done: boolean) {
    setProgress((current) => {
      const record = createLessonProgressRecord(lessonId, done);
      const next = { ...current, [lessonId]: record };
      void saveLessonProgressRecord(record);
      return next;
    });
  }

  function assignLesson(lessonId: string) {
    setAssignments((current) => assignLessonRecord(lessonId, current));
  }

  function unassignLesson(lessonId: string) {
    setAssignments((current) => unassignLessonRecord(lessonId, current));
  }

  return (
    <section className="tg-page">
      <section className="tg-hero">
        <div>
          <div className="tg-brand">
            <b>TG</b>
            <span>Training Ground</span>
          </div>
          <h1>
            Ready to train,
            <br />
            Leo?
          </h1>
          <p>
            Short sessions to fix the tricky bits. Win your weak spots, one drill at a time.
          </p>
          <div className="tg-last-five" aria-label="Last five sessions">
            <span>Last 5</span>
            {sessions.slice(0, 5).map((session) => (
              <i className={session.done ? "" : "muted"} key={session.lesson.id} />
            ))}
            {Array.from({ length: Math.max(0, 5 - sessions.length) }).map((_, index) => (
              <i className="muted" key={`empty-${index}`} />
            ))}
          </div>
        </div>

        {nextSession ? (
          <aside>
            <span>Next session</span>
            <b>{nextSession.number}</b>
            <strong>{nextSession.lesson.title}</strong>
            <small>{nextSession.lesson.subtitle}</small>
            <Link href={`/lessons/${nextSession.lesson.id}`}>Kick off →</Link>
          </aside>
        ) : sessions.length ? (
          <aside>
            <span>All caught up</span>
            <b>✓</b>
            <strong>Every session taught</strong>
            <small>Neritan builds the next drill when Leo needs one.</small>
          </aside>
        ) : (
          <aside>
            <span>No sessions yet</span>
            <b>0</b>
            <strong>Nothing built yet</strong>
            <small>Neritan builds a drill for whatever Leo finds tricky.</small>
          </aside>
        )}
      </section>

      <div className="tg-stats">
        <div>
          <span>Sessions done</span>
          <strong>{sessionsDone}</strong>
        </div>
        <div>
          <span>Avg accuracy</span>
          <strong>{avgAccuracy}</strong>
        </div>
        <div className="tg-stat-dark">
          <span>This week</span>
          <strong>{playedThisWeek} played</strong>
        </div>
      </div>

      <section className="tg-session-list">
        <header>
          <h2>Your sessions</h2>
          <button type="button">+ New session</button>
        </header>

        {sessions.map((session) => {
          const learnerProgress = session.learner ? appProgress[session.learner.id] : undefined;
          const assignment = session.learner ? assignments[session.learner.id] : undefined;

          return (
            <article key={session.lesson.id} className={!session.done ? "active" : ""}>
              <b>{session.number}</b>
              <div>
                <h3>{session.lesson.title}</h3>
                <span>Phonics</span>
                <p>{session.lesson.subtitle}</p>
                {session.learner ? (
                  <div className="tg-session-app">
                    <span>{learnerProgress?.done ? "✓ Done" : assignment ? "Assigned" : "Not assigned"}</span>
                    {session.learner.title}
                    {learnerProgress ? ` — ${learnerProgress.completedModules}/${learnerProgress.moduleCount} modules` : null}
                    {learnerProgress?.done || assignment ? (
                      <Link href={`/lessons/${session.learner.id}`}>Open app</Link>
                    ) : (
                      <button onClick={() => assignLesson(session.learner!.id)} type="button">
                        Assign to Leo
                      </button>
                    )}
                    {assignment ? (
                      <button onClick={() => unassignLesson(session.learner!.id)} type="button">
                        Unassign
                      </button>
                    ) : null}
                  </div>
                ) : null}
              </div>
              <div className="tg-session-actions">
                {learnerProgress?.score != null && <strong>{learnerProgress.score}%</strong>}
                {session.done ? <span>✓ Done</span> : <em>Up next</em>}
                <button onClick={() => setLessonDone(session.lesson.id, !session.done)} type="button">
                  {session.done ? "Mark not done" : "Mark done"}
                </button>
                <Link className="tg-open-deck" href={`/lessons/${session.lesson.id}`}>
                  Open deck
                </Link>
              </div>
            </article>
          );
        })}

        <article className="tg-new-session">
          <b>+</b>
          <div>
            <h3>New training session</h3>
            <p>Neritan builds a drill for whatever Leo finds tricky.</p>
          </div>
        </article>
      </section>
    </section>
  );
}
