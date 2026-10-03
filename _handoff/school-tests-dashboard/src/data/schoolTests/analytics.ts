// Pure analysis of Leo's school test results. No React, no storage — every
// number the dashboard shows is computed here, so it can be checked in one
// place.
//
// Two rules run through all of it:
//  1. Raw scores are not comparable across tests. Tests differ in difficulty
//     (the 期末 average total was 45 points below the 中間's), so trends are
//     read through 平均との差 and 順位, and 点数 is shown for reference.
//  2. 定期テスト and 実力テスト measure different things (school vs
//     prefecture average, different ranges), so "change since last time"
//     prefers the last test of the same type and says which test it used.

import rawData from "../../../content/school-tests/tests.json";
import { studyLinkFor, type StudyLink } from "./studyLinks";
import {
  CORE_SUBJECTS,
  EXTRA_SUBJECTS,
  type AcademicGoals,
  type CoreSubject,
  type DomainResult,
  type QuestionResult,
  type ReviewCardState,
  type SchoolTest,
  type SchoolTestsFile,
  type Subject,
  type TestType
} from "./types";

export const schoolTestsFile = rawData as unknown as SchoolTestsFile;

export const subjectLabels: Record<Subject, string> = schoolTestsFile.subjectLabels;

export const subjectColors: Record<Subject, string> = {
  japanese: "#dc2626",
  social: "#ea580c",
  math: "#2563eb",
  science: "#16a34a",
  english: "#7c3aed",
  music: "#db2777",
  health: "#0ea5e9",
  techHome: "#d97706",
  art: "#0d9488"
};

export const testTypeColors: Record<TestType, string> = {
  中間: "#0ea5e9",
  期末: "#8b5cf6",
  実力: "#f59e0b",
  その他: "#64748b"
};

/** Tests oldest → newest. */
export const allTests: SchoolTest[] = [...schoolTestsFile.tests].sort((a, b) => a.date.localeCompare(b.date));

export const latestTest: SchoolTest | null = allTests.length ? allTests[allTests.length - 1] : null;

export const defaultGoals: AcademicGoals = {
  total5: 420,
  rank: 40,
  students: 150,
  subjects: { japanese: 80, social: 85, math: 85, science: 85, english: 95 }
};

export function avgLabel(test: SchoolTest): string {
  return test.averageScope === "prefecture" ? "県平均" : "学校平均";
}

export function shortTestName(test: SchoolTest): string {
  return test.name.replace("テスト", "").replace(/\s+/g, "");
}

export function testIndex(test: SchoolTest): number {
  return allTests.findIndex((t) => t.id === test.id);
}

export function previousTest(test: SchoolTest): SchoolTest | null {
  const i = testIndex(test);
  return i > 0 ? allTests[i - 1] : null;
}

/** The most recent earlier test of the same type, else the one just before. */
export function comparableTest(test: SchoolTest): { test: SchoolTest; sameType: boolean } | null {
  const i = testIndex(test);
  for (let j = i - 1; j >= 0; j--) {
    if (allTests[j].type === test.type) return { test: allTests[j], sameType: true };
  }
  const prev = previousTest(test);
  return prev ? { test: prev, sameType: false } : null;
}

export function subjectsIn(test: SchoolTest): Subject[] {
  const extras = EXTRA_SUBJECTS.filter((s) => typeof test.scores[s] === "number");
  return [...CORE_SUBJECTS, ...extras];
}

export function hasQuestionData(test: SchoolTest): boolean {
  return Boolean(test.questions && Object.keys(test.questions).length);
}

// ---------- Rows ----------

export type SubjectRow = {
  subject: Subject;
  score: number;
  average: number;
  diff: number;
  rank: number | null;
  /** 上位 % (rank / students × 100), lower is better. */
  topPct: number | null;
  genderRank: number | null;
};

const round1 = (n: number) => Math.round(n * 10) / 10;

