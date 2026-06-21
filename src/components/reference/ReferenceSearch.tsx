"use client";

/**
 * ReferenceSearch — the redesigned `/reference/search` surface.
 *
 * One query → words AND grammar mixed. Filter chips: All · Vocabulary ·
 * Academic · Junior High · Grammar. Per
 * design_handoff_leea_reference/Reference Search.dc.html.
 */

import Link from "next/link";
import { Search as SearchIcon } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useJapanesePreference } from "@/components/AppShell";
import { useKnownWordIds } from "@/components/useKnownWordIds";
import { allGrammar, allWords } from "./ref-data";
import { posPillClass } from "./pos-pill";
import sanseidoIndex from "../../../content/subjects/english/junior-high/sanseido-index.json";
import type { GrammarEntry, WordEntry } from "@/data/reference-shapes";

type SanseidoEntry = { w: string; u: string };

type ResultFilter = "all" | "vocabulary" | "academic" | "junior-high" | "grammar";

type ResultWord = {
  kind: "word";
  entry: WordEntry;
  score: number;
};
type ResultJh = {
  kind: "junior-high";
  word: string;
  url: string;
  score: number;
};
type ResultGrammar = {
  kind: "grammar";
  entry: GrammarEntry;
  score: number;
  matchedExample?: { en: string; jp: string };
};
type SearchResult = ResultWord | ResultJh | ResultGrammar;

const FILTERS: Array<{ key: ResultFilter; label: string; hasDot?: boolean }> = [
  { key: "all", label: "All" },
  { key: "vocabulary", label: "Vocabulary" },
  { key: "academic", label: "Academic" },
  { key: "junior-high", label: "Junior High" },
  { key: "grammar", label: "Grammar", hasDot: true }
];

const SANSEIDO_LIMIT_PER_QUERY = 20;

export function ReferenceSearch() {
  const sanseidoItems = sanseidoIndex as SanseidoEntry[];
  const jp = useJapanesePreference();
  const { knownWordSet, setWordKnown } = useKnownWordIds();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<ResultFilter>("all");
  const inputRef = useRef<HTMLInputElement | null>(null);

  /* ⌘K focus shortcut */
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        inputRef.current?.focus();
        inputRef.current?.select();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const trimmed = query.trim().toLowerCase();

  const results = useMemo<SearchResult[]>(() => {
    if (trimmed.length === 0) return [];
    const out: SearchResult[] = [];

    /* WORDS — vocabulary + academic + content/glossary */
    for (const entry of allWords) {
      const score = scoreWord(entry, trimmed);
      if (score > 0) out.push({ kind: "word", entry, score });
    }

    /* GRAMMAR — title / rule / sample text */
    for (const entry of allGrammar) {
      const { score, matchedExample } = scoreGrammar(entry, trimmed);
      if (score > 0) out.push({ kind: "grammar", entry, score, matchedExample });
    }

    /* SANSEIDO — limited to top N to avoid drowning results */
    let jhCount = 0;
    for (const item of sanseidoItems) {
      if (jhCount >= SANSEIDO_LIMIT_PER_QUERY) break;
      const lower = item.w.toLowerCase();
      if (lower === trimmed) {
        out.push({ kind: "junior-high", word: item.w, url: item.u, score: 95 });
        jhCount++;
      } else if (lower.startsWith(trimmed)) {
        out.push({ kind: "junior-high", word: item.w, url: item.u, score: 80 });
        jhCount++;
      } else if (lower.includes(trimmed)) {
        out.push({ kind: "junior-high", word: item.w, url: item.u, score: 50 });
        jhCount++;
      }
    }

    return out.sort((a, b) => b.score - a.score);
  }, [trimmed, sanseidoItems]);

  const counts = useMemo(() => {
    const totals: Record<ResultFilter, number> = {
      all: results.length,
      vocabulary: 0,
      academic: 0,
      "junior-high": 0,
      grammar: 0
    };
    for (const r of results) {
      if (r.kind === "word") {
        if (r.entry.type === "academic") totals.academic++;
        else totals.vocabulary++;
      } else if (r.kind === "junior-high") totals["junior-high"]++;
      else if (r.kind === "grammar") totals.grammar++;
    }
    return totals;
  }, [results]);

  const filteredResults = useMemo(() => {
    if (filter === "all") return results;
    return results.filter((r) => {
      if (filter === "vocabulary") return r.kind === "word" && r.entry.type !== "academic";
      if (filter === "academic") return r.kind === "word" && r.entry.type === "academic";
      if (filter === "junior-high") return r.kind === "junior-high";
      if (filter === "grammar") return r.kind === "grammar";
      return true;
    });
  }, [results, filter]);

  return (
    <div className="refv2-shell">
      <div className="refv2-search-field">
        <SearchIcon size={18} className="refv2-search-icon" />
        <input
          ref={inputRef}
          type="text"
          placeholder="Search every word and grammar point…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="refv2-search-input"
          autoFocus
        />
      </div>

      <div className="refv2-search-controls">
        <div className="refv2-search-filters">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              type="button"
              className={`refv2-filter${filter === f.key ? " is-active" : ""}`}
              onClick={() => setFilter(f.key)}
            >
              {f.hasDot && <span className="refv2-filter-dot" />}
              <span>{f.label}</span>
              <span className="refv2-filter-count">{counts[f.key]}</span>
            </button>
          ))}
        </div>
        {trimmed && (
          <span className="refv2-search-meta">
            {filteredResults.length} result{filteredResults.length === 1 ? "" : "s"} · words &amp; grammar
          </span>
        )}
      </div>

      {trimmed.length === 0 ? (
        <div className="refv2-search-empty">Type to search words, grammar, and the Junior-High Sanseido index.</div>
      ) : filteredResults.length === 0 ? (
        <div className="refv2-search-empty">No matches for &ldquo;{query}&rdquo;.</div>
      ) : (
        <div className="refv2-search-results">
          <div className="refv2-eyebrow-mini">Best matches</div>
          {filteredResults.map((r) => (
            <ResultCard key={resultKey(r)} result={r} query={trimmed} jp={jp} knownSet={knownWordSet} setWordKnown={setWordKnown} />
          ))}
        </div>
      )}
    </div>
  );
}

