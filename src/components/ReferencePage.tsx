"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { BookOpen, ExternalLink, Search } from "lucide-react";
import { useKnownWordIds } from "@/components/useKnownWordIds";
import {
  grammarPoints,
  unit7AcademicItems,
  unit7GlossaryItems,
  unit7Vocab1Items,
  unit7Vocab2Items,
  unit8AcademicItems,
  unit8GlossaryItems,
  unit8GrammarItems,
  unit8Vocab1Items,
  unit8Vocab2Items,
  vocabularyItems
} from "@/data/reference";
import sanseidoIndex from "../../content/subjects/english/junior-high/sanseido-index.json";

type ReferenceMode = "source" | "vocabulary" | "grammar" | "known" | "unknown";
type ResultTone = "vocabulary" | "academic" | "content" | "related" | "glossary" | "grammar" | "junior-high";
type SearchScope = "all" | "vocabulary" | "grammar" | "glossary" | "academic" | "junior-high";
type SanseidoEntry = {
  w: string;
  u: string;
};
type SearchResultBase = {
  id: string;
  title: string;
  description: string;
  href: string;
  label: string;
  score: number;
  tags: string[];
  tone: ResultTone;
};
type SearchResult =
  | {
      kind: "vocabulary";
    } & SearchResultBase
  | {
      kind: "grammar";
    } & SearchResultBase
  | {
      kind: "junior-high";
    } & SearchResultBase;