export function subjectRow(test: SchoolTest, subject: Subject, students: number): SubjectRow | null {
  const score = test.scores[subject];
  const average = test.average[subject];
  if (typeof score !== "number" || typeof average !== "number") return null;
  const rank = test.subjectRanks[subject] ?? null;
  return {
    subject,
    score,
    average,
    diff: round1(score - average),
    rank,
    topPct: rank ? round1((rank / students) * 100) : null,
    genderRank: test.genderRanks?.[subject] ?? null
  };
}

export function subjectRows(test: SchoolTest, students: number): SubjectRow[] {
  return subjectsIn(test)
    .map((s) => subjectRow(test, s, students))
    .filter((r): r is SubjectRow => r !== null);
}

export type TotalKey = "total3" | "total5" | "total9";
export const totalLabels: Record<TotalKey, string> = { total3: "3科目（国数英）", total5: "5科目", total9: "9科目" };
export const totalMax: Record<TotalKey, number> = { total3: 300, total5: 500, total9: 900 };

export function totalRow(test: SchoolTest, key: TotalKey, students: number) {
  const t = test.totals[key];
  if (!t) return null;
  return {
    key,
    score: t.score,
    average: t.average,
    diff: round1(t.score - t.average),
    rank: t.rank,
    topPct: t.rank ? round1((t.rank / students) * 100) : null,
    genderRank: t.genderRank
  };
}

// ---------- Trends ----------

export type TrendMetric = "score" | "diff" | "rank" | "topPct";

export const trendMetricLabels: Record<TrendMetric, string> = {
  score: "点数",
  diff: "平均との差",
  rank: "順位",
  topPct: "上位%"
};

export function metricValue(test: SchoolTest, subject: Subject | TotalKey, metric: TrendMetric, students: number): number | null {
  if (subject === "total3" || subject === "total5" || subject === "total9") {
    const r = totalRow(test, subject, students);
    if (!r) return null;
    return metric === "score" ? r.score : metric === "diff" ? r.diff : metric === "rank" ? r.rank : r.topPct;
  }
  const r = subjectRow(test, subject, students);
  if (!r) return null;
  return metric === "score" ? r.score : metric === "diff" ? r.diff : metric === "rank" ? r.rank : r.topPct;
}

/** Least-squares slope of a series against its index (per test). */
export function slope(values: Array<number | null>): number | null {
  const pts = values.map((v, i) => [i, v] as const).filter((p): p is readonly [number, number] => p[1] !== null);
  if (pts.length < 2) return null;
  const n = pts.length;
  const mx = pts.reduce((a, p) => a + p[0], 0) / n;
  const my = pts.reduce((a, p) => a + p[1], 0) / n;
  const num = pts.reduce((a, p) => a + (p[0] - mx) * (p[1] - my), 0);
  const den = pts.reduce((a, p) => a + (p[0] - mx) ** 2, 0);
  return den ? num / den : null;
}

function stdev(values: number[]): number {
  if (values.length < 2) return 0;
  const m = values.reduce((a, b) => a + b, 0) / values.length;
  return Math.sqrt(values.reduce((a, v) => a + (v - m) ** 2, 0) / values.length);
}

export type SubjectProfile = {
  subject: CoreSubject;
  /** Mean 上位% across tests (lower = stronger). */
  meanTopPct: number | null;
  /** Mean 平均との差 across tests. */
  meanDiff: number;
  /** Change in 上位% per test (negative = improving). */
  topPctTrend: number | null;
  /** Spread of 上位% — how much the subject swings. */
  swing: number;
  label: "得意" | "安定" | "波がある" | "要注意";
  direction: "上昇" | "下降" | "横ばい" | "—";
};

