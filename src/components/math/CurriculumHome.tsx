"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { mathBooksByGrade } from "../../../content/subjects/math/curriculum";
import { mathGrades, type MathGrade } from "../../../content/subjects/math/grades";
import type { MathExtraLessonSummary } from "../../../content/subjects/math/loadSection";
import type { MathChapterMeta } from "../../../content/subjects/math/types";
import { readMathProgress, syncMathProgressWithCloud, type MathBlockProgressMap } from "../../data/mathProgress";
import { MathTopbarHome } from "./MathTopbarHome";

const STATUS_LABEL: Record<string, string> = { done: "完了", now: "学習中", todo: "未学習" };

export function CurriculumHome({ extraLessons = {} }: { extraLessons?: Record<string, MathExtraLessonSummary[]> }) {
  const [progress, setProgress] = useState<MathBlockProgressMap>({});
  const [grade, setGrade] = useState<MathGrade>("g1");
  const chapters = mathBooksByGrade[grade];
  const [open, setOpen] = useState<Record<string, boolean>>(() => {
    const defaultOpen: Record<string, boolean> = {};
    const nowChapter = chapters.find((chapter) => chapter.sections.some((section) => section.status === "now"));
    if (nowChapter) defaultOpen[nowChapter.id] = true;
    return defaultOpen;
  });

  useEffect(() => {
    const local = readMathProgress();
    setProgress(local);
    void syncMathProgressWithCloud(local).then(setProgress);
  }, []);

  function pickGrade(nextGrade: MathGrade) {
    setGrade(nextGrade);
    setOpen({});
  }

  const totalSectionCount = chapters.reduce((sum, chapter) => sum + chapter.sections.length, 0);
  const doneSectionCount = chapters.reduce((sum, chapter) => sum + chapter.sections.filter((section) => section.status === "done").length, 0);
  const doneBlockCount = useMemo(() => Object.values(progress).filter((record) => record.status === "done").length, [progress]);

  const resumeSection = useMemo(() => {
    for (const chapter of chapters) {
      const section = chapter.sections.find((s) => s.status === "now");
      if (section) return { chapter, section };
    }
    return chapters[0]?.sections[0] ? { chapter: chapters[0], section: chapters[0].sections[0] } : null;
  }, [chapters]);

  const gradeMeta = mathGrades.find((g) => g.key === grade) ?? mathGrades[0];

  return (
    <div className="math-scope">
      <div className="math-topbar">
        <div className="math-home-topbar-inner">
          <MathTopbarHome />
          <span className="math-topbar-brand">数学の学び</span>
          <span className="math-grade-switch math-grade-switch--home">
            {mathGrades.map((g) => (
              <button
                key={g.key}
                type="button"
                className={`math-grade-btn math-grade-btn--home${grade === g.key ? " math-grade-btn--active" : ""}`}
                onClick={() => pickGrade(g.key)}
              >
                {g.label}
              </button>
            ))}
          </span>
          <Link className="math-speciallesson-navbtn" href="/math/free">
            特訓レッスン
          </Link>
          <span className="math-home-book-label">{gradeMeta.book}</span>
          <span className="math-home-student">レオ</span>
        </div>
      </div>

      <div className="math-page math-home-page">
        <div className="math-stats-card">
          <div>
            <div className="math-stats-greeting">おかえり、レオくん！</div>
            {resumeSection ? (
              <div className="math-stats-resume">
                つづきから：
                <Link href={`/math/${resumeSection.chapter.id}/${resumeSection.section.id}`}>
                  {resumeSection.chapter.num}章 {resumeSection.section.name}
                </Link>
              </div>
            ) : (
              <div className="math-stats-resume">教科書がとどいたら、ここからはじめよう。</div>
            )}
          </div>
          <div className="math-stat-block">
            <div className="math-stat-value" style={{ color: "#c9804f" }}>
              {doneSectionCount}
              <span style={{ fontSize: 13 }}>/{totalSectionCount}</span>
            </div>
            <div className="math-stat-label">節 完了</div>
          </div>
          <div className="math-stat-block">
            <div className="math-stat-value" style={{ color: "#7c9a5e" }}>
              ♥ {doneBlockCount}
            </div>
            <div className="math-stat-label">できた問題</div>
          </div>
          <div className="math-stat-block">
            <div className="math-stat-value" style={{ color: "#e8a13c" }}>
              🔥 –
            </div>
            <div className="math-stat-label">記録はこれから</div>
          </div>
        </div>

        <div className="math-chapter-list">
          {chapters.map((chapter) => {
            const done = chapter.sections.filter((s) => s.status === "done").length;
            const pct = Math.round((done / chapter.sections.length) * 100);
            const isOpen = !!open[chapter.id];
            const chapterExtraLessonCount = chapter.sections.reduce(
              (sum, s) => sum + (extraLessons[s.id]?.length ?? 0),
              0
            );

            return (
              <div
                className="math-chapter-card"
                key={chapter.id}
                style={{ "--m-accent": chapter.color, "--m-tint": chapter.tint, "--m-dark": chapter.dark } as React.CSSProperties}
              >
                <button
                  className="math-chapter-row"
                  onClick={() => setOpen((current) => ({ ...current, [chapter.id]: !current[chapter.id] }))}
                  type="button"
                >
                  <span className="math-chapter-badge">{chapter.num}</span>
                  <span className="math-chapter-titles">
                    <span className="math-chapter-title">
                      {chapter.num}章 {chapter.title}
                    </span>
                    <span className="math-chapter-subtitle">{chapter.subtitle}</span>
                  </span>
                  <span className="math-chapter-end">
                    {chapterExtraLessonCount > 0 ? (
                      <span className="math-chapter-extra-badge" title="この章のおまけレッスン">
                        📘 {chapterExtraLessonCount}
                      </span>
                    ) : null}
                    <span className="math-progress-track" style={{ width: 110 }}>
                      <span className="math-progress-fill" style={{ width: `${pct}%`, display: "block" }} />
                    </span>
                    <span className="math-chapter-progress-label">
                      {done} / {chapter.sections.length} 節
                    </span>
                    <span className={`math-chapter-chevron${isOpen ? " math-chapter-chevron--open" : ""}`}>▼</span>
                  </span>
                </button>
                {isOpen ? (
                  <div className="math-section-list">
                    {chapter.sections.map((section) => (
                      <SectionRow
                        chapter={chapter}
                        key={section.id}
                        lessons={extraLessons[section.id] ?? []}
                        section={section}
                      />
                    ))}
                  </div>
                ) : null}
              </div>
            );
          })}
          {chapters.length === 0 ? (
            <div className="math-chapter-empty">
              <div className="math-chapter-empty-title">{gradeMeta.label}の教科書はまだ準備中</div>
              <div className="math-chapter-empty-sub">教科書がとどいたら、ここに章がならぶよ。</div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function SectionRow({
  chapter,
  lessons,
  section
}: {
  chapter: MathChapterMeta;
  lessons: MathExtraLessonSummary[];
  section: MathChapterMeta["sections"][number];
}) {
  const dotStyle =
    section.status === "done"
      ? { background: "#7c9a5e", color: "#fff", borderColor: "#7c9a5e" }
      : section.status === "now"
        ? { background: chapter.tint, color: chapter.dark, borderColor: chapter.color }
        : { background: "#fff", color: chapter.dark, borderColor: "#ded3b8" };
  const statusStyle =
    section.status === "done"
      ? { color: "#4a6b35", background: "#eef5e8" }
      : section.status === "now"
        ? { color: chapter.dark, background: chapter.tint }
        : { color: "#b3a685", background: "#f3eede" };

  return (
    <div className="math-section-row-wrap">
      <Link className="math-section-row" href={`/math/${chapter.id}/${section.id}`}>
        <span className="math-section-dot" style={dotStyle}>
          {section.status === "done" ? "✓" : section.status === "now" ? "…" : ""}
        </span>
        <span className="math-section-name">{section.name}</span>
        <span className="math-section-pages">{section.pages}</span>
        <span className="math-section-end">
          {lessons.length > 0 ? (
            <span className="math-section-extra-badge" title="この節のおまけレッスン">
              📘 {lessons.length}
            </span>
          ) : null}
          <span className="math-section-status" style={statusStyle}>
            {STATUS_LABEL[section.status]}
          </span>
        </span>
      </Link>
      {section.digitalUrl ? (
        <a
          className="math-companion-link"
          href={section.digitalUrl}
          rel="noopener noreferrer"
          target="_blank"
          title="デジタル教科書でこの節を開く"
        >
          📘 デジタル教科書
        </a>
      ) : null}
      {lessons.length > 0 ? (
        <div className="math-section-lessons">
          {lessons.map((lesson) => (
            <a
              className="math-section-lesson"
              href={lesson.href}
              key={lesson.blockId}
              rel="noopener noreferrer"
              target="_blank"
              title={lesson.label}
            >
              <span className="math-section-lesson-icon">{lesson.label.split(" ")[0]}</span>
              <span className="math-section-lesson-title">{lesson.heading}</span>
              {lesson.page ? <span className="math-section-lesson-page">p.{lesson.page}</span> : null}
            </a>
          ))}
        </div>
      ) : null}
    </div>
  );
}
