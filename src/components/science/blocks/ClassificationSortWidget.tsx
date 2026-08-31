"use client";

import { useMemo, useState } from "react";

/**
 * 思考ツール — さまざまな生物の分類.
 *
 * The book's point is not that one grouping is correct. It is 実習1 ステップ3:
 * change the feature you attend to and the same organisms fall apart
 * differently. So the widget is built around the 観点 (criterion) as the thing
 * Leo picks, and it only says the thing the chapter is actually teaching once
 * he has completed two different 観点 on the same set.
 *
 * Two sets, from two books, kept apart because each is its own book's worked
 * example — merging them into one pool would misrepresent both:
 *
 * - 教科書 — 新編 新しい科学1 p.23 実習1, p.24 分類の例, p.25 活用
 *   (`docs/lesson-plans/science/new-science-1/scans/unit1-ch1_p10-26.pdf`)
 * - ワーク — よくわかる 理科の学習 1（東）p.3 実習1, 図1 and 図2
 *   (`docs/lesson-plans/science/yokuwakaru-rika-1/scans/toc-and-p1-31.pdf`)
 *
 * The workbook asks its version as multiple choice over four pre-made groups
 * (図1 ア〜エ, where エ is a distractor); it is offered here as sorting instead,
 * so both sets play the same way. The memberships are still the book's own:
 * ア, イ and ウ are its stated answers to (3), (4) and (2), and the remaining
 * organisms follow as the complement.
 */

type Organism = {
  id: string;
  name: string;
  emoji: string;
  /** Held back until Leo asks for them — 教科書 p.25's 活用 task. */
  extra?: boolean;
};

type Criterion = {
  id: string;
  /** The 観点 as the book words it. */
  label: string;
  hint: string;
  page: string;
  groups: { id: string; label: string; members: string[] }[];
  /**
   * Organisms this 観点 does not apply to — each book narrows the set as it
   * goes (only 移動する organisms have a 移動の手段; only あし organisms have
   * あしの数). They are held out of the tray rather than made unanswerable.
   */
  excludes?: string[];
  /** Shown after a correct run, in the book's own terms. */
  note: string;
};

type ClassificationSet = {
  id: string;
  label: string;
  source: string;
  organisms: Organism[];
  criteria: Criterion[];
  /** Whether this set has held-back organisms to reveal. */
  extrasLabel?: string;
  /** Where this set's own book states the change-the-criterion point. */
  insightSource: string;
};

const TEXTBOOK: ClassificationSet = {
  id: "textbook",
  label: "教科書",
  source: "新編 新しい科学1 p.23–25",
  extrasLabel: "新しい生物を加える（p.25 活用）",
  insightSource: "教科書 p.25",
  organisms: [
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
  ],
  criteria: [
    {
      id: "kankyou",
      label: "生息・生育環境",
      hint: "その生物は、どこでくらしているだろう。",
      page: "教科書 p.23",
      groups: [
        { id: "suichuu", label: "水中", members: ["ookanadamo", "dojou", "maaji", "kumanomi"] },
        {
          id: "rikujou",
          label: "陸上",
          members: ["okadangomushi", "kuroooari", "sakura", "nanahoshitentou", "abura-na", "tomato"]
        }
      ],
      // p.23's worked example has no アメンボ; it lives on the water surface,
      // which the book never files as 水中 or 陸上, so it is not forced into
      // either.
      excludes: ["amenbo"],
      note: "教科書 p.23 の例と同じ分け方だね。生息・生育環境に注目すると、この2つのグループになる。"
    },
    {
      id: "idou",
      label: "移動するか、しないか",
      hint: "自分から動いて場所を変えるだろうか。",
      page: "教科書 p.24",
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
      page: "教科書 p.24",
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
      page: "教科書 p.24",
      groups: [
        { id: "roppon", label: "6本", members: ["nanahoshitentou", "kuroooari", "amenbo"] },
        { id: "sonota", label: "それ以外の数", members: ["okadangomushi"] }
      ],
      excludes: ["abura-na", "ookanadamo", "sakura", "dojou", "maaji", "kumanomi", "tomato"],
      note: "教科書 p.24 の3段目。あしが6本の生物は昆虫のなかまだね（オカダンゴムシは14本）。"
    }
  ]
};

/** The 動き方 question (図2) runs over its own four organisms, not the eight. */
const WORKBOOK_MOVEMENT_ONLY = ["shimarisu", "mitsubachi", "kujira"];
const WORKBOOK_MAIN_EIGHT = [
  "tanpopo",
  "dangomushi",
  "sakura",
  "dojou",
  "tsubame",
  "medaka",
  "aburana",
  "ageha"
];

