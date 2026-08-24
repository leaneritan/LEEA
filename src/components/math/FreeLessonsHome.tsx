"use client";

import Link from "next/link";
import { useState } from "react";
import { mathGrades, type MathGrade } from "../../../content/subjects/math/grades";
import {
  getSpecialLessonsByGrade,
  groupSpecialLessonsByTopic,
  type SpecialLessonStatus
} from "../../../content/subjects/math/specialLessons";
import { MathTopbarHome } from "./MathTopbarHome";

type GradeFilter = "all" | MathGrade;

const STATUS_LABEL: Record<SpecialLessonStatus, string> = { done: "完了", now: "学習中", todo: "未学習" };

export function FreeLessonsHome() {
  const [grade, setGrade] = useState<GradeFilter>("all");
  const [topicFilter, setTopicFilter] = useState<string>("all");

  const pool = getSpecialLessonsByGrade(grade);
  const allGroups = groupSpecialLessonsByTopic(pool);
  const groups = allGroups.filter((group) => topicFilter === "all" || group.topic === topicFilter);

  const filters = [
    { key: "all", label: `すべて（${pool.length}）` },
    ...allGroups.map((group) => ({ key: group.topic, label: `${group.topic}（${group.lessons.length}）` }))
  ];

  function pickGrade(nextGrade: GradeFilter) {
    setGrade(nextGrade);
    setTopicFilter("all");
  }

  return (
    <div className="math-scope">
      <div className="math-topbar">
        <div className="math-home-topbar-inner">
          <MathTopbarHome />
          <Link className="math-topbar-brand" href="/math">
            ← 数学の学び
          </Link>
          <span className="math-speciallesson-chip">特訓レッスン</span>
          <span className="math-grade-switch math-grade-switch--accent">
            <button
              type="button"
              className={`math-grade-btn math-grade-btn--accent${grade === "all" ? " math-grade-btn--active" : ""}`}
              onClick={() => pickGrade("all")}
            >
              すべて
            </button>
            {mathGrades.map((g) => (
              <button
                key={g.key}
                type="button"
                className={`math-grade-btn math-grade-btn--accent${grade === g.key ? " math-grade-btn--active" : ""}`}
                onClick={() => pickGrade(g.key)}
              >
                {g.label}
              </button>
            ))}
          </span>
          <span className="math-home-student">レオ</span>
        </div>
      </div>

      <div className="math-page math-home-page">
        <div className="math-speciallesson-intro">
          <h1>特訓レッスン</h1>
          <p>教科書の章とは別に、レオが苦手なところを特訓するためのレッスンだよ。すこしずつ増えていくよ。</p>
        </div>

        <div className="math-speciallesson-filters">
          {filters.map((f) => (
            <button
              key={f.key}
              type="button"
              className={`math-speciallesson-filter-chip${topicFilter === f.key ? " math-speciallesson-filter-chip--active" : ""}`}
              onClick={() => setTopicFilter(f.key)}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="math-speciallesson-groups">
          {groups.map((group) => (
            <div className="math-speciallesson-group" key={group.topic}>
              <div className="math-speciallesson-group-head">
                <span className="math-speciallesson-group-dot" style={{ background: group.palette.color }} />
                <span className="math-speciallesson-group-name">{group.topic}</span>
                <span className="math-speciallesson-group-count">{group.lessons.length} レッスン</span>
              </div>

              <div className="math-speciallesson-card">
                {group.lessons.map((lesson, index) => {
                  const done = lesson.status === "done";
                  const badgeStyle = done ? { background: "#eef5e8", color: "#4a6b35" } : { background: group.palette.tint, color: group.palette.dark };
                  const statusStyle =
                    lesson.status === "done"
                      ? { color: "#4a6b35", background: "#eef5e8" }
                      : lesson.status === "now"
                        ? { color: group.palette.dark, background: group.palette.tint }
                        : { color: "#b3a685", background: "#f3eede" };

                  return (
                    <Link className="math-speciallesson-row" href={`/math/free/${lesson.id}`} key={lesson.id}>
                      <span className="math-speciallesson-badge" style={badgeStyle}>
                        {done ? "✓" : index + 1}
                      </span>
                      <span className="math-speciallesson-row-titles">
                        <span className="math-speciallesson-row-title">{lesson.title}</span>
                        <span className="math-speciallesson-row-meta">
                          <span>{lesson.kind}</span>
                          <span className="math-speciallesson-row-meta-sep">・</span>
                          <span>{lesson.meta}</span>
                        </span>
                      </span>
                      <span className="math-speciallesson-row-end">
                        <span className="math-speciallesson-status" style={statusStyle}>
                          {STATUS_LABEL[lesson.status]}
                        </span>
                        <span className="math-speciallesson-chevron">›</span>
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}

          {pool.length === 0 ? (
            <div className="math-speciallesson-empty">
              <div className="math-speciallesson-empty-title">この学年の特訓レッスンはまだないよ</div>
              <div className="math-speciallesson-empty-sub">苦手が見つかったら、ここに追加していこう。</div>
            </div>
          ) : null}
        </div>

        <button type="button" className="math-speciallesson-add" onClick={() => {}}>
          <span className="math-speciallesson-add-icon">＋</span>
          <span>新しい特訓レッスンをつくる</span>
        </button>
      </div>
    </div>
  );
}
