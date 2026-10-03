"use client";

import { Fragment, useMemo, useState } from "react";
import { allCards, emptyCardState, hasQuestionData, questionRefs, subjectColors, subjectLabels } from "@/data/schoolTests/analytics";
import { CORE_SUBJECTS, type CoreSubject } from "@/data/schoolTests/types";
import { Chips, MultiChips } from "./charts";
import type { DashCtx } from "./context";
import { CardControls } from "./Cards";
import { Card, statusLabels, SubjectTag } from "./shared";

type Result = "all" | "ng" | "ok";
type Band = "all" | "easy" | "standard" | "hard";
type Sort = "no" | "rate" | "priority" | "value";

export function QuestionExplorer({ ctx }: { ctx: DashCtx }) {
  const withQ = ctx.tests.filter(hasQuestionData);
  const [testId, setTestId] = useState(withQ[withQ.length - 1]?.id ?? "");
  const [subjects, setSubjects] = useState<CoreSubject[]>([...CORE_SUBJECTS]);
  const [result, setResult] = useState<Result>("all");
  const [band, setBand] = useState<Band>("all");
  const [sort, setSort] = useState<Sort>("no");
  const [text, setText] = useState("");
  const [open, setOpen] = useState<string | null>(null);
  const cards = useMemo(() => new Map(allCards().map((c) => [c.id, c])), []);

  const test = withQ.find((t) => t.id === testId);
  if (!test) return <Card title="問題一覧">正誤データのあるテストがまだありません。</Card>;

  const refs = questionRefs(test);
  const order = new Map(refs.map((q, i) => [q.subject + q.no, i]));
  const rows = refs
    .filter((q) => subjects.includes(q.subject))
    .filter((q) => result === "all" || (result === "ok" ? q.ok : !q.ok))
    .filter((q) => band === "all" || (band === "easy" ? q.rate >= 60 : band === "standard" ? q.rate >= 40 && q.rate < 60 : q.rate < 40))
    .filter((q) => !text || `${q.topic} ${q.domainName} ${q.no}`.includes(text))
    .sort((a, b) =>
      sort === "rate" ? b.rate - a.rate : sort === "priority" ? b.priority - a.priority : sort === "value" ? b.value - a.value : (order.get(a.subject + a.no) ?? 0) - (order.get(b.subject + b.no) ?? 0)
    );
  const ng = rows.filter((q) => !q.ok);

  return (
    <Card title="問題一覧" sub={`${test.name}・全${refs.length}問。行をクリックすると弱点カードを操作できます。`}>
      <div className="stx-filters">
        {withQ.length > 1 && (
          <Chips options={withQ.map((t) => ({ id: t.id, label: t.name }))} value={testId} onChange={setTestId} />
        )}
        <MultiChips
          options={CORE_SUBJECTS.map((s) => ({ id: s, label: subjectLabels[s], color: subjectColors[s] }))}
          value={subjects}
          onChange={(v) => setSubjects(v as CoreSubject[])}
        />
      </div>
      <div className="stx-filters">
        <Chips
          options={[
            { id: "all", label: "すべて" },
            { id: "ng", label: "× だけ" },
            { id: "ok", label: "○ だけ" }
          ]}
          value={result}
          onChange={(v) => setResult(v as Result)}
        />
        <Chips
          options={[
            { id: "all", label: "全難易度" },
            { id: "easy", label: "基本 60%〜" },
            { id: "standard", label: "標準 40〜59%" },
            { id: "hard", label: "難問 〜39%" }
          ]}
          value={band}
          onChange={(v) => setBand(v as Band)}
        />
        <Chips
          options={[
            { id: "no", label: "番号順" },
            { id: "priority", label: "優先度順" },
            { id: "rate", label: "正答率順" },
            { id: "value", label: "配点順" }
          ]}
          value={sort}
          onChange={(v) => setSort(v as Sort)}
        />
        <label className="stx-field">
          検索
          <input value={text} onChange={(e) => setText(e.target.value)} placeholder="例：漢字、時差、文字式" />
        </label>
      </div>
      <p className="stx-sub" style={{ marginBottom: 8 }}>
        {rows.length}問を表示・うち × {ng.length}問（−{ng.reduce((a, q) => a + q.value, 0)}点）
      </p>
      <div className="stx-table-wrap">
        <table className="stx-table">
          <thead>
            <tr>
              <th>教科</th>
              <th>番号</th>
              <th className="l">問題内容</th>
              <th className="l">領域</th>
              <th>配点</th>
              <th style={{ minWidth: 150 }}>全体の正答率</th>
              <th>結果</th>
              <th>カード</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((q) => {
              const id = `${q.testId}:${q.subject}:${q.no}`;
              const card = cards.get(id);
              const state = card ? ctx.cardStates[id] ?? emptyCardState(card) : null;
              const isOpen = open === id;
              return (
                <Fragment key={id}>
                  <tr className={card ? "clickable" : ""} onClick={() => card && setOpen(isOpen ? null : id)}>
                    <td>
                      <SubjectTag subject={q.subject} small />
                    </td>
                    <td>
                      <b>{q.no}</b>
                    </td>
                    <td className="l">{q.topic}</td>
                    <td className="l stx-mutedc" style={{ fontSize: 12 }}>
                      {q.domainName}
                    </td>
                    <td>{q.points ?? "?"}</td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "flex-end" }}>
                        <div style={{ width: 90, height: 8, background: "#eef0f4", borderRadius: 99, overflow: "hidden" }}>
                          <div style={{ width: `${q.rate}%`, height: "100%", background: q.rate >= 60 ? "#94a3b8" : q.rate >= 40 ? "#cbd5e1" : "#e2e8f0" }} />
                        </div>
                        {q.rate}%
                      </div>
                    </td>
                    <td className={q.ok ? "ok" : "ng"}>{q.ok ? "○" : "×"}</td>
                    <td style={{ fontSize: 12 }}>{state ? statusLabels[state.status] : ""}</td>
                  </tr>
                  {isOpen && card && state && (
                    <tr>
                      <td colSpan={8} className="l" style={{ background: "#f8fafc" }}>
                        <CardControls card={card} state={state} update={ctx.updateCard} />
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
