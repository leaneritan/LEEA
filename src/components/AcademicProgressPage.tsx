"use client";

import { useEffect, useMemo, useState, useRef, useCallback } from "react";

const subjects = ["japanese", "social", "math", "science", "english"] as const;
type SubjectId = typeof subjects[number];

const labels: Record<SubjectId, string> = {
  japanese: "国語",
  social: "社会",
  math: "数学",
  science: "理科",
  english: "英語"
};

const colors: Record<SubjectId, string> = {
  japanese: "#dc2626",
  social: "#ea580c",
  math: "#2563eb",
  science: "#16a34a",
  english: "#7c3aed"
};

interface TestRecord {
  date: string;
  name: string;
  scores: Record<SubjectId, number>;
  rank: number | null;
  average: Record<SubjectId, number>;
}

interface AcademicGoals {
  total: number;
  rank: number;
  students: number;
  japanese: number;
  social: number;
  math: number;
  science: number;
  english: number;
}

const starterTests: TestRecord[] = [
  {
    date: "2026-05-17",
    name: "1学期中間テスト",
    scores: { japanese: 70, social: 75, math: 75, science: 80, english: 92 },
    rank: 65,
    average: { japanese: 74.2, social: 56.3, math: 67.2, science: 67.6, english: 82.7 }
  }
];

const defaultGoals: AcademicGoals = {
  total: 420,
  rank: 40,
  students: 150,
  japanese: 85,
  social: 85,
  math: 85,
  science: 85,
  english: 95
};

