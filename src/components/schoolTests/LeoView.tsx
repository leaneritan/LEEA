"use client";

// Leo's own screen. Encouraging on purpose: no ranks, no "you lost N points".
// He sees what he has won back, today's cards, and what he is good at.

import { useMemo } from "react";
import {
  allCards,
  buildPlan,
  cardProgress,
  daysUntil,
  emptyCardState,
  isoDay,
  latestTest,
  subjectColors,
  subjectLabels,
  subjectProfiles,
  type ReviewCard
} from "@/data/schoolTests/analytics";
import { CORE_SUBJECTS, type MissReason, type ReviewCardState } from "@/data/schoolTests/types";
import { Ring } from "./charts";
import { reasonFix, reasonLabels } from "./shared";
import type { AcademicGoals, SchoolTestSettings } from "@/data/schoolTests/types";

const DAY = 86_400_000;

export function LeoView({
  cardStates,
  updateCard,
  settings,
  goals,
  students
}: {
  cardStates: Record<string, ReviewCardState>;
  updateCard: (base: ReviewCardState, patch: Partial<ReviewCardState>) => ReviewCardState;
  settings: SchoolTestSettings;
  goals: AcademicGoals;
  students: number;
}) {
  const cards = useMemo(() => allCards(), []);
  const st = (c: ReviewCard) => cardStates[c.id] ?? emptyCardState(c);
  const prog = cardProgress(cards, cardStates);
  const today = isoDay(new Date());
  const plan = buildPlan(cards, cardStates, settings.nextTest.date, settings.nextTest.cardsPerDay);
  const todayPlan = plan.find((d) => d.date === today);
  let todays = (todayPlan?.cards ?? []).filter((c) => st(c).status === "todo");
  if (!todays.length) {
    todays = cards
      .filter((c) => st(c).status === "todo")
      .sort((a, b) => b.priority - a.priority)
      .slice(0, settings.nextTest.cardsPerDay);
  }
  // Re-test once at least two days have passed since practising.
  const retests = cards.filter((c) => {
    const s = st(c);
    return s.status === "practiced" && s.practicedAt && Date.now() - new Date(s.practicedAt).getTime() >= 2 * DAY;
  });
  const waiting = cards.filter((c) => st(c).status === "practiced").length - retests.length;
  const left = daysUntil(settings.nextTest.date);
  const profiles = subjectProfiles(latestTest ? [latestTest] : [], students);
  const strong = profiles.filter((p) => (p.meanTopPct ?? 100) <= 25).map((p) => subjectLabels[p.subject]);

  const badges = [
    { id: "first", label: "はじめの1枚", got: prog.mastered >= 1, icon: "🌱" },
    { id: "five", label: "5枚クリア", got: prog.mastered >= 5, icon: "⭐" },
    { id: "ten", label: "10枚クリア", got: prog.mastered >= 10, icon: "🌟" },
    { id: "pts20", label: "20点取り戻した", got: prog.pointsWon >= 20, icon: "🏅" },
    { id: "pts50", label: "50点取り戻した", got: prog.pointsWon >= 50, icon: "🏆" },
    ...CORE_SUBJECTS.filter((s) => cards.some((c) => c.subject === s)).map((s) => ({
      id: s,
      label: `${subjectLabels[s]}コンプリート`,
      got: cards.filter((c) => c.subject === s).every((c) => st(c).status === "mastered"),
      icon: "👑"
    }))
  ];

  return (
    <div className="stx-leo">
      <div className="stx-leo-hero">
        <div>
          <h2>Leo、今日もいっしょにがんばろう！</h2>
          <p>
            {left !== null && left > 0 ? `${settings.nextTest.name}まで あと${left}日。` : `${settings.nextTest.name}にむけて準備しよう。`}
            {strong.length > 0 && ` ${strong.join("・")}はすごく強い！`}
          </p>
          <p style={{ fontSize: 13 }}>
            できた {prog.mastered}枚・練習中 {prog.practiced}枚・のこり {prog.todo}枚
          </p>
        </div>
        <Ring value={prog.pointsWon} max={prog.pointsTotal} color="#fde047" size={140}>
          <b style={{ fontSize: 30 }}>{prog.pointsWon}</b>
          <span style={{ fontSize: 12 }}>点 取り戻した！</span>
        </Ring>
      </div>

      {retests.length > 0 && (
        <section>
          <h2 style={{ margin: "0 0 10px" }}>🔁 もう一回テスト（{retests.length}枚）</h2>
          <p className="stx-sub" style={{ marginTop: -6 }}>
            練習してから2日たったカード。見ないで解いてみよう！
          </p>
          <div className="stx-grid stx-g2">
            {retests.map((c) => (
              <LeoCard key={c.id} card={c} state={st(c)} update={updateCard} mode="retest" />
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 style={{ margin: "0 0 10px" }}>📚 今日のカード</h2>
        {todays.length ? (
          <div className="stx-grid stx-g2">
            {todays.map((c) => (
              <LeoCard key={c.id} card={c} state={st(c)} update={updateCard} mode="practice" />
            ))}
          </div>
        ) : (
          <div className="stx-empty">今日のカードはぜんぶ終わり！すごい！🎉</div>
        )}
        {waiting > 0 && <p className="stx-sub">練習したカード {waiting}枚は、2日たったら「もう一回テスト」に出てきます。</p>}
      </section>

      <section className="stx-card">
        <h2 style={{ marginBottom: 12 }}>🎯 ぼくの目標</h2>
        <div className="stx-grid stx-g5">
          {CORE_SUBJECTS.map((s) => {
            const now = latestTest?.scores[s] ?? 0;
            const goal = goals.subjects[s];
            return (
              <div key={s} className="stx-subj" style={{ ["--c" as string]: subjectColors[s] }}>
                <span className="stx-subj-name">{subjectLabels[s]}</span>
                <span style={{ fontSize: 22, fontWeight: 800 }}>{goal}点</span>
                <div className="stx-meter">
                  <span style={{ width: `${Math.min(100, (now / goal) * 100)}%` }} />
                </div>
                <span className="stx-sub">{now >= goal ? "達成！🎉" : `今 ${now}点 → あと${goal - now}点`}</span>
              </div>
            );
          })}
        </div>
      </section>

      <section className="stx-card">
        <h2 style={{ marginBottom: 12 }}>🏅 バッジ</h2>
        <div className="stx-badges">
          {badges.map((b) => (
            <span key={b.id} className={`stx-badge-x ${b.got ? "got" : ""}`}>
              <span style={{ fontSize: 20, filter: b.got ? undefined : "grayscale(1)", opacity: b.got ? 1 : 0.4 }}>{b.icon}</span>
              {b.label}
            </span>
          ))}
        </div>
      </section>
    </div>
  );
}

const REASONS = Object.keys(reasonLabels) as MissReason[];

function LeoCard({
  card,
  state,
  update,
  mode
}: {
  card: ReviewCard;
  state: ReviewCardState;
  update: (base: ReviewCardState, patch: Partial<ReviewCardState>) => ReviewCardState;
  mode: "practice" | "retest";
}) {
  const now = () => new Date().toISOString();
  return (
    <div className="stx-leo-card" style={{ ["--c" as string]: subjectColors[card.subject] }}>
      <div className="stx-row" style={{ justifyContent: "space-between" }}>
        <b style={{ color: subjectColors[card.subject] }}>
          {subjectLabels[card.subject]}・{card.testName.replace("テスト", "")}
        </b>
        <span className="stx-pill muted">{card.value}点</span>
      </div>
      <div className="stx-leo-q">
        {card.no}　{card.topic}
      </div>
      <div className="stx-leo-help">
        みんなの <b>{card.rate}%</b> が正解した問題。{card.rate >= 60 ? "Leoなら絶対できる！" : card.rate >= 40 ? "がんばればできる！" : "むずかしいけど、チャレンジ！"}
        {card.link && (
          <>
            <br />
            📘 {card.link.href ? <a className="stx-link" href={card.link.href}>{card.link.label}</a> : card.link.label}
            {card.link.book && `（${card.link.book}）`}
          </>
        )}
      </div>
      {mode === "practice" && (
        <>
          <span style={{ fontWeight: 800, fontSize: 14 }}>どうして まちがえた？</span>
          <div className="stx-leo-btns">
            {REASONS.map((r) => (
              <button key={r} type="button" className={state.reason === r ? "on" : ""} onClick={() => update(state, { reason: r })}>
                {reasonLabels[r]}
              </button>
            ))}
          </div>
          {state.reason && <span className="stx-sub">💡 {reasonFix[state.reason]}</span>}
          <div className="stx-leo-btns">
            <button
              type="button"
              className="go"
              disabled={!state.reason}
              onClick={() => update(state, { status: "practiced", practiceCount: state.practiceCount + 1, practicedAt: now() })}
            >
              ✅ 練習した！
            </button>
            {!state.reason && <span className="stx-sub" style={{ alignSelf: "center" }}>まず理由をえらんでね</span>}
          </div>
        </>
      )}
      {mode === "retest" && (
        <div className="stx-leo-btns">
          <button type="button" className="go" onClick={() => update(state, { status: "mastered", masteredAt: now() })}>
            ⭕ できた！
          </button>
          <button type="button" className="retry" onClick={() => update(state, { status: "todo" })}>
            🔄 もう少し練習する
          </button>
        </div>
      )}
    </div>
  );
}
