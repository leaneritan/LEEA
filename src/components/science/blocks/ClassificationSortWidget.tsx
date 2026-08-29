"use client";

import { useMemo, useState } from "react";

/**
 * 思考ツール — さまざまな生物の分類 (教科書 p.23 実習1, p.24 分類の例, p.25 活用).
 *
 * The book's point is not that one grouping is correct. It is 実習1 ステップ3:
 * change the feature you attend to and the same organisms fall apart
 * differently. So the widget is built around the 観点 (criterion) as the thing
 * Leo picks, and it only says the thing the chapter is actually teaching once
 * he has completed two different 観点 on the same set.
 *
 * Every organism and every grouping below is taken from the scan
 * (`docs/lesson-plans/science/new-science-1/scans/unit1-ch1_p10-26.pdf`), not
 * invented: p.23's worked example is 生息・生育環境, and p.24's three-level tree
 * is 移動 → 移動の手段 → あしの数. The three extras are p.25's 活用 task.
 */

type OrganismId =
  | "abura-na"
  | "ookanadamo"
  | "okadangomushi"
  | "kuroooari"
  | "sakura"
  | "dojou"
  | "nanahoshitentou"
  | "maaji"
  | "kumanomi"
  | "amenbo"
  | "tomato";

type Organism = {
  id: OrganismId;
  name: string;
  emoji: string;
  /** p.25's 活用: added to the set only when Leo asks for them. */
  extra?: boolean;
};

const ORGANISMS: Organism[] = [
  { id: "abura-na", name: "アブラナ", emoji: "🌼" },
  { id: "ookanadamo", name: "オオカナダモ", emoji: "🌿" },
  { id: "okadangomushi", name: "オカダンゴムシ", emoji: "🪲" },
  { id: "kuroooari", name: "クロオオアリ", emoji: "🐜" },
  { id: "sakura", name: "サクラ", emoji: "🌸" },
  { id: "dojou", name: "ドジョウ", emoji: "🐟" },
  { id: "nanahoshitentou", name: "ナナホシテントウ", emoji: "🐞" },
  { id: "maaji", name: "マアジ", emoji: "🐠" },
  { id: "kumanomi", name: "クマノミ", emoji: "🐡", extra: true },
  { id: "amenbo", name: "アメンボ", emoji: "🦗", extra: true },
  { id: "tomato", name: "トマト", emoji: "🍅", extra: true }
];

type Criterion = {
  id: string;
  /** The 観点 as the book words it. */
  label: string;
  hint: string;
  page: string;
  groups: { id: string; label: string; members: OrganismId[] }[];
  /**
   * Organisms this 観点 does not apply to — p.24 narrows the set at each level
   * (only 移動する organisms have a 移動の手段; only あし organisms have あしの数).
   * They are held out of the tray rather than being made unanswerable.
   */
  excludes?: OrganismId[];
  /** Shown after a correct run, in the book's own words. */
  note: string;
};