export function AcademicProgressPage() {
  const [tests, setTests] = useState<TestRecord[]>([]);
  const [goals, setGoals] = useState<AcademicGoals>(defaultGoals);
  const [isLoaded, setIsLoaded] = useState(false);

  // Form State
  const [form, setForm] = useState({
    editIndex: null as number | null,
    name: "1学期期末テスト",
    date: new Date().toISOString().slice(0, 10),
    rank: "" as string | number,
    japanese: "" as string | number,
    social: "" as string | number,
    math: "" as string | number,
    science: "" as string | number,
    english: "" as string | number,
    avg_japanese: "" as string | number,
    avg_social: "" as string | number,
    avg_math: "" as string | number,
    avg_science: "" as string | number,
    avg_english: "" as string | number,
  });

  const [compareFromIdx, setCompareFromIdx] = useState<number>(0);
  const [compareToIdx, setCompareToIdx] = useState<number>(0);
  const [radarCompareIdx, setRadarCompareIdx] = useState<number>(0);

  const [showDeleteModal, setShowDeleteModal] = useState<number | null>(null);
  const [toastMsg, setToastMsg] = useState("");

  useEffect(() => {
    const savedTests = localStorage.getItem("leeaTestsJPDashboardV2");
    const savedGoals = localStorage.getItem("leeaGoalsJPDashboardV2");

    if (savedTests) {
      try {
        const parsed = JSON.parse(savedTests);
        setTests(parsed);
      } catch (e) {
        setTests(starterTests);
      }
    } else {
      setTests(starterTests);
    }

    if (savedGoals) {
      try {
        const parsed = JSON.parse(savedGoals);
        setGoals({ ...defaultGoals, ...parsed });
      } catch (e) {
        setGoals(defaultGoals);
      }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("leeaTestsJPDashboardV2", JSON.stringify(tests));
    }
  }, [tests, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("leeaGoalsJPDashboardV2", JSON.stringify(goals));
    }
  }, [goals, isLoaded]);

  const showToast = useCallback((msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 1800);
  }, []);

  const totalScore = (t: TestRecord) => subjects.reduce((sum, s) => sum + Number(t.scores[s] || 0), 0);
  const avgTotalScore = (t: TestRecord) => Math.round(subjects.reduce((sum, s) => sum + Number(t.average?.[s] || 0), 0) * 10) / 10;

  const clearForm = useCallback((show = true) => {
    setForm({
      editIndex: null,
      name: "1学期期末テスト",
      date: new Date().toISOString().slice(0, 10),
      rank: "",
      japanese: "",
      social: "",
      math: "",
      science: "",
      english: "",
      avg_japanese: "",
      avg_social: "",
      avg_math: "",
      avg_science: "",
      avg_english: "",
    });
    if (show) showToast("入力欄をクリアしました");
  }, [showToast]);

  const addOrUpdateTest = () => {
    const t: TestRecord = {
      date: form.date || new Date().toISOString().slice(0, 10),
      name: form.name || "新しいテスト",
      scores: {
        japanese: Number(form.japanese || 0),
        social: Number(form.social || 0),
        math: Number(form.math || 0),
        science: Number(form.science || 0),
        english: Number(form.english || 0),
      },
      rank: form.rank === "" ? null : Number(form.rank),
      average: {
        japanese: Number(form.avg_japanese || 0),
        social: Number(form.avg_social || 0),
        math: Number(form.avg_math || 0),
        science: Number(form.avg_science || 0),
        english: Number(form.avg_english || 0),
      }
    };

    for (const s of subjects) {
      if (t.scores[s] < 0 || t.scores[s] > 100) {
        alert(labels[s] + "は0〜100で入力してください。");
        return;
      }
    }
    if (t.rank !== null && t.rank < 0) {
      alert("順位を確認してください。");
      return;
    }

    if (form.editIndex !== null) {
      const nextTests = [...tests];
      nextTests[form.editIndex] = t;
      setTests(nextTests);
      showToast("テストデータを修正しました");
    } else {
      setTests([...tests, t]);
      showToast("テストを追加しました");
    }
    clearForm(false);
  };

  const editTest = (i: number) => {
    const t = tests[i];
    setForm({
      editIndex: i,
      name: t.name,
      date: t.date,
      rank: t.rank ?? "",
      japanese: t.scores.japanese,
      social: t.scores.social,
      math: t.scores.math,
      science: t.scores.science,
      english: t.scores.english,
      avg_japanese: t.average.japanese || "",
      avg_social: t.average.social || "",
      avg_math: t.average.math || "",
      avg_science: t.average.science || "",
      avg_english: t.average.english || "",
    });
    window.location.hash = "#input";
    showToast("編集モードです");
  };

  const askDelete = (i: number) => {
    setShowDeleteModal(i);
  };

  const confirmDelete = () => {
    if (showDeleteModal === null) return;
    const nextTests = tests.filter((_, i) => i !== showDeleteModal);
    setTests(nextTests.length ? nextTests : starterTests);
    setShowDeleteModal(null);
    showToast("削除しました");
  };

  const fillSampleImprovement = () => {
    setForm({
      ...form,
      name: "1学期期末テスト",
      date: "2026-07-10",
      japanese: 82,
      social: 80,
      math: 85,
      science: 86,
      english: 94,
      rank: 42,
      avg_japanese: 72,
      avg_social: 58,
      avg_math: 68,
      avg_science: 69,
      avg_english: 83
    });
    showToast("サンプルを入力しました");
  };

  const resetData = () => {
    if (!confirm("初期データに戻しますか？追加したテストは消えます。")) return;
    setTests(starterTests);
    clearForm(false);
    showToast("初期データに戻しました");
  };

  const totalChartRef = useRef<SVGSVGElement>(null);
  const radarChartRef = useRef<SVGSVGElement>(null);
  const improvementChartRef = useRef<SVGSVGElement>(null);
  const subjectTrendChartRef = useRef<SVGSVGElement>(null);
  const rankChartRef = useRef<SVGSVGElement>(null);

  const sortedTests = useMemo(() => {
    return [...tests].sort((a, b) => String(a.date).localeCompare(String(b.date)));
  }, [tests]);

  const summary = useMemo(() => {
    if (!sortedTests.length) return null;
    const latest = sortedTests[sortedTests.length - 1];
    const previous = sortedTests[sortedTests.length - 2];

    const curTotal = totalScore(latest);
    const prevTotal = previous ? totalScore(previous) : null;
    const totalDiff = prevTotal !== null ? curTotal - prevTotal : null;

    const curRank = latest.rank;
    const prevRank = previous ? previous.rank : null;
    const rankDiff = (curRank !== null && prevRank !== null) ? curRank - prevRank : null;

    const diffRows = subjects.map(s => ({
      s,
      score: latest.scores[s],
      gap: Math.max(0, (goals[s] || 100) - latest.scores[s])
    }));

    const strong = diffRows.reduce((a, b) => a.score > b.score ? a : b).s;
    const weak = diffRows.reduce((a, b) => a.gap > b.gap ? a : b).s;

    return {
      curTotal,
      totalDiff,
      curRank,
      rankDiff,
      strong,
      strongScore: latest.scores[strong],
      weak
    };
  }, [sortedTests, goals]);

  const esc = (s: any) => String(s ?? "").replace(/[&<>\"]/g, m => (({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;" } as any)[m]));
  const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

  const renderTotalAverageChart = useCallback(() => {
    const svg = totalChartRef.current;
    if (!svg || !sortedTests.length) return;
    const W = 760, H = 320, L = 52, R = 26, T = 26, B = 48;
    const totals = sortedTests.map(totalScore);
    const avgs = sortedTests.map(t => avgTotalScore(t) > 0 ? avgTotalScore(t) : null);
    const allVals = [...totals, ...avgs.filter((v): v is number => v !== null), goals.total || 420];
    let vmin = Math.max(0, Math.floor((Math.min(...allVals) - 25) / 25) * 25);
    let vmax = Math.min(500, Math.ceil((Math.max(...allVals) + 25) / 25) * 25);
    if (vmax - vmin < 100) { vmin = Math.max(0, vmin - 50); vmax = Math.min(500, vmax + 50); }
    const x = (i: number) => L + (W - L - R) * (sortedTests.length === 1 ? 0.5 : i / (sortedTests.length - 1));
    const y = (v: number) => T + (vmax - v) / (vmax - vmin) * (H - T - B);
    let html = `<defs><linearGradient id="grad_total_avg" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stop-color="#2563eb" stop-opacity=".15"/><stop offset="100%" stop-color="#2563eb" stop-opacity="0"/></linearGradient></defs>`;
    for (let i = 0; i < 5; i++) {
      const yy = T + (H - T - B) * i / 4;
      const val = Math.round(vmax - (vmax - vmin) * i / 4);
      html += `<line x1="${L}" y1="${yy}" x2="${W - R}" y2="${yy}" stroke="#e5eaf3"/><text x="10" y="${yy + 4}" font-size="12" fill="#667085">${val}</text>`;
    }
    const gy = y(goals.total || 420);
    html += `<line x1="${L}" y1="${gy}" x2="${W - R}" y2="${gy}" stroke="#dc2626" stroke-width="2" stroke-dasharray="7 6"/><text x="${L + 8}" y="${gy - 8}" font-size="12" fill="#dc2626" font-weight="900">目標 ${goals.total || 420}</text>`;
    const leoPts = totals.map((v, i) => `${x(i)},${y(v)}`).join(" ");
    if (totals.length > 1) { html += `<polygon points="${L},${H - B} ${leoPts} ${W - R},${H - B}" fill="url(#grad_total_avg)"/>`; }
    html += `<polyline points="${leoPts}" fill="none" stroke="#2563eb" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>`;
    const avgPts = avgs.map((v, i) => v === null ? null : `${x(i)},${y(v)}`);
    let segment: string[] = [];
    avgPts.forEach((p, i) => { if (p) { segment.push(p); } else if (segment.length) { html += `<polyline points="${segment.join(" ")}" fill="none" stroke="#64748b" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`; segment = []; } });
    if (segment.length) { html += `<polyline points="${segment.join(" ")}" fill="none" stroke="#64748b" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`; }
    totals.forEach((v, i) => { html += `<circle cx="${x(i)}" cy="${y(v)}" r="6" fill="#fff" stroke="#2563eb" stroke-width="4"/><text x="${x(i) - 15}" y="${y(v) - 13}" font-size="13" fill="#172033" font-weight="1000">${v}</text>`; });
    avgs.forEach((v, i) => { if (v !== null) html += `<circle cx="${x(i)}" cy="${y(v)}" r="5" fill="#fff" stroke="#64748b" stroke-width="3"/><text x="${x(i) - 18}" y="${y(v) + 22}" font-size="12" fill="#64748b" font-weight="900">平均${v}</text>`; });
    sortedTests.forEach((t, i) => html += `<text x="${x(i) - 30}" y="${H - 18}" font-size="11" fill="#667085">${esc(t.name).slice(0, 9)}</text>`);
    svg.innerHTML = html;
  }, [sortedTests, goals.total, esc]);

  const renderRadarChart = useCallback(() => {
    const svg = radarChartRef.current;
    if (!svg || !sortedTests.length) return;
    const cur = sortedTests[sortedTests.length - 1];
    const pre = sortedTests[radarCompareIdx] || sortedTests[Math.max(0, sortedTests.length - 2)];
    const W = 620, H = 340, cx = 300, cy = 172, R = 110;
    const angle = (i: number) => -Math.PI / 2 + i * 2 * Math.PI / subjects.length;
    const pt = (score: number, i: number, rad = R) => [cx + Math.cos(angle(i)) * rad * score / 100, cy + Math.sin(angle(i)) * rad * score / 100];
    let html = `<defs><filter id="radarShadow"><feDropShadow dx="0" dy="7" stdDeviation="7" flood-opacity=".13"/></filter></defs>`;
    [20, 40, 60, 80, 100].forEach(level => { const pts = subjects.map((s, i) => pt(level, i)).map(p => p.join(",")).join(" "); html += `<polygon points="${pts}" fill="none" stroke="#e5eaf3"/>`; html += `<text x="${cx + 4}" y="${cy - R * level / 100 - 2}" font-size="10" fill="#94a3b8">${level}</text>`; });
    subjects.forEach((s, i) => { const [x, y] = pt(100, i); html += `<line x1="${cx}" y1="${cy}" x2="${x}" y2="${y}" stroke="#e5eaf3"/><text x="${x + (x < cx ? -42 : x > cx ? 9 : -16)}" y="${y + (y < cy ? -10 : 19)}" font-size="14" fill="${colors[s]}" font-weight="1000">${labels[s]}</text>`; });
    if (pre && sortedTests.length > 1) { const ppts = subjects.map((s, i) => pt(pre.scores[s], i)).map(p => p.join(",")).join(" "); html += `<polygon points="${ppts}" fill="#ea580c" opacity=".08" stroke="#ea580c" stroke-width="4" stroke-dasharray="8 7"/>`; subjects.forEach((s, i) => { const [x, y] = pt(pre.scores[s], i); html += `<circle cx="${x}" cy="${y}" r="4" fill="#fff" stroke="#ea580c" stroke-width="2"/>`; }); }
    const cpts = subjects.map((s, i) => pt(cur.scores[s], i)).map(p => p.join(",")).join(" "); html += `<polygon points="${cpts}" fill="#2563eb" opacity=".16" stroke="#2563eb" stroke-width="5" filter="url(#radarShadow)"/>`;
    subjects.forEach((s, i) => { const [x, y] = pt(cur.scores[s], i); html += `<circle cx="${x}" cy="${y}" r="6" fill="#fff" stroke="#2563eb" stroke-width="3"/><text x="${x + 8}" y="${y + 4}" font-size="12" fill="#172033" font-weight="1000">${cur.scores[s]}</text>`; });
    html += `<rect x="446" y="24" width="146" height="86" rx="16" fill="#fff" stroke="#e5eaf3"/><line x1="466" y1="50" x2="492" y2="50" stroke="#2563eb" stroke-width="5" stroke-linecap="round"/><text x="502" y="54" font-size="13" fill="#172033" font-weight="1000">最新</text><line x1="466" y1="78" x2="492" y2="78" stroke="#ea580c" stroke-width="4" stroke-dasharray="7 6"/><text x="502" y="82" font-size="13" fill="#172033" font-weight="1000">比較</text>`;
    svg.innerHTML = html;
  }, [sortedTests, radarCompareIdx]);

  const renderImprovementChart = useCallback(() => {
    const svg = improvementChartRef.current;
    if (!svg) return;
    const W = 560, H = 320, L = 56, R = 20, T = 28, B = 48;
    if (sortedTests.length < 2) {
      svg.innerHTML = `<rect x="20" y="76" width="520" height="126" rx="22" fill="#f8fafc" stroke="#e5eaf3"/><text x="42" y="124" font-size="17" fill="#667085" font-weight="900">次のテストを追加すると改善グラフが出ます。</text><text x="42" y="155" font-size="13" fill="#667085">「サンプル改善データを入力」で動きを確認できます。</text>`;
      return;
    }
    const from = sortedTests[compareFromIdx] || sortedTests[Math.max(0, sortedTests.length - 2)];
    const to = sortedTests[compareToIdx] || sortedTests[sortedTests.length - 1];
    const diffs = subjects.map(s => Number(to.scores[s]) - Number(from.scores[s]));
    const max = Math.max(20, Math.ceil(Math.max(...diffs.map(Math.abs)) / 5) * 5);
    const zero = T + (H - T - B) / 2;
    const scale = (H - T - B) / 2 / max;
    const step = (W - L - R) / subjects.length;
    let html = `<line x1="${L}" y1="${zero}" x2="${W - R}" y2="${zero}" stroke="#172033" stroke-width="2"/><text x="18" y="${zero + 4}" font-size="12" fill="#667085">0</text>`;
    for (let g = -max; g <= max; g += 10) {
      const y = zero - g * scale;
      html += `<line x1="${L}" y1="${y}" x2="${W - R}" y2="${y}" stroke="#e5eaf3"/><text x="14" y="${y + 4}" font-size="11" fill="#94a3b8">${g > 0 ? "+" : ""}${g}</text>`;
    }
    subjects.forEach((s, i) => {
      const d = diffs[i], x = L + i * step + step * .18, bw = step * .64, y = d >= 0 ? zero - d * scale : zero, h = Math.max(2, Math.abs(d * scale));
      html += `<rect x="${x}" y="${y}" width="${bw}" height="${h}" rx="9" fill="${d >= 0 ? "#16a34a" : "#dc2626"}"/><text x="${x + bw / 2 - 14}" y="${d >= 0 ? y - 8 : y + h + 19}" font-size="13" fill="#172033" font-weight="1000">${d >= 0 ? "+" : ""}${d}</text><text x="${x + bw / 2 - 14}" y="${H - 18}" font-size="12" fill="${colors[s]}" font-weight="1000">${labels[s]}</text>`;
    });
    svg.innerHTML = html;
  }, [sortedTests, compareFromIdx, compareToIdx]);

  const renderSubjectTrendChart = useCallback(() => {
    const svg = subjectTrendChartRef.current;
    if (!svg || !sortedTests.length) return;
    const W = 700, H = 330, L = 46, R = 22, T = 26, B = 50;
    let html = "";
    for (let v = 50; v <= 100; v += 10) { const y = T + (100 - v) / 50 * (H - T - B); html += `<line x1="${L}" y1="${y}" x2="${W - R}" y2="${y}" stroke="#e5eaf3"/><text x="12" y="${y + 4}" font-size="11" fill="#667085">${v}</text>`; }
    const x = (i: number) => L + (W - L - R) * (sortedTests.length === 1 ? 0.5 : i / (sortedTests.length - 1));
    const y = (v: number) => T + (100 - clamp(v, 50, 100)) / 50 * (H - T - B);
    subjects.forEach(s => {
      const pts = sortedTests.map((t, i) => `${x(i)},${y(t.scores[s])}`).join(" ");
      html += `<polyline points="${pts}" fill="none" stroke="${colors[s]}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`;
      sortedTests.forEach((t, i) => html += `<circle cx="${x(i)}" cy="${y(t.scores[s])}" r="4" fill="#fff" stroke="${colors[s]}" stroke-width="2"/>`);
    });
    sortedTests.forEach((t, i) => html += `<text x="${x(i) - 30}" y="${H - 18}" font-size="11" fill="#667085">${esc(t.name).slice(0, 9)}</text>`);
    svg.innerHTML = html;
  }, [sortedTests, clamp, esc]);

  const renderRankChart = useCallback(() => {
    const svg = rankChartRef.current;
    if (!svg || !sortedTests.length) return;
    const values = sortedTests.map(t => t.rank || 0);
    const names = sortedTests.map(t => t.name);
    const min = 1, max = goals.students || 150, goal = goals.rank, invert = true, W = 520, H = 330, color = "#7c3aed", area = true;
    const L = 52, R = 26, T = 26, B = 48;
    let vmin = min, vmax = max; if (vmin === vmax) { vmin -= 10; vmax += 10; }
    const x = (i: number) => L + (W - L - R) * (values.length === 1 ? 0.5 : i / (values.length - 1));
    const y = (v: number) => T + (invert ? (v - vmin) / (vmax - vmin) : (vmax - v) / (vmax - vmin)) * (H - T - B);
    let html = `<defs><linearGradient id="grad_rank" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stop-color="${color}" stop-opacity=".18"/><stop offset="100%" stop-color="${color}" stop-opacity="0"/></linearGradient></defs>`;
    for (let i = 0; i < 5; i++) {
      const yy = T + (H - T - B) * i / 4;
      const val = Math.round(invert ? vmin + (vmax - vmin) * i / 4 : vmax - (vmax - vmin) * i / 4);
      html += `<line x1="${L}" y1="${yy}" x2="${W - R}" y2="${yy}" stroke="#e5eaf3"/><text x="10" y="${yy + 4}" font-size="12" fill="#667085">${val}</text>`;
    }
    if (goal !== undefined && goal !== 0) { const gy = y(goal); html += `<line x1="${L}" y1="${gy}" x2="${W - R}" y2="${gy}" stroke="#dc2626" stroke-width="2" stroke-dasharray="7 6"/><text x="${L + 8}" y="${gy - 8}" font-size="12" fill="#dc2626" font-weight="900">目標 ${goal}</text>`; }
    const pts = values.map((v, i) => `${x(i)},${y(v)}`).join(" ");
    if (area && values.length > 1) { html += `<polygon points="${L},${H - B} ${pts} ${W - R},${H - B}" fill="url(#grad_rank)"/>`; }
    html += `<polyline points="${pts}" fill="none" stroke="${color}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>`;
    values.forEach((v, i) => { html += `<circle cx="${x(i)}" cy="${y(v)}" r="6" fill="#fff" stroke="${color}" stroke-width="4"/><text x="${x(i) - 14}" y="${y(v) - 12}" font-size="13" fill="#172033" font-weight="1000">${v}</text><text x="${x(i) - 30}" y="${H - 18}" font-size="11" fill="#667085">${esc(names[i]).slice(0, 9)}</text>`; });
    svg.innerHTML = html;
  }, [sortedTests, goals.students, goals.rank, esc]);

  useEffect(() => {
    if (isLoaded) {
      renderTotalAverageChart();
      renderRadarChart();
      renderImprovementChart();
      renderSubjectTrendChart();
      renderRankChart();
    }
  }, [isLoaded, sortedTests, goals, compareFromIdx, compareToIdx, radarCompareIdx, renderTotalAverageChart, renderRadarChart, renderImprovementChart, renderSubjectTrendChart, renderRankChart]);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        .academic-progress-container {
          --tracker-bg: #f6f8fb;
          --tracker-surface: #ffffff;
          --tracker-surface2: #f8fafc;
          --tracker-ink: #172033;
          --tracker-muted: #667085;
          --tracker-line: #e4e8f0;
          --tracker-blue: #2563eb;
          --tracker-sky: #0ea5e9;
          --tracker-green: #16a34a;
          --tracker-red: #dc2626;
          --tracker-orange: #ea580c;
          --tracker-amber: #f59e0b;
          --tracker-purple: #7c3aed;
          --tracker-pink: #db2777;
          --tracker-shadow: 0 16px 40px rgba(15, 23, 42, .08);
          --tracker-radius: 22px;

          color: var(--tracker-ink);
          font-family: -apple-system, BlinkMacSystemFont, "Hiragino Sans", "Yu Gothic", Meiryo, "Segoe UI", Arial, sans-serif;
          background:
            radial-gradient(circle at 5% 0%, rgba(37, 99, 235, .08), transparent 34%),
            radial-gradient(circle at 100% 14%, rgba(245, 158, 11, .10), transparent 28%),
            var(--tracker-bg);
          min-height: 100vh;
          padding-bottom: 44px;
        }

        .academic-progress-container header {
          max-width: 1260px;
          margin: 0 auto;
          padding: 24px 20px 10px;
        }

        .academic-progress-container .hero {
          background: linear-gradient(135deg, #ffffff 0%, #f8fafc 58%, #eef6ff 100%);
          border: 1px solid #e6edf7;
          border-radius: 30px;
          padding: 26px;
          box-shadow: var(--tracker-shadow);
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 18px;
          align-items: center;
          position: relative;
          overflow: hidden;
        }

        .academic-progress-container .hero:before {
          content: "";
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 8px;
          background: linear-gradient(180deg, var(--tracker-blue), var(--tracker-green), var(--tracker-amber));
        }

        .academic-progress-container .kicker {
          font-size: 12px;
          font-weight: 1000;
          letter-spacing: .12em;
          text-transform: uppercase;
          color: var(--tracker-blue);
          margin-bottom: 8px;
        }

        .academic-progress-container h1 {
          font-size: 31px;
          line-height: 1.16;
          margin: 0 0 8px;
          letter-spacing: -.03em;
        }

        .academic-progress-container .hero p {
          margin: 0;
          color: var(--tracker-muted);
          line-height: 1.7;
          max-width: 780px;
        }

        .academic-progress-container .nav {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          justify-content: flex-end;
        }

        .academic-progress-container .nav a {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          text-decoration: none;
          color: var(--tracker-ink);
          font-weight: 1000;
          background: #fff;
          border: 1px solid var(--tracker-line);
          border-radius: 999px;
          padding: 10px 13px;
          box-shadow: 0 6px 16px rgba(15, 23, 42, .05);
        }

        .academic-progress-container .nav a:hover {
          transform: translateY(-1px);
        }

        .academic-progress-container main {
          max-width: 1260px;
          margin: 0 auto;
          padding: 12px 20px 44px;
        }

        .academic-progress-container .grid {
          display: grid;
          grid-template-columns: repeat(12, 1fr);
          gap: 16px;
        }

        .academic-progress-container .card {
          background: rgba(255, 255, 255, .94);
          border: 1px solid rgba(228, 232, 240, .95);
          border-radius: var(--tracker-radius);
          padding: 19px;
          box-shadow: var(--tracker-shadow);
        }

        .academic-progress-container .span-3 { grid-column: span 3 }
        .academic-progress-container .span-4 { grid-column: span 4 }
        .academic-progress-container .span-5 { grid-column: span 5 }
        .academic-progress-container .span-6 { grid-column: span 6 }
        .academic-progress-container .span-7 { grid-column: span 7 }
        .academic-progress-container .span-8 { grid-column: span 8 }
        .academic-progress-container .span-12 { grid-column: span 12 }

        .academic-progress-container h2 {
          font-size: 18px;
          margin: 0 0 14px;
          letter-spacing: -.01em;
        }

        .academic-progress-container .card-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 12px;
        }

        .academic-progress-container .eyebrow {
          font-size: 12px;
          color: var(--tracker-muted);
          font-weight: 1000;
          letter-spacing: .08em;
          text-transform: uppercase;
        }

        .academic-progress-container .big {
          font-size: 37px;
          line-height: 1;
          font-weight: 1000;
          letter-spacing: -.04em;
          margin-top: 8px;
        }

        .academic-progress-container .pill {
          display: inline-flex;
          gap: 6px;
          align-items: center;
          margin-top: 11px;
          padding: 7px 11px;
          border-radius: 999px;
          background: #eef2ff;
          color: #3730a3;
          font-weight: 1000;
          font-size: 12px;
        }

        .academic-progress-container .pill.good { background: #dcfce7; color: #166534 }
        .academic-progress-container .pill.bad { background: #fee2e2; color: #991b1b }
        .academic-progress-container .pill.warn { background: #fef3c7; color: #92400e }
        .academic-progress-container .pill.neutral { background: #f1f5f9; color: #475569 }

        .academic-progress-container .muted,
        .academic-progress-container .small { color: var(--tracker-muted); font-size: 12px }
        .academic-progress-container .goodtxt { color: var(--tracker-green); font-weight: 1000 }
        .academic-progress-container .badtxt { color: var(--tracker-red); font-weight: 1000 }
        .academic-progress-container .warntxt { color: var(--tracker-amber); font-weight: 1000 }

        .academic-progress-container button {
          border: 0;
          border-radius: 14px;
          padding: 10px 14px;
          font-weight: 1000;
          cursor: pointer;
          font-family: inherit;
          transition: .15s transform, .15s box-shadow;
        }

        .academic-progress-container button:hover {
          transform: translateY(-1px);
          box-shadow: 0 8px 18px rgba(15, 23, 42, .12);
        }

        .academic-progress-container .primary { background: linear-gradient(135deg, var(--tracker-blue), var(--tracker-purple)); color: #fff }
        .academic-progress-container .secondary { background: #eff6ff; color: #1d4ed8 }
        .academic-progress-container .ghost { background: #f3f6fb; color: #172033 }
        .academic-progress-container .danger { background: #fee2e2; color: #991b1b }
        .academic-progress-container .success { background: #dcfce7; color: #166534 }

        .academic-progress-container label {
          display: block;
          font-size: 12px;
          color: var(--tracker-muted);
          font-weight: 1000;
          margin-bottom: 5px;
        }

        .academic-progress-container input,
        .academic-progress-container select {
          width: 100%;
          padding: 10px 11px;
          border: 1px solid #d7deea;
          border-radius: 13px;
          font: inherit;
          background: #fff;
          color: var(--tracker-ink);
        }

        .academic-progress-container input:focus,
        .academic-progress-container select:focus {
          outline: 3px solid #bfdbfe;
          border-color: #60a5fa;
        }

        .academic-progress-container .formgrid { display: grid; grid-template-columns: repeat(6, 1fr); gap: 12px }
        .academic-progress-container .goalgrid { display: grid; grid-template-columns: repeat(8, 1fr); gap: 10px }
        .academic-progress-container .twocol { display: grid; grid-template-columns: 1fr 1fr; gap: 10px }
        .academic-progress-container .actions { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 14px }
        .academic-progress-container .actions.tight { margin-top: 0 }

        .academic-progress-container table { width: 100%; border-collapse: separate; border-spacing: 0; font-size: 14px; overflow: hidden }
        .academic-progress-container th,
        .academic-progress-container td { padding: 11px 10px; border-bottom: 1px solid var(--tracker-line); text-align: left; vertical-align: middle }
        .academic-progress-container th { font-size: 12px; color: var(--tracker-muted); font-weight: 1000; background: #f8fafc }
        .academic-progress-container .right { text-align: right }
        .academic-progress-container .center { text-align: center }
        .academic-progress-container .nowrap { white-space: nowrap }

        .academic-progress-container .chart { width: 100%; height: 320px; display: block }
        .academic-progress-container .chart text { font-family: inherit }

        .academic-progress-container .bar-row { display: grid; grid-template-columns: 58px 1fr 44px; gap: 10px; align-items: center; margin: 12px 0 }
        .academic-progress-container .bar { height: 15px; background: #e5eaf3; border-radius: 999px; overflow: hidden }
        .academic-progress-container .fill { height: 100%; border-radius: 999px }

        .academic-progress-container .goal-status { display: grid; grid-template-columns: repeat(7, 1fr); gap: 10px; margin-top: 14px }
        .academic-progress-container .goal-card { background: #f8fafc; border: 1px solid var(--tracker-line); border-radius: 16px; padding: 11px }
        .academic-progress-container .goal-title { font-weight: 1000; font-size: 12px; color: var(--tracker-muted) }
        .academic-progress-container .goal-value { font-weight: 1000; margin-top: 6px }
        .academic-progress-container .goal-progress { height: 12px; background: #e5eaf3; border-radius: 999px; overflow: hidden; margin-top: 9px }
        .academic-progress-container .goal-fill { height: 100%; border-radius: 999px; background: linear-gradient(90deg, #60a5fa, #16a34a) }

        .academic-progress-container .legend { display: flex; gap: 12px; flex-wrap: wrap; align-items: center }
        .academic-progress-container .legend-item { display: inline-flex; gap: 6px; align-items: center; font-size: 12px; color: var(--tracker-muted); font-weight: 1000 }
        .academic-progress-container .dot { width: 10px; height: 10px; border-radius: 999px; display: inline-block }
        .academic-progress-container .line-sample { width: 22px; height: 0; border-top: 4px solid #000; border-radius: 999px }
        .academic-progress-container .dash-sample { width: 22px; height: 0; border-top: 4px dashed #000; border-radius: 999px }

        .academic-progress-container .note { background: #fffbeb; border: 1px solid #fde68a; border-radius: 16px; padding: 12px 14px; color: #92400e; line-height: 1.65 }
        .academic-progress-container .soft { background: #f8fafc; border: 1px solid var(--tracker-line); border-radius: 16px; padding: 12px 14px; line-height: 1.6 }
        .academic-progress-container .analysis p { line-height: 1.75; margin: 0 0 10px }

        .academic-progress-container .modal { position: fixed; inset: 0; background: rgba(15, 23, 42, .56); display: none; align-items: center; justify-content: center; padding: 22px; z-index: 10 }
        .academic-progress-container .modal.open { display: flex }
        .academic-progress-container .modal-card { max-width: 680px; width: 100%; background: #fff; border-radius: 26px; padding: 22px; box-shadow: 0 24px 80px rgba(0, 0, 0, .28) }

        .academic-progress-container .toast { position: fixed; left: 50%; bottom: 22px; transform: translateX(-50%); background: #111827; color: #fff; padding: 12px 16px; border-radius: 999px; font-weight: 1000; display: none; z-index: 20 }
        .academic-progress-container .toast.show { display: block }

        .academic-progress-container .badge { display: inline-flex; align-items: center; gap: 6px; border-radius: 999px; padding: 6px 9px; background: #f1f5f9; font-weight: 1000; font-size: 12px; margin: 2px }
        .academic-progress-container .subject-table-wrap { overflow: auto }

        @media(max-width:1050px) {
          .academic-progress-container .hero { grid-template-columns: 1fr }
          .academic-progress-container .nav { justify-content: flex-start }
          .academic-progress-container .span-3, .academic-progress-container .span-4, .academic-progress-container .span-5, .academic-progress-container .span-6, .academic-progress-container .span-7, .academic-progress-container .span-8 { grid-column: span 12 }
          .academic-progress-container .formgrid { grid-template-columns: repeat(3, 1fr) }
          .academic-progress-container .goalgrid { grid-template-columns: repeat(4, 1fr) }
          .academic-progress-container .goal-status { grid-template-columns: repeat(3, 1fr) }
        }
        @media(max-width:660px) {
          .academic-progress-container header, .academic-progress-container main { padding-left: 12px; padding-right: 12px }
          .academic-progress-container .hero { padding: 20px }
          .academic-progress-container .formgrid, .academic-progress-container .goalgrid, .academic-progress-container .goal-status, .academic-progress-container .twocol { grid-template-columns: 1fr }
          .academic-progress-container .big { font-size: 31px }
          .academic-progress-container .chart { height: 280px }
          .academic-progress-container table { font-size: 12px }
          .academic-progress-container th, .academic-progress-container td { padding: 8px 6px }
          .academic-progress-container .card { padding: 16px }
        }
      ` }} />
      <div className="academic-progress-container">
        <header>
          <section className="hero">
            <div>
              <div className="kicker">LEEA Academic Dashboard</div>
              <h1>定期テスト成績トラッカー</h1>
              <p>テストを追加すると、合計点・学校平均・順位・教科別推移・レーダー・目標達成率が自動更新されます。学年人数は150人として順位の位置も見えるようにしました。入力ミスはあとから編集・削除できます。</p>
            </div>
            <nav className="nav">
              <a href="#input">＋ 追加</a>
              <a href="#goals">🎯 目標</a>
              <a href="#compare">📊 比較</a>
              <a href="#history">✏️ 修正</a>
            </nav>
          </section>
        </header>
        <main>
          <section className="grid">
            <div className="card span-3">
              <div className="eyebrow">最新合計</div>
              <div className="big">{summary?.curTotal ?? "—"}</div>
              <div className={`pill ${summary && summary.totalDiff !== null ? (summary.totalDiff >= 0 ? 'good' : 'bad') : 'neutral'}`}>
                {summary && summary.totalDiff !== null ? `${summary.totalDiff >= 0 ? '+' : ''}${summary.totalDiff}` : '—'}
              </div>
            </div>
            <div className="card span-3">
              <div className="eyebrow">学年順位</div>
              <div className="big">{summary?.curRank ?? "—"}</div>
              <div className={`pill ${summary && summary.rankDiff !== null ? (summary.rankDiff <= 0 ? 'good' : 'bad') : 'neutral'}`}>
                {summary && summary.rankDiff !== null ? `${summary.rankDiff <= 0 ? '' : '+'}${summary.rankDiff}位` : '順位は小さいほど良い'}
              </div>
            </div>
            <div className="card span-3">
              <div className="eyebrow">一番強い教科</div>
              <div className="big">{summary ? labels[summary.strong] : "—"}</div>
              <div className="pill good">{summary ? `${summary.strongScore}点` : "—"}</div>
            </div>
            <div className="card span-3">
              <div className="eyebrow">優先して伸ばす教科</div>
              <div className="big">{summary ? labels[summary.weak] : "—"}</div>
              <div className="pill warn">合計点への効果大</div>
            </div>

            <div className="card span-8">
              <div className="card-head"><h2>5教科合計の推移</h2><div className="legend"><span className="legend-item"><span className="line-sample" style={{ borderColor: "#2563eb" }}></span>Leo</span><span className="legend-item"><span className="line-sample" style={{ borderColor: "#64748b" }}></span>学校平均</span><span className="legend-item"><span className="dash-sample" style={{ borderColor: "#dc2626" }}></span>合計目標</span></div></div>
              <svg ref={totalChartRef} className="chart" viewBox="0 0 760 320" preserveAspectRatio="none"></svg>
              <div className="small">学校平均線は、各教科の平均点を合計して表示しています。平均点を入力すると自動で更新されます。</div>
            </div>
            <div className="card span-4">
              <h2>最新テスト：教科別スコア</h2>
              <div id="subjectBars">
                {sortedTests.length > 0 && subjects.map(s => {
                  const latest = sortedTests[sortedTests.length - 1];
                  return (
                    <div key={s}>
                      <div className="bar-row">
                        <b style={{ color: colors[s] }}>{labels[s]}</b>
                        <div className="bar">
                          <div className="fill" style={{ width: `${latest.scores[s]}%`, background: colors[s] }}></div>
                        </div>
                        <b>{latest.scores[s]}</b>
                      </div>
                      <div className="small" style={{ margin: "-6px 0 8px 68px" }}>
                        平均との差：<span className={latest.scores[s] - (latest.average?.[s] || 0) >= 0 ? 'goodtxt' : 'badtxt'}>
                          {latest.scores[s] - (latest.average?.[s] || 0) >= 0 ? '+' : ''}{Math.round((latest.scores[s] - (latest.average?.[s] || 0)) * 10) / 10}
                        </span> ／ 目標まで：{Math.max(0, (goals[s] || 100) - latest.scores[s])}点
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="card span-12" id="goals">
              <div className="card-head"><h2>🎯 目標設定</h2><span className="small">全教科の目標を設定できます。</span></div>
              <div className="goalgrid">
                <div><label htmlFor="goalTotal">合計点目標</label><input id="goalTotal" type="number" min="0" max="500" value={goals.total} onChange={e => setGoals({ ...goals, total: Number(e.target.value) })} /></div>
                <div><label htmlFor="goalRank">順位目標</label><input id="goalRank" type="number" min="1" value={goals.rank} onChange={e => setGoals({ ...goals, rank: Number(e.target.value) })} /></div>
                <div><label htmlFor="studentCount">学年人数</label><input id="studentCount" type="number" min="1" value={goals.students} onChange={e => setGoals({ ...goals, students: Number(e.target.value) })} /></div>
                <div><label htmlFor="goalJapanese">国語目標</label><input id="goalJapanese" type="number" min="0" max="100" value={goals.japanese} onChange={e => setGoals({ ...goals, japanese: Number(e.target.value) })} /></div>
                <div><label htmlFor="goalSocial">社会目標</label><input id="goalSocial" type="number" min="0" max="100" value={goals.social} onChange={e => setGoals({ ...goals, social: Number(e.target.value) })} /></div>
                <div><label htmlFor="goalMath">数学目標</label><input id="goalMath" type="number" min="0" max="100" value={goals.math} onChange={e => setGoals({ ...goals, math: Number(e.target.value) })} /></div>
                <div><label htmlFor="goalScience">理科目標</label><input id="goalScience" type="number" min="0" max="100" value={goals.science} onChange={e => setGoals({ ...goals, science: Number(e.target.value) })} /></div>
                <div><label htmlFor="goalEnglish">英語目標</label><input id="goalEnglish" type="number" min="0" max="100" value={goals.english} onChange={e => setGoals({ ...goals, english: Number(e.target.value) })} /></div>
              </div>
              <div className="actions">
                <button className="primary" onClick={() => showToast("目標を保存しました")}>目標を保存</button>
                <button className="ghost" onClick={() => setGoals({ total: 420, rank: 40, students: 150, japanese: 85, social: 85, math: 85, science: 85, english: 95 })}>おすすめ目標</button>
              </div>
              <div id="goalStatus" className="goal-status">
                {sortedTests.length > 0 && (() => {
                  const latest = sortedTests[sortedTests.length - 1];
                  const curTotal = totalScore(latest);
                  const remain = Math.max(0, goals.total - curTotal);
                  const totalPct = goals.total ? clamp(curTotal / goals.total * 100, 0, 100) : 0;
                  const rankOk = latest.rank && latest.rank <= goals.rank;
                  const rankPct = (latest.rank && goals.students) ? Math.round((latest.rank / goals.students * 100) * 10) / 10 : null;

                  return (
                    <>
                      <div className="goal-card">
                        <div className="goal-title">合計</div>
                        <div className="goal-value">{curTotal}/{goals.total}</div>
                        <div className="goal-progress"><div className="goal-fill" style={{ width: `${totalPct}%` }}></div></div>
                        <div className="small">{remain === 0 ? <span className="goodtxt">達成</span> : `あと${remain}点`}</div>
                      </div>
                      <div className="goal-card">
                        <div className="goal-title">順位</div>
                        <div className="goal-value">{latest.rank || "—"}位 / {goals.students || 150}人</div>
                        <div className="goal-progress"><div className="goal-fill" style={{ width: `${rankOk ? 100 : clamp(goals.rank / (latest.rank || goals.rank) * 100, 0, 100)}%`, background: rankOk ? '#16a34a' : '#f59e0b' }}></div></div>
                        <div className="small">{latest.rank ? `上位${rankPct}%・${rankOk ? <span className="goodtxt">目標達成</span> : `あと${Math.max(0, latest.rank - goals.rank)}人`}` : '順位なし'}</div>
                      </div>
                      {subjects.map(s => {
                        const g = goals[s] || 100;
                        const p = clamp(latest.scores[s] / g * 100, 0, 100);
                        const left = Math.max(0, g - latest.scores[s]);
                        return (
                          <div className="goal-card" key={s}>
                            <div className="goal-title">{labels[s]}</div>
                            <div className="goal-value">{latest.scores[s]}/{g}</div>
                            <div className="goal-progress"><div className="goal-fill" style={{ width: `${p}%`, background: colors[s] }}></div></div>
                            <div className="small">{left === 0 ? <span className="goodtxt">達成</span> : `あと${left}点`}</div>
                          </div>
                        );
                      })}
                    </>
                  );
                })()}
              </div>
            </div>

            <div className="card span-6">
              <div className="card-head">
                <h2>レーダーチャート</h2>
                <div className="legend"><span className="legend-item"><span className="line-sample" style={{ borderColor: "#2563eb" }}></span>最新</span><span className="legend-item"><span className="dash-sample" style={{ borderColor: "#ea580c" }}></span>比較</span></div>
              </div>
              <div className="twocol" style={{ marginBottom: "10px" }}>
                <div>
                  <label>比較するテスト</label>
                  <select id="radarCompareSelect" value={radarCompareIdx} onChange={(e) => setRadarCompareIdx(Number(e.target.value))}>
                    {sortedTests.map((t, i) => <option key={i} value={i}>{t.name}（{t.date}）</option>)}
                  </select>
                </div>
                <div><label>最新テスト</label><input id="radarLatestName" disabled value={sortedTests[sortedTests.length - 1]?.name || ""} /></div>
              </div>
              <svg ref={radarChartRef} className="chart" viewBox="0 0 620 340" preserveAspectRatio="xMidYMid meet"></svg>
              <div className="small">青＝最新、オレンジ点線＝比較テスト。色と線を分けて見やすくしました。</div>
            </div>

            <div className="card span-6" id="compare">
              <div className="card-head"><h2>前回からの教科別アップ・ダウン</h2><span className="badge">比較テストを変更可能</span></div>
              <div className="twocol" style={{ marginBottom: "10px" }}>
                <div>
                  <label>比較元</label>
                  <select id="compareFrom" value={compareFromIdx} onChange={(e) => setCompareFromIdx(Number(e.target.value))}>
                    {sortedTests.map((t, i) => <option key={i} value={i}>{t.name}（{t.date}）</option>)}
                  </select>
                </div>
                <div>
                  <label>比較先</label>
                  <select id="compareTo" value={compareToIdx} onChange={(e) => setCompareToIdx(Number(e.target.value))}>
                    {sortedTests.map((t, i) => <option key={i} value={i}>{t.name}（{t.date}）</option>)}
                  </select>
                </div>
              </div>
              <svg ref={improvementChartRef} className="chart" viewBox="0 0 560 320" preserveAspectRatio="none"></svg>
              <div id="improvementHint" className="small">
                {sortedTests.length >= 2 && (() => {
                  const from = sortedTests[compareFromIdx];
                  const to = sortedTests[compareToIdx];
                  if (!from || !to) return null;
                  const diffs = subjects.map(s => Number(to.scores[s]) - Number(from.scores[s]));
                  const bestIdx = diffs.indexOf(Math.max(...diffs));
                  const worstIdx = diffs.indexOf(Math.min(...diffs));
                  return (
                    <>
                      比較：<b>{from.name}</b> → <b>{to.name}</b> ／ 一番伸びた教科：<b className="goodtxt">{labels[subjects[bestIdx]]}（{diffs[bestIdx] >= 0 ? "+" : ""}{diffs[bestIdx]}点）</b> ／ 注意：<b className={diffs[worstIdx] < 0 ? "badtxt" : "goodtxt"}>{labels[subjects[worstIdx]]}（{diffs[worstIdx] >= 0 ? "+" : ""}{diffs[worstIdx]}点）</b>
                    </>
                  );
                })()}
              </div>
            </div>

            <div className="card span-7">
              <div className="card-head"><h2>教科別推移（全テスト）</h2><div id="subjectTrendLegend" className="legend">
                {subjects.map(s => (
                  <span key={s} className="legend-item"><span className="dot" style={{ background: colors[s] }}></span>{labels[s]}</span>
                ))}
              </div></div>
              <svg ref={subjectTrendChartRef} className="chart" viewBox="0 0 700 330" preserveAspectRatio="none"></svg>
              <div className="small">各教科がどのテストで上がったか、下がったかをまとめて確認できます。</div>
            </div>
            <div className="card span-5">
              <h2>学年順位の推移</h2>
              <svg ref={rankChartRef} className="chart" viewBox="0 0 520 330" preserveAspectRatio="none"></svg>
              <div className="small">上に行くほど良い順位です。赤点線は順位目標です。</div>
            </div>

            <div className="card span-12" id="input">
              <h2 id="formTitle">{form.editIndex !== null ? "テスト結果を修正" : "新しいテスト結果を追加"}</h2>
              <div className="formgrid">
                <div><label htmlFor="name">テスト名</label><input id="name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
                <div><label htmlFor="date">日付</label><input id="date" type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} /></div>
                <div><label htmlFor="rank">学年順位</label><input id="rank" type="number" min="1" value={form.rank} onChange={e => setForm({ ...form, rank: e.target.value })} /></div>
                {subjects.map(s => (
                  <div key={s}><label htmlFor={s}>{labels[s]}</label><input id={s} type="number" min="0" max="100" value={form[s]} onChange={e => setForm({ ...form, [s]: e.target.value })} /></div>
                ))}
                {subjects.map(s => (
                  <div key={`avg_${s}`}><label htmlFor={`avg_${s}`}>{labels[s]} 平均点</label><input id={`avg_${s}`} type="number" step="0.1" value={form[`avg_${s}` as keyof typeof form] as string} onChange={e => setForm({ ...form, [`avg_${s}`]: e.target.value })} /></div>
                ))}
              </div>
              <div className="actions">
                <button className="primary" onClick={addOrUpdateTest} id="saveBtn">{form.editIndex !== null ? "修正して保存" : "テストを追加"}</button>
                <button className="secondary" onClick={fillSampleImprovement}>サンプル改善データを入力</button>
                <button className="ghost" onClick={() => clearForm()}>入力欄をクリア</button>
                <button className="danger" onClick={resetData}>初期データに戻す</button>
              </div>
              <div className="note" style={{ marginTop: "14px" }}>入力ミスをした場合は、下の「テスト履歴」から <b>編集</b> を押してください。同じフォームで修正して保存できます。</div>
            </div>

            <div className="card span-12" id="history">
              <h2>テスト履歴・データ修正</h2>
              <div id="historyTable" className="subject-table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>テスト</th>
                      <th>日付</th>
                      <th className="right">合計</th>
                      <th className="right">前年差</th>
                      <th className="right">平均合計</th>
                      <th className="right">平均との差</th>
                      <th className="right">順位</th>
                      <th className="right">上位%</th>
                      {subjects.map(s => <th key={s} className="right">{labels[s]}</th>)}
                      <th className="center">修正</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedTests.map((t, i) => {
                      const prev = sortedTests[i - 1];
                      const td = prev ? totalScore(t) - totalScore(prev) : null;
                      const curTotal = totalScore(t);
                      const curAvgTotal = avgTotalScore(t);
                      const rankPct = (t.rank && goals.students) ? Math.round((t.rank / goals.students * 100) * 10) / 10 : null;
                      return (
                        <tr key={i}>
                          <td><b>{t.name}</b></td>
                          <td className="nowrap">{t.date}</td>
                          <td className="right"><b>{curTotal}</b></td>
                          <td className={`right ${td === null ? '' : td >= 0 ? 'goodtxt' : 'badtxt'}`}>{td === null ? '—' : (td >= 0 ? '+' : '') + td}</td>
                          <td className="right">{curAvgTotal || "—"}</td>
                          <td className={`right ${curTotal - curAvgTotal >= 0 ? 'goodtxt' : 'badtxt'}`}>{curTotal - curAvgTotal >= 0 ? '+' : ''}{Math.round((curTotal - curAvgTotal) * 10) / 10}</td>
                          <td className="right">{t.rank ? t.rank + '位' : '—'}</td>
                          <td className="right">{rankPct ? rankPct + '%' : '—'}</td>
                          {subjects.map(s => <td key={s} className="right">{t.scores[s]}</td>)}
                          <td className="center nowrap"><button className="secondary" onClick={() => editTest(i)}>編集</button> <button className="danger" onClick={() => askDelete(i)}>削除</button></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="card span-12 analysis">
              <h2>自動分析</h2>
              <div id="analysis">
                {sortedTests.length > 0 && (() => {
                  const latest = sortedTests[sortedTests.length - 1];
                  const curTotal = totalScore(latest);
                  const curAvgTotal = avgTotalScore(latest);
                  const gap = Math.max(0, goals.total - curTotal);
                  const rankAhead = latest.rank ? Math.max(0, latest.rank - 1) : 0;
                  const rankBehind = latest.rank ? Math.max(0, goals.students - latest.rank) : 0;
                  const rankPct = (latest.rank && goals.students) ? Math.round((latest.rank / goals.students * 100) * 10) / 10 : null;

                  const diffRows = subjects.map(s => ({
                    s,
                    d: Math.round((latest.scores[s] - (latest.average?.[s] || 0)) * 10) / 10,
                    score: latest.scores[s],
                    gap: Math.max(0, (goals[s] || 100) - latest.scores[s])
                  }));
                  const weak = diffRows.reduce((a, b) => a.gap > b.gap ? a : b).s;
                  const strong = diffRows.reduce((a, b) => a.score > b.score ? a : b).s;

                  return (
                    <>
                      <p><b>率直に言うと：</b> 最新の合計は <b>{curTotal}点</b>。学校平均合計は <b>{curAvgTotal}点</b> なので、平均との差は <b className={curTotal - curAvgTotal >= 0 ? 'goodtxt' : 'badtxt'}>{curTotal - curAvgTotal >= 0 ? '+' : ''}{Math.round((curTotal - curAvgTotal) * 10) / 10}点</b> です。合計目標の <b>{goals.total}点</b> までは <b className={gap === 0 ? 'goodtxt' : 'warntxt'}>{gap === 0 ? '達成' : `あと${gap}点`}</b> です。</p>
                      <p><b>順位：</b> {latest.rank ? `${latest.rank}位 / ${goals.students || 150}人。上位${rankPct}%・前に${rankAhead}人・後ろに${rankBehind}人。` : '順位データなし'} 目標の{goals.rank}位以内に入るには、順位だけで見るとあと <b>{latest.rank ? Math.max(0, latest.rank - goals.rank) : '—'}人</b> 抜く必要があります。</p>
                      <p>一番強い教科は <b>{labels[strong]}</b>。今いちばん点数を取りに行くべき教科は <b>{labels[weak]}</b> です。英語が強いなら、英語だけに時間を使いすぎず、国語・数学・理科の底上げで合計点を上げる方が効率的です。</p>
                      <table>
                        <thead>
                          <tr>
                            <th>教科</th><th className="right">点数</th><th className="right">目標</th><th className="right">目標まで</th><th className="right">平均との差</th><th className="right">目安</th>
                          </tr>
                        </thead>
                        <tbody>
                          {diffRows.map(r => (
                            <tr key={r.s}>
                              <td>{labels[r.s]}</td>
                              <td className="right">{r.score}</td>
                              <td className="right">{goals[r.s] || 100}</td>
                              <td className={`right ${r.gap === 0 ? 'goodtxt' : 'warntxt'}`}>{r.gap === 0 ? '達成' : r.gap + '点'}</td>
                              <td className={`right ${r.d >= 0 ? 'goodtxt' : 'badtxt'}`}>{r.d >= 0 ? '+' : ''}{r.d}</td>
                              <td className="right">{r.score >= 90 ? '強み' : r.score >= 80 ? '良い' : r.score >= 70 ? '改善余地あり' : '最優先'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </>
                  );
                })()}
              </div>
            </div>
          </section>
        </main>
        <div className={`modal ${showDeleteModal !== null ? "open" : ""}`} id="confirmModal">
          <div className="modal-card">
            <h2 id="modalTitle">確認</h2>
            <p id="modalText">{showDeleteModal !== null && sortedTests[showDeleteModal] && (
              <><b>{sortedTests[showDeleteModal].name}</b> を削除します。入力ミスなら「編集」の方が安全です。</>
            )}</p>
            <div className="actions">
              <button className="danger" onClick={confirmDelete} id="modalYes">削除する</button>
              <button className="ghost" onClick={() => setShowDeleteModal(null)}>キャンセル</button>
            </div>
          </div>
        </div>
        <div className={`toast ${toastMsg ? "show" : ""}`} id="toast">{toastMsg}</div>
      </div>
    </>
  );
}