export function subjectProfiles(tests: SchoolTest[], students: number): SubjectProfile[] {
  return CORE_SUBJECTS.map((subject) => {
    const tops = tests.map((t) => subjectRow(t, subject, students)?.topPct ?? null);
    const diffs = tests.map((t) => subjectRow(t, subject, students)?.diff ?? null).filter((d): d is number => d !== null);
    const valid = tops.filter((v): v is number => v !== null);
    const meanTopPct = valid.length ? round1(valid.reduce((a, b) => a + b, 0) / valid.length) : null;
    const meanDiff = diffs.length ? round1(diffs.reduce((a, b) => a + b, 0) / diffs.length) : 0;
    const trend = slope(tops);
    const swing = round1(stdev(valid));
    let label: SubjectProfile["label"] = "安定";
    if (meanTopPct !== null && meanTopPct <= 20) label = "得意";
    else if (swing >= 18) label = "波がある";
    else if (meanTopPct !== null && meanTopPct >= 55) label = "要注意";
    const direction: SubjectProfile["direction"] =
      trend === null ? "—" : trend <= -4 ? "上昇" : trend >= 4 ? "下降" : "横ばい";
    return { subject, meanTopPct, meanDiff, topPctTrend: trend === null ? null : round1(trend), swing, label, direction };
  });
}

// ---------- Question-level analysis ----------

export type QuestionRef = QuestionResult & {
  testId: string;
  subject: CoreSubject;
  domainName: string;
  /** Points lost (配点, or an estimate of 2 when unknown). */
  value: number;
  /** How "cheap" the miss was: 配点 × 全体正答率. Bigger = easier points to win back. */
  priority: number;
  kind: MissKind | "win" | "hardWin";
  link: StudyLink | null;
  /** Answer had to be written out (記述・作文・書き取り・英訳). */
  written: boolean;
};

/**
 * - easy: most people got it (≥ 60%) — a gap in basics or a slip
 * - standard: about half got it (40–59%) — the core of the test
 * - hard: few got it (< 40%) — worth it later, not first
 */
export type MissKind = "easy" | "standard" | "hard";

export const missKindLabels: Record<MissKind, string> = {
  easy: "基本（全体60%以上）",
  standard: "標準（40〜59%）",
  hard: "難問（40%未満）"
};

export function missKind(rate: number): MissKind {
  return rate >= 60 ? "easy" : rate >= 40 ? "standard" : "hard";
}

const WRITTEN = /記述|作文|書き取り|和文英訳|整序|補じゅう|数字の書き取り/;

export function questionRefs(test: SchoolTest): QuestionRef[] {
  const out: QuestionRef[] = [];
  if (!test.questions) return out;
  for (const subject of CORE_SUBJECTS) {
    const qs = test.questions[subject];
    if (!qs) continue;
    const domains = test.domains?.[subject] ?? [];
    for (const q of qs) {
      const domainName = domains[q.domain - 1]?.name ?? "";
      const value = q.points ?? 2;
      out.push({
        ...q,
        testId: test.id,
        subject,
        domainName,
        value,
        priority: round1((value * q.rate) / 100),
        kind: q.ok ? (q.rate < 45 ? "hardWin" : "win") : missKind(q.rate),
        link: studyLinkFor(subject, domainName, q.topic),
        written: WRITTEN.test(q.topic)
      });
    }
  }
  return out;
}

export type SubjectQuestionSummary = {
  subject: CoreSubject;
  count: number;
  correct: number;
  lost: number;
  /** Points lost on questions ≥ 50% of everyone got right. */
  cheapLost: number;
  byKind: Record<MissKind, { count: number; points: number }>;
  written: { count: number; correct: number };
};

export function questionSummary(test: SchoolTest): SubjectQuestionSummary[] {
  const refs = questionRefs(test);
  return CORE_SUBJECTS.filter((s) => refs.some((r) => r.subject === s)).map((subject) => {
    const qs = refs.filter((r) => r.subject === subject);
    const misses = qs.filter((q) => !q.ok);
    const byKind = { easy: { count: 0, points: 0 }, standard: { count: 0, points: 0 }, hard: { count: 0, points: 0 } };
    for (const m of misses) {
      const k = missKind(m.rate);
      byKind[k].count++;
      byKind[k].points += m.value;
    }
    const written = qs.filter((q) => q.written);
    return {
      subject,
      count: qs.length,
      correct: qs.length - misses.length,
      lost: misses.reduce((a, m) => a + m.value, 0),
      cheapLost: misses.filter((m) => m.rate >= 50).reduce((a, m) => a + m.value, 0),
      byKind,
      written: { count: written.length, correct: written.filter((q) => q.ok).length }
    };
  });
}