const WORKBOOK: ClassificationSet = {
  id: "workbook",
  label: "ワーク",
  source: "よくわかる 理科の学習1 p.3",
  // The workbook states the same point as 実習1 ❸ on its own page.
  insightSource: "ワーク p.3 実習1 ❸",
  organisms: [
    { id: "tanpopo", name: "タンポポ", emoji: "🌼" },
    { id: "dangomushi", name: "ダンゴムシ", emoji: "🪲" },
    { id: "sakura", name: "サクラ", emoji: "🌸" },
    { id: "dojou", name: "ドジョウ", emoji: "🐟" },
    { id: "tsubame", name: "ツバメ", emoji: "🐦" },
    { id: "medaka", name: "メダカ", emoji: "🐠" },
    { id: "aburana", name: "アブラナ", emoji: "🌻" },
    { id: "ageha", name: "アゲハ", emoji: "🦋" },
    { id: "shimarisu", name: "シマリス", emoji: "🐿️" },
    { id: "mitsubachi", name: "ニホンミツバチ", emoji: "🐝" },
    { id: "kujira", name: "クジラ", emoji: "🐋" }
  ],
  criteria: [
    {
      id: "kankyou",
      label: "水中か、陸上か",
      hint: "ワーク(2)。水中で生活する生物はどれだろう。",
      page: "ワーク p.3 (2)",
      groups: [
        { id: "suichuu", label: "水中で生活する", members: ["dojou", "medaka"] },
        {
          id: "rikujou",
          label: "陸上で生活する",
          members: ["tanpopo", "sakura", "aburana", "dangomushi", "tsubame", "ageha"]
        }
      ],
      excludes: WORKBOOK_MOVEMENT_ONLY,
      note: "ワークの答えは図1の ウ（ドジョウ・メダカ）。のこりの6つが陸上のグループだね。"
    },
    {
      id: "idou",
      label: "移動するか、しないか",
      hint: "ワーク(3)。自分から動いて場所を変えるだろうか。",
      page: "ワーク p.3 (3)",
      groups: [
        {
          id: "suru",
          label: "移動する",
          members: ["dangomushi", "dojou", "tsubame", "medaka", "ageha"]
        },
        { id: "shinai", label: "移動しない", members: ["tanpopo", "sakura", "aburana"] }
      ],
      excludes: WORKBOOK_MOVEMENT_ONLY,
      note: "ワークの答えは図1の ア（タンポポ・サクラ・アブラナ）。植物は移動しないね。"
    },
    {
      id: "hane",
      label: "はねで移動するか",
      hint: "ワーク(4)。移動する生物だけを、はねを使うかどうかで分けよう。",
      page: "ワーク p.3 (4)",
      groups: [
        { id: "hane", label: "はねで移動する", members: ["tsubame", "ageha"] },
        { id: "hane-igai", label: "はね以外で移動する", members: ["dangomushi", "dojou", "medaka"] }
      ],
      excludes: [...WORKBOOK_MOVEMENT_ONLY, "tanpopo", "sakura", "aburana"],
      note: "ワークの答えは図1の イ（ツバメ・アゲハ）。移動しない植物はここには出てこない。"
    },
    {
      id: "ugokikata",
      label: "動き方",
      hint: "ワーク(5) 図2。この4つを動き方で3つに分けよう。",
      page: "ワーク p.3 (5)",
      groups: [
        { id: "tobu", label: "飛ぶ", members: ["mitsubachi"] },
        { id: "hashiru", label: "走る", members: ["shimarisu"] },
        { id: "oyogu", label: "泳ぐ", members: ["kujira", "medaka"] }
      ],
      // 図2 is its own question over four organisms; メダカ is the only one it
      // shares with the eight above.
      excludes: WORKBOOK_MAIN_EIGHT.filter((id) => id !== "medaka"),
      note: "ワーク図2のとおり。①シマリスは走る、②ニホンミツバチは飛ぶ、③クジラとメダカは泳ぐ。"
    }
  ]
};

const SETS: ClassificationSet[] = [TEXTBOOK, WORKBOOK];

function correctGroupFor(criterion: Criterion, organismId: string) {
  return criterion.groups.find((group) => group.members.includes(organismId))?.id;
}

