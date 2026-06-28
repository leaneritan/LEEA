"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { readLessonProgress, syncLessonProgressWithCloud, type LessonProgressMap } from "@/data/lessonProgress";
import { teacherLessons } from "@/data/lessons";
import { allGrammar, allWords } from "./reference/ref-data";
import { useKnownWordIds } from "./useKnownWordIds";

export function LessonsPage() {
  const [progress, setProgress] = useState<LessonProgressMap>({});
  const { knownWordSet } = useKnownWordIds();
  const taught = teacherLessons.filter((lesson) => progress[lesson.id]?.status === "done").length;
  const progressPercent = teacherLessons.length ? Math.round((taught / teacherLessons.length) * 100) : 0;
  const reviewCount = Math.max(0, allWords.length - knownWordSet.size);

  useEffect(() => {
    const refresh = () => {
      const localProgress = readLessonProgress();
      setProgress(localProgress);
      void syncLessonProgressWithCloud(localProgress).then(setProgress);
    };
    refresh();
    window.addEventListener("storage", refresh);
    window.addEventListener("focus", refresh);
    return () => { window.removeEventListener("storage", refresh); window.removeEventListener("focus", refresh); };
  }, []);

  return (
    <section className="english-hub english-hub--final">
      <header className="screen-heading">
        <span>Subject</span>
        <h1>English</h1>
        <p>Three courses, one shared reference memory. Each course keeps its own world—pick where Leo is working today.</p>
      </header>

      <div className="english-course-rows">
        <Link className="english-course-row english-course-row--ow" href="/english/our-world">
          <CourseVisual kind="ow" />
          <div className="english-course-detail">
            <span className="course-status">● Active course</span>
            <h2>Our World</h2>
            <p>Photo-rich National Geographic units—vocabulary, grammar, reading, missions and projects. Six levels.</p>
            <div className="course-progress"><span>Level 4 · Unit 8</span><b>{progressPercent}%</b><div><i style={{ width: `${progressPercent}%` }} /></div></div>
            <strong className="course-open course-open--ow">Continue →</strong>
          </div>
        </Link>

        <article className="english-course-row english-course-row--jw">
          <CourseVisual kind="jw" />
          <div className="english-course-detail">
            <span className="course-status course-status--red">● School workbook</span>
            <h2 className="joyful-title">Joyful Work <small>ジョイフルワーク</small></h2>
            <p>Backs up Leo&apos;s school book—grammar, word order, writing and test preparation.</p>
            <div className="course-tags"><span>Year 1</span><span>Planned</span></div>
            <button className="course-open course-open--jw" disabled type="button">Planned</button>
          </div>
        </article>

        <Link className="english-course-row english-course-row--tg" href="/english/training-ground">
          <CourseVisual kind="tg" />
          <div className="english-course-detail">
            <span className="course-status course-status--blue">● Weak-spot drills</span>
            <h2>Training Ground</h2>
            <p>Short, focused sessions for whatever is tricky—a new one whenever Leo needs it.</p>
            <div className="course-tags course-tags--blue"><span>Nouns</span><span>Subject / Object</span><span>Punctuation</span></div>
            <strong className="course-open course-open--tg">Open training →</strong>
          </div>
        </Link>
      </div>

      <Link className="english-reference-footer" href="/reference">
        <span>R</span><div><strong>Reference library</strong><small>Every word and grammar point across all three courses · {knownWordSet.size} known · {reviewCount} to review · {allGrammar.length} grammar</small></div><b>Open Reference</b>
      </Link>
    </section>
  );
}

function CourseVisual({ kind }: { kind: "ow" | "jw" | "tg" }) {
  if (kind === "jw") {
    return <div className="course-visual course-visual--jw"><Image alt="Joyful Work workbook" height={170} src="/brand/joyful_work_logo.png" width={330} /></div>;
  }
  if (kind === "tg") {
    return <div className="course-visual course-visual--tg"><span>TG</span><strong>Training<br />Ground</strong><small>Drill · Train · Win</small></div>;
  }
  return <div className="course-visual course-visual--ow"><span>National Geographic</span><strong>Our<br />World</strong></div>;
}
