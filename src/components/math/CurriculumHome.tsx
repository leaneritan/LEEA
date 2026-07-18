"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { mathChapters, mathTotalSectionCount } from "../../../content/subjects/math/curriculum";
import { readMathProgress, syncMathProgressWithCloud, type MathBlockProgressMap } from "../../data/mathProgress";

const STATUS_LABEL: Record<string, string> = { done: "完了", now: "学習中", todo: "未学習" };

export function CurriculumHome() {
  const [progress, setProgress] = useState<MathBlockProgressMap>({});
  const [open, setOpen] = useState<Record<string, boolean>>(() => {
    const defaultOpen: Record<string, boolean> = {};
    const nowChapter = mathChapters.find((chapter) => chapter.sections.some((section) => section.status === "now"));
    if (nowChapter) defaultOpen[nowChapter.id] = true;
    return defaultOpen;
  });

  useEffect(() => {
    const local = readMathProgress();
    setProgress(local);
    void syncMathProgressWithCloud(local).then(setProgress);
  }, []);

  const doneSectionCount = mathChapters.reduce((sum, chapter) => sum + chapter.sections.filter((section) => section.status === "done").length, 0);
  const doneBlockCount = useMemo(() => Object.values(progress).filter((record) => record.status === "done").length, [progress]);

  const resumeSection = useMemo(() => {
    for (const chapter of mathChapters) {
      const section = chapter.sections.find((s) => s.status === "now");
      if (section) return { chapter, section };
    }
    return { chapter: mathChapters[0], section: mathChapters[0].sections[0] };
  }, []);

  return (
    <div className="math-scope">
      <div className="math-topbar">
        <div className="math-home-topbar-inner">
          <span className="math-topbar-brand">数学の学び</span>
          <span className="math-home-pill">中1・新しい数学1</span>
          <span className="math-home-student">レオ</span>
        </div>
      </div>

      <div className="math-page math-home-page">
        <div className="math-stats-card">
          <div>
            <div className="math-stats-greeting">おかえり、レオくん！</div>
            <div className="math-stats-resume">
              つづきから：
              <Link href={`/math/${resumeSection.chapter.id}/${resumeSection.section.id}`}>
                {resumeSection.chapter.num}章 {resumeSection.section.name}
              </Link>
            </div>
          </div>
          <div className="math-stat-block">
            <div className="math-stat-value" style={{ color: "#c9804f" }}>
              {doneSectionCount}
              <span style={{ fontSize: 13 }}>/{mathTotalSectionCount}</span>
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
          {mathChapters.map((chapter) => {
            const done = chapter.sections.filter((s) => s.status === "done").length;
            const pct = Math.round((done / chapter.sections.length) * 100);
            const isOpen = !!open[chapter.id];

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
                      <SectionRow chapter={chapter} key={section.id} section={section} />
                    ))}
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function SectionRow({
  chapter,
  section
}: {
  chapter: (typeof mathChapters)[number];
  section: (typeof mathChapters)[number]["sections"][number];
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
    <Link className="math-section-row" href={`/math/${chapter.id}/${section.id}`}>
      <span className="math-section-dot" style={dotStyle}>
        {section.status === "done" ? "✓" : section.status === "now" ? "…" : ""}
      </span>
      <span className="math-section-name">{section.name}</span>
      <span className="math-section-pages">{section.pages}</span>
      <span className="math-section-status" style={statusStyle}>
        {STATUS_LABEL[section.status]}
      </span>
    </Link>
  );
}