function resultKey(r: SearchResult) {
  if (r.kind === "word") return `w:${r.entry.id}`;
  if (r.kind === "junior-high") return `jh:${r.word}:${r.url}`;
  return `g:${r.entry.grammarId}`;
}

function ResultCard({
  result,
  query,
  jp,
  knownSet,
  setWordKnown
}: {
  result: SearchResult;
  query: string;
  jp: boolean;
  knownSet: Set<string>;
  setWordKnown: (id: string, known: boolean) => void;
}) {
  if (result.kind === "word") return <WordResultCard word={result.entry} query={query} jp={jp} knownSet={knownSet} setWordKnown={setWordKnown} />;
  if (result.kind === "junior-high") return <JhResultCard entry={result} query={query} jp={jp} />;
  return <GrammarResultCard entry={result.entry} matched={result.matchedExample} query={query} jp={jp} />;
}

function WordResultCard({
  word,
  query,
  jp,
  knownSet,
  setWordKnown
}: {
  word: WordEntry;
  query: string;
  jp: boolean;
  knownSet: Set<string>;
  setWordKnown: (id: string, known: boolean) => void;
}) {
  const route = word.type === "academic" ? `/reference/academic/${word.id}` : `/reference/word/${word.id}`;
  const known = knownSet.has(word.id);
  const isAcademic = word.type === "academic";
  return (
    <article className="refv2-result">
      <div className="refv2-result-head">
        <div className="refv2-result-titlebar">
          <h3 className="refv2-result-title">
            <Link href={route}>{highlightMatch(word.word, query)}</Link>
          </h3>
          <span className={`refv2-pos-pill ${posPillClass(word.pos)}`}>{word.pos}</span>
          {isAcademic ? (
            <span className="refv2-type-pill refv2-type-pill--academic">★ Academic</span>
          ) : (
            <span className="refv2-type-pill refv2-type-pill--vocab">Vocabulary</span>
          )}
        </div>
        <p className="refv2-result-def">{highlightMatchInText(word.definition, query)}</p>
        {jp && word.jp.gloss && (
          <p className="refv2-result-jp" lang="ja">
            {word.jp.gloss}
          </p>
        )}
      </div>
      <button
        type="button"
        className={`refv2-iknow${known ? " is-known" : ""}`}
        onClick={() => setWordKnown(word.id, !known)}
      >
        <span className="refv2-iknow-dot" />
        {known ? "Known" : "I know"}
      </button>
      <div className="refv2-open-in">
        <span className="refv2-open-in-label">Open in</span>
        {word.sources.map((source, idx) => (
          <Link key={`${source.tag}-${idx}`} href={route} className="refv2-source-chip">
            <span className="refv2-course-dot" style={{ background: courseColor(source.course) }} />
            <span>{courseLabel(source.course)}</span>
            <span className="refv2-source-chip-tag">{source.tag}</span>
            <span className="refv2-source-chip-arrow">→</span>
          </Link>
        ))}
      </div>
    </article>
  );
}

