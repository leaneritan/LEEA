"use client";

import {
  cheapestMisses,
  domainGaps,
  hardWins,
  hasQuestionData,
  missKindLabels,
  questionRefs,
  questionSummary,
  recoverableScore,
  subjectColors,
  subjectLabels,
  subjectRows,
  topicClusters
} from "@/data/schoolTests/analytics";
import { CORE_SUBJECTS } from "@/data/schoolTests/types";
import { DifficultyStrip, RateBars, StackBar } from "./charts";
import type { DashCtx } from "./context";
import { Card, QuestionItem, SubjectTag, TestPicker } from "./shared";

export function WeakPoints({ ctx }: { ctx: DashCtx }) {
  const { test, tests, students } = ctx;
  const picker = <TestPicker tests={tests} value={test.id} onChange={ctx.setTestId} />;

  if (!hasQuestionData(test)) {
    const rows = subjectRows(test, students)
      .filter((r) => r.topPct !== null)
      .sort((a, b) => (b.topPct ?? 0) - (a.topPct ?? 0));
    return (
      <>
        {picker}
        <Card title="このテストは正誤表がありません" sub="定期テストは問題ごとの正誤が返ってこないので、教科単位で見ます。答案や問題用紙の写真を _未整理 に入れてもらえれば、問題ごとの分析も作れます。">
          <div className="stx-table-wrap">
            <table className="stx-table">
              <thead>
                <tr>
                  <th>教科（弱い順）</th>
                  <th>点数</th>
                  <th>平均との差</th>
                  <th>順位</th>
                  <th>上位%</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.subject}>
                    <td style={{ color: subjectColors[r.subject], fontWeight: 800 }}>{subjectLabels[r.subject]}</td>
                    <td>{r.score}</td>
                    <td className={r.diff >= 0 ? "ok" : "ng"}>{r.diff > 0 ? `+${r.diff}` : r.diff}</td>
                    <td>{r.rank}位</td>
                    <td>{r.topPct}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </>
    );
  }

  const summary = questionSummary(test);
  const cheap = cheapestMisses(test);
  const rec = recoverableScore(test);
  const gaps = domainGaps(test);
  const weakDomains = [...gaps].filter((g) => g.gap < 0 || g.rate < 60).sort((a, b) => a.gap - b.gap || b.lost - a.lost);
  const strongDomains = [...gaps].filter((g) => g.gap >= 15).sort((a, b) => b.gap - a.gap);
  const clusters = topicClusters(test);
  const wins = hardWins(test);
  const refs = questionRefs(test);
  const lostTotal = summary.reduce((a, s) => a + s.lost, 0);

  return (
    <>
      {picker}

      <div className="stx-grid stx-g3">
        <div className="stx-card stx-stat">
          <span className="stx-stat-label">落とした点（5教科）</span>
          <span className="stx-stat-value stx-bad">
            −{lostTotal}
            <small>点</small>
          </span>
          <StackBar
            parts={summary.map((s) => ({ id: s.subject, label: subjectLabels[s.subject], value: s.lost, color: subjectColors[s.subject] }))}
          />
        </div>
        <div className="stx-card stx-stat">
          <span className="stx-stat-label">ミスの種類（全体の正答率で分類）</span>
          <span className="stx-stat-value">
            {refs.filter((q) => !q.ok).length}
            <small>問</small>
          </span>
          <StackBar
            parts={(["easy", "standard", "hard"] as const).map((k) => ({
              id: k,
              label: missKindLabels[k],
              value: summary.reduce((a, s) => a + s.byKind[k].points, 0),
              color: k === "easy" ? "#dc2626" : k === "standard" ? "#f59e0b" : "#94a3b8"
            }))}
          />
        </div>
        <div className="stx-card stx-stat">
          <span className="stx-stat-label">取り戻しやすいミス（全体50%以上）を取ると</span>
          <span className="stx-stat-value stx-good">
            {rec.total5}
            <small>点（+{rec.points}）</small>
          </span>
          <span className="stx-stat-foot">
            {[...rec.bySubject.entries()].map(([s, p]) => `${subjectLabels[s]} +${p}`).join("・")}
          </span>
          <span className="stx-stat-foot">全体の50%以上が正解した問題だけで計算。</span>
        </div>
      </div>

      <Card title="問題の難しさマップ" sub="1つの点が1問。右ほど「みんなが取れた」問題。赤＝Leoのミス、緑＝正解。点にマウスを乗せると内容が出ます。">
        <div className="stx-grid" style={{ gap: 6 }}>
          {summary.map((s) => (
            <div key={s.subject} style={{ display: "grid", gridTemplateColumns: "64px 1fr 110px", gap: 10, alignItems: "center" }}>
              <SubjectTag subject={s.subject} />
              <DifficultyStrip
                items={refs
                  .filter((q) => q.subject === s.subject)
                  .map((q) => ({ id: q.subject + q.no, rate: q.rate, ok: q.ok, label: `${q.no} ${q.topic}`, value: q.value }))}
              />
              <span className="stx-sub">
                {s.correct}/{s.count}問 正解
                <br />
                <b className="stx-bad">60%以上のミス −{s.byKind.easy.points}点</b>
              </span>
            </div>
          ))}
        </div>
      </Card>

      <div className="stx-grid stx-g2">
        <Card title="次に伸ばす領域" sub="全体より低い順。棒＝Leo、◆＝全体の正答率">
          <RateBars
            color="#dc2626"
            rows={weakDomains.slice(0, 8).map((g) => ({
              id: g.subject + g.name,
              label: `${subjectLabels[g.subject]}：${g.name}`,
              sub: `${g.score}/${g.max}点（−${g.lost}点）`,
              rate: g.rate,
              overall: g.overall
            }))}
          />
        </Card>
        <Card title="みんなより取れた領域" sub="全体より15ポイント以上高い領域">
          {strongDomains.length ? (
            <RateBars
              color="#059669"
              rows={strongDomains.slice(0, 8).map((g) => ({
                id: g.subject + g.name,
                label: `${subjectLabels[g.subject]}：${g.name}`,
                sub: `${g.score}/${g.max}点`,
                rate: g.rate,
                overall: g.overall
              }))}
            />
          ) : (
            <div className="stx-empty">なし</div>
          )}
        </Card>
      </div>

      <Card
        title="取り戻しやすい問題（優先順）"
        sub="全体の50%以上が正解したのにLeoが落とした問題。配点 × 全体正答率 が大きい順＝少ない練習で点になる順。"
        right={
          <div className="stx-row">
            <button type="button" className="stx-btn" onClick={() => ctx.goTo("cards")}>
              弱点カードへ
            </button>
            <button type="button" className="stx-btn primary" onClick={() => ctx.goTo("print")}>
              🖨 印刷用レポート
            </button>
          </div>
        }
      >
        <ol className="stx-list">
          {cheap.map((q) => (
            <QuestionItem key={q.subject + q.no} q={q} />
          ))}
        </ol>
      </Card>

      <Card title="領域ごとの分析（全教科）" sub="棒＝Leoの正答率、◆＝全体の正答率、右の数字＝差">
        <div className="stx-grid stx-g2">
          {CORE_SUBJECTS.map((s) => {
            const ds = test.domains?.[s] ?? [];
            const sum = summary.find((x) => x.subject === s);
            if (!ds.length) return null;
            return (
              <div key={s} className="stx-subj" style={{ ["--c" as string]: subjectColors[s] }}>
                <div className="stx-subj-top">
                  <span className="stx-subj-name">{subjectLabels[s]}</span>
                  <span className="stx-sub">
                    {test.scores[s]}点・{test.subjectRanks[s]}位{sum && `・−${sum.lost}点`}
                  </span>
                </div>
                <RateBars
                  color={subjectColors[s]}
                  rows={ds.map((d, i) => ({ id: String(i), label: d.name, sub: `${d.score}/${d.max}`, rate: d.rate, overall: d.overall }))}
                />
                {sum && sum.written.count > 0 && (
                  <span className="stx-sub">
                    書いて答える問題：{sum.written.correct}/{sum.written.count}問 正解
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </Card>

      <div className="stx-grid stx-g2">
        <Card title="同じ種類のミスが重なっているところ" sub="問題内容が同じで2問以上落としたもの">
          {clusters.length ? (
            <ul className="stx-list">
              {clusters.map((c) => (
                <li className="stx-q" key={c.subject + c.key}>
                  <SubjectTag subject={c.subject} />
                  <div className="stx-q-main">
                    <b>{c.key}</b>
                    <small>{c.misses.map((m) => m.no).join("・")}</small>
                  </div>
                  <div className="stx-q-side">
                    <b>
                      {c.misses.length}/{c.total}問ミス
                    </b>
                    −{c.points}点
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="stx-empty">なし</div>
          )}
        </Card>
        <Card title="難問を正解した問題" sub="全体の正答率45%未満を正解 — Leoの力の証拠">
          <ul className="stx-list">
            {wins.slice(0, 12).map((q) => (
              <QuestionItem
                key={q.subject + q.no}
                q={q}
                right={
                  <>
                    <b className="stx-good">○ 全体 {q.rate}%</b>
                    {q.value}点
                  </>
                }
              />
            ))}
          </ul>
          {wins.length > 12 && <p className="stx-note">ほか {wins.length - 12}問</p>}
        </Card>
      </div>
    </>
  );
}
