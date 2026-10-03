"use client";

import { useMemo, useState } from "react";
import {
  allCards,
  buildPlan,
  cardProgress,
  daysUntil,
  isoDay,
  latestTest,
  subjectColors,
  subjectLabels,
  subjectProfiles
} from "@/data/schoolTests/analytics";
import { CORE_SUBJECTS } from "@/data/schoolTests/types";
import type { DashCtx } from "./context";
import { Card, fmtDate } from "./shared";

export function NextTest({ ctx }: { ctx: DashCtx }) {
  const { settings, updateSettings, cardStates, students } = ctx;
  const next = settings.nextTest;
  const [name, setName] = useState(next.name);
  const [date, setDate] = useState(next.date);
  const [perDay, setPerDay] = useState(next.cardsPerDay);
  const cards = useMemo(() => allCards(), []);
  const plan = buildPlan(cards, cardStates, next.date, next.cardsPerDay);
  const left = daysUntil(next.date);
  const prog = cardProgress(cards, cardStates);
  const today = isoDay(new Date());
  const profiles = subjectProfiles(ctx.tests, students);
  const dirty = name !== next.name || date !== next.date || perDay !== next.cardsPerDay;
  const openCards = prog.todo + prog.practiced;
  const needDays = Math.ceil(prog.todo / Math.max(1, next.cardsPerDay));

  const focus = (s: string) => {
    const seen = new Map<string, number>();
    for (const c of cards) {
      if (c.subject !== s || (cardStates[c.id]?.status ?? "todo") === "mastered") continue;
      const k = c.topic.split("・")[0];
      seen.set(k, (seen.get(k) ?? 0) + c.priority);
    }
    return [...seen.entries()].sort((a, b) => b[1] - a[1]).slice(0, 4).map(([k]) => k);
  };

  const weekday = (d: string) => "日月火水木金土"[new Date(`${d}T00:00:00`).getDay()];

  return (
    <>
      <div className="stx-grid stx-g3">
        <div className="stx-card stx-stat">
          <span className="stx-stat-label">次のテスト</span>
          <span className="stx-stat-value" style={{ fontSize: 24 }}>
            {next.name}
          </span>
          <span className="stx-pill info">{fmtDate(next.date)}</span>
          <span className="stx-stat-value">
            {left === null ? "—" : left > 0 ? left : left === 0 ? "今日" : "終了"}
            {left !== null && left > 0 && <small>日</small>}
          </span>
        </div>
        <div className="stx-card stx-stat">
          <span className="stx-stat-label">残りのカード</span>
          <span className="stx-stat-value">
            {openCards}
            <small>枚</small>
          </span>
          <span className="stx-stat-foot">
            1日{next.cardsPerDay}枚 → 新しいカードは約{needDays}日で一周
            {left !== null && left > 0 && (needDays > left - 1 ? <b className="stx-bad">（間に合わない：1日の枚数を増やす）</b> : <b className="stx-good">（間に合う）</b>)}
          </span>
        </div>
        <div className="stx-card">
          <h3>設定</h3>
          <div className="stx-grid" style={{ gap: 8 }}>
            <label className="stx-field">
              テスト名
              <input value={name} onChange={(e) => setName(e.target.value)} />
            </label>
            <div className="stx-row" style={{ alignItems: "flex-end" }}>
              <label className="stx-field">
                日付
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
              </label>
              <label className="stx-field">
                1日のカード
                <input type="number" min={1} max={12} value={perDay} onChange={(e) => setPerDay(Math.max(1, Number(e.target.value) || 1))} style={{ width: 80 }} />
              </label>
              <button
                type="button"
                className="stx-btn primary"
                disabled={!dirty}
                onClick={() => updateSettings({ nextTest: { name, date, cardsPerDay: perDay } })}
              >
                保存
              </button>
            </div>
          </div>
        </div>
      </div>

      <Card
        title="テストまでの計画"
        sub={
          next.date
            ? "優先度の高いカード（取り戻しやすい順）から。1日に同じ教科は2枚まで。練習したカードは3日後に再テスト。テスト前日は再テストだけ。"
            : "テストの日付が未定なので、今日から14日分を表示しています。日付を入れると自動で組み直します。"
        }
      >
        <div className="stx-plan">
          {plan.map((d) => (
            <div key={d.date} className={`stx-day ${d.date === today ? "today" : ""} ${d.isTestDay ? "test" : ""}`}>
              <div className="stx-day-head">
                <span>
                  {Number(d.date.slice(5, 7))}/{Number(d.date.slice(8))}（{weekday(d.date)}）
                </span>
                <span>{d.date === today ? "今日" : d.isTestDay ? "テスト！" : ""}</span>
              </div>
              {d.isTestDay && <span style={{ fontSize: 13 }}>{next.name}。がんばれ！</span>}
              {d.cards.map((c) => (
                <span className="stx-day-item" key={c.id}>
                  <i style={{ background: subjectColors[c.subject] }} />
                  {subjectLabels[c.subject]} {c.no} {c.topic}
                </span>
              ))}
              {d.retests.length > 0 && (
                <span className="stx-day-item re">
                  <i style={{ background: "#cbd5e1" }} />
                  再テスト {d.retests.length}枚
                </span>
              )}
              {!d.isTestDay && !d.cards.length && !d.retests.length && <span className="stx-sub">お休み・見直し</span>}
            </div>
          ))}
        </div>
      </Card>

      <Card title="教科ごとの作戦" sub={`${latestTest?.name ?? ""}までの結果から`}>
        <div className="stx-table-wrap">
          <table className="stx-table">
            <thead>
              <tr>
                <th>教科</th>
                <th>タイプ</th>
                <th>残りカード</th>
                <th className="l">作戦</th>
              </tr>
            </thead>
            <tbody>
              {CORE_SUBJECTS.map((s) => {
                const p = profiles.find((x) => x.subject === s)!;
                const open = cards.filter((c) => c.subject === s && (cardStates[c.id]?.status ?? "todo") !== "mastered").length;
                return (
                  <tr key={s}>
                    <td style={{ color: subjectColors[s], fontWeight: 800 }}>{subjectLabels[s]}</td>
                    <td>{p.label}</td>
                    <td>{open}枚</td>
                    <td className="l">
                      {strategy(s, p.label)}
                      {focus(s).length > 0 && (
                        <>
                          <br />
                          <span className="stx-sub">重点：{focus(s).join("・")}</span>
                        </>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="stx-note">定期テストは範囲が決まっています。テスト範囲表（テスト範囲表.jpg）を _未整理 に入れてもらえれば、範囲に合わせた計画にできます。</p>
      </Card>
    </>
  );
}

function strategy(s: string, label: string): string {
  const base: Record<string, string> = {
    japanese: "毎日：漢字5問（書き取り→読み）。週2回：記述問題1問（本文の言葉を使う・文末を問いに合わせる）。作文は条件（字数・段落）を先にチェック。",
    social: "地図と年表で確認 → 用語を書いて覚える。正誤問題は「どこが間違いか」を言えるように。",
    math: "計算は毎日5問（符号・計算の順序のミスを防ぐ）。まちがえた形の問題を3問ずつ。",
    science: "用語を図とセットで覚える。図を見て名前を言う・書く練習。",
    english: "まちがえた単語のつづりを書いて練習。今の勉強を続ければOK。"
  };
  const extra = label === "得意" ? "（得意教科：点を守る）" : label === "要注意" ? "（一番伸びしろがある教科）" : label === "波がある" ? "（安定させるのが目標）" : "";
  return `${base[s] ?? ""}${extra}`;
}