function JhResultCard({ entry, query, jp }: { entry: ResultJh; query: string; jp: boolean }) {
  return (
    <article className="refv2-result refv2-result--jh">
      <div className="refv2-result-head">
        <div className="refv2-result-titlebar">
          <h3 className="refv2-result-title">{highlightMatch(entry.word, query)}</h3>
          <span className="refv2-type-pill refv2-type-pill--jh">Junior High</span>
        </div>
        <p className="refv2-result-def refv2-result-def--muted">Sanseido entry · meaning not yet imported. Opens the external Sanseido lookup.</p>
        {jp && (
          <p className="refv2-result-jp refv2-result-jp--muted" lang="ja">
            三省堂で意味を確認
          </p>
        )}
      </div>
      <div className="refv2-open-in">
        <span className="refv2-open-in-label">Open in</span>
        <a className="refv2-source-chip" href={entry.url} target="_blank" rel="noreferrer">
          <span className="refv2-course-dot" style={{ background: courseColor("junior-high") }} />
          <span>Sanseido</span>
          <span className="refv2-source-chip-arrow">↗</span>
        </a>
      </div>
    </article>
  );
}

function GrammarResultCard({
  entry,
  matched,
  query,
  jp
}: {
  entry: GrammarEntry;
  matched?: { en: string; jp: string };
  query: string;
  jp: boolean;
}) {
  const route = `/reference/grammar/${entry.grammarId}`;
  return (
    <Link href={route} className="refv2-result refv2-result--grammar">
      <div className="refv2-result-head">
        <div className="refv2-result-titlebar">
          <h3 className="refv2-result-title">{highlightMatch(entry.title, query)}</h3>
          <span className="refv2-type-pill refv2-type-pill--grammar">Grammar</span>
          <span className="refv2-tag-chip">{entry.tag}</span>
        </div>
        {matched ? (
          <p className="refv2-result-def">
            Matched in an example — &ldquo;{highlightMatchInText(matched.en, query)}&rdquo;
          </p>
        ) : (
          <p className="refv2-result-def">{entry.subtitle}</p>
        )}
        {jp && matched?.jp && (
          <p className="refv2-result-jp" lang="ja">
            {matched.jp}
          </p>
        )}
      </div>
      <span className="refv2-result-arrow">→</span>
      <div className="refv2-open-in">
        <span className="refv2-open-in-label">Open in</span>
        <span className="refv2-source-chip">
          <span className="refv2-course-dot" style={{ background: courseColor("our-world") }} />
          <span>Our World</span>
          <span className="refv2-source-chip-tag">Grammar card</span>
        </span>
      </div>
    </Link>
  );
}

/* ─── helpers ─── */
function scoreWord(entry: WordEntry, q: string): number {
  const w = entry.word.toLowerCase();
  if (w === q) return 100;
  if (w.startsWith(q)) return 85;
  if (w.includes(q)) return 60;
  if (entry.definition.toLowerCase().includes(q)) return 35;
  if (entry.examples.some((ex) => ex.toLowerCase().includes(q))) return 25;
  return 0;
}

function scoreGrammar(entry: GrammarEntry, q: string): { score: number; matchedExample?: { en: string; jp: string } } {
  const title = entry.title.toLowerCase();
  if (title === q) return { score: 95 };
  if (title.startsWith(q)) return { score: 80 };
  if (title.includes(q)) return { score: 65 };
  if (entry.subtitle.toLowerCase().includes(q)) return { score: 40 };
  const sample = entry.chartAndSamples.samples.find((s) => s.en.toLowerCase().includes(q));
  if (sample) return { score: 30, matchedExample: sample };
  return { score: 0 };
}

function courseColor(course: "our-world" | "joyful-work" | "junior-high"): string {
  if (course === "joyful-work") return "var(--ref-course-jw)";
  if (course === "junior-high") return "var(--ref-course-jh)";
  return "var(--ref-course-ow)";
}

function courseLabel(course: "our-world" | "joyful-work" | "junior-high"): string {
  if (course === "joyful-work") return "Joyful Work";
  if (course === "junior-high") return "Junior High";
  return "Our World";
}

/* Highlight a substring within a heading without rendering raw HTML. */
function highlightMatch(text: string, q: string) {
  if (!q) return text;
  const lower = text.toLowerCase();
  const idx = lower.indexOf(q);
  if (idx < 0) return text;
  const before = text.slice(0, idx);
  const hit = text.slice(idx, idx + q.length);
  const after = text.slice(idx + q.length);
  return (
    <>
      {before}
      <mark>{hit}</mark>
      {after}
    </>
  );
}

function highlightMatchInText(text: string, q: string) {
  if (!q) return text;
  return highlightMatch(text, q);
}
