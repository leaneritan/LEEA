"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Search as SearchIcon } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useJapanesePreference } from "@/components/AppShell";
import { useKnownWordIds } from "@/components/useKnownWordIds";
import type { GrammarEntry, WordEntry } from "@/data/reference-shapes";
import sanseidoIndex from "../../../content/subjects/english/junior-high/sanseido-index.json";
import { allGrammar, allWords } from "./ref-data";
import { posPillClass } from "./pos-pill";

type SanseidoEntry = { w: string; u: string };
type ResultFilter = "all" | "vocabulary" | "academic" | "junior-high" | "grammar";

type ResultWord = { kind: "word"; entry: WordEntry; score: number };
type ResultJh = { kind: "junior-high"; word: string; url: string; score: number };
type ResultGrammar = { kind: "grammar"; entry: GrammarEntry; score: number; matchedExample?: { en: string; jp: string } };
type SearchResult = ResultWord | ResultJh | ResultGrammar;

const FILTERS: Array<{ key: ResultFilter; label: string; dotColor?: string }> = [
  { key: "all", label: "All" },
  { key: "vocabulary", label: "Vocabulary" },
  { key: "academic", label: "Academic" },
  { key: "junior-high", label: "Junior High" },
  { key: "grammar", label: "Grammar", dotColor: "var(--ref-accent)" }
];

const SANSEIDO_LIMIT_PER_QUERY = 20;

const sanseidoByWord = new Map(
  (sanseidoIndex as SanseidoEntry[]).map((entry) => [entry.w.toLowerCase(), entry.u])
);

export function ReferenceSearch() {
  const sanseidoItems = sanseidoIndex as SanseidoEntry[];
  const searchParams = useSearchParams();
  const jp = useJapanesePreference();
  const { knownWordSet, setWordKnown } = useKnownWordIds();
  const [query, setQuery] = useState(() => searchParams.get("q") ?? "");
  const [filter, setFilter] = useState<ResultFilter>("all");
  const inputRef = useRef<HTMLInputElement | null>(null);

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
    if (!trimmed) return [];
    const out: SearchResult[] = [];

    for (const entry of allWords) {
      const score = scoreWord(entry, trimmed);
      if (score > 0) out.push({ kind: "word", entry, score });
    }

    for (const entry of allGrammar) {
      const { score, matchedExample } = scoreGrammar(entry, trimmed);
      if (score > 0) out.push({ kind: "grammar", entry, score, matchedExample });
    }

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
    const totals: Record<ResultFilter, number> = { all: results.length, vocabulary: 0, academic: 0, "junior-high": 0, grammar: 0 };
    for (const result of results) {
      if (result.kind === "word") {
        if (result.entry.type === "academic") totals.academic++;
        else totals.vocabulary++;
      } else if (result.kind === "junior-high") {
        totals["junior-high"]++;
      } else {
        totals.grammar++;
      }
    }
    return totals;
  }, [results]);

  const filteredResults = useMemo(() => {
    if (filter === "all") return results;
    return results.filter((result) => {
      if (filter === "vocabulary") return result.kind === "word" && result.entry.type !== "academic";
      if (filter === "academic") return result.kind === "word" && result.entry.type === "academic";
      if (filter === "junior-high") return result.kind === "junior-high";
      return result.kind === "grammar";
    });
  }, [filter, results]);

  const bestMatches = filteredResults.filter((result) => result.score >= 60);
  const alsoFound = filteredResults.filter((result) => result.score < 60);

  return (
    <div className="refv2-shell ref-search-design">
      <div className="refv2-search-field ref-search-design-field">
        <SearchIcon size={20} className="refv2-search-icon" />
        <input
          ref={inputRef}
          type="text"
          placeholder="Search words & grammar"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="refv2-search-input"
          autoFocus
        />
      </div>

      <div className="refv2-search-controls ref-search-design-controls">
        <div className="refv2-search-filters">
          {FILTERS.map((item) => (
            <button
              key={item.key}
              type="button"
              className={`refv2-filter${filter === item.key ? " is-active" : ""}`}
              onClick={() => setFilter(item.key)}
            >
              {item.dotColor ? <span className="refv2-filter-dot" style={{ background: item.dotColor }} /> : null}
              <span>{item.label}</span>
              <span className="refv2-filter-count">{counts[item.key]}</span>
            </button>
          ))}
        </div>
        {trimmed ? (
          <span className="refv2-search-meta">
            {filteredResults.length} result{filteredResults.length === 1 ? "" : "s"} · words &amp; grammar
          </span>
        ) : null}
      </div>

      {!trimmed ? (
        <div className="refv2-search-empty">Type to search LEEA vocabulary, academic words, grammar, and Sanseido junior-high links.</div>
      ) : filteredResults.length === 0 ? (
        <div className="refv2-search-empty">No matches for “{query}”.</div>
      ) : (
        <div className="ref-search-sections">
          <ResultSection
            title="Best matches"
            results={bestMatches.length ? bestMatches : filteredResults}
            query={trimmed}
            jp={jp}
            knownSet={knownWordSet}
            setWordKnown={setWordKnown}
          />
          {alsoFound.length ? (
            <ResultSection
              title="Also found"
              subtitle="matched in meanings & examples"
              results={alsoFound}
              query={trimmed}
              jp={jp}
              knownSet={knownWordSet}
              setWordKnown={setWordKnown}
            />
          ) : null}
        </div>
      )}
    </div>
  );
}

