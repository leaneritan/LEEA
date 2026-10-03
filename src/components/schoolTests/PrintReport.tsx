"use client";

// The sheet Neritan prints after each test and works through with Leo.
// Page 1: results and what they mean. Page 2: the questions to win back,
// with boxes Leo fills in by hand. Page 3: the plan and his own reflection.

import { useState } from "react";
import {
  avgLabel,
  buildPlan,
  cheapestMisses,
  comparableTest,
  domainGaps,
  hardWins,
  hasQuestionData,
  insightsFor,
  questionRefs,
  recoverableScore,
  schoolTestsFile,
  subjectLabels,
  subjectRow,
  subjectsIn,
  totalRow,
  allCards
} from "@/data/schoolTests/analytics";
import { CORE_SUBJECTS } from "@/data/schoolTests/types";
import { Chips } from "./charts";
import type { DashCtx } from "./context";
import { Card, fmtDate, reasonLabels, TestPicker } from "./shared";

type Scope = "cheap" | "all";

export function PrintReport({ ctx }: { ctx: DashCtx }) {
  const { test, tests, students, goals, settings } = ctx;
  const [scope, setScope] = useState<Scope>("cheap");
  const [withPlan, setWithPlan] = useState(true);
  const cmp = comparableTest(test);
  const st = schoolTestsFile.student;
  const t5 = totalRow(test, "total5", students)!;
  const t3 = totalRow(test, "total3", students)!;
  const hasQ = hasQuestionData(test);
  const misses = hasQ
    ? (scope === "cheap" ? cheapestMisses(test) : questionRefs(test).filter((q) => !q.ok).sort((a, b) => b.priority - a.priority))
    : [];
  const rec = hasQ ? recoverableScore(test) : null;
  const gaps = hasQ ? domainGaps(test) : [];
  const weak = [...gaps].filter((g) => g.gap < 0).sort((a, b) => a.gap - b.gap).slice(0, 5);
  const strong = [...gaps].sort((a, b) => b.gap - a.gap).slice(0, 4);
  const wins = hasQ ? hardWins(test).slice(0, 5) : [];
  const plan = buildPlan(allCards(), ctx.cardStates, settings.nextTest.date, settings.nextTest.cardsPerDay).slice(0, 14);

  const doPrint = () => {
    document.body.classList.add("stx-print-mode");
    const off = () => {
      document.body.classList.remove("stx-print-mode");
      window.removeEventListener("afterprint", off);
    };
    window.addEventListener("afterprint", off);
    window.print();
    setTimeout(off, 1500);
  };

  return (
    <>
      <div className="stx-no-print">
        <TestPicker tests={tests} value={test.id} onChange={ctx.setTestId} />
      </div>
      <Card
        className="stx-no-print"
        title="印刷用レポート"
        sub="A4で印刷。テストが返ってきたら印刷して、Leoと一緒に「なぜ？」に印をつけ、練習日と再テストの結果を書きこんでいきます。"
        right={
          <button type="button" className="stx-btn primary" onClick={doPrint}>
            🖨 印刷する
          </button>
        }
      >
        <div className="stx-row">
          {hasQ && (
            <Chips
              options={[
                { id: "cheap", label: "取り戻しやすいミスだけ（全体50%以上）" },
                { id: "all", label: "すべてのミス" }
              ]}
              value={scope}
              onChange={(v) => setScope(v as Scope)}
            />
          )}
          <Chips
            options={[
              { id: "yes", label: "計画表をつける" },
              { id: "no", label: "計画表なし" }
            ]}
            value={withPlan ? "yes" : "no"}
            onChange={(v) => setWithPlan(v === "yes")}
          />
        </div>
      </Card>

      <div className="stx-print-sheet">
        <div className="stx-print-head">
          <div>
            <div style={{ fontSize: 11, color: "#64748b", fontWeight: 700 }}>
              {st.school} {st.grade}年{st.class}組{st.number}番
            </div>
            <h1>{test.name} ふりかえりシート</h1>
          </div>
          <div style={{ textAlign: "right", fontSize: 11.5 }}>
            テスト日：{fmtDate(test.date)}
            <br />
            作成日：{fmtDate(new Date().toISOString().slice(0, 10))}
          </div>
        </div>

        <h2>1. 結果</h2>
        <table>
          <thead>
            <tr>
              <th></th>
              {subjectsIn(test).map((s) => (
                <th key={s}>{subjectLabels[s]}</th>
              ))}
              <th>3科目</th>
              <th>5科目</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="l">得点</td>
              {subjectsIn(test).map((s) => (
                <td key={s}>
                  <b>{test.scores[s]}</b>
                </td>
              ))}
              <td>
                <b>{t3.score}</b>
              </td>
              <td>
                <b>{t5.score}</b>
              </td>
            </tr>
            <tr>
              <td className="l">{avgLabel(test)}</td>
              {subjectsIn(test).map((s) => (
                <td key={s}>{test.average[s]}</td>
              ))}
              <td>{t3.average}</td>
              <td>{t5.average}</td>
            </tr>
            <tr>
              <td className="l">平均との差</td>
              {subjectsIn(test).map((s) => {
                const r = subjectRow(test, s, students)!;
                return <td key={s}>{r.diff > 0 ? `+${r.diff}` : r.diff}</td>;
              })}
              <td>{t3.diff > 0 ? `+${t3.diff}` : t3.diff}</td>
              <td>{t5.diff > 0 ? `+${t5.diff}` : t5.diff}</td>
            </tr>
            <tr>
              <td className="l">順位（男女）</td>
              {subjectsIn(test).map((s) => (
                <td key={s}>
                  {test.subjectRanks[s] ?? ""}
                  {test.genderRanks?.[s] ? `（${test.genderRanks[s]}）` : ""}
                </td>
              ))}
              <td>
                {t3.rank}（{t3.genderRank}）
              </td>
              <td>
                {t5.rank}（{t5.genderRank}）
              </td>
            </tr>
            {cmp && (
              <tr>
                <td className="l">前回の順位</td>
                {subjectsIn(test).map((s) => (
                  <td key={s}>{cmp.test.subjectRanks[s] ?? ""}</td>
                ))}
                <td>{cmp.test.totals.total3.rank}</td>
                <td>{cmp.test.totals.total5.rank}</td>
              </tr>
            )}
            <tr>
              <td className="l">目標</td>
              {subjectsIn(test).map((s) => (
                <td key={s}>{(goals.subjects as Record<string, number>)[s] ?? ""}</td>
              ))}
              <td></td>
              <td>{goals.total5}</td>
            </tr>
          </tbody>
        </table>
        {cmp && <p style={{ fontSize: 10.5, color: "#64748b", margin: "4px 0 0" }}>前回＝{cmp.test.name}{!cmp.sameType && "（種類が違うテスト）"}</p>}

        <h2>2. ポイント</h2>
        <ul style={{ margin: 0, paddingLeft: 18 }}>
          {insightsFor(test, students)
            .filter((i) => i.title !== "比べ方の注意")
            .map((i, n) => (
              <li key={n} style={{ marginBottom: 3 }}>
                <b>{i.title}：</b>
                {i.text}
              </li>
            ))}
        </ul>

        {hasQ && (
          <div className="stx-print-cols">
            <div>
              <h2>3. のばすところ</h2>
              <table>
                <tbody>
                  {weak.map((g) => (
                    <tr key={g.subject + g.name}>
                      <td className="l">
                        {subjectLabels[g.subject]}：{g.name}
                      </td>
                      <td>
                        {g.rate}%／全体{g.overall}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div>
              <h2>4. よくできたところ</h2>
              <table>
                <tbody>
                  {strong.map((g) => (
                    <tr key={g.subject + g.name}>
                      <td className="l">
                        {subjectLabels[g.subject]}：{g.name}
                      </td>
                      <td>
                        {g.rate}%／全体{g.overall}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {wins.length > 0 && (
                <p style={{ fontSize: 11, margin: "6px 0 0" }}>
                  難問を正解：{wins.map((q) => `${subjectLabels[q.subject]}${q.no}（全体${q.rate}%）`).join("、")}
                </p>
              )}
            </div>
          </div>
        )}

        {hasQ && (
          <>
            <h2 className="stx-pagebreak">5. 取り戻す問題（{misses.length}問・{misses.reduce((a, q) => a + q.value, 0)}点分）</h2>
            {rec && scope === "cheap" && (
              <p style={{ margin: "0 0 6px" }}>
                ぜんぶ取り戻すと <b>5科目 {rec.total5}点</b>（+{rec.points}点）。上から順に、少ない練習で点になる問題です。
              </p>
            )}
            <table>
              <thead>
                <tr>
                  <th>✓</th>
                  <th>教科</th>
                  <th>番号</th>
                  <th>内容</th>
                  <th>全体</th>
                  <th>点</th>
                  <th>なぜ？（○をつける）</th>
                  <th>練習日</th>
                  <th>再テスト</th>
                </tr>
              </thead>
              <tbody>
                {misses.map((q) => (
                  <tr key={q.subject + q.no}>
                    <td>
                      <span className="stx-box" />
                    </td>
                    <td>{subjectLabels[q.subject]}</td>
                    <td>{q.no}</td>
                    <td className="l">
                      {q.topic}
                      {q.link && <div style={{ fontSize: 9.5, color: "#64748b" }}>{q.link.label}{q.link.book ? `（${q.link.book}）` : ""}</div>}
                    </td>
                    <td>{q.rate}%</td>
                    <td>{q.value}</td>
                    <td style={{ fontSize: 9.5, whiteSpace: "nowrap" }}>ケ・わ・読・時・白</td>
                    <td style={{ width: 52 }}></td>
                    <td style={{ width: 52 }}>○ ×</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p style={{ fontSize: 10.5, color: "#475569", margin: "6px 0 0" }}>
              なぜ？：ケ＝{reasonLabels.careless}　わ＝{reasonLabels.unknown}　読＝{reasonLabels.misread}　時＝{reasonLabels.time}　白＝{reasonLabels.blank}
            </p>
          </>
        )}

        {withPlan && (
          <>
            <h2 className="stx-pagebreak">6. {settings.nextTest.name}までの計画{settings.nextTest.date ? `（${fmtDate(settings.nextTest.date)}）` : "（日付未定：14日分）"}</h2>
            <table>
              <thead>
                <tr>
                  <th>日</th>
                  <th>やるカード</th>
                  <th>再テスト</th>
                  <th>済</th>
                </tr>
              </thead>
              <tbody>
                {plan.map((d) => (
                  <tr key={d.date}>
                    <td style={{ whiteSpace: "nowrap" }}>
                      {Number(d.date.slice(5, 7))}/{Number(d.date.slice(8))}
                    </td>
                    <td className="l" style={{ fontSize: 10.5 }}>
                      {d.isTestDay ? "テスト当日" : d.cards.map((c) => `${subjectLabels[c.subject]}${c.no}`).join("、") || "見直し"}
                    </td>
                    <td>{d.retests.length || ""}</td>
                    <td>
                      <span className="stx-box" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        <h2>7. Leoのふりかえり</h2>
        <div className="stx-print-cols">
          <div>
            <p style={{ margin: "0 0 2px" }}>よくできたこと：</p>
            <div className="stx-lines" />
            <div className="stx-lines" />
          </div>
          <div>
            <p style={{ margin: "0 0 2px" }}>次のテストでがんばること：</p>
            <div className="stx-lines" />
            <div className="stx-lines" />
          </div>
        </div>
        <p style={{ margin: "10px 0 2px" }}>
          次のテストの目標：
          {CORE_SUBJECTS.map((s) => (
            <span key={s} style={{ marginRight: 12 }}>
              {subjectLabels[s]} ____点
            </span>
          ))}
          合計 ____点
        </p>
        <div className="stx-print-cols" style={{ marginTop: 10 }}>
          <div>
            <p style={{ margin: "0 0 2px" }}>お父さんから：</p>
            <div className="stx-lines" />
            <div className="stx-lines" />
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 20 }}>
            <span>Leo ________</span>
            <span>父 ________</span>
          </div>
        </div>
      </div>
    </>
  );
}
