"use client";

import { useMemo, useState } from "react";
import { allCards, cardProgress, emptyCardState, subjectColors, subjectLabels, type ReviewCard } from "@/data/schoolTests/analytics";
import { CORE_SUBJECTS, type CardStatus, type CoreSubject, type MissReason, type ReviewCardState } from "@/data/schoolTests/types";
import { Chips, Ring, StackBar } from "./charts";
import type { DashCtx } from "./context";
import { Card, reasonFix, reasonLabels, statusLabels, SubjectTag } from "./shared";

const REASONS = Object.keys(reasonLabels) as MissReason[];
const reasonColors: Record<MissReason, string> = {
  careless: "#f59e0b",
  unknown: "#dc2626",
  misread: "#0ea5e9",
  time: "#8b5cf6",
  blank: "#64748b"
};

export function CardControls({
  card,
  state,
  update,
  compact = false
}: {
  card: ReviewCard;
  state: ReviewCardState;
  update: DashCtx["updateCard"];
  compact?: boolean;
}) {
  const [note, setNote] = useState(state.note);
  const now = () => new Date().toISOString();
  return (
    <div className="stx-grid" style={{ gap: 8 }}>
      <div className="stx-reasons">
        {REASONS.map((r) => (
          <button key={r} type="button" className={state.reason === r ? "on" : ""} onClick={() => update(state, { reason: state.reason === r ? null : r })}>
            {reasonLabels[r]}
          </button>
        ))}
      </div>
      {state.reason && <span className="stx-sub">→ {reasonFix[state.reason]}</span>}
      {!compact && (
        <input
          style={{ border: "1px solid var(--stx-line)", borderRadius: 8, padding: "6px 8px", fontSize: 12.5 }}
          placeholder="メモ（正しい答え・気づいたこと）"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          onBlur={() => note !== state.note && update(state, { note })}
        />
      )}
      <div className="stx-row">
        {state.status === "todo" && (
          <button type="button" className="stx-btn small primary" onClick={() => update(state, { status: "practiced", practiceCount: state.practiceCount + 1, practicedAt: now() })}>
            練習した
          </button>
        )}
        {state.status === "practiced" && (
          <>
            <button type="button" className="stx-btn small good" onClick={() => update(state, { status: "mastered", masteredAt: now() })}>
              再テスト ○ できた
            </button>
            <button type="button" className="stx-btn small" onClick={() => update(state, { status: "todo" })}>
              × まだ
            </button>
          </>
        )}
        {state.status === "mastered" && (
          <button type="button" className="stx-btn small" onClick={() => update(state, { status: "todo", masteredAt: null })}>
            もう一度やる
          </button>
        )}
        {card.link?.href && (
          <a className="stx-link" style={{ fontSize: 12 }} href={card.link.href}>
            📘 {card.link.label}
          </a>
        )}
        {card.link && !card.link.href && <span className="stx-sub">📘 {card.link.label}</span>}
        {card.link?.book && <span className="stx-sub">{card.link.book}</span>}
      </div>
    </div>
  );
}

