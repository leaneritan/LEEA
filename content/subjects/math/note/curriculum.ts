/**
 * The 学習ノート's spine — the workbook's own 目次, not the textbook's.
 *
 * **Every `workbookPages` here is a WORKBOOK page.** `textbookRef` carries the
 * 教科書 page the section practises, taken from the (NN~NN) column the 目次
 * prints beside each row.
 *
 * Rows for 1章 are folio-verified against the scans. 2章 onward comes from the
 * 目次 alone and is listed at chapter level only, because those pages are not
 * scanned and asserting per-section ranges would be asserting something nobody
 * has checked — see the coverage table in
 * `docs/lesson-plans/math/sugaku-no-gakushu-note-1/README.md`.
 *
 * Chapter colours are borrowed from the textbook spine so the two tabs read as
 * the same book of the same subject.
 */

import { mathChapters } from "../curriculum";
import type { MathNoteChapterMeta, MathNoteSectionMeta } from "./types";

function palette(chapterId: string) {
  const chapter = mathChapters.find((c) => c.id === chapterId);
  return {
    color: chapter?.color ?? "#6f8fa8",
    tint: chapter?.tint ?? "#e4edf3",
    dark: chapter?.dark ?? "#42607a"
  };
}

/**
 * A row of the 目次. `key` becomes the URL segment and the progress-map section
 * id, so it is given explicitly rather than derived from the name — 特訓ドリル①
 * and 特訓ドリル② would otherwise slug to the same thing and silently share a
 * progress record.
 */
function section(
  chapterKey: string,
  number: number | null,
  key: string | number,
  name: string,
  workbookPages: string,
  options: { textbookRef?: string; authored?: boolean; scanned?: boolean } = {}
): MathNoteSectionMeta {
  return {
    id: `note-${chapterKey}-${key}`,
    chapterKey,
    number,
    name,
    workbookPages,
    textbookRef: options.textbookRef,
    authored: options.authored ?? false,
    scanned: options.scanned ?? false
  };
}