const CRITERIA: Criterion[] = [
  {
    id: "kankyou",
    label: "生息・生育環境",
    hint: "その生物は、どこでくらしているだろう。",
    page: "23",
    groups: [
      { id: "suichuu", label: "水中", members: ["ookanadamo", "dojou", "maaji", "kumanomi"] },
      {
        id: "rikujou",
        label: "陸上",
        members: ["okadangomushi", "kuroooari", "sakura", "nanahoshitentou", "abura-na", "tomato"]
      }
    ],
    // p.23's worked example has no アメンボ; it lives on the water surface, which
    // the book never files as 水中 or 陸上, so it is not forced into either.
    excludes: ["amenbo"],
    note: "教科書 p.23 の例と同じ分け方だね。生息・生育環境に注目すると、この2つのグループになる。"
  },
  {
    id: "idou",
    label: "移動するか、しないか",
    hint: "自分から動いて場所を変えるだろうか。",
    page: "24",
    groups: [
      {
        id: "suru",
        label: "移動する",
        members: ["dojou", "okadangomushi", "nanahoshitentou", "maaji", "kuroooari", "kumanomi", "amenbo"]
      },
      { id: "shinai", label: "移動しない", members: ["abura-na", "ookanadamo", "sakura", "tomato"] }
    ],
    note: "教科書 p.24 の1段目と同じだね。同じ生物でも、さっきとは分かれ方が変わったことに気づいたかな。"
  },
  {
    id: "shudan",
    label: "何を使って移動するか",
    hint: "移動する生物だけを、移動の手段で分けてみよう。",
    page: "24",
    groups: [
      { id: "hire", label: "ひれ", members: ["dojou", "maaji", "kumanomi"] },
      { id: "ashi", label: "あし", members: ["okadangomushi", "kuroooari", "nanahoshitentou", "amenbo"] }
    ],
    excludes: ["abura-na", "ookanadamo", "sakura", "tomato"],
    note: "教科書 p.24 の2段目。移動しない生物はここには出てこない ── 分けるグループがせまくなっている。"
  },
  {
    id: "ashi-no-kazu",
    label: "あしの数",
    hint: "あしで移動する生物だけを、あしの数で分けてみよう。",
    page: "24",
    groups: [
      { id: "roppon", label: "6本", members: ["nanahoshitentou", "kuroooari", "amenbo"] },
      { id: "sonota", label: "それ以外の数", members: ["okadangomushi"] }
    ],
    excludes: ["abura-na", "ookanadamo", "sakura", "dojou", "maaji", "kumanomi", "tomato"],
    note: "教科書 p.24 の3段目。あしが6本の生物は昆虫のなかまだね（オカダンゴムシは14本）。"
  }
];

function correctGroupFor(criterion: Criterion, organismId: OrganismId) {
  return criterion.groups.find((group) => group.members.includes(organismId))?.id;
}

