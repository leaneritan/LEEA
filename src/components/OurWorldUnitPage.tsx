"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getLearnerAppProgress, syncLearnerProgressWithCloud } from "@/data/learnerProgress";
import { getLessonGroups } from "@/data/lessons";
import type { Lesson } from "@/data/types";
import { getComponentMeta } from "./componentMeta";

const lessonCopy: Record<string, { title: string; subtitle: string }> = {
  opener: {
    title: "Unit 8 Opener",
    subtitle: "Hobbies, interests & the Arctic photo"
  },
  "vocab-1": {
    title: "Vocabulary 1",
    subtitle: "14 words about hobbies & games"
  },
  song: {
    title: "Unit 8 Song",
    subtitle: "“What’s Your Hobby?” — sing along"
  },
  "grammar-1": {
    title: "Describing people with 'who'",
    subtitle: "Relative clauses for people"
  },
  "vocab-2": {
    title: "Vocabulary 2",
    subtitle: "5 collecting words"
  },
  "grammar-2": {
    title: "Direct & Indirect Objects",
    subtitle: "Who is doing what to whom"
  },
  reading: {
    title: "Hide and Seek",
    subtitle: "A geocaching adventure story"
  },
  writing: {
    title: "Explain a Hobby",
    subtitle: "Origami how-to writing"
  }
};

const unitMeta: Record<number, { title: string; subtitle: string; chips: string[] }> = {
  7: {
    title: "Good Idea!",
    subtitle: "Inventions, ideas & the Space Projection Helmet.",
    chips: ["💡 Inventions", "🔬 Ideas", "🚀 Solutions"]
  },
  8: {
    title: "That's Really Interesting!",
    subtitle: "Hobbies, interests & the Arctic.",
    chips: ["🎨 Hobbies", "📷 Photography", "🐻‍❄️ Polar Bears"]
  },
  9: {
    title: "The Science of Fun",
    subtitle: "Force, motion & a mountain biking photo.",
    chips: ["⚡ Force", "🎡 Motion", "🚵 Mountain Biking"]
  }
};

function getLearnerForTeacher(teacher: Lesson, lessons: Lesson[]) {
  return lessons.find((lesson) => lesson.mode === "learner" && lesson.component === `${teacher.component}-app`);
}

function getLessonState(teacher: Lesson, learner: Lesson | undefined) {
  if (!learner) {
    return {
      className: "is-locked",
      label: "Dad unlocks soon",
      action: null,
      progress: null
    };
  }

  const progress = getLearnerAppProgress(learner.source);
  const total = progress.moduleCount || learner.source.moduleCount || 0;
  const done = Math.min(progress.completedModules, total);
  const isComplete = total > 0 && done >= total;
  const isStarted = done > 0;

  return {
    className: isComplete ? "is-done" : isStarted ? "is-active" : "is-ready",
    label: isComplete ? `✓ ${progress.score ?? 100}%` : isStarted ? "In progress" : learner.status === "assigned" ? "Assigned" : "Ready",
    action: {
      href: `/lessons/${learner.id}`,
      label: isComplete ? "Replay" : isStarted ? "Keep going" : "Start"
    },
    progress: total > 0 ? { done, total } : null
  };
}

export function OurWorldUnitPage({ unit }: { unit: number }) {
  const [progressVersion, setProgressVersion] = useState(0);
  const meta = unitMeta[unit] ?? { title: `Unit ${unit}`, subtitle: "", chips: [] };
  const group = getLessonGroups().find((item) => item.course === "our-world" && item.level === 4 && item.unit === unit);

  useEffect(() => {
    const currentGroup = getLessonGroups().find((item) => item.course === "our-world" && item.level === 4 && item.unit === unit);
    if (!currentGroup) return;
    const learners = currentGroup.lessons.filter((lesson) => lesson.mode === "learner");
    void syncLearnerProgressWithCloud(learners).then((changed) => {
      if (changed) setProgressVersion((value) => value + 1);
    });
  }, [unit]);

  progressVersion;

  const teacherLessons = group?.lessons.filter((lesson) => lesson.mode === "teacher") ?? [];
  const lessonRows = teacherLessons.map((teacher) => {
    const learner = group ? getLearnerForTeacher(teacher, group.lessons) : undefined;
    return { teacher, learner, state: getLessonState(teacher, learner) };
  });
  const completedCount = lessonRows.filter((row) => row.state.className === "is-done").length;
  const nextRow = lessonRows.find((row) => row.state.className === "is-active") ?? lessonRows.find((row) => row.state.className === "is-ready");
  const nextCopy = nextRow ? lessonCopy[nextRow.teacher.component] ?? nextRow.teacher : null;

  return (
    <section className="ow-unit-page">
      <section className="ow-unit-hero">
        <div className="ow-unit-hero__brand">
          <span>National Geographic</span>
          <h1>Our<br />World</h1>
          <b>Level 4 · Unit {unit}</b>
          <p>{meta.subtitle}</p>
          <div className="ow-hero-chips" aria-label="Unit themes">
            {meta.chips.map((chip) => <span key={chip}>{chip}</span>)}
          </div>
        </div>

        {nextRow && nextCopy ? (
          <aside className="ow-unit-next">
            <span>Continue Unit {unit}</span>
            <strong>{nextCopy.title}</strong>
            {nextRow.state.progress ? (
              <div className="ow-unit-next__meter" aria-label={`${nextRow.state.progress.done} of ${nextRow.state.progress.total} modules complete`}>
                <i style={{ width: `${Math.round((nextRow.state.progress.done / nextRow.state.progress.total) * 100)}%` }} />
                <b>{nextRow.state.progress.done}/{nextRow.state.progress.total}</b>
              </div>
            ) : null}
            {nextRow.state.action ? <Link href={nextRow.state.action.href}>Keep going →</Link> : null}
          </aside>
        ) : null}
      </section>

      <header className="unit-list-heading ow-unit-heading">
        <h2>Unit {unit} lessons</h2>
        <strong>{completedCount} of {teacherLessons.length} done · keep climbing!</strong>
      </header>

      <div className="unit-design-list">
        {lessonRows.map(({ teacher, state }) => {
          const meta = getComponentMeta(teacher.component);
          const copy = (teacher.unit === 8 ? lessonCopy[teacher.component] : undefined) ?? { title: teacher.title, subtitle: teacher.subtitle };
          return (
            <article className={`unit-design-row unit-design-row--${meta.tone} ${state.className}`} key={teacher.id}>
              <span className="unit-design-icon" aria-hidden="true">{meta.emoji}</span>
              <div className="unit-design-copy">
                <small>{meta.label}</small>
                <h3>{copy.title}</h3>
                <p>{copy.subtitle}</p>
                {state.progress && state.className === "is-active" ? (
                  <div className="unit-row-meter" aria-label={`${state.progress.done} of ${state.progress.total} modules complete`}>
                    <i style={{ width: `${Math.round((state.progress.done / state.progress.total) * 100)}%` }} />
                    <b>{state.progress.done}/{state.progress.total}</b>
                  </div>
                ) : null}
              </div>
              <div className="unit-design-state">
                <span>{state.label}</span>
                {state.action ? <Link href={state.action.href}>{state.action.label}</Link> : null}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