function ResultSection({
  title,
  subtitle,
  results,
  query,
  jp,
  knownSet,
  setWordKnown
}: {
  title: string;
  subtitle?: string;
  results: SearchResult[];
  query: string;
  jp: boolean;
  knownSet: Set<string>;
  setWordKnown: (id: string, known: boolean) => void;
}) {
  return (
    <section className="ref-search-section">
      <div className="refv2-eyebrow-mini">{title}{subtitle ? <span> · {subtitle}</span> : null}</div>
      <div className="refv2-search-results">
        {results.map((result) => (
          <ResultCard key={resultKey(result)} result={result} query={query} jp={jp} knownSet={knownSet} setWordKnown={setWordKnown} />
        ))}
      </div>
    </section>
  );
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
  const sanseidoUrl = sanseidoByWord.get(word.word.toLowerCase());

  return (
    <article className="refv2-result ref-search-card">
      <div className="refv2-result-head">
        <div className="refv2-result-titlebar">
          <h3 className="refv2-result-title"><Link href={route}>{highlightMatch(word.word, query)}</Link></h3>
          <span className={`refv2-pos-pill ${posPillClass(word.pos)}`}>{word.pos}</span>
          <span className={`refv2-type-pill refv2-type-pill--${word.type === "academic" ? "academic" : word.type}`}>
            {word.type === "academic" ? "★ Academic" : typeLabel(word.type)}
          </span>
        </div>
        <p className="refv2-result-def">{highlightMatchInText(word.definition, query)}</p>
        {jp && word.jp.gloss ? <p className="refv2-result-jp" lang="ja">{word.jp.gloss}</p> : null}
      </div>

      <button type="button" className={`refv2-iknow${known ? " is-known" : ""}`} onClick={() => setWordKnown(word.id, !known)}>
        <span className="refv2-iknow-dot" />
        {known ? "Known" : "I know"}
      </button>

      <div className="refv2-open-in">
        <span className="refv2-open-in-label">Open in</span>
        {word.sources.map((source, index) => {
          const liveLessonHref = source.lessonId && source.lessonStatus === "live" ? `/lessons/${source.lessonId}` : null;
          return (
            <Link key={`${source.tag}-${index}`} href={liveLessonHref ?? route} className="refv2-source-chip">
              <span className="refv2-course-dot" style={{ background: courseColor(source.course) }} />
              <span>{courseLabel(source.course)}</span>
              <span className="refv2-source-chip-tag">{source.tag}</span>
              <span className="refv2-source-chip-arrow">{liveLessonHref ? "↗" : "→"}</span>
            </Link>
          );
        })}
        {sanseidoUrl ? (
          <a className="refv2-source-chip" href={sanseidoUrl} target="_blank" rel="noreferrer">
            <span className="refv2-course-dot" style={{ background: courseColor("junior-high") }} />
            <span>Sanseido</span>
            <span className="refv2-source-chip-tag">dictionary</span>
            <span className="refv2-source-chip-arrow">↗</span>
          </a>
        ) : null}
      </div>
    </article>
  );
}