export function ReferencePage() {
  const [mode, setMode] = useState<ReferenceMode>("source");
  const [searchScope, setSearchScope] = useState<SearchScope>("all");
  const [query, setQuery] = useState("");
  const { knownWordSet } = useKnownWordIds();
  const searchQuery = query.toLowerCase().trim();
  const sanseidoItems = sanseidoIndex as SanseidoEntry[];

  const referenceCounts = useMemo(
    () => ({
      source: vocabularyItems.length + grammarPoints.length + sanseidoItems.length,
      vocabulary: vocabularyItems.length,
      grammar: grammarPoints.length,
      known: vocabularyItems.filter((item) => isWordKnown(item, knownWordSet)).length,
      unknown: vocabularyItems.filter((item) => !isWordKnown(item, knownWordSet)).length
    }),
    [knownWordSet, sanseidoItems.length]
  );

  const filteredWords = useMemo(() => {
    return vocabularyItems.filter((item) => {
      if (mode === "grammar" || mode === "source") return false;
      const known = isWordKnown(item, knownWordSet);
      if (mode === "known" && !known) return false;
      if (mode === "unknown" && known) return false;
      if (!searchQuery) return true;
      const text = [
        item.word,
        item.normalizedWord,
        item.meaning,
        item.japanese?.word,
        item.japanese?.reading,
        item.japanese?.meaning,
        ...item.tags,
        ...item.sources.map((source) => source.tag)
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return text.includes(searchQuery);
    });
  }, [knownWordSet, mode, searchQuery]);

  const filteredGrammar = useMemo(() => {
    return grammarPoints.filter((item) => {
      if (mode !== "grammar") return false;
      if (!searchQuery) return true;
      const text = [item.title, item.shortName, item.rule, item.pattern, item.tag, item.japanese?.title, item.japanese?.rule]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return text.includes(searchQuery);
    });
  }, [mode, searchQuery]);

  const searchResults = useMemo(() => {
    if (!searchQuery) return [];

    const wordResults = vocabularyItems.flatMap<SearchResult>((item) => {
      const tags = [formatVocabularyKind(item.type), ...item.sources.map((source) => source.tag)];
      const score = getWordSearchScore(item, tags, searchQuery);

      if (score === 0) return [];
      if (!searchScopeAllows(searchScope, item.type)) return [];

      return [
        {
          id: `vocabulary-${item.id}`,
          title: item.word,
          description: item.meaning,
          href: `/reference/vocabulary/${item.id}`,
          kind: "vocabulary",
          label: formatVocabularyKind(item.type),
          score,
          tone: item.type,
          tags
        }
      ];
    });

    const grammarResults = grammarPoints.flatMap<SearchResult>((item) => {
      const tags = ["Grammar", item.tag, item.component.toUpperCase()];
      const score = getGrammarSearchScore(item, tags, searchQuery);

      if (score === 0) return [];
      if (searchScope !== "all" && searchScope !== "grammar") return [];

      return [
        {
          id: `grammar-${item.id}`,
          title: item.title,
          description: item.rule,
          href: `/reference/grammar/${item.id}`,
          kind: "grammar",
          label: "Grammar",
          score,
          tone: "grammar",
          tags
        }
      ];
    });

    const sanseidoResults: SearchResult[] = sanseidoItems
      .filter((item) => item.w.toLowerCase().includes(searchQuery))
      .filter(() => searchScope === "all" || searchScope === "junior-high")
      .slice(0, 60)
      .map((item) => ({
        id: `junior-high-${item.w}-${item.u}`,
        title: item.w,
        description: "Sanseido junior-high dictionary link.",
        href: item.u,
        kind: "junior-high",
        label: "Junior High",
        score: item.w.toLowerCase() === searchQuery ? 95 : 45,
        tone: "junior-high",
        tags: ["Junior High", "Sanseido", "Year 1-3"]
      }));

    return [...wordResults, ...grammarResults, ...sanseidoResults]
      .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title))
      .slice(0, 100);
  }, [sanseidoItems, searchQuery, searchScope]);

  const searchCounts = useMemo(() => {
    return searchResults.reduce(
      (counts, result) => {
        counts[result.tone] += 1;
        return counts;
      },
      {
        vocabulary: 0,
        academic: 0,
        content: 0,
        related: 0,
        glossary: 0,
        grammar: 0,
        "junior-high": 0
      } satisfies Record<ResultTone, number>
    );
  }, [searchResults]);

  return (
    <div className="reference-layout">
      <aside className="reference-side">
        <label className="search-box">
          <Search size={18} />
          <input
            onChange={(event) => setQuery(event.target.value)}
            onInput={(event) => setQuery(event.currentTarget.value)}
            placeholder="Search words, grammar, tags..."
            type="search"
            value={query}
          />
        </label>
        <div className="search-scope-tabs" aria-label="Search categories">
          <SearchScopeButton active={searchScope === "all"} label="All" onClick={() => setSearchScope("all")} />
          <SearchScopeButton active={searchScope === "vocabulary"} label="Our World Vocab" onClick={() => setSearchScope("vocabulary")} />
          <SearchScopeButton active={searchScope === "grammar"} label="Grammar" onClick={() => setSearchScope("grammar")} />
          <SearchScopeButton active={searchScope === "glossary"} label="Glossary" onClick={() => setSearchScope("glossary")} />
          <SearchScopeButton active={searchScope === "academic"} label="Academic" onClick={() => setSearchScope("academic")} />
          <SearchScopeButton active={searchScope === "junior-high"} label="Junior High" onClick={() => setSearchScope("junior-high")} />
        </div>

        <div className="ref-tabs">
          <ModeButton active={mode === "source"} count={referenceCounts.source} label="Source Tree" onClick={() => setMode("source")} />
          <ModeButton active={mode === "vocabulary"} count={referenceCounts.vocabulary} label="Vocabulary" onClick={() => setMode("vocabulary")} />
          <ModeButton active={mode === "grammar"} count={referenceCounts.grammar} label="Grammar" onClick={() => setMode("grammar")} />
          <ModeButton active={mode === "known"} count={referenceCounts.known} label="I Know" onClick={() => setMode("known")} />
          <ModeButton active={mode === "unknown"} count={referenceCounts.unknown} label="I Don't Know" onClick={() => setMode("unknown")} />
        </div>
      </aside>

      <section className="reference-main">
        {searchQuery ? <SearchResults counts={searchCounts} query={query} results={searchResults} scope={searchScope} /> : null}
        {!searchQuery && mode === "source" ? <SourceTree /> : null}
        {!searchQuery && (mode === "vocabulary" || mode === "known" || mode === "unknown") ? (
          <ReferenceCards
            help={
              mode === "known"
                ? "Words Leo marked as known."
                : mode === "unknown"
                  ? "Words Leo is still learning or needs to review."
                  : "All word-like cards: vocabulary, academic, content, related, and glossary."
            }
            title={mode === "known" ? "I Know" : mode === "unknown" ? "I Don't Know" : "Vocabulary"}
            words={filteredWords}
            knownWordSet={knownWordSet}
          />
        ) : null}
        {!searchQuery && mode === "grammar" ? <GrammarCards grammar={filteredGrammar} /> : null}
      </section>
    </div>
  );
}