/** Misses most people got right — the cheapest points, best first. */
export function cheapestMisses(test: SchoolTest, minRate = 50): QuestionRef[] {
  return questionRefs(test)
    .filter((q) => !q.ok && q.rate >= minRate)
    .sort((a, b) => b.priority - a.priority || b.rate - a.rate);
}

/** Questions few people got that Leo got — proof of what he can do. */
export function hardWins(test: SchoolTest, maxRate = 45): QuestionRef[] {
  return questionRefs(test)
    .filter((q) => q.ok && q.rate < maxRate)
    .sort((a, b) => a.rate - b.rate);
}

export type DomainGap = DomainResult & { subject: CoreSubject; gap: number; lost: number };

export function domainGaps(test: SchoolTest): DomainGap[] {
  const out: DomainGap[] = [];
  for (const subject of CORE_SUBJECTS) {
    for (const d of test.domains?.[subject] ?? []) {
      out.push({ ...d, subject, gap: d.rate - d.overall, lost: d.max - d.score });
    }
  }
  return out;
}

export type TopicCluster = { key: string; subject: CoreSubject; misses: QuestionRef[]; points: number; total: number };

/** Misses grouped by the first part of 問題内容, e.g. all 漢字の書き取り together. */
export function topicClusters(test: SchoolTest): TopicCluster[] {
  const refs = questionRefs(test);
  const map = new Map<string, TopicCluster>();
  for (const q of refs) {
    const key = q.topic.split("・")[0];
    const id = `${q.subject}:${key}`;
    const c = map.get(id) ?? { key, subject: q.subject, misses: [], points: 0, total: 0 };
    c.total++;
    if (!q.ok) {
      c.misses.push(q);
      c.points += q.value;
    }
    map.set(id, c);
  }
  return [...map.values()].filter((c) => c.misses.length >= 2).sort((a, b) => b.points - a.points);
}

/** Score if the cheapest misses had been right — the realistic next step. */
export function recoverableScore(test: SchoolTest, minRate = 50) {
  const cheap = cheapestMisses(test, minRate);
  const byS = new Map<CoreSubject, number>();
  for (const q of cheap) byS.set(q.subject, (byS.get(q.subject) ?? 0) + q.value);
  const total5 = test.totals.total5.score + cheap.reduce((a, q) => a + q.value, 0);
  return { total5, points: total5 - test.totals.total5.score, bySubject: byS };
}

// ---------- Review cards ----------

export type ReviewCard = QuestionRef & { id: string; testName: string; testDate: string };

export function cardId(testId: string, subject: CoreSubject, no: string) {
  return `${testId}:${subject}:${no}`;
}

/** Every miss in every test with question data becomes a card. */
export function allCards(): ReviewCard[] {
  const out: ReviewCard[] = [];
  for (const test of allTests) {
    for (const q of questionRefs(test)) {
      if (q.ok) continue;
      out.push({ ...q, id: cardId(test.id, q.subject, q.no), testName: test.name, testDate: test.date });
    }
  }
  return out;
}

export function emptyCardState(card: ReviewCard): ReviewCardState {
  return {
    id: card.id,
    testId: card.testId,
    subject: card.subject,
    questionNo: card.no,
    status: "todo",
    reason: null,
    note: "",
    practiceCount: 0,
    practicedAt: null,
    masteredAt: null,
    updatedAt: new Date(0).toISOString()
  };
}

export type CardProgress = {
  total: number;
  todo: number;
  practiced: number;
  mastered: number;
  pointsTotal: number;
  pointsWon: number;
};

export function cardProgress(cards: ReviewCard[], states: Record<string, ReviewCardState>): CardProgress {
  const p = { total: cards.length, todo: 0, practiced: 0, mastered: 0, pointsTotal: 0, pointsWon: 0 };
  for (const c of cards) {
    const s = states[c.id]?.status ?? "todo";
    p[s]++;
    p.pointsTotal += c.value;
    if (s === "mastered") p.pointsWon += c.value;
  }
  return p;
}

