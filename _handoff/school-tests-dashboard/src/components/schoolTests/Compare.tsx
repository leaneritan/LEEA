"use client";

import { useState } from "react";
import {
  avgLabel,
  comparableTest,
  latestTest,
  subjectColors,
  subjectLabels,
  subjectRow,
  totalRow,
  type TotalKey
} from "@/data/schoolTests/analytics";
import { CORE_SUBJECTS, EXTRA_SUBJECTS, type Subject } from "@/data/schoolTests/types";
import { DivergingBars, Radar } from "./charts";
import type { DashCtx } from "./context";
import { Card, Delta, TestPicker } from "./shared";

export function Compare({ ctx }: { ctx: DashCtx }) {
  const { tests, students } = ctx;
  const last = latestTest!;
  const [bId, setBId] = useState(last.id);
  const [aId, setAId] = useState(comparableTest(last)?.test.id ?? tests[0].id);
  const A = tests.find((t) => t.id === aId)!;
  const B = tests.find((t) => t.id === bId)!;
  const sameType = A.type === B.type;
  const sameScope = A.averageScope === B.averageScope;
  const subjects: Subject[] = [
    ...CORE_SUBJECTS,
    ...EXTRA_SUBJECTS.filter((s) => typeof A.scores[s] === "number" && typeof B.scores[s] === "number")
  ];

  const rows = subjects.map((s) => {
    const a = subjectRow(A, s, students)!;
    const b = subjectRow(B, s, students)!;
    return {
      s,
      a,
      b,
      dScore: b.score - a.score,
      dDiff: Math.round((b.diff - a.diff) * 10) / 10,
      dRank: a.rank && b.rank ? a.rank - b.rank : null
    };
  });
  const byRank = rows.filter((r) => r.dRank !== null).sort((x, y) => (y.dRank ?? 0) - (x.dRank ?? 0));
  const up = byRank[0];
  const down = byRank[byRank.length - 1];

  return (
    <>
      <Card title="比べるテストを選ぶ" sub="A（前）→ B（後）">
        <div className="stx-grid" style={{ gap: 10 }}>
          <TestPicker tests={tests} value={aId} onChange={setAId} label="A" />
          <TestPicker tests={tests} value={bId} onChange={setBId} label="B" />
        </div>
        {aId === bId && <p className="stx-note">同じテストが選ばれています。</p>}
        {(!sameType || !sameScope) && aId !== bId && (
          <div className="stx-insight info" style={{ marginTop: 12 }}>
            <b>注意</b>
            <span>
              {A.type}テストと{B.type}テストは種類が違います{!sameScope && `（平均：${avgLabel(A)}／${avgLabel(B)}）`}
              。点数の上下より、<b>順位</b>と<b>平均との差</b>で比べてください。
            </span>
          </div>
        )}
      </Card>

      <div className="stx-grid stx-g3">
        {(["total5", "total3"] as TotalKey[]).map((k) => {
          const a = totalRow(A, k, students)!;
          const b = totalRow(B, k, students)!;
          return (
            <div className="stx-card stx-stat" key={k}>
              <span className="stx-stat-label">{k === "total5" ? "5科目" : "3科目（国数英）"}</span>
              <span className="stx-stat-value">
                {a.score} → {b.score}
              </span>
              <span className="stx-stat-foot">
                点数 <Delta value={b.score - a.score} unit="点" digits={0} />・平均との差 {a.diff >= 0 ? "+" : ""}
                {a.diff} → {b.diff >= 0 ? "+" : ""}
                {b.diff}
              </span>
              <span className="stx-stat-foot">
                順位 {a.rank}位 → {b.rank}位 {a.rank && b.rank ? <Delta value={a.rank - b.rank} digits={0} unit="人抜いた" /> : null}
              </span>
            </div>
          );
        })}
        <div className="stx-card stx-stat">
          <span className="stx-stat-label">一番伸びた／下がった（順位）</span>
          {up && (
            <span style={{ fontSize: 15 }}>
              ⬆ <b style={{ color: subjectColors[up.s] }}>{subjectLabels[up.s]}</b> {up.a.rank}位 → {up.b.rank}位
            </span>
          )}
          {down && down !== up && (
            <span style={{ fontSize: 15 }}>
              ⬇ <b style={{ color: subjectColors[down.s] }}>{subjectLabels[down.s]}</b> {down.a.rank}位 → {down.b.rank}位
            </span>
          )}
          <span className="stx-stat-foot">順位は点数よりテストの難しさに左右されにくい。</span>
        </div>
      </div>

      <Card title="教科ごとの比較">
        <div className="stx-table-wrap">
          <table className="stx-table">
            <thead>
              <tr>
                <th>教科</th>
                <th>A 点</th>
                <th>B 点</th>
                <th>点の変化</th>
                <th>A 平均との差</th>
                <th>B 平均との差</th>
                <th>差の変化</th>
                <th>A 順位</th>
                <th>B 順位</th>
                <th>順位の変化</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.s}>
                  <td style={{ color: subjectColors[r.s], fontWeight: 800 }}>{subjectLabels[r.s]}</td>
                  <td>{r.a.score}</td>
                  <td>
                    <b>{r.b.score}</b>
                  </td>
                  <td>
                    <Delta value={r.dScore} digits={0} />
                  </td>
                  <td>{r.a.diff > 0 ? `+${r.a.diff}` : r.a.diff}</td>
                  <td>{r.b.diff > 0 ? `+${r.b.diff}` : r.b.diff}</td>
                  <td>
                    <Delta value={r.dDiff} />
                  </td>
                  <td>{r.a.rank ?? "—"}</td>
                  <td>
                    <b>{r.b.rank ?? "—"}</b>
                  </td>
                  <td>
                    <Delta value={r.dRank} digits={0} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="stx-note">順位の変化は「何人抜いたか」。▲＝良くなった。</p>
      </Card>

      <div className="stx-grid stx-g2">
        <Card title="順位の変化（何人抜いたか）">
          <DivergingBars
            unit="人"
            rows={rows
              .filter((r) => r.dRank !== null)
              .map((r) => ({ id: r.s, label: subjectLabels[r.s], value: r.dRank as number, color: subjectColors[r.s], note: `${r.a.rank}位 → ${r.b.rank}位` }))}
          />
        </Card>
        <Card title="強さのかたち" sub="100 − 上位%。外側ほど学年の中で上。灰色の点線＝A、色＝B">
          <Radar
            axes={CORE_SUBJECTS.map((s) => ({ id: s, label: subjectLabels[s], color: subjectColors[s] }))}
            series={[
              { id: "a", label: "A", color: "#94a3b8", values: CORE_SUBJECTS.map((s) => 100 - (subjectRow(A, s, students)?.topPct ?? 100)), dashed: true },
              { id: "b", label: "B", color: "#4f46e5", values: CORE_SUBJECTS.map((s) => 100 - (subjectRow(B, s, students)?.topPct ?? 100)), fill: true }
            ]}
          />
        </Card>
      </div>
    </>
  );
}
