"use client";

// Progress → Leo's school tests (定期テスト・実力テスト).
//
// Data: content/school-tests/tests.json (copy of Leo's_Tests/tests.json).
// Analysis: src/data/schoolTests/analytics.ts — every number comes from there.
// Leo's work on his mistakes: src/data/schoolTests/reviewStore.ts (Supabase).

import { useEffect, useMemo, useState } from "react";
import { allCards, allTests, cardProgress, latestTest } from "@/data/schoolTests/analytics";
import { useSchoolReview } from "@/data/schoolTests/reviewStore";
import { getCloudSyncFailures, getCloudSyncStatus, subscribeToCloudSyncStatus } from "@/lib/syncStatus";
import { CardsTab } from "./schoolTests/Cards";
import { Compare } from "./schoolTests/Compare";
import type { DashCtx, TabId } from "./schoolTests/context";
import { Goals } from "./schoolTests/Goals";
import { LeoView } from "./schoolTests/LeoView";
import { NextTest } from "./schoolTests/NextTest";
import { Overview } from "./schoolTests/Overview";
import { PrintReport } from "./schoolTests/PrintReport";
import { QuestionExplorer } from "./schoolTests/QuestionExplorer";
import { ReportSheet } from "./schoolTests/ReportSheet";
import { stxCss } from "./schoolTests/styles";
import { Trends } from "./schoolTests/Trends";
import { WeakPoints } from "./schoolTests/WeakPoints";

const TABS: Array<{ id: TabId; label: string }> = [
  { id: "overview", label: "📋 概要" },
  { id: "sheet", label: "🧾 成績表" },
  { id: "trend", label: "📈 推移" },
  { id: "compare", label: "📊 比較" },
  { id: "weak", label: "🔍 弱点分析" },
  { id: "questions", label: "📝 問題一覧" },
  { id: "cards", label: "🃏 弱点カード" },
  { id: "plan", label: "🗓 次のテスト" },
  { id: "goals", label: "🎯 目標" },
  { id: "print", label: "🖨 印刷" }
];

const TAB_KEY = "leea.schoolTests.tab.v1";

export function AcademicProgressPage({ initialMode = "parent" }: { initialMode?: "parent" | "leo" }) {
  const { cards: cardStates, settings, updateCard, updateSettings } = useSchoolReview();
  const [mode, setMode] = useState<"parent" | "leo">(initialMode);
  const [tab, setTab] = useState<TabId>("overview");
  const [testId, setTestId] = useState(latestTest?.id ?? "");
  const [sync, setSync] = useState<{ status: string; detail?: string }>({ status: "not-configured" });

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(TAB_KEY) as TabId | null;
      if (saved && TABS.some((t) => t.id === saved)) setTab(saved);
    } catch {
      /* ignore */
    }
    const read = () => {
      const f = getCloudSyncFailures().find((x) => x.source === "school-tests");
      setSync({ status: f ? "error" : getCloudSyncStatus() === "not-configured" ? "not-configured" : "synced", detail: f?.detail });
    };
    read();
    return subscribeToCloudSyncStatus(read);
  }, []);

  const goTo = (t: TabId) => {
    setTab(t);
    try {
      window.localStorage.setItem(TAB_KEY, t);
    } catch {
      /* ignore */
    }
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cards = useMemo(() => allCards(), []);
  const prog = cardProgress(cards, cardStates);
  const test = allTests.find((t) => t.id === testId) ?? latestTest;

  if (!test) {
    return (
      <div className="stx">
        <style dangerouslySetInnerHTML={{ __html: stxCss }} />
        <div className="stx-empty">テストのデータがまだありません。</div>
      </div>
    );
  }

  const goals = settings.goals;
  const ctx: DashCtx = {
    tests: allTests,
    test,
    setTestId,
    students: goals.students,
    goals,
    settings,
    updateSettings,
    cardStates,
    updateCard,
    goTo
  };

  return (
    <div className="stx">
      <style dangerouslySetInnerHTML={{ __html: stxCss }} />
      <div className="stx-wrap">
        <header className="stx-hero stx-no-print">
          <div>
            <div className="stx-kicker">LEEA · School tests</div>
            <h1>{mode === "leo" ? "Leoのテスト復習" : "テスト成績ダッシュボード"}</h1>
            <p>
              {mode === "leo"
                ? "まちがえた問題をカードにして、1枚ずつ取り戻そう。"
                : `${allTests.length}回分のテスト（最新：${latestTest?.name}）。点数・平均との差・順位・問題ごとの正誤から、次にやることまで。`}
            </p>
          </div>
          <div className="stx-hero-side">
            <div className="stx-mode" role="tablist">
              <button type="button" className={mode === "parent" ? "on" : ""} onClick={() => setMode("parent")}>
                Neritan
              </button>
              <button type="button" className={mode === "leo" ? "on" : ""} onClick={() => setMode("leo")}>
                Leo
              </button>
            </div>
            <span className="stx-sync" title={sync.detail}>
              <i
                style={{
                  background: sync.status === "synced" ? "var(--stx-good)" : sync.status === "error" ? "var(--stx-bad)" : "var(--stx-faint)"
                }}
              />
              {sync.status === "synced" ? "カードは同期済み" : sync.status === "error" ? "同期エラー（この端末に保存中）" : "この端末に保存"}
            </span>
          </div>
        </header>

        {mode === "leo" ? (
          <LeoView cardStates={cardStates} updateCard={updateCard} settings={settings} goals={goals} students={goals.students} />
        ) : (
          <>
            <nav className="stx-tabs stx-no-print">
              {TABS.map((t) => (
                <button type="button" key={t.id} className={tab === t.id ? "on" : ""} onClick={() => goTo(t.id)}>
                  {t.label}
                  {t.id === "cards" && prog.todo > 0 && <span className="stx-badge">{prog.todo}</span>}
                </button>
              ))}
            </nav>
            {tab === "overview" && <Overview ctx={ctx} />}
            {tab === "sheet" && <ReportSheet ctx={ctx} />}
            {tab === "trend" && <Trends ctx={ctx} />}
            {tab === "compare" && <Compare ctx={ctx} />}
            {tab === "weak" && <WeakPoints ctx={ctx} />}
            {tab === "questions" && <QuestionExplorer ctx={ctx} />}
            {tab === "cards" && <CardsTab ctx={ctx} />}
            {tab === "plan" && <NextTest ctx={ctx} />}
            {tab === "goals" && <Goals ctx={ctx} />}
            {tab === "print" && <PrintReport ctx={ctx} />}
          </>
        )}
      </div>
    </div>
  );
}
