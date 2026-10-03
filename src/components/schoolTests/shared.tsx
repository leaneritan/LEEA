"use client";

import type { ReactNode } from "react";
import {
  avgLabel,
  shortTestName,
  subjectColors,
  subjectLabels,
  testTypeColors,
  type Insight,
  type QuestionRef
} from "@/data/schoolTests/analytics";
import type { CardStatus, MissReason, SchoolTest, Subject } from "@/data/schoolTests/types";

export const reasonLabels: Record<MissReason, string> = {
  careless: "ケアレスミス",
  unknown: "わからなかった",
  misread: "問題の読みまちがい",
  time: "時間が足りなかった",
  blank: "白紙（書けなかった）"
};

/** What to do about each kind of miss — shown on cards and the print sheet. */
export const reasonFix: Record<MissReason, string> = {
  careless: "見直しの手順を決める（符号・単位・写しまちがいをチェック）",
  unknown: "教科書で確認 → 似た問題を3問 → 3日後にもう一度",
  misread: "問題文の大事なところに線を引いてから解く",
  time: "時間を計って練習。わからない問題は飛ばして最後に戻る",
  blank: "答え方の型を覚える（書き出しの一文・使う言葉）"
};

export const statusLabels: Record<CardStatus, string> = {
  todo: "やること",
  practiced: "練習した → 再テスト待ち",
  mastered: "できた！"
};

export function SubjectTag({ subject, small }: { subject: Subject; small?: boolean }) {
  return (
    <span className="stx-q-sub" style={{ background: subjectColors[subject], fontSize: small ? 10.5 : undefined }}>
      {subjectLabels[subject]}
    </span>
  );
}

export function TypeTag({ test }: { test: SchoolTest }) {
  return (
    <span className="stx-type" style={{ background: testTypeColors[test.type] }}>
      {test.type}
    </span>
  );
}

export function Delta({ value, invert = false, unit = "", digits = 1 }: { value: number | null; invert?: boolean; unit?: string; digits?: number }) {
  if (value === null || Number.isNaN(value)) return <span className="stx-mutedc">—</span>;
  const v = Math.round(value * 10 ** digits) / 10 ** digits;
  const good = invert ? v < 0 : v > 0;
  const bad = invert ? v > 0 : v < 0;
  const arrow = v === 0 ? "±" : v > 0 ? "▲" : "▼";
  return (
    <span className={`stx-num ${good ? "stx-good" : bad ? "stx-bad" : "stx-mutedc"}`}>
      {arrow}
      {Math.abs(v)}
      {unit}
    </span>
  );
}

export function TestPicker({ tests, value, onChange, label = "テスト" }: { tests: SchoolTest[]; value: string; onChange: (id: string) => void; label?: string }) {
  return (
    <div className="stx-picker">
      <span>{label}</span>
      {tests.map((t) => (
        <button type="button" key={t.id} className={`stx-pick ${value === t.id ? "on" : ""}`} onClick={() => onChange(t.id)}>
          <TypeTag test={t} />
          {shortTestName(t)}
          <small>{t.date.slice(5).replace("-", "/")}</small>
        </button>
      ))}
    </div>
  );
}

export function Insights({ items }: { items: Insight[] }) {
  return (
    <div className="stx-insights">
      {items.map((i, n) => (
        <div className={`stx-insight ${i.tone}`} key={n}>
          <b>{i.title}</b>
          <span>{i.text}</span>
        </div>
      ))}
    </div>
  );
}

export function Card({ title, sub, right, children, className = "" }: { title?: ReactNode; sub?: ReactNode; right?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={`stx-card ${className}`}>
      {(title || right) && (
        <div className="stx-head">
          <div>
            {title && <h2>{title}</h2>}
            {sub && <div className="stx-sub">{sub}</div>}
          </div>
          {right}
        </div>
      )}
      {children}
    </section>
  );
}

export function QuestionItem({ q, right, onClick }: { q: QuestionRef; right?: ReactNode; onClick?: () => void }) {
  return (
    <li className="stx-q" onClick={onClick} style={onClick ? { cursor: "pointer" } : undefined}>
      <SubjectTag subject={q.subject} />
      <div className="stx-q-main">
        <b>{q.no}</b> {q.topic}
        <small>
          {q.domainName}
          {q.link && (
            <>
              {" ・ "}
              {q.link.href ? (
                <a className="stx-link" href={q.link.href} onClick={(e) => e.stopPropagation()}>
                  {q.link.label}
                </a>
              ) : (
                q.link.label
              )}
            </>
          )}
        </small>
      </div>
      <div className="stx-q-side">
        {right ?? (
          <>
            <b>全体 {q.rate}%</b>
            {q.value}点
          </>
        )}
      </div>
    </li>
  );
}

export function AvgNote({ test }: { test: SchoolTest }) {
  return (
    <span className="stx-sub">
      平均＝{avgLabel(test)}・順位＝校内（学年）順位
    </span>
  );
}

export function fmtDate(d: string) {
  if (!d) return "未定";
  const [y, m, dd] = d.split("-");
  const wd = "日月火水木金土"[new Date(`${d}T00:00:00`).getDay()];
  return `${y}年${Number(m)}月${Number(dd)}日（${wd}）`;
}