export function CardsTab({ ctx }: { ctx: DashCtx }) {
  const cards = useMemo(() => allCards(), []);
  const [subject, setSubject] = useState<CoreSubject | "all">("all");
  const [testId, setTestId] = useState<string>("all");
  const [kind, setKind] = useState<"all" | "cheap">("cheap");
  const st = (c: ReviewCard) => ctx.cardStates[c.id] ?? emptyCardState(c);

  const filtered = cards
    .filter((c) => subject === "all" || c.subject === subject)
    .filter((c) => testId === "all" || c.testId === testId)
    .filter((c) => kind === "all" || c.rate >= 50 || st(c).status !== "todo")
    .sort((a, b) => b.priority - a.priority);
  const prog = cardProgress(cards, ctx.cardStates);
  const reasons = REASONS.map((r) => ({ r, n: cards.filter((c) => ctx.cardStates[c.id]?.reason === r).length }));
  const testsWithCards = ctx.tests.filter((t) => cards.some((c) => c.testId === t.id));

  const col = (status: CardStatus) => filtered.filter((c) => st(c).status === status);

  return (
    <>
      <div className="stx-grid stx-g3">
        <div className="stx-card" style={{ display: "flex", gap: 18, alignItems: "center" }}>
          <Ring value={prog.pointsWon} max={prog.pointsTotal} color="#059669" size={124}>
            <b style={{ fontSize: 24 }}>{prog.pointsWon}</b>
            <span className="stx-sub">/{prog.pointsTotal}点</span>
          </Ring>
          <div className="stx-stat">
            <span className="stx-stat-label">取り戻した点</span>
            <span style={{ fontSize: 13 }}>
              できた {prog.mastered}枚・再テスト待ち {prog.practiced}枚・やること {prog.todo}枚
            </span>
            <span className="stx-sub">「できた」＝練習したあと、日を空けた再テストで正解したもの。</span>
          </div>
        </div>
        <div className="stx-card stx-span2">
          <h3>間違えた理由（Leoが選んだもの）</h3>
          {reasons.some((x) => x.n) ? (
            <>
              <StackBar parts={reasons.map((x) => ({ id: x.r, label: reasonLabels[x.r], value: x.n, color: reasonColors[x.r] }))} />
              <p className="stx-note">
                一番多い理由：
                <b>{reasonLabels[[...reasons].sort((a, b) => b.n - a.n)[0].r]}</b> → {reasonFix[[...reasons].sort((a, b) => b.n - a.n)[0].r]}
              </p>
            </>
          ) : (
            <div className="stx-empty">まだ理由が選ばれていません。カードごとに「どうして間違えた？」を選ぶと、ここに傾向が出ます。</div>
          )}
        </div>
      </div>

      <Card title="弱点カード" sub="間違えた問題1つ＝カード1枚。やること → 練習した → 再テストで○ → できた！">
        <div className="stx-filters">
          <Chips
            options={[{ id: "all", label: "全教科" }, ...CORE_SUBJECTS.map((s) => ({ id: s, label: subjectLabels[s], color: subjectColors[s] }))]}
            value={subject}
            onChange={(v) => setSubject(v as CoreSubject | "all")}
          />
          <Chips
            options={[{ id: "all", label: "全テスト" }, ...testsWithCards.map((t) => ({ id: t.id, label: t.name.replace("テスト", "") }))]}
            value={testId}
            onChange={setTestId}
          />
          <Chips
            options={[
              { id: "cheap", label: "取り戻しやすいミスだけ（全体50%以上）" },
              { id: "all", label: "すべてのミス" }
            ]}
            value={kind}
            onChange={(v) => setKind(v as "all" | "cheap")}
          />
        </div>
        <div className="stx-kanban">
          {(["todo", "practiced", "mastered"] as CardStatus[]).map((status) => (
            <div className={`stx-col ${status}`} key={status}>
              <h3>
                {statusLabels[status]} <span className="stx-sub">{col(status).length}枚</span>
              </h3>
              {col(status).map((c) => {
                const s = st(c);
                return (
                  <div className="stx-rc" key={c.id} style={{ ["--c" as string]: subjectColors[c.subject] }}>
                    <div className="stx-rc-top">
                      <div>
                        <div className="stx-rc-title">
                          {c.no} {c.topic}
                        </div>
                        <div className="stx-rc-meta">
                          {c.testName.replace("テスト", "")}・{c.domainName}
                        </div>
                      </div>
                      <SubjectTag subject={c.subject} small />
                    </div>
                    <div className="stx-row" style={{ gap: 6 }}>
                      <span className={`stx-pill ${c.rate >= 60 ? "bad" : c.rate >= 40 ? "warn" : "muted"}`}>全体 {c.rate}%</span>
                      <span className="stx-pill muted">{c.value}点</span>
                      {s.practiceCount > 0 && <span className="stx-pill info">練習 {s.practiceCount}回</span>}
                    </div>
                    <CardControls card={c} state={s} update={ctx.updateCard} />
                  </div>
                );
              })}
              {!col(status).length && <div className="stx-empty">なし</div>}
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}