export function ClassificationSortWidget({
  onScored
}: {
  /** Reports a finished run so the section can record it. */
  onScored?: (correct: number, total: number) => void;
}) {
  const [setId, setSetId] = useState(SETS[0].id);
  const [criterionId, setCriterionId] = useState(SETS[0].criteria[0].id);
  const [withExtras, setWithExtras] = useState(false);
  const [placements, setPlacements] = useState<Record<string, string>>({});
  const [selected, setSelected] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);
  const [solved, setSolved] = useState<string[]>([]);

  const set = SETS.find((entry) => entry.id === setId) ?? SETS[0];
  const criterion = set.criteria.find((entry) => entry.id === criterionId) ?? set.criteria[0];

  const pool = useMemo(() => {
    const excluded = new Set(criterion.excludes ?? []);
    return set.organisms.filter(
      (organism) => (withExtras || !organism.extra) && !excluded.has(organism.id)
    );
  }, [set, criterion, withExtras]);

  const unplaced = pool.filter((organism) => !placements[organism.id]);
  const allPlaced = unplaced.length === 0 && pool.length > 0;

  const results = pool.map((organism) => ({
    organism,
    placed: placements[organism.id],
    ok: placements[organism.id] === correctGroupFor(criterion, organism.id)
  }));
  const correctCount = results.filter((result) => result.ok).length;
  const allCorrect = checked && correctCount === pool.length;

  /** Solved 観点 are tracked per set, so switching books does not carry credit over. */
  const solvedKey = (sId: string, cId: string) => `${sId}::${cId}`;
  const solvedInSet = solved.filter((key) => key.startsWith(`${set.id}::`)).length;

  function reset(nextSetId = setId, nextCriterionId = criterionId, nextWithExtras = withExtras) {
    setSetId(nextSetId);
    setCriterionId(nextCriterionId);
    setWithExtras(nextWithExtras);
    setPlacements({});
    setSelected(null);
    setChecked(false);
  }

  function chooseSet(nextSetId: string) {
    const next = SETS.find((entry) => entry.id === nextSetId) ?? SETS[0];
    reset(next.id, next.criteria[0].id, false);
  }

  function place(groupId: string) {
    if (!selected) return;
    setPlacements((current) => ({ ...current, [selected]: groupId }));
    setSelected(null);
    setChecked(false);
  }

  function unplace(organismId: string) {
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
    const key = solvedKey(set.id, criterion.id);
    if (correct === pool.length && !solved.includes(key)) {
      setSolved((current) => [...current, key]);
    }
    onScored?.(correct, pool.length);
  }

  return (
    <div className="sci-widget">
      <div className="sci-widget-controls">
        <span className="sci-widget-label">つかう本</span>
        <div className="sci-chip-row">
          {SETS.map((entry) => (
            <button
              className={`sci-set${entry.id === set.id ? " is-active" : ""}`}
              key={entry.id}
              onClick={() => chooseSet(entry.id)}
              type="button"
            >
              {entry.label}
              <small>{entry.source}</small>
            </button>
          ))}
        </div>

        <span className="sci-widget-label">注目する特徴（観点）</span>
        <div className="sci-chip-row">
          {set.criteria.map((entry) => (
            <button
              className={`sci-criterion${entry.id === criterion.id ? " is-active" : ""}${
                solved.includes(solvedKey(set.id, entry.id)) ? " is-solved" : ""
              }`}
              key={entry.id}
              onClick={() => reset(set.id, entry.id)}
              type="button"
            >
              {entry.label}
              {solved.includes(solvedKey(set.id, entry.id)) ? <span aria-hidden="true"> ✓</span> : null}
            </button>
          ))}
        </div>
        <p className="sci-widget-hint">
          {criterion.hint}
          <span className="sci-widget-page">{criterion.page}</span>
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
        {set.extrasLabel ? (
          <button className="sci-btn" onClick={() => reset(set.id, criterion.id, !withExtras)} type="button">
            {withExtras ? "はじめの8種類にもどす" : set.extrasLabel}
          </button>
        ) : null}
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
          {allCorrect && solvedInSet >= 2 ? (
            <p className="sci-result-insight">
              同じ生物の組み合わせでも、注目する特徴を変えると分け方が変わる。これが実習1で
              確かめたかったことだよ。（{set.insightSource}）
            </p>
          ) : null}
          {allCorrect && solvedInSet < 2 ? (
            <p className="sci-result-insight">
              上の観点をもう1つえらんで、同じ生物をちがう分け方で分けてみよう。
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