function ModeButton({ active, count, label, onClick }: { active: boolean; count: number; label: string; onClick: () => void }) {
  return (
    <button className={active ? "active" : ""} onClick={onClick} type="button">
      <span>{label}</span>
      <span className="ref-count">{count.toLocaleString()}</span>
    </button>
  );
}

function SearchScopeButton({ active, label, onClick }: { active: boolean; label: string; onClick: () => void }) {
  return (
    <button className={active ? "active" : ""} onClick={onClick} type="button">
      {label}
    </button>
  );
}

const sourceLevels = [
  { level: 1, caption: "Discover" },
  { level: 2, caption: "Grow" },
  { level: 3, caption: "Build" },
  { level: 4, caption: "Explore" },
  { level: 5, caption: "Stretch" },
  { level: 6, caption: "Master" }
];

function SourceTree() {
  return (
    <div className="reference-panel">
      <div className="panel-head">
        <span className="eyebrow">Default View</span>
        <h1>Reference source tree</h1>
        <p>Our World levels are visible first. Units and components can expand as we add real data.</p>
      </div>

      <div className="source-tree">
        <details open>
          <summary>Our World</summary>
          {sourceLevels.map(({ level, caption }) => (
            <details className={`source-level source-level-${level}`} key={level} open={level === 4}>
              <summary className="level-summary">
                <span>Level {level}</span>
                <small>{caption}</small>
              </summary>
              {level === 4 ? (
                <>
                  <details>
                    <summary>Unit 7 - Good Idea!</summary>
                    <details open>
                      <summary>Vocabulary</summary>
                      <details open>
                        <summary>Vocabulary 1</summary>
                        {unit7Vocab1Items.map((word) => (
                          <TreeLink href={`/reference/vocabulary/${word.id}`} key={word.id} label={`${word.emoji} ${word.word}`} />
                        ))}
                      </details>
                      <details>
                        <summary>Vocabulary 2</summary>
                        {unit7Vocab2Items.map((word) => (
                          <TreeLink href={`/reference/vocabulary/${word.id}`} key={word.id} label={`${word.emoji} ${word.word}`} />
                        ))}
                      </details>
                      <details>
                        <summary>Academic</summary>
                        {unit7AcademicItems.map((word) => (
                          <TreeLink href={`/reference/vocabulary/${word.id}`} key={word.id} label={`${word.emoji} ${word.word}`} />
                        ))}
                      </details>
                      <details>
                        <summary>Glossary</summary>
                        {unit7GlossaryItems.map((word) => (
                          <TreeLink href={`/reference/vocabulary/${word.id}`} key={word.id} label={`${word.emoji} ${word.word}`} />
                        ))}
                      </details>
                    </details>
                    <details>
                      <summary>Grammar</summary>
                      <span className="tree-placeholder">Grammar charts not yet built for Unit 7.</span>
                    </details>
                  </details>
                  <details open>
                    <summary>Unit 8 - That&apos;s Really Interesting!</summary>
                    <details open>
                      <summary>Vocabulary</summary>
                      <details open>
                        <summary>Vocabulary 1</summary>
                        {unit8Vocab1Items.map((word) => (
                          <TreeLink href={`/reference/vocabulary/${word.id}`} key={word.id} label={`${word.emoji} ${word.word}`} />
                        ))}
                      </details>
                      <details>
                        <summary>Vocabulary 2</summary>
                        {unit8Vocab2Items.map((word) => (
                          <TreeLink href={`/reference/vocabulary/${word.id}`} key={word.id} label={`${word.emoji} ${word.word}`} />
                        ))}
                      </details>
                      <details>
                        <summary>Academic</summary>
                        {unit8AcademicItems.map((word) => (
                          <TreeLink href={`/reference/vocabulary/${word.id}`} key={word.id} label={`${word.emoji} ${word.word}`} />
                        ))}
                      </details>
                      <details>
                        <summary>Glossary</summary>
                        {unit8GlossaryItems.map((word) => (
                          <TreeLink href={`/reference/vocabulary/${word.id}`} key={word.id} label={`${word.emoji} ${word.word}`} />
                        ))}
                      </details>
                    </details>
                    <details open>
                      <summary>Grammar</summary>
                      {unit8GrammarItems.map((grammar) => (
                        <TreeLink href={`/reference/grammar/${grammar.id}`} key={grammar.id} label={`${grammar.component}: ${grammar.shortName}`} />
                      ))}
                    </details>
                    <details open>
                      <summary>Search-only support</summary>
                      <TreeLine label="Junior-high dictionary links are searched from the menu above." />
                    </details>
                  </details>
                </>
              ) : (
                <>
                  <details>
                    <summary>Vocabulary</summary>
                    <span className="tree-placeholder">Units will appear here.</span>
                  </details>
                  <details>
                    <summary>Grammar</summary>
                    <span className="tree-placeholder">Grammar points will appear here.</span>
                  </details>
                </>
              )}
            </details>
          ))}
        </details>

        <details open>
          <summary>Joyful Work</summary>
          <TreeLine label="Year 1" />
          <TreeLine label="Year 2" />
          <TreeLine label="Year 3" />
        </details>

        <details open>
          <summary>Junior High</summary>
          <TreeLine label={`${(sanseidoIndex as SanseidoEntry[]).length.toLocaleString()} Sanseido dictionary links - search only`} />
        </details>

        <details open>
          <summary>Training Ground</summary>
          <TreeLine label="Punctuation" />
          <TreeLine label="Nouns" />
          <TreeLine label="Articles" />
          <TreeLine label="Word Order" />
        </details>
      </div>
    </div>
  );
}