function JhResultCard({ entry, query, jp }: { entry: ResultJh; query: string; jp: boolean }) {
  return (
    <article className="refv2-result refv2-result--jh ref-search-card">
      <div className="refv2-result-head">
        <div className="refv2-result-titlebar">
          <h3 className="refv2-result-title">{highlightMatch(entry.word, query)}</h3>
          <span className="refv2-type-pill refv2-type-pill--jh">Junior High</span>
        </div>
        <p className="refv2-result-def refv2-result-def--muted">A Sanseido junior-high dictionary link. Search-only; no LEEA card yet.</p>
        {jp ? <p className="refv2-result-jp refv2-result-jp--muted" lang="ja">三省堂の外部辞書で意味を確認します。</p> : null}
      </div>
      <div className="refv2-open-in">
        <span className="refv2-open-in-label">Open in</span>
        <a className="refv2-source-chip" href={entry.url} target="_blank" rel="noreferrer">
          <span className="refv2-course-dot" style={{ background: courseColor("junior-high") }} />
          <span>Sanseido</span>
          <span className="refv2-source-chip-tag">search-only</span>
          <span className="refv2-source-chip-arrow">↗</span>
        </a>
      </div>
    </article>
  );
}

function GrammarResultCard({ entry, matched, query, jp }: { entry: GrammarEntry; matched?: { en: string; jp: string }; query: string; jp: boolean }) {
  const route = `/reference/grammar/${entry.grammarId}`;
  return (
    <Link href={route} className="refv2-result refv2-result--grammar ref-search-card">
      <div className="refv2-result-head">
        <div className="refv2-result-titlebar">
          <h3 className="refv2-result-title">{highlightMatch(entry.title, query)}</h3>
          <span className="refv2-type-pill refv2-type-pill--grammar">Grammar</span>
          <span className="refv2-tag-chip">{entry.tag}</span>
        </div>
        {matched ? (
          <p className="refv2-result-def">Matched in an example — “{highlightMatchInText(matched.en, query)}”</p>
        ) : (
          <p className="refv2-result-def">{entry.subtitle}</p>
        )}
        {jp && matched?.jp ? <p className="refv2-result-jp" lang="ja">{matched.jp}</p> : null}
      </div>
      <span className="refv2-result-arrow">→</span>
      <div className="refv2-open-in">
        <span className="refv2-open-in-label">Open in</span>
        <span className="refv2-source-chip">
          <span className="refv2-course-dot" style={{ background: courseColor(entry.course === "joyful-work" ? "joyful-work" : "our-world") }} />
          <span>{courseLabel(entry.course === "joyful-work" ? "joyful-work" : "our-world")}</span>
          <span className="refv2-source-chip-tag">Grammar card</span>
        </span>
      </div>
    </Link>
  );
}

function resultKey(result: SearchResult) {
  if (result.kind === "word") return `w:${result.entry.id}`;
  if (result.kind === "junior-high") return `jh:${result.word}:${result.url}`;
  return `g:${result.entry.grammarId}`;
}

function scoreWord(entry: WordEntry, q: string): number {
  const word = entry.word.toLowerCase();
  if (word === q) return 100;
  if (word.startsWith(q)) return 85;
  if (word.includes(q)) return 60;
  if (entry.definition.toLowerCase().includes(q)) return 35;
  if (entry.examples.some((example) => example.toLowerCase().includes(q))) return 25;
  return 0;
}

function scoreGrammar(entry: GrammarEntry, q: string): { score: number; matchedExample?: { en: string; jp: string } } {
  const title = entry.title.toLowerCase();
  if (title === q) return { score: 95 };
  if (title.startsWith(q)) return { score: 80 };
  if (title.includes(q)) return { score: 65 };
  if (entry.subtitle.toLowerCase().includes(q)) return { score: 40 };
  const sample = entry.chartAndSamples.samples.find((item) => item.en.toLowerCase().includes(q));
  if (sample) return { score: 30, matchedExample: sample };
  return { score: 0 };
}

function courseColor(course: "our-world" | "joyful-work" | "junior-high") {
  if (course === "joyful-work") return "var(--ref-course-jw)";
  if (course === "junior-high") return "var(--ref-course-jh)";
  return "var(--ref-course-ow)";
}

function courseLabel(course: "our-world" | "joyful-work" | "junior-high") {
  if (course === "joyful-work") return "Joyful Work";
  if (course === "junior-high") return "Junior High";
  return "Our World";
}

function typeLabel(type: WordEntry["type"]) {
  if (type === "content") return "Content";
  if (type === "related") return "Related";
  if (type === "glossary") return "Glossary";
  if (type === "academic") return "Academic";
  return "Vocabulary";
}

function highlightMatch(text: string, q: string) {
  if (!q) return text;
  const lower = text.toLowerCase();
  const index = lower.indexOf(q);
  if (index < 0) return text;
  return (
    <>
      {text.slice(0, index)}
      <mark>{text.slice(index, index + q.length)}</mark>
      {text.slice(index + q.length)}
    </>
  );
}

function highlightMatchInText(text: string, q: string) {
  return highlightMatch(text, q);
}
