"use client";

// 成績表 — the numbers exactly as the school printed them, before any analysis.

import { avgLabel, subjectColors, subjectLabels, subjectsIn, totalLabels, type TotalKey } from "@/data/schoolTests/analytics";
import { CORE_SUBJECTS, type Subject } from "@/data/schoolTests/types";
import type { DashCtx } from "./context";
import { Card, TestPicker, TypeTag } from "./shared";

const short: Record<Subject, string> = {
  japanese: "国",
  social: "社",
  math: "数",
  science: "理",
  english: "英",
  music: "音",
  health: "保",
  techHome: "技家",
  art: "美"
};

export function ReportSheet({ ctx }: { ctx: DashCtx }) {
  const { test, tests } = ctx;
  const subjects = subjectsIn(test);
  const extras = subjects.filter((s) => !(CORE_SUBJECTS as readonly string[]).includes(s));
  const totals: TotalKey[] = test.totals.total9 ? ["total3", "total5", "total9"] : ["total3", "total5"];
  const sheetClass = test.type === "期末" ? "kimatsu" : test.type === "実力" ? "jitsu" : "";
  const historyCols: Subject[] = [...CORE_SUBJECTS, "music", "health", "techHome", "art"];

  const cell = (v: number | null | undefined, italic = false) => (v === null || v === undefined ? "" : italic ? <i>{v}</i> : v);

  return (
    <>
      <TestPicker tests={tests} value={test.id} onChange={ctx.setTestId} />

      <Card
        title={
          <span className="stx-row">
            <TypeTag test={test} /> {test.name}
          </span>
        }
        sub={`${test.date}・平均は${avgLabel(test)}・写真：Leo's_Tests/${test.folder}`}
      >
        <div className="stx-table-wrap">
          <table className={`stx-table stx-sheet ${sheetClass}`}>
            <thead>
              <tr>
                <th>今回の成績</th>
                {CORE_SUBJECTS.map((s) => (
                  <th key={s}>{short[s]}</th>
                ))}
                <th>国数英計</th>
                <th>5科目計</th>
                {extras.map((s) => (
                  <th key={s}>{short[s]}</th>
                ))}
                {test.totals.total9 && <th>9科目計</th>}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>得点</td>
                {CORE_SUBJECTS.map((s) => (
                  <td key={s}>
                    <b>{cell(test.scores[s])}</b>
                  </td>
                ))}
                <td>
                  <b>{test.totals.total3.score}</b>
                </td>
                <td>
                  <b>{test.totals.total5.score}</b>
                </td>
                {extras.map((s) => (
                  <td key={s}>
                    <b>{cell(test.scores[s])}</b>
                  </td>
                ))}
                {test.totals.total9 && (
                  <td>
                    <b>{test.totals.total9.score}</b>
                  </td>
                )}
              </tr>
              <tr>
                <td>平均点</td>
                {CORE_SUBJECTS.map((s) => (
                  <td key={s}>{cell(test.average[s], true)}</td>
                ))}
                <td>
                  <i>{test.totals.total3.average}</i>
                </td>
                <td>
                  <i>{test.totals.total5.average}</i>
                </td>
                {extras.map((s) => (
                  <td key={s}>{cell(test.average[s], true)}</td>
                ))}
                {test.totals.total9 && (
                  <td>
                    <i>{test.totals.total9.average}</i>
                  </td>
                )}
              </tr>
              <tr>
                <td>総合順位</td>
                {CORE_SUBJECTS.map((s) => (
                  <td key={s}>{cell(test.subjectRanks[s])}</td>
                ))}
                <td>{cell(test.totals.total3.rank)}</td>
                <td>{cell(test.totals.total5.rank)}</td>
                {extras.map((s) => (
                  <td key={s}>{cell(test.subjectRanks[s])}</td>
                ))}
                {test.totals.total9 && <td>{cell(test.totals.total9.rank)}</td>}
              </tr>
              <tr>
                <td>男女順位</td>
                {CORE_SUBJECTS.map((s) => (
                  <td key={s}>{cell(test.genderRanks?.[s])}</td>
                ))}
                <td>{cell(test.totals.total3.genderRank)}</td>
                <td>{cell(test.totals.total5.genderRank)}</td>
                {extras.map((s) => (
                  <td key={s}>{cell(test.genderRanks?.[s])}</td>
                ))}
                {test.totals.total9 && <td>{cell(test.totals.total9.genderRank)}</td>}
              </tr>
            </tbody>
          </table>
        </div>
        <div className="stx-row" style={{ marginTop: 12, fontSize: 12.5 }}>
          {totals.map((k) => (
            <span key={k} className="stx-pill muted">
              {totalLabels[k]}：{test.totals[k]!.score}点（平均 {test.totals[k]!.average}）
            </span>
          ))}
        </div>
      </Card>

      {test.domains && (
        <Card title="今回の領域ごとの得点とデータ" sub="成績表の表をそのまま。正答率はLeo／全体（県内受検者）。">
          <div className="stx-table-wrap">
            <table className="stx-table">
              <thead>
                <tr>
                  <th>教科</th>
                  <th className="l">領域名</th>
                  <th>得点／配点</th>
                  <th>Leoの正答率</th>
                  <th>全体の正答率</th>
                  <th>差</th>
                </tr>
              </thead>
              <tbody>
                {CORE_SUBJECTS.flatMap((s) =>
                  (test.domains?.[s] ?? []).map((d, i) => (
                    <tr key={s + i}>
                      <td style={{ color: subjectColors[s], fontWeight: 800 }}>{i === 0 ? subjectLabels[s] : ""}</td>
                      <td className="l">
                        {i + 1}. {d.name}
                      </td>
                      <td>
                        {d.score} / {d.max}
                      </td>
                      <td>{d.rate}%</td>
                      <td>{d.overall}%</td>
                      <td className={d.rate - d.overall >= 0 ? "ok" : "ng"}>
                        {d.rate - d.overall > 0 ? "+" : ""}
                        {d.rate - d.overall}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <Card title="今までの成績" sub="成績表の「今までの成績」と同じ並び。">
        <div className="stx-table-wrap">
          <table className="stx-table">
            <thead>
              <tr>
                <th>得点</th>
                {historyCols.map((s) => (
                  <th key={s}>{short[s]}</th>
                ))}
                <th>国数英計</th>
                <th>5科目計</th>
                <th>9科目計</th>
              </tr>
            </thead>
            <tbody>
              {tests.map((t) => (
                <tr key={t.id} style={t.id === test.id ? { background: "#eef2ff" } : undefined}>
                  <td>
                    <TypeTag test={t} /> {t.name.replace("テスト", "")}
                  </td>
                  {historyCols.map((s) => (
                    <td key={s}>{t.scores[s] ?? ""}</td>
                  ))}
                  <td>{t.totals.total3.score}</td>
                  <td>
                    <b>{t.totals.total5.score}</b>
                  </td>
                  <td>{t.totals.total9?.score ?? ""}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="stx-table-wrap" style={{ marginTop: 12 }}>
          <table className="stx-table">
            <thead>
              <tr>
                <th>順位（男女）</th>
                {historyCols.map((s) => (
                  <th key={s}>{short[s]}</th>
                ))}
                <th>国数英計</th>
                <th>5科目計</th>
                <th>9科目計</th>
              </tr>
            </thead>
            <tbody>
              {tests.map((t) => (
                <tr key={t.id}>
                  <td>
                    <TypeTag test={t} /> {t.name.replace("テスト", "")}
                  </td>
                  {historyCols.map((s) => (
                    <td key={s}>
                      {t.subjectRanks[s] ?? ""}
                      {t.genderRanks?.[s] ? <span className="stx-mutedc">（{t.genderRanks[s]}）</span> : ""}
                    </td>
                  ))}
                  <td>
                    {t.totals.total3.rank}
                    <span className="stx-mutedc">（{t.totals.total3.genderRank}）</span>
                  </td>
                  <td>
                    <b>{t.totals.total5.rank}</b>
                    <span className="stx-mutedc">（{t.totals.total5.genderRank}）</span>
                  </td>
                  <td>
                    {t.totals.total9 ? (
                      <>
                        {t.totals.total9.rank}
                        <span className="stx-mutedc">（{t.totals.total9.genderRank}）</span>
                      </>
                    ) : (
                      ""
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card title="元の資料" sub="Leo's_Tests フォルダの写真">
        <ul className="stx-list">
          {test.files.map((f) => (
            <li key={f} className="stx-q" style={{ gridTemplateColumns: "1fr" }}>
              📄 {test.folder}/{f}
            </li>
          ))}
        </ul>
        {test.remarks?.map((r) => (
          <p className="stx-note" key={r}>
            メモ：{r}
          </p>
        ))}
      </Card>
    </>
  );
}
