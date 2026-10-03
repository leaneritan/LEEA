"use client";

import { useEffect, useState } from "react";
import { cheapestMisses, goalGaps, hasQuestionData, subjectColors, subjectLabels } from "@/data/schoolTests/analytics";
import { CORE_SUBJECTS, type AcademicGoals, type CoreSubject } from "@/data/schoolTests/types";
import type { DashCtx } from "./context";
import { Card, TestPicker } from "./shared";

export function Goals({ ctx }: { ctx: DashCtx }) {
  const { test, tests, goals } = ctx;
  const [draft, setDraft] = useState<AcademicGoals>(goals);
  useEffect(() => setDraft(goals), [goals]);
  const g = goalGaps(test, goals);
  const cheap = hasQuestionData(test) ? cheapestMisses(test) : [];
  const cheapBy = (s: CoreSubject) => cheap.filter((q) => q.subject === s).reduce((a, q) => a + q.value, 0);
  const dirty = JSON.stringify(draft) !== JSON.stringify(goals);
  const sumGoals = CORE_SUBJECTS.reduce((a, s) => a + draft.subjects[s], 0);

  return (
    <>
      <TestPicker tests={tests} value={test.id} onChange={ctx.setTestId} label="比べるテスト" />

      <div className="stx-grid stx-g3">
        <div className="stx-card stx-stat">
          <span className="stx-stat-label">5科目の目標</span>
          <span className="stx-stat-value">
            {g.total.score}
            <small>/ {g.total.goal}</small>
          </span>
          <span className={`stx-pill ${g.total.met ? "good" : "warn"}`}>{g.total.met ? "達成！" : `あと ${g.total.need}点`}</span>
          {hasQuestionData(test) && !g.total.met && (
            <span className="stx-stat-foot">
              取り戻しやすいミス（全体50%以上）を取ると +{cheap.reduce((a, q) => a + q.value, 0)}点 →{" "}
              {g.total.score + cheap.reduce((a, q) => a + q.value, 0) >= g.total.goal ? "目標に届く" : "まだ足りない（標準問題も必要）"}
            </span>
          )}
        </div>
        <div className="stx-card stx-stat">
          <span className="stx-stat-label">順位の目標</span>
          <span className="stx-stat-value">
            {g.rank.rank ?? "—"}
            <small>位 / 目標 {g.rank.goal}位</small>
          </span>
          <span className={`stx-pill ${g.rank.met ? "good" : "warn"}`}>{g.rank.met ? "達成！" : `あと ${(g.rank.rank ?? 0) - g.rank.goal}人`}</span>
        </div>
        <div className="stx-card stx-stat">
          <span className="stx-stat-label">教科の目標の合計</span>
          <span className="stx-stat-value">
            {sumGoals}
            <small>点</small>
          </span>
          <span className="stx-stat-foot">{sumGoals !== draft.total5 ? `5科目の目標（${draft.total5}）と ${Math.abs(sumGoals - draft.total5)}点ずれています。` : "5科目の目標と一致。"}</span>
        </div>
      </div>

      <Card title="教科ごとの目標" sub="赤い線＝目標、灰色＝今の点数。「取り戻しやすい」＝そのテストで全体の50%以上が正解したのに落とした問題の点。">
        <div className="stx-grid" style={{ gap: 12 }}>
          {g.subjects.map((x) => (
            <div key={x.subject} style={{ display: "grid", gridTemplateColumns: "64px 1fr 220px", gap: 12, alignItems: "center" }}>
              <b style={{ color: subjectColors[x.subject] }}>{subjectLabels[x.subject]}</b>
              <div className="stx-meter" style={{ ["--c" as string]: subjectColors[x.subject], height: 12 }}>
                <span style={{ width: `${x.score}%` }} />
                <em style={{ left: `${x.goal}%` }} />
              </div>
              <span style={{ fontSize: 13 }}>
                {x.score} / {x.goal}点{" "}
                {x.met ? (
                  <b className="stx-good">達成</b>
                ) : (
                  <>
                    <b className="stx-bad">あと{x.need}</b>
                    {hasQuestionData(test) && <span className="stx-mutedc">（取り戻しやすい {cheapBy(x.subject)}点）</span>}
                  </>
                )}
              </span>
            </div>
          ))}
        </div>
      </Card>

      <Card title="目標を変える" right={<button type="button" className="stx-btn primary" disabled={!dirty} onClick={() => ctx.updateSettings({ goals: draft })}>保存</button>}>
        <div className="stx-grid stx-g4">
          <label className="stx-field">
            5科目合計
            <input type="number" value={draft.total5} onChange={(e) => setDraft({ ...draft, total5: Number(e.target.value) || 0 })} />
          </label>
          <label className="stx-field">
            順位
            <input type="number" value={draft.rank} onChange={(e) => setDraft({ ...draft, rank: Number(e.target.value) || 0 })} />
          </label>
          <label className="stx-field">
            学年の人数
            <input type="number" value={draft.students} onChange={(e) => setDraft({ ...draft, students: Number(e.target.value) || 1 })} />
          </label>
          {CORE_SUBJECTS.map((s) => (
            <label className="stx-field" key={s}>
              {subjectLabels[s]}
              <input
                type="number"
                min={0}
                max={100}
                value={draft.subjects[s]}
                onChange={(e) => setDraft({ ...draft, subjects: { ...draft.subjects, [s]: Number(e.target.value) || 0 } })}
              />
            </label>
          ))}
        </div>
        <p className="stx-note">目標はLeoと話して決めるのがおすすめ。Leoの画面にも表示されます。</p>
      </Card>
    </>
  );
}