function TreeLink({ href, label }: { href: string; label: string }) {
  return (
    <Link className="tree-line" href={href}>
      {label}
    </Link>
  );
}

function TreeLine({ label }: { label: string }) {
  return <span className="tree-line">{label}</span>;
}

function SearchResults({
  counts,
  query,
  results,
  scope
}: {
  counts: Record<ResultTone, number>;
  query: string;
  results: SearchResult[];
  scope: SearchScope;
}) {
  const visibleCounts = (Object.entries(counts) as Array<[ResultTone, number]>).filter(([, count]) => count > 0);

  return (
    <div className="reference-panel">
      <div className="panel-head">
        <span className="eyebrow">Search Everything</span>
        <h1>Results for &ldquo;{query}&rdquo;</h1>
        <p>{scope === "all" ? "Vocabulary, academic cards, glossary, grammar, and junior-high dictionary links are searched together." : `${formatSearchScope(scope)} results only.`}</p>
        {visibleCounts.length ? (
          <div className="result-counts" aria-label="Search result counts by type">
            <span className="result-total">{results.length.toLocaleString()} results</span>
            {visibleCounts.map(([tone, count]) => (
              <span className={`result-count result-count-${tone}`} key={tone}>
                {formatResultTone(tone)} {count.toLocaleString()}
              </span>
            ))}
          </div>
        ) : null}
      </div>

      {results.length ? (
        <div className="search-results">
          {results.map((result) =>
            result.kind === "junior-high" ? (
              <a className={`search-result search-result-${result.tone}`} href={result.href} key={result.id} rel="noreferrer" target="_blank">
                <SearchResultContent result={result} />
                <ExternalLink size={18} />
              </a>
            ) : (
              <Link className={`search-result search-result-${result.tone}`} href={result.href} key={result.id}>
                <SearchResultContent result={result} />
              </Link>
            )
          )}
        </div>
      ) : (
        <div className="empty-results">No matches yet.</div>
      )}
    </div>
  );
}

function SearchResultContent({ result }: { result: SearchResult }) {
  return (
    <div className="search-result-main">
      <div className="mini-top">
        <strong>{result.title}</strong>
        <span className={`result-kind result-kind-${result.tone}`}>{result.label}</span>
      </div>
      <p>{result.description}</p>
      <div className="source-tags">
        {result.tags.map((tag) => (
          <span key={`${result.id}-${tag}`}>{tag}</span>
        ))}
      </div>
    </div>
  );
}