export const mathNoteChapters: MathNoteChapterMeta[] = [
  {
    key: "start",
    badge: "スタート",
    title: "中学数学スタートDASH!",
    subtitle: "小学校の算数のおさらい",
    workbookPages: "p.2–9",
    ...palette("0"),
    sections: [
      section("start", null, "dash", "中学数学スタートDASH!", "p.2–9", { scanned: true })
    ]
  },
  {
    key: "0",
    badge: "0章",
    title: "算数から数学へ",
    subtitle: "整数の性質",
    workbookPages: "p.10–11",
    ...palette("0"),
    sections: [
      section("0", 1, 1, "整数の性質", "p.10–11", { textbookRef: "教 P.12〜17", scanned: true })
    ]
  },
  {
    key: "1",
    badge: "1章",
    title: "正負の数",
    subtitle: "符号のついた数・加法と減法・乗法と除法",
    workbookPages: "p.12–41",
    ...palette("1"),
    sections: [
      section("1", 1, 1, "符号のついた数", "p.12–13", { textbookRef: "教 P.22〜24", authored: true, scanned: true }),
      section("1", 2, 2, "数の大小", "p.14–15", { textbookRef: "教 P.25〜27", authored: true, scanned: true }),
      section("1", 3, 3, "加法", "p.16–17", { textbookRef: "教 P.30〜32", scanned: true }),
      section("1", 4, 4, "分数や小数の加法　加法の交換法則と結合法則", "p.18–19", { textbookRef: "教 P.32〜33", scanned: true }),
      section("1", 5, 5, "減法", "p.20–21", { textbookRef: "教 P.34〜36", scanned: true }),
      section("1", 6, 6, "加法と減法の混じった計算", "p.22–23", { textbookRef: "教 P.37〜39", scanned: true }),
      section("1", null, "drill1", "特訓ドリル①　正負の数の加法と減法", "p.24–25", { scanned: true }),
      section("1", 7, 7, "乗法", "p.26–27", { textbookRef: "教 P.42〜46", scanned: true }),
      section("1", 8, 8, "累乗", "p.28", { textbookRef: "教 P.47", scanned: true }),
      section("1", 9, 9, "除法", "p.29", { textbookRef: "教 P.48〜49", scanned: true }),
      section("1", 10, 10, "除法と逆数", "p.30", { textbookRef: "教 P.50〜51", scanned: true }),
      section("1", 11, 11, "乗法と除法の混じった計算", "p.31", { textbookRef: "教 P.51", scanned: true }),
      section("1", 12, 12, "四則の混じった計算", "p.32–33", { textbookRef: "教 P.52〜53", scanned: true }),
      section("1", null, "drill2", "特訓ドリル②　正負の数の四則", "p.34–35", { scanned: true }),
      section("1", 13, 13, "数の範囲と四則", "p.36", { textbookRef: "教 P.54〜55", scanned: true }),
      section("1", 14, 14, "正負の数の利用", "p.37", { textbookRef: "教 P.57〜59", scanned: true }),
      section("1", null, "test", "確認テスト・C問題・考えてみよう", "p.38–41", { scanned: true })
    ]
  },
  {
    key: "2",
    badge: "2章",
    title: "文字と式",
    subtitle: "文字を使った式・文字式の計算",
    workbookPages: "p.42–61",
    ...palette("2"),
    sections: [section("2", null, "all", "2章 全体", "p.42–61", { textbookRef: "教 P.66〜87" })]
  },
  {
    key: "3",
    badge: "3章",
    title: "方程式",
    subtitle: "方程式とその解き方・1次方程式の利用",
    workbookPages: "p.62–81",
    ...palette("3"),
    sections: [section("3", null, "all", "3章 全体", "p.62–81", { textbookRef: "教 P.94〜111" })]
  },
  {
    key: "4",
    badge: "4章",
    title: "比例と反比例",
    subtitle: "関数・比例・反比例・座標・グラフ",
    workbookPages: "p.82–99",
    ...palette("4"),
    sections: [section("4", null, "all", "4章 全体", "p.82–99", { textbookRef: "教 P.120〜153" })]
  },
  {
    key: "5",
    badge: "5章",
    title: "平面図形",
    subtitle: "図形の移動・基本の作図・おうぎ形",
    workbookPages: "p.100–115",
    ...palette("5"),
    sections: [section("5", null, "all", "5章 全体", "p.100–115", { textbookRef: "教 P.160〜185" })]
  },
  {
    key: "6",
    badge: "6章",
    title: "空間図形",
    subtitle: "いろいろな立体・体積と表面積",
    workbookPages: "p.116–137",
    ...palette("6"),
    sections: [section("6", null, "all", "6章 全体", "p.116–137", { textbookRef: "教 P.194〜221" })]
  },
  {
    key: "7",
    badge: "7章",
    title: "データの分析と活用",
    subtitle: "度数分布・相対度数・確率",
    workbookPages: "p.138–149",
    ...palette("7"),
    sections: [section("7", null, "all", "7章 全体", "p.138–149", { textbookRef: "教 P.228〜245" })]
  }
];

export function getMathNoteChapter(key: string) {
  return mathNoteChapters.find((chapter) => chapter.key === key);
}

export function getMathNoteSectionMeta(sectionId: string) {
  for (const chapter of mathNoteChapters) {
    const found = chapter.sections.find((s) => s.id === sectionId);
    if (found) return { chapter, section: found };
  }
  return undefined;
}

/** Authored rows in book order, so a section page can offer ← / → to its neighbours. */
export function getAdjacentNoteSections(sectionId: string) {
  const authored = mathNoteChapters.flatMap((chapter) => chapter.sections.filter((s) => s.authored));
  const index = authored.findIndex((s) => s.id === sectionId);
  return {
    prev: index > 0 ? authored[index - 1] : undefined,
    next: index >= 0 && index < authored.length - 1 ? authored[index + 1] : undefined
  };
}