// ---------- Study plan ----------

export type PlanDay = { date: string; cards: ReviewCard[]; retests: ReviewCard[]; isTestDay: boolean };

const DAY = 86_400_000;

export function isoDay(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${dd}`;
}

export function daysUntil(date: string, today = new Date()): number | null {
  if (!date) return null;
  const t = new Date(`${date}T00:00:00`);
  const now = new Date(`${isoDay(today)}T00:00:00`);
  return Math.round((t.getTime() - now.getTime()) / DAY);
}

/**
 * Lays the open cards out day by day until the test.
 *
 * - Highest priority first (cheapest points), but no more than two cards of
 *   one subject on a day, so a day is never all 国語.
 * - A card practised on day N comes back as a re-test on day N+3 (spacing),
 *   or on the last day before the test, whichever comes first.
 * - The day before the test is kept for re-tests only.
 * - With no test date, it plans 14 days.
 */
export function buildPlan(
  cards: ReviewCard[],
  states: Record<string, ReviewCardState>,
  testDate: string,
  cardsPerDay: number,
  today = new Date()
): PlanDay[] {
  const until = daysUntil(testDate, today);
  const span = until !== null && until > 0 ? until : 14;
  const days: PlanDay[] = [];
  for (let i = 0; i < span; i++) {
    days.push({ date: isoDay(new Date(today.getTime() + i * DAY)), cards: [], retests: [], isTestDay: false });
  }
  if (until !== null && until > 0) {
    days.push({ date: testDate, cards: [], retests: [], isTestDay: true });
  }

  const studyDays = days.filter((d) => !d.isTestDay);
  const lastStudy = studyDays.length - 1;
  const newCardDays = Math.max(1, studyDays.length - 1);

  // Practised but not yet re-tested: re-test early.
  const waiting = cards.filter((c) => states[c.id]?.status === "practiced");
  waiting.forEach((c, i) => studyDays[Math.min(i % Math.max(1, Math.ceil(studyDays.length / 3)), lastStudy)].retests.push(c));

  const queue = cards
    .filter((c) => (states[c.id]?.status ?? "todo") === "todo")
    .sort((a, b) => b.priority - a.priority || b.rate - a.rate);

  let dayIdx = 0;
  while (queue.length && dayIdx < newCardDays) {
    const day = studyDays[dayIdx];
    const perSubject = new Map<CoreSubject, number>();
    for (let i = 0; i < queue.length && day.cards.length < cardsPerDay; ) {
      const c = queue[i];
      const n = perSubject.get(c.subject) ?? 0;
      if (n >= 2 && queue.some((q) => (perSubject.get(q.subject) ?? 0) < 2)) {
        i++;
        continue;
      }
      day.cards.push(c);
      perSubject.set(c.subject, n + 1);
      queue.splice(i, 1);
    }
    for (const c of day.cards) {
      const back = Math.min(dayIdx + 3, lastStudy);
      studyDays[back].retests.push(c);
    }
    dayIdx++;
  }
  return days;
}

// ---------- Goals ----------

export function goalGaps(test: SchoolTest, goals: AcademicGoals) {
  const subjects = CORE_SUBJECTS.map((s) => {
    const score = test.scores[s] ?? 0;
    return { subject: s, score, goal: goals.subjects[s], need: Math.max(0, goals.subjects[s] - score), met: score >= goals.subjects[s] };
  });
  const total = test.totals.total5.score;
  return {
    subjects,
    total: { score: total, goal: goals.total5, need: Math.max(0, goals.total5 - total), met: total >= goals.total5 },
    rank: { rank: test.totals.total5.rank, goal: goals.rank, met: (test.totals.total5.rank ?? 9999) <= goals.rank }
  };
}

// ---------- Written insights ----------

export type Insight = { tone: "good" | "warn" | "info"; title: string; text: string };

export function insightsFor(test: SchoolTest, students: number): Insight[] {
  const out: Insight[] = [];
  const t5 = test.totals.total5;
  const cmp = comparableTest(test);
  const prev = previousTest(test);

  out.push({
    tone: t5.score >= t5.average ? "good" : "warn",
    title: "合計",
    text: `5科目 ${t5.score}点（${avgLabel(test)} ${t5.average}点、差 ${signed(round1(t5.score - t5.average))}点）・学年 ${t5.rank ?? "—"}位（上位 ${t5.rank ? round1((t5.rank / students) * 100) : "—"}%）。`
  });

  if (prev && prev.totals.total5.rank && t5.rank) {
    const d = prev.totals.total5.rank - t5.rank;
    out.push({
      tone: d > 0 ? "good" : d < 0 ? "warn" : "info",
      title: "順位の動き",
      text:
        d > 0
          ? `前回（${prev.name}）の ${prev.totals.total5.rank}位から ${d}人抜いて ${t5.rank}位。点数が${t5.score < prev.totals.total5.score ? "下がっても" : "上がり"}、順位は上がっています。`
          : d < 0
            ? `前回（${prev.name}）の ${prev.totals.total5.rank}位から ${-d}つ下がって ${t5.rank}位。`
            : `前回と同じ ${t5.rank}位。`
    });
  }

  if (cmp && !cmp.sameType) {
    out.push({
      tone: "info",
      title: "比べ方の注意",
      text: `${test.type}テストは今回が初めてなので、${cmp.test.name}と比べています。平均の種類（${avgLabel(test)}／${avgLabel(cmp.test)}）が違うので、点数より順位で比べてください。`
    });
  }

  const rows = subjectRows(test, students).filter((r) => (CORE_SUBJECTS as readonly string[]).includes(r.subject));
  const best = [...rows].sort((a, b) => (a.topPct ?? 999) - (b.topPct ?? 999))[0];
  const worst = [...rows].sort((a, b) => (b.topPct ?? -1) - (a.topPct ?? -1))[0];
  if (best) out.push({ tone: "good", title: "一番の強み", text: `${subjectLabels[best.subject]}：${best.score}点・${best.rank}位（上位${best.topPct}%）。` });
  if (worst && worst !== best)
    out.push({ tone: "warn", title: "一番の課題", text: `${subjectLabels[worst.subject]}：${worst.score}点・${worst.rank}位（上位${worst.topPct}%）。` });

  if (hasQuestionData(test)) {
    const cheap = cheapestMisses(test);
    const pts = cheap.reduce((a, q) => a + q.value, 0);
    if (cheap.length)
      out.push({
        tone: "warn",
        title: "取れたはずの点",
        text: `全体の半分以上が正解した問題を ${cheap.length}問 落としています（合計 ${pts}点）。ここを取り戻すだけで 5科目 ${t5.score + pts}点になります。`
      });
    const sum = questionSummary(test).filter((s) => s.written.count >= 3);
    if (sum.length) {
      const weakest = [...sum].sort((x, y) => x.written.correct / x.written.count - y.written.correct / y.written.count)[0];
      const ratio = weakest.written.correct / weakest.written.count;
      out.push({
        tone: ratio >= 0.6 ? "good" : "warn",
        title: "書いて答える問題",
        text:
          sum.map((s) => `${subjectLabels[s.subject]} ${s.written.correct}/${s.written.count}問`).join("・") +
          (ratio < 0.6 ? `。${subjectLabels[weakest.subject]}の記述・書き取りが一番の伸びしろです。` : "。")
      });
    }
    const wins = hardWins(test);
    if (wins.length)
      out.push({ tone: "good", title: "難問を正解", text: `全体の正答率45%未満の問題を ${wins.length}問 正解。力はあります。` });
  }

  for (const r of test.remarks ?? []) out.push({ tone: "info", title: "メモ", text: r });
  return out;
}

export function signed(n: number): string {
  return n > 0 ? `+${n}` : `${n}`;
}
