"use client";

import Link from "next/link";
import { CheckCircle2, Circle, RotateCcw } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";
import {
  assignLesson,
  createAssignmentRecord,
  createReviewRecord,
  readAssignments,
  readAssignmentsFromCloud,
  saveAssignments,
  type AssignmentMap,
  type AssignmentRecord
} from "@/data/assignments";
import { getLearnerAppProgress, syncLearnerProgressWithCloud, loadLocalValue, type LearnerAppProgress } from "@/data/learnerProgress";
import { learnerLessons } from "@/data/lessons";
import type { Lesson } from "@/data/types";
import { getComponentMeta } from "./componentMeta";

type SavedScore = {
  score?: number;
  total?: number;
  percent?: number;
  answers?: Array<number | null>;
  done?: boolean;
};

type ReviewQuestion = {
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

const vocab2Questions: ReviewQuestion[] = [
  { prompt: "A small insect is a ___.", options: ["fossil", "bug", "comic book", "stuffed animal"], correctIndex: 1, explanation: "Bug = small insect." },
  { prompt: "Spider-Man, Iron Man and Batman appear in ___.", options: ["fossils", "comic books", "dinosaur models", "stuffed animals"], correctIndex: 1, explanation: "Comic books — Marvel and DC heroes." },
  { prompt: "An animal that lived millions of years ago is a ___.", options: ["stuffed animal", "dinosaur", "bug", "comic book"], correctIndex: 1, explanation: "Dinosaur." },
  { prompt: "A teddy bear is a ___.", options: ["fossil", "stuffed animal", "dinosaur"], correctIndex: 1, explanation: "A teddy bear is a stuffed animal." },
  { prompt: "A mark or bone of an animal from long ago — found in rock — is a ___.", options: ["fossil", "bug", "comic book"], correctIndex: 0, explanation: "Fossil." },
  { prompt: "Workbook p. 98: Which one moves with batteries?", options: ["bug", "dinosaur", "fossil"], correctIndex: 0, explanation: "Toy bugs move with batteries." },
  { prompt: "Leo collects ___ from the Premier League. Which fits best?", options: ["fossils", "soccer cards", "bugs"], correctIndex: 1, explanation: "Soccer cards work like collectible paper items." },
  { prompt: "How correct something is — that’s ___.", options: ["accuracy", "collecting", "flexibility"], correctIndex: 0, explanation: "Accuracy = how correct." },
  { prompt: "Sid from Ice Age would be sold in a store as a ___.", options: ["fossil", "stuffed animal", "dinosaur model"], correctIndex: 1, explanation: "A stuffed animal is a soft toy." },
  { prompt: "We know dinosaurs existed because of ___.", options: ["comic books", "fossils", "stuffed animals"], correctIndex: 1, explanation: "Fossils show us the past." }
];

export function TeacherReviewPage({ lesson }: { lesson: Lesson }) {
  const [assignments, setAssignments] = useState<AssignmentMap>({});
  const [progress, setProgress] = useState<LearnerAppProgress>(() => getEmptyProgress(lesson));
  const [savedScore, setSavedScore] = useState<SavedScore | null>(null);
  const [onlyMissed, setOnlyMissed] = useState(false);
  const [note, setNote] = useState("Great job, Leo! Let’s practice the tricky parts together.");
  const assignment = assignments[lesson.id];
  const meta = getComponentMeta(lesson.component);

  useEffect(() => {
    function refresh() {
      setAssignments(readAssignments(learnerLessons));
      void readAssignmentsFromCloud(learnerLessons).then(setAssignments);
      void syncLearnerProgressWithCloud([lesson]).then((changed) => {
        if (changed) {
          setProgress(getLearnerAppProgress(lesson.source));
          setSavedScore(readSavedScore(lesson));
        }
      });
      setProgress(getLearnerAppProgress(lesson.source));
      setSavedScore(readSavedScore(lesson));
    }

    refresh();
    window.addEventListener("storage", refresh);
    window.addEventListener("focus", refresh);
    return () => {
      window.removeEventListener("storage", refresh);
      window.removeEventListener("focus", refresh);
    };
  }, [lesson]);

  function assign() {
    setAssignments((current) => assignLesson(lesson.id, current));
  }

  function review(status: "reviewed" | "needs-redo") {
    const current = assignment ?? createAssignmentRecord(lesson.id);
    const reviewed = createReviewRecord(current, status);
    setAssignments((existing) => saveAssignments({ ...existing, [lesson.id]: { ...reviewed, reviewNote: note } }));
  }

  const questions = useMemo(() => {
    if (lesson.component === "vocab-2-app") return vocab2Questions;
    return progress.modules.map((module) => ({
      prompt: module.label,
      options: ["Done", "Not yet"],
      correctIndex: module.done ? 0 : 1,
      explanation: module.done ? "Module completed." : "Module not completed yet."
    }));
  }, [lesson.component, progress.modules]);

  const reviewedQuestions = questions.map((question, index) => {
    const chosen = savedScore?.answers?.[index];
    const answered = chosen !== undefined && chosen !== null;
    const isCorrect = answered ? chosen === question.correctIndex : index < progress.completedModules;
    return { ...question, chosen, answered, isCorrect };
  });
  const visibleQuestions = onlyMissed ? reviewedQuestions.filter((question) => !question.isCorrect) : reviewedQuestions;
  const correctCount = savedScore?.score ?? reviewedQuestions.filter((question) => question.isCorrect).length;
  const totalCount = savedScore?.total ?? (reviewedQuestions.length || progress.moduleCount);
  const percent = progress.score ?? (totalCount ? Math.round((correctCount / totalCount) * 100) : 0);
  const modulesDone = `${progress.completedModules}/${progress.moduleCount}`;
  const weakSpot = reviewedQuestions.find((question) => !question.isCorrect)?.prompt ?? "one tricky spot";

  return (
    <section className="review-page review-design-page">
      <Link className="review-back" href="/teacher">← Back to Teacher menu</Link>
      <header className={`review-hero review-design-hero review-hero-${meta.tone}`}>
        <span className="eyebrow">Quiz review · {meta.label} · Our World · L{lesson.level} · U{lesson.unit}</span>
        <h1>{cleanReviewTitle(lesson.title)}</h1>
        <p><span className="review-learner-dot">L</span> Leo finished this · {formatFinishedText(assignment)}</p>
      </header>

      <section className="review-score-card review-design-score" aria-label="Leo app review summary">
        <div className="review-score-ring" style={{ "--review-score": `${percent}%` } as CSSProperties}>
          <strong>{percent ? `${percent}%` : "—"}</strong>
          <span>{correctCount} of {totalCount}<br />correct</span>
        </div>
        <div className="review-score-copy">
          <span>How Leo did</span>
          <h2>{progress.done || savedScore?.done ? <>Strong work — one spot to revisit: <em>{shortWeakSpot(weakSpot)}</em>.</> : "Work is still in progress."}</h2>
          <div className="review-score-stats">
            <ReviewStat label="first try" value={`${correctCount}/${totalCount}`} />
            <ReviewStat label="time spent" value="Saved locally" />
            <ReviewStat label="modules done" value={modulesDone} />
          </div>
          <div className="review-score-actions">
            <button className="teacher-done-button warning" onClick={() => review("needs-redo")} type="button"><RotateCcw size={18} />Re-drill weak spot</button>
            <button className="teacher-done-button active" onClick={() => review("reviewed")} type="button"><CheckCircle2 size={18} />Mark reviewed</button>
          </div>
        </div>
      </section>

      <section className="review-skill-card" aria-label="Skill breakdown">
        <span>By skill</span>
        <div className="review-skill-grid">
          <SkillBar label="Word meanings" value={Math.min(correctCount, 7)} total={7} />
          <SkillBar label="Spelling" value={progress.modules.filter((module) => module.done && /spell|unscramble/i.test(module.label)).length || 0} total={2} />
          <SkillBar label="Using in a sentence" value={Math.max(0, correctCount - 7)} total={Math.max(1, totalCount - 7)} warn />
        </div>
      </section>

      <section className="review-question-card">
        <header>
          <h2>Question by question</h2>
          <button className={onlyMissed ? "review-filter active" : "review-filter"} onClick={() => setOnlyMissed((value) => !value)} type="button">Only missed</button>
        </header>
        <div className="review-question-list">
          {visibleQuestions.length ? visibleQuestions.map((question, index) => (
            <QuestionRow displayIndex={reviewedQuestions.indexOf(question) + 1 || index + 1} key={`${question.prompt}-${index}`} question={question} />
          )) : <div className="empty-results">No missed questions. Nice.</div>}
        </div>
      </section>

      <section className="review-note-card">
        <span className="review-note-avatar">N</span>
        <div>
          <small>Leave Leo a note</small>
          <p>He&apos;ll see it on his homework screen.</p>
          <textarea value={note} onChange={(event) => setNote(event.target.value)} />
          <button className="teacher-open-button" onClick={() => review("reviewed")} type="button">Send to Leo</button>
        </div>
      </section>

      <section className="review-actions">
        <Link className="ghost-button" href="/teacher">Back to Teacher Menu</Link>
        <Link className="ghost-button" href={`/lessons/${lesson.id}`}>Open Leo App</Link>
        {!assignment ? <button className="teacher-done-button" onClick={assign} type="button"><Circle size={18} />Assign to Leo</button> : null}
      </section>
    </section>
  );
}

function QuestionRow({ displayIndex, question }: { displayIndex: number; question: ReviewQuestion & { chosen?: number | null; answered: boolean; isCorrect: boolean } }) {
  const chosenText = question.chosen !== undefined && question.chosen !== null ? question.options[question.chosen] : "";
  const correctText = question.options[question.correctIndex];

  return (
    <article className={question.isCorrect ? "review-question-row correct" : "review-question-row missed"}>
      <span className="review-question-number">{displayIndex}</span>
      <div>
        <h3>{question.prompt}</h3>
        {!question.isCorrect ? (
          <div className="review-answer-stack">
            {chosenText ? <p className="wrong-answer"><b>Leo</b> {chosenText}</p> : null}
            <p className="right-answer"><b>Answer</b> {correctText}</p>
          </div>
        ) : null}
      </div>
      <aside>
        <span>{question.isCorrect ? "✓ Correct" : "✕ Missed"}</span>
        <small>{question.answered ? "saved answer" : "inferred"}</small>
      </aside>
    </article>
  );
}

function SkillBar({ label, value, total, warn = false }: { label: string; value: number; total: number; warn?: boolean }) {
  const safeTotal = Math.max(1, total);
  const safeValue = Math.min(value, safeTotal);
  return (
    <div className={warn ? "review-skill warn" : "review-skill"}>
      <div><strong>{label}</strong><b>{safeValue}/{safeTotal}</b></div>
      <i><span style={{ width: `${Math.round((safeValue / safeTotal) * 100)}%` }} /></i>
    </div>
  );
}

function ReviewStat({ label, value }: { label: string; value: string }) {
  return <div><strong>{value}</strong><span>{label}</span></div>;
}

function readSavedScore(lesson: Lesson): SavedScore | null {
  if (!lesson.source.storagePrefix || typeof window === "undefined") return null;
  return loadLocalValue<SavedScore | null>(`${lesson.source.storagePrefix}${lesson.source.scoreKey ?? "score"}`, null);
}

function formatFinishedText(assignment: AssignmentRecord | undefined) {
  if (assignment?.updatedAt) {
    return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }).format(new Date(assignment.updatedAt));
  }
  return "saved locally";
}

function cleanReviewTitle(title: string) {
  return title.replace(/^Unit 8 /, "").replace(/ App$/, "").replace(/ Leo's Test App$/, "");
}

function shortWeakSpot(text: string) {
  if (/accuracy/i.test(text)) return "accuracy";
  if (/sentence|collect/i.test(text)) return "using words in a sentence";
  return text.length > 42 ? `${text.slice(0, 42)}…` : text;
}

function getEmptyProgress(lesson: Lesson): LearnerAppProgress {
  return {
    completedModules: 0,
    moduleCount: lesson.source.moduleCount ?? 1,
    modules: [],
    score: null,
    done: false,
    caption: ""
  };
}
