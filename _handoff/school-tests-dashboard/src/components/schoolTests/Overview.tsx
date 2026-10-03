"use client";

import {
  allCards,
  avgLabel,
  cardProgress,
  cheapestMisses,
  comparableTest,
  hasQuestionData,
  insightsFor,
  signed,
  previousTest,
  subjectColors,
  subjectLabels,
  subjectProfiles,
  subjectRow,
  subjectRows,
  totalRow
} from "@/data/schoolTests/analytics";
import { CORE_SUBJECTS, type CoreSubject } from "@/data/schoolTests/types";
import { DivergingBars, Radar } from "./charts";
import type { DashCtx } from "./context";
import { AvgNote, Card, Delta, Insights, TestPicker } from "./shared";

const round1 = (n: number) => Math.round(n * 10) / 10;

export function Overview({ ctx }: { ctx: DashCtx }) {
  const { test, tests, students, goals } = ctx;
  const t5 = totalRow(test, "total5", students)!;
  const t3 = totalRow(test, "total3", students)!;
  const t9 = totalRow(test, "total9", students);
  const cmp = comparableTest(test);
  const prev = previousTest(test);
  const rows = subjectRows(test, students);
  const cheap = hasQuestionData(test) ? cheapestMisses(test) : [];
  const cheapPts = cheap.reduce((a, q) => a + q.value, 0);
  const cards = allCards();
  const prog = cardProgress(cards, ctx.cardStates);
  const profiles = subjectProfiles(tests, students);

  return (
    <>
      <TestPicker tests={tests} value={test.id} onChange={ctx.setTestId} />

      <div className="stx-grid stx-g4">
        <div className="stx-card stx-stat">
          <span className="stx-stat-label">5科目合計</span>
          <span className="stx-stat-value">
            {t5.score}
            <small>/500</small>
          </span>
          <span className={`stx-pill ${t5.diff >= 0 ? "good" : "bad"}`}>
            {avgLabel(test)} {t5.average}（{t5.diff >= 0 ? "+" : ""}
            {t5.diff}）
          </span>
          <span className="stx-stat-foot">
            {cmp ? (
              cmp.sameType ? (
                <>
                  {cmp.test.name}比 <Delta value={t5.score - cmp.test.totals.total5.score} unit="点" />
                </>
              ) : (
                <>
                  平均との差：{cmp.test.name} {signed(round1(cmp.test.totals.total5.score - cmp.test.totals.total5.average))} → {signed(t5.diff)}
                </>
              )
            ) : (
              "最初のテスト"
            )}
          </span>
        </div>
        <div className="stx-card stx-stat">
          <span className="stx-stat-label">学年順位（5科目）</span>
          <span className="stx-stat-value">
            {t5.rank ?? "—"}
            <small>位 / {students}人</small>
          </span>
          <span className="stx-pill info">上位 {t5.topPct ?? "—"}%・男女別 {t5.genderRank ?? "—"}位</span>
          <span className="stx-stat-foot">
            {prev && prev.totals.total5.rank && t5.rank ? (
              <>
                {prev.name}比 <Delta value={prev.totals.total5.rank - t5.rank} unit="人抜いた" digits={0} />
              </>
            ) : (
              "—"
            )}
          </span>
        </div>
        <div className="stx-card stx-stat">
          <span className="stx-stat-label">3科目（国数英）</span>
          <span className="stx-stat-value">
            {t3.score}
            <small>/300</small>
          </span>
          <span className="stx-pill info">
            {t3.rank ?? "—"}位（上位 {t3.topPct ?? "—"}%）
          </span>
          <span className="stx-stat-foot">
            {avgLabel(test)} {t3.average}・差 {t3.diff >= 0 ? "+" : ""}
            {t3.diff}
            {t9 && `・9科目 ${t9.score}点 ${t9.rank}位`}
          </span>
        </div>
        <div className="stx-card stx-stat" style={{ cursor: "pointer" }} onClick={() => ctx.goTo("cards")}>
          <span className="stx-stat-label">取り戻しやすい点（全体50%以上のミス）</span>
          <span className="stx-stat-value stx-warnc">
            {hasQuestionData(test) ? `+${cheapPts}` : "—"}
            <small>点</small>
          </span>
          <span className="stx-pill warn">{hasQuestionData(test) ? `${cheap.length}問 → ${t5.score + cheapPts}点` : "正誤データなし"}</span>
          <span className="stx-stat-foot">
            弱点カード：{prog.mastered}/{prog.total}枚クリア（{prog.pointsWon}点分）
          </span>
        </div>
      </div>

      <Card title="教科別スコア" sub={<AvgNote test={test} />}>
        <div className="stx-grid stx-g5">
          {rows.map((r) => {
            const goal = (goals.subjects as Record<string, number>)[r.subject];
            const before = cmp ? subjectRow(cmp.test, r.subject, students) : null;
            return (
              <div className="stx-subj" key={r.subject} style={{ ["--c" as string]: subjectColors[r.subject] }}>
                <div className="stx-subj-top">
                  <span className="stx-subj-name">{subjectLabels[r.subject]}</span>
                  {before && cmp?.sameType ? <Delta value={r.score - before.score} unit="点" digits={0} /> : <span />}
                </div>
                <span className="stx-subj-score">{r.score}</span>
                <div className="stx-meter">
                  <span style={{ width: `${r.score}%` }} />
                  <i style={{ left: `${r.average}%` }} title={`平均 ${r.average}`} />
                  {goal ? <em style={{ left: `${goal}%` }} title={`目標 ${goal}`} /> : null}
                </div>
                <div className="stx-subj-meta">
                  <span>平均</span>
                  <b>
                    {r.average}（<span className={r.diff >= 0 ? "stx-good" : "stx-bad"}>{r.diff >= 0 ? `+${r.diff}` : r.diff}</span>）
                  </b>
                  <span>順位</span>
                  <b>
                    {r.rank ?? "—"}位{r.topPct !== null && <span className="stx-mutedc">（上位{r.topPct}%）</span>}
                  </b>
                  {r.genderRank !== null && (
                    <>
                      <span>男女別</span>
                      <b>{r.genderRank}位</b>
                    </>
                  )}
                  {before?.rank && r.rank && (
                    <>
                      <span>順位の変化</span>
                      <b>
                        <Delta value={before.rank - r.rank} digits={0} unit="" />
                      </b>
                    </>
                  )}
                  {goal ? (
                    <>
                      <span>目標</span>
                      <b>{r.score >= goal ? "達成！" : `${goal}（あと${goal - r.score}）`}</b>
                    </>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
        <p className="stx-note">
          バー＝得点、黒い線＝平均、赤い点線＝目標。
          {cmp && (cmp.sameType ? `▲▼は${cmp.test.name}との比較。` : `順位の変化は${cmp.test.name}との比較（テストの種類が違うので点数は比べていません）。`)}
        </p>
      </Card>

      <div className="stx-grid stx-g2">
        <Card title="平均との差" sub={`${avgLabel(test)}との差。0より右なら平均より上。`}>
          <DivergingBars
            rows={rows.map((r) => ({ id: r.subject, label: subjectLabels[r.subject], value: r.diff, color: subjectColors[r.subject] }))}
          />
        </Card>
        <Card title="5教科プロフィール" sub="Leo（色）と平均（灰色の点線）">
          <Radar
            axes={CORE_SUBJECTS.map((s) => ({ id: s, label: subjectLabels[s], color: subjectColors[s] }))}
            series={[
              { id: "avg", label: "平均", color: "#94a3b8", values: CORE_SUBJECTS.map((s) => test.average[s] ?? 0), dashed: true },
              { id: "leo", label: "Leo", color: "#4f46e5", values: CORE_SUBJECTS.map((s) => test.scores[s] ?? 0), fill: true }
            ]}
          />
        </Card>
      </div>

      <Card title="自動分析" sub={`${test.name}（${test.date}）`}>
        <Insights items={insightsFor(test, students)} />
      </Card>

      <Card title="教科のタイプ（全テストから）" sub="順位（上位%）の平均・ふれ幅・向きで判定。点数ではなく順位で見るので、テストの難しさに左右されません。">
        <div className="stx-table-wrap">
          <table className="stx-table">
            <thead>
              <tr>
                <th>教科</th>
                <th>タイプ</th>
                <th>平均の上位%</th>
                <th>平均との差（平均）</th>
                <th>ふれ幅</th>
                <th>向き</th>
                {tests.map((t) => (
                  <th key={t.id}>{t.name.replace("テスト", "")}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {profiles.map((p) => (
                <tr key={p.subject}>
                  <td style={{ color: subjectColors[p.subject], fontWeight: 800 }}>{subjectLabels[p.subject]}</td>
                  <td>
                    <span className={`stx-pill ${p.label === "得意" ? "good" : p.label === "要注意" ? "bad" : p.label === "波がある" ? "warn" : "muted"}`}>{p.label}</span>
                  </td>
                  <td>{p.meanTopPct ?? "—"}%</td>
                  <td className={p.meanDiff >= 0 ? "ok" : "ng"}>{p.meanDiff >= 0 ? `+${p.meanDiff}` : p.meanDiff}</td>
                  <td>±{p.swing}</td>
                  <td className={p.direction === "上昇" ? "ok" : p.direction === "下降" ? "ng" : ""}>{p.direction}</td>
                  {tests.map((t) => {
                    const r = subjectRow(t, p.subject as CoreSubject, students);
                    return <td key={t.id}>{r ? `${r.rank}位` : "—"}</td>;
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="stx-note">得意＝平均で上位20%以内／要注意＝平均で上位55%より下／波がある＝テストごとの差が大きい。向き＝順位が毎回どちらに動いているか。</p>
      </Card>
    </>
  );
}