export function ClassificationSortWidget({
  onScored
}: {
  /** Reports a finished run so the section can record it. */
  onScored?: (correct: number, total: number) => void;
}) {
  const [criterionId, setCriterionId] = useState(CRITERIA[0].id);
  const [withExtras, setWithExtras] = useState(false);
  const [placements, setPlacements] = useState<Record<string, string>>({});
  const [selected, setSelected] = useState<OrganismId | null>(null);
  const [checked, setChecked] = useState(false);
  const [solvedCriteria, setSolvedCriteria] = useState<string[]>([]);

  const criterion = CRITERIA.find((entry) => entry.id === criterionId) ?? CRITERIA[0];

  const pool = useMemo(() => {
    const excluded = new Set(criterion.excludes ?? []);
    return ORGANISMS.filter(
      (organism) => (withExtras || !organism.extra) && !excluded.has(organism.id)
    );
  }, [criterion, withExtras]);

  const unplaced = pool.filter((organism) => !placements[organism.id]);
  const allPlaced = unplaced.length === 0 && pool.length > 0;

  const results = pool.map((organism) => ({
    organism,
    placed: placements[organism.id],
    ok: placements[organism.id] === correctGroupFor(criterion, organism.id)
  }));
  const correctCount = results.filter((result) => result.ok).length;
  const allCorrect = checked && correctCount === pool.length;

  function reset(nextCriterionId = criterionId, nextWithExtras = withExtras) {
    setCriterionId(nextCriterionId);
    setWithExtras(nextWithExtras);
    setPlacements({});
    setSelected(null);
    setChecked(false);
  }

  function place(groupId: string) {
    if (!selected) return;
    setPlacements((current) => ({ ...current, [selected]: groupId }));
    setSelected(null);
    setChecked(false);
  }

  function unplace(organismId: OrganismId) {
    setPlacements((current) => {
      const next = { ...current };
      delete next[organismId];
      return next;
    });
    setChecked(false);
  }

  function check() {
    setChecked(true);
    const correct = results.filter((result) => result.ok).length;
    if (correct === pool.length && !solvedCriteria.includes(criterion.id)) {
      setSolvedCriteria((current) => [...current, criterion.id]);
    }
    onScored?.(correct, pool.length);
  }

  return (
    <div className="sci-widget">
      <div className="sci-widget-controls">
        <span className="sci-widget-label">注目する特徴（観点）</span>
        <div className="sci-chip-row">
          {CRITERIA.map((entry) => (
            <button
              className={`sci-criterion${entry.id === criterion.id ? " is-active" : ""}${
                solvedCriteria.includes(entry.id) ? " is-solved" : ""
              }`}
              key={entry.id}
              onClick={() => reset(entry.id)}
              type="button"
            >
              {entry.label}
              {solvedCriteria.includes(entry.id) ? <span aria-hidden="true"> ✓</span> : null}
            </button>
          ))}
        </div>
        <p className="sci-widget-hint">
          {criterion.hint}
          <span className="sci-widget-page">教科書 p.{criterion.page}</span>
        </p>
      </div>

      <div className="sci-tray">
        <span className="sci-tray-title">
          {unplaced.length > 0 ? "分けたい生物をえらぶ" : "ぜんぶ入ったよ"}
        </span>
        <div className="sci-chip-row">
          {unplaced.map((organism) => (
            <button
              className={`sci-organism${selected === organism.id ? " is-selected" : ""}`}
              key={organism.id}
              onClick={() => setSelected(selected === organism.id ? null : organism.id)}
              type="button"
            >
              <span aria-hidden="true">{organism.emoji}</span> {organism.name}
            </button>
          ))}
          {unplaced.length === 0 ? <span className="sci-tray-empty">↓ 下のグループを確かめよう</span> : null}
        </div>
      </div>

      <div className="sci-groups">
        {criterion.groups.map((group) => {
          const members = results.filter((result) => result.placed === group.id);
          return (
            <div className="sci-group" key={group.id}>
              <button
                className="sci-group-head"
                disabled={!selected}
                onClick={() => place(group.id)}
                type="button"
              >
                {group.label}
                {selected ? <span className="sci-group-cta">ここに入れる</span> : null}
              </button>
              <div className="sci-group-body">
                {members.map((result) => (
                  <button
                    className={`sci-organism sci-organism--placed${
                      checked ? (result.ok ? " is-right" : " is-wrong") : ""
                    }`}
                    key={result.organism.id}
                    onClick={() => unplace(result.organism.id)}
                    title="もどす"
                    type="button"
                  >
                    <span aria-hidden="true">{result.organism.emoji}</span> {result.organism.name}
                    {checked ? <span aria-hidden="true">{result.ok ? " ○" : " ×"}</span> : null}
                  </button>
                ))}
                {members.length === 0 ? <span className="sci-group-empty">まだ何もないよ</span> : null}
              </div>
            </div>
          );
        })}
      </div>

      <div className="sci-widget-actions">
        <button className="sci-btn sci-btn--primary" disabled={!allPlaced} onClick={check} type="button">
          確かめる
        </button>
        <button className="sci-btn" onClick={() => reset()} type="button">
          やりなおす
        </button>
        <button className="sci-btn" onClick={() => reset(criterionId, !withExtras)} type="button">
          {withExtras ? "はじめの8種類にもどす" : "新しい生物を加える（p.25 活用）"}
        </button>
      </div>

      {checked ? (
        <div className={`sci-result${allCorrect ? " is-right" : " is-wrong"}`}>
          <strong>
            {correctCount} / {pool.length} 正解
          </strong>
          <p>
            {allCorrect
              ? criterion.note
              : "×のついた生物をもういちど考えてみよう。その生物をクリックすると、トレイにもどせるよ。"}
          </p>
          {allCorrect && solvedCriteria.length >= 2 ? (
            <p className="sci-result-insight">
              同じ生物の組み合わせでも、注目する特徴を変えると分け方が変わる。これが実習1のステップ3で
              確かめたかったことだよ。（教科書 p.25）
            </p>
          ) : null}
          {allCorrect && solvedCriteria.length < 2 ? (
            <p className="sci-result-insight">
              上の観点をもう1つえらんで、同じ生物をちがう分け方で分けてみよう。
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
