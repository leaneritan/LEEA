"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { mathNoteChapters } from "../../../../content/subjects/math/note/curriculum";
import {
  getSectionCompletionPercent,
  readMathProgress,
  syncMathProgressWithCloud,
  type MathBlockProgressMap
} from "../../../data/mathProgress";
import { MathTopbarHome } from "../MathTopbarHome";

/**
 * The 学習ノート home — the workbook's own 目次.
 *
 * It lists the whole book, not only what is built, so the shape of the year is
 * visible from the start: an authored row opens, a scanned-but-unbuilt row says
 * so, and an unscanned row says that instead. Silence about the rest would make
 * a 41-page book look like the whole thing.
 */
export function NoteHome({ setIds }: { setIds: Record<string, string[]> }) {
  const [progress, setProgress] = useState<MathBlockProgressMap>({});

  useEffect(() => {
    const local = readMathProgress();
    setProgress(local);
    void syncMathProgressWithCloud(local).then(setProgress);
  }, []);

  const authored = mathNoteChapters.flatMap((chapter) => chapter.sections.filter((s) => s.authored));
  const resume = authored.find(
    (s) => getSectionCompletionPercent(s.id, setIds[s.id] ?? [], progress) < 100
  );

  return (
    <div className="math-scope">
      <div className="math-topbar">
        <div className="math-home-topbar-inner">
          <MathTopbarHome />
          <Link className="math-topbar-brand" href="/math">
            ← 数学の学び
          </Link>
          <span className="math-topbar-sep">｜</span>
          <span className="note-topbar-title">数学の学習ノート 1年</span>
          <span className="math-home-book-label">東京書籍版ワーク</span>
          <span className="math-home-student">レオ</span>
        </div>
      </div>

      <div className="math-page math-home-page">
        <div className="math-stats-card note-stats-card">
          <div>
            <div className="math-stats-greeting">学習ノート、どこからやる？</div>
            {resume ? (
              <div className="math-stats-resume">
                つづきから：<Link href={`/math/note/${resume.id}`}>{resume.number} {resume.name}</Link>
              </div>
            ) : (
              <div className="math-stats-resume">いまあるページは、ぜんぶ終わったよ！</div>
            )}
          </div>
          <p className="note-home-note">
            教科書とは別の本だから、ページ番号もべつべつ。ここの「p.○○」はぜんぶ<strong>ワークのページ</strong>だよ。
          </p>
        </div>

        {mathNoteChapters.map((chapter) => (
          <section
            className="note-chapter"
            key={chapter.key}
            style={
              {
                "--m-accent": chapter.color,
                "--m-tint": chapter.tint,
                "--m-dark": chapter.dark
              } as React.CSSProperties
            }
          >
            <header className="note-chapter-head">
              <span className="note-chapter-badge">{chapter.badge}</span>
              <div>
                <h2>{chapter.title}</h2>
                <p>{chapter.subtitle}</p>
              </div>
              <span className="note-chapter-pages">{chapter.workbookPages}</span>
            </header>

            <ul className="note-chapter-sections">
              {chapter.sections.map((meta) => {
                const percent = meta.authored
                  ? getSectionCompletionPercent(meta.id, setIds[meta.id] ?? [], progress)
                  : 0;

                const label = (
                  <>
                    <span className="note-row-num">{meta.number ?? "―"}</span>
                    <span className="note-row-name">{meta.name}</span>
                    <span className="note-row-pages">{meta.workbookPages}</span>
                    {meta.textbookRef ? <span className="note-row-ref">{meta.textbookRef}</span> : null}
                  </>
                );

                if (meta.authored) {
                  return (
                    <li className="note-row note-row--ready" key={meta.id}>
                      <Link href={`/math/note/${meta.id}`}>
                        {label}
                        <span className={`note-row-state${percent === 100 ? " is-done" : ""}`}>
                          {percent === 100 ? "✓ できた" : percent > 0 ? `${percent}%` : "はじめる →"}
                        </span>
                      </Link>
                    </li>
                  );
                }

                return (
                  <li className="note-row note-row--pending" key={meta.id}>
                    {label}
                    <span className="note-row-state">{meta.scanned ? "準備中" : "未スキャン"}</span>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
