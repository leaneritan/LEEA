"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getAdjacentNoteSections } from "../../../../content/subjects/math/note/curriculum";
import type {
  MathNoteChapterMeta,
  MathNoteSection
} from "../../../../content/subjects/math/note/types";
import {
  createMathBlockProgressRecord,
  getSectionCompletionPercent,
  isBlockDone,
  readMathProgress,
  saveMathBlockProgress,
  syncMathProgressWithCloud,
  type MathBlockProgressMap
} from "../../../data/mathProgress";
import { MathTopbarHome } from "../MathTopbarHome";
import { NoteBlockList } from "./NoteBlockList";

/**
 * One 学習ノート section.
 *
 * Progress rides on `mathProgress` rather than a second store: section ids here
 * are namespaced `note-…` and the map is keyed `<sectionId>::<blockId>`, so the
 * two books cannot collide, and Leo has one progress record instead of two that
 * drift.
 */
export function NoteSectionView({
  chapter,
  section
}: {
  chapter: MathNoteChapterMeta;
  section: MathNoteSection;
}) {
  const [progress, setProgress] = useState<MathBlockProgressMap>({});
  const setIds = section.blocks.filter((block) => block.type === "qset").map((block) => block.id);

  useEffect(() => {
    const local = readMathProgress();
    setProgress(local);
    void syncMathProgressWithCloud(local).then(setProgress);
  }, []);

  function handleScored(blockId: string, correct: number, total: number) {
    const record = createMathBlockProgressRecord(section.id, blockId, true, { correct, total });
    setProgress((current) => ({ ...current, [`${section.id}::${blockId}`]: record }));
    void saveMathBlockProgress(record);
  }

  const percent = getSectionCompletionPercent(section.id, setIds, progress);
  const { prev, next } = getAdjacentNoteSections(section.id);

  return (
    <div
      className="math-scope"
      style={
        {
          "--m-accent": chapter.color,
          "--m-tint": chapter.tint,
          "--m-dark": chapter.dark
        } as React.CSSProperties
      }
    >
      <div className="math-topbar">
        <div className="math-topbar-inner">
          <MathTopbarHome />
          <Link className="math-topbar-brand" href="/math/note">
            ← 学習ノート
          </Link>
          <span className="math-topbar-sep">｜</span>
          <span className="math-topbar-chapter">
            <span className="math-topbar-dot" />
            {chapter.badge} {chapter.title}
          </span>
          <span className="math-topbar-chevron">›</span>
          <span className="math-topbar-section">
            {section.number} {section.title}
          </span>
        </div>
      </div>

      <div className="math-page">
        <header className="note-section-head">
          <div>
            <span className="note-book-pill">数学の学習ノート</span>
            <h1>
              {section.number}　{section.title}
            </h1>
            <p className="note-section-pages">
              ワーク {section.workbookPages}
              <span className="note-section-sep">／</span>
              {section.textbookRef}
            </p>
          </div>
          <div className="note-section-progress">
            <div className="note-progress-bar">
              <span style={{ width: `${percent}%` }} />
            </div>
            <span className="note-progress-label">{percent}%</span>
          </div>
        </header>

        <NoteBlockList
          blocks={section.blocks}
          isBlockDone={(blockId) => isBlockDone(section.id, blockId, progress)}
          onSetScored={handleScored}
        />

        <nav className="note-section-nav">
          {prev ? (
            <Link className="math-nav-link" href={`/math/note/${prev.id}`}>
              ← {prev.number} {prev.name}
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link className="math-nav-link math-nav-link--next" href={`/math/note/${next.id}`}>
              {next.number} {next.name} →
            </Link>
          ) : (
            <span />
          )}
        </nav>
      </div>
    </div>
  );
}
