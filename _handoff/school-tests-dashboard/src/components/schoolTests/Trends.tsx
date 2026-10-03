"use client";

import { useState } from "react";
import {
  metricValue,
  shortTestName,
  slope,
  subjectColors,
  subjectLabels,
  testTypeColors,
  trendMetricLabels,
  type TrendMetric
} from "@/data/schoolTests/analytics";
import { CORE_SUBJECTS, type CoreSubject } from "@/data/schoolTests/types";
import { Chips, LineChart, MultiChips } from "./charts";
import type { DashCtx } from "./context";
import { Card } from "./shared";

const metricHelp: Record<TrendMetric, string> = {
  score: "そのままの点数。テストの難しさで上下するので、参考程度に。",
  diff: "0より上＝平均より上。テストの難しさに左右されない「本当の実力」の動き。",
  rank: "上にいくほど良い。学年の中での位置。",
  topPct: "順位を人数で割った値。上にいくほど良い（小さいほど上位）。"
};

export function Trends({ ctx }: { ctx: DashCtx }) {
  const { tests, students, goals } = ctx;
  const [metric, setMetric] = useState<TrendMetric>("diff");
  const [shown, setShown] = useState<CoreSubject[]>([...CORE_SUBJECTS]);
  const cats = tests.map(shortTestName);
  const bands = tests.map((t) => testTypeColors[t.type]);
  const invert = metric === "rank" || metric === "topPct";
  const fmt = (v: number) => (metric === "diff" && v > 0 ? `+${v}` : metric === "topPct" ? `${v}%` : String(v));

  const totalSeries = (m: TrendMetric) => tests.map((t) => metricValue(t, "total5", m, students));

  return (
    <>
      <Card
        title="教科別の推移"
        sub={metricHelp[metric]}
        right={
          <Chips
            options={(["diff", "rank", "topPct", "score"] as TrendMetric[]).map((m) => ({ id: m, label: trendMetricLabels[m] }))}
            value={metric}
            onChange={setMetric}
          />
        }
      >
        <div style={{ marginBottom: 10 }}>
          <MultiChips
            options={CORE_SUBJECTS.map((s) => ({ id: s, label: subjectLabels[s], color: subjectColors[s] }))}
            value={shown}
            onChange={(v) => setShown(v as CoreSubject[])}
          />
        </div>
        <LineChart
          categories={cats}
          bandColors={bands}
          invert={invert}
          format={fmt}
          width={980}
          height={380}
          series={shown.map((s) => ({
            id: s,
            label: subjectLabels[s],
            color: subjectColors[s],
            values: tests.map((t) => metricValue(t, s, metric, students)),
            labels: shown.length <= 2
          }))}
          yMin={metric === "score" ? 0 : metric === "rank" || metric === "topPct" ? 0 : undefined}
          yMax={metric === "score" ? 100 : metric === "topPct" ? 100 : metric === "rank" ? students : undefined}
        />
        <div className="stx-legend" style={{ marginTop: 8 }}>
          {(["中間", "期末", "実力"] as const).map((t) => (
            <span key={t}>
              <i style={{ background: testTypeColors[t] }} />
              {t}テスト
            </span>
          ))}
        </div>
      </Card>

      <div className="stx-grid stx-g2">
        <Card title="5科目合計：点数と平均" sub="青＝Leo、灰色＝平均、赤＝目標">
          <LineChart
            categories={cats}
            bandColors={bands}
            series={[
              { id: "leo", label: "Leo", color: "#2563eb", values: totalSeries("score"), labels: true },
              { id: "avg", label: "平均", color: "#94a3b8", values: tests.map((t) => t.totals.total5.average), dashed: true, labels: true }
            ]}
            refLines={[{ value: goals.total5, label: `目標 ${goals.total5}`, color: "#dc2626" }]}
          />
        </Card>
        <Card title="5科目：学年順位" sub="上にいくほど良い">
          <LineChart
            categories={cats}
            bandColors={bands}
            invert
            series={[
              { id: "rank", label: "5科目", color: "#4f46e5", values: totalSeries("rank"), labels: true },
              { id: "r3", label: "3科目", color: "#0ea5e9", values: tests.map((t) => t.totals.total3.rank), dashed: true, labels: true }
            ]}
            refLines={[{ value: goals.rank, label: `目標 ${goals.rank}位`, color: "#dc2626" }]}
            format={(v) => `${v}`}
          />
          <div className="stx-legend">
            <span>
              <i style={{ background: "#4f46e5" }} />
              5科目
            </span>
            <span style={{ color: "#0ea5e9" }}>
              <i className="dash" />
              3科目（国数英）
            </span>
          </div>
        </Card>
      </div>

      <Card title="教科ごとのくわしい推移" sub="点数（色）と平均（灰色の点線）。下の数字は順位。">
        <div className="stx-grid stx-g3">
          {CORE_SUBJECTS.map((s) => {
            const ranks = tests.map((t) => t.subjectRanks[s] ?? null);
            const sl = slope(ranks);
            return (
              <div key={s} className="stx-subj" style={{ ["--c" as string]: subjectColors[s] }}>
                <div className="stx-subj-top">
                  <span className="stx-subj-name">{subjectLabels[s]}</span>
                  <span className={`stx-pill ${sl === null ? "muted" : sl < -3 ? "good" : sl > 3 ? "bad" : "muted"}`}>
                    {sl === null ? "—" : sl < -3 ? "順位 上昇中" : sl > 3 ? "順位 下降中" : "横ばい"}
                  </span>
                </div>
                <LineChart
                  categories={cats}
                  width={380}
                  height={210}
                  yMin={0}
                  yMax={100}
                  series={[
                    { id: "s", label: "Leo", color: subjectColors[s], values: tests.map((t) => t.scores[s] ?? null), labels: true },
                    { id: "a", label: "平均", color: "#94a3b8", values: tests.map((t) => t.average[s] ?? null), dashed: true }
                  ]}
                />
                <div className="stx-row" style={{ justifyContent: "space-around", fontSize: 12 }}>
                  {tests.map((t) => (
                    <span key={t.id} className="stx-mutedc">
                      {t.subjectRanks[s] ?? "—"}位
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <Card title="数字で見る推移" sub="点数／平均との差／順位">
        <div className="stx-table-wrap">
          <table className="stx-table">
            <thead>
              <tr>
                <th>教科</th>
                {tests.map((t) => (
                  <th key={t.id} colSpan={3}>
                    {t.name.replace("テスト", "")}
                  </th>
                ))}
              </tr>
              <tr>
                <th></th>
                {tests.map((t) => [
                  <th key={t.id + "s"}>点</th>,
                  <th key={t.id + "d"}>差</th>,
                  <th key={t.id + "r"}>順位</th>
                ])}
              </tr>
            </thead>
            <tbody>
              {[...CORE_SUBJECTS, "total3" as const, "total5" as const].map((s) => (
                <tr key={s} className={s.startsWith("total") ? "total" : ""}>
                  <td style={s.startsWith("total") ? undefined : { color: subjectColors[s as CoreSubject], fontWeight: 800 }}>
                    {s === "total3" ? "3科目" : s === "total5" ? "5科目" : subjectLabels[s as CoreSubject]}
                  </td>
                  {tests.map((t) => {
                    const sc = metricValue(t, s, "score", students);
                    const df = metricValue(t, s, "diff", students);
                    const rk = metricValue(t, s, "rank", students);
                    return [
                      <td key={t.id + "s"}>{sc ?? "—"}</td>,
                      <td key={t.id + "d"} className={df !== null && df >= 0 ? "ok" : "ng"}>
                        {df === null ? "—" : df > 0 ? `+${df}` : df}
                      </td>,
                      <td key={t.id + "r"}>{rk ?? "—"}</td>
                    ];
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}