function ReferenceCards({
  title,
  help,
  words,
  knownWordSet
}: {
  title: string;
  help: string;
  words: typeof vocabularyItems;
  knownWordSet: Set<string>;
}) {
  return (
    <div className="reference-panel">
      <div className="panel-head">
        <span className="eyebrow">English Reference</span>
        <h1>{title}</h1>
        <p>{help}</p>
      </div>

      <div className="card-grid">
        {words.map((word) => (
          <Link className={`mini-card mini-card-${word.type}`} href={`/reference/vocabulary/${word.id}`} key={word.id}>
            <div className="mini-top">
              <strong>{word.word}</strong>
              <span>{word.emoji}</span>
            </div>
            <p>{word.meaning}</p>
            <div className="source-tags">
              {word.sources.map((source) => (
                <span key={`${word.id}-${source.tag}`}>{source.tag}</span>
              ))}
              {isWordKnown(word, knownWordSet) ? <span className="known-tag">KNOWN</span> : <span>LEARNING</span>}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function getWordSearchScore(item: (typeof vocabularyItems)[number], displayTags: string[], query: string) {
  return Math.max(
    scoreExactText([item.word, item.normalizedWord], query, 120, 100, 80),
    scoreExactText([item.meaning, item.japanese?.meaning, item.jp_meaning], query, 65, 55, 45),
    scoreExactText([item.example, item.sample, item.japanese?.word, item.japanese?.reading, item.jp_word, item.jp_reading], query, 45, 35, 25),
    scoreExactTag([item.partOfSpeech, item.pos, ...item.sources.map((source) => source.tag), ...displayTags, ...item.tags], query)
  );
}

function getGrammarSearchScore(item: (typeof grammarPoints)[number], displayTags: string[], query: string) {
  return Math.max(
    scoreExactText([item.title, item.shortName], query, 120, 100, 85),
    scoreExactText([item.rule, item.pattern, item.japanese?.title, item.japanese?.rule, item.japanese?.pattern], query, 75, 60, 45),
    scoreExactTag([item.tag, item.component, ...displayTags, ...(item.tags ?? [])], query)
  );
}

function isWordKnown(item: (typeof vocabularyItems)[number], knownWordSet: Set<string>) {
  return knownWordSet.has(item.id) || Boolean(item.knows);
}

function searchScopeAllows(scope: SearchScope, type: ResultTone) {
  if (scope === "all") return true;
  if (scope === "vocabulary") return ["vocabulary", "content", "related"].includes(type);
  return scope === type;
}

function formatSearchScope(scope: SearchScope) {
  if (scope === "all") return "All";
  if (scope === "grammar") return "Grammar";
  if (scope === "junior-high") return "Junior High";
  return formatVocabularyKind(scope);
}

function scoreExactText(fields: Array<string | undefined>, query: string, exactScore: number, startsScore: number, containsScore: number) {
  return fields.reduce((best, field) => {
    const value = normalizeSearchText(field);
    if (!value) return best;
    if (value === query) return Math.max(best, exactScore);
    if (value.startsWith(query)) return Math.max(best, startsScore);
    if (containsSearchTerm(value, query)) return Math.max(best, containsScore);
    return best;
  }, 0);
}

function scoreExactTag(tags: Array<string | undefined>, query: string) {
  return tags.reduce((best, tag) => {
    const value = normalizeSearchText(tag);
    if (!value) return best;
    if (value === query) return Math.max(best, 70);
    if ((query.includes("-") || query.startsWith("ow")) && value.includes(query)) return Math.max(best, 55);
    return best;
  }, 0);
}

function containsSearchTerm(value: string, query: string) {
  if (query.includes(" ")) return value.includes(query);
  return new RegExp(`(^|[^a-z0-9])${escapeRegExp(query)}([^a-z0-9]|$)`, "i").test(value);
}

function normalizeSearchText(value: string | undefined) {
  return value?.toLowerCase().trim() ?? "";
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function formatVocabularyKind(type: string) {
  if (type === "academic") return "Academic";
  if (type === "content") return "Content";
  if (type === "related") return "Related";
  if (type === "glossary") return "Glossary";
  return "Vocabulary";
}

function formatResultTone(tone: ResultTone) {
  if (tone === "junior-high") return "Junior High";
  if (tone === "grammar") return "Grammar";
  return formatVocabularyKind(tone);
}

function GrammarCards({ grammar }: { grammar: typeof grammarPoints }) {
  return (
    <div className="reference-panel">
      <div className="panel-head">
        <span className="eyebrow">English Reference</span>
        <h1>Grammar</h1>
        <p>All grammar points as reusable charts and cards.</p>
      </div>

      <div className="card-grid">
        {grammar.map((item) => (
          <Link className="mini-card grammar" href={`/reference/grammar/${item.id}`} key={item.id}>
            <div className="mini-top">
              <strong>{item.title}</strong>
              <BookOpen size={24} />
            </div>
            <p>{item.rule}</p>
            <div className="source-tags">
              <span>{item.tag}</span>
              <span>{item.component.toUpperCase()}</span>
              {item.lessonStatus === "live" ? <span className="known-tag">LIVE</span> : <span>DRAFT</span>}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
