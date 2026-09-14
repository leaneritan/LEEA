"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { getScienceChapterTokens, scienceChapters } from "../../../content/subjects/science/curriculum";
import type { ScienceQrGroup } from "../../../content/subjects/science/types";
import { ScienceTopbarHome } from "./ScienceTopbarHome";

/**
 * QRコンテンツ — 理科's second surface, the counterpart of math's 特訓レッスン.
 *
 * The publisher prints a QR code beside 166 places in this book, and all but
 * six resolve to a real page we already captured. Until this existed they were
 * reachable only through a chip inside an authored 節, which meant roughly 150
 * of them could not be reached at all: every item in 第2章 onward belongs to a
 * 章 that has no sections written yet.
 *
 * So this page is not a nicety — it is the only way most of the book's own
 * material is reachable while the scans are still arriving. A 準備中 章 has 11
 * or 12 videos and 練習 sitting behind it already.
 */

/** The publisher's own labels, with the three web kinds shown as one. */
const KIND_ICON: Record<string, string> = {
  動画: "▶️",
  練習: "✏️",
  ワークシート: "📝",
  シミュレーション: "🧪",
  思考ツール: "🧩",
  資料: "📚",
  リンク: "🔗"
};

/** 「Webページ」「Webページ（リンク）」「他教科リンク」 are one thing to Leo. */
function displayKind(kind: string) {
  return kind.includes("Web") || kind.includes("リンク") ? "リンク" : kind;
}

const KIND_ORDER = ["動画", "練習", "ワークシート", "シミュレーション", "思考ツール", "資料", "リンク"];

export function QrLibrary({ groups }: { groups: ScienceQrGroup[] }) {
  const [kind, setKind] = useState<string | null>(null);

  const counts = useMemo(() => {
    const tally: Record<string, number> = {};
    for (const group of groups) {
      for (const item of group.items) {
        const k = displayKind(item.kind);
        tally[k] = (tally[k] ?? 0) + 1;
      }
    }
    return tally;
  }, [groups]);

  const total = useMemo(
    () => groups.reduce((sum, group) => sum + group.items.length, 0),
    [groups]
  );

  const shown = useMemo(
    () =>
      groups
        .map((group) => ({
          ...group,
          items: kind ? group.items.filter((item) => displayKind(item.kind) === kind) : group.items
        }))
        .filter((group) => group.items.length > 0),
    [groups, kind]
  );

  return (
    <div className="sci-scope">
      <div className="sci-topbar">
        <div className="sci-home-topbar-inner">
          <ScienceTopbarHome />
          <Link className="sci-topbar-brand" href="/science">
            ← 理科の学び
          </Link>
          <span className="sci-library-navbtn sci-library-navbtn--active">QRコンテンツ</span>
          <span className="sci-home-book-label">新編 新しい科学1</span>
          <span className="sci-home-student">レオ</span>
        </div>
      </div>

      <div className="sci-page sci-home-page">
        <h1 className="sci-library-title">QRコンテンツ</h1>
        <p className="sci-library-lead">
          教科書のQRコードから開ける、東京書籍のコンテンツだよ。動画もシミュレーションも、
          まだ作っていない章のぶんもぜんぶここから見られる。
        </p>

        <div className="sci-library-filters">
          <button
            className={`sci-library-filter${kind === null ? " is-active" : ""}`}
            onClick={() => setKind(null)}
            type="button"
          >
            すべて（{total}）
          </button>
          {KIND_ORDER.filter((k) => counts[k]).map((k) => (
            <button
              className={`sci-library-filter${kind === k ? " is-active" : ""}`}
              key={k}
              onClick={() => setKind(k)}
              type="button"
            >
              {KIND_ICON[k]} {k}（{counts[k]}）
            </button>
          ))}
        </div>

        {shown.map((group) => {
          const chapter = scienceChapters.find((entry) => entry.id === group.chapterId);
          const tokens = chapter
            ? getScienceChapterTokens(chapter)
            : { color: "#9fb2a8", tint: "#eef3f0", dark: "#5d7268" };

          return (
            <div
              className="sci-library-group"
              key={group.chapterId}
              style={
                {
                  "--s-accent": tokens.color,
                  "--s-tint": tokens.tint,
                  "--s-dark": tokens.dark
                } as React.CSSProperties
              }
            >
              <div className="sci-library-group-head">
                <span className="sci-library-dot" />
                <span className="sci-library-group-title">
                  {group.unitNum ? `単元${group.unitNum}　` : ""}
                  {group.title}
                </span>
                <span className="sci-library-group-count">{group.items.length} 件</span>
              </div>

              <div className="sci-library-list">
                {group.items.map((item) => {
                  const k = displayKind(item.kind);
                  const body = (
                    <>
                      <span className="sci-library-icon">{KIND_ICON[k] ?? "📄"}</span>
                      <span className="sci-library-text">
                        <span className="sci-library-item-title">{item.title}</span>
                        <span className="sci-library-item-meta">
                          {item.kind}
                          {item.page ? `　・　教科書 p.${item.page}` : ""}
                        </span>
                      </span>
                      {/* Only a captured link becomes a link; the six without
                          one stay plain rows rather than dead destinations. */}
                      {item.url ? (
                        <span className="sci-library-go">↗</span>
                      ) : (
                        <span className="sci-library-nolink">リンク未取得</span>
                      )}
                    </>
                  );

                  return item.url ? (
                    <a
                      className="sci-library-row"
                      href={item.url}
                      key={item.no}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      {body}
                    </a>
                  ) : (
                    <span className="sci-library-row sci-library-row--plain" key={item.no}>
                      {body}
                    </span>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
