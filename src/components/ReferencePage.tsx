"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { BookOpen, ExternalLink, Search } from "lucide-react";
import {
  grammarPoints,
  unit8AcademicItems,
  unit8GlossaryItems,
  unit8GrammarItems,
  unit8Vocab1Items,
  unit8Vocab2Items,
  vocabularyItems
} from "@/data/reference";
import sanseidoIndex from "../../content/subjects/english/junior-high/sanseido-index.json";

type ReferenceMode = "source" | "vocabulary" | "grammar" | "known" | "unknown";
type SanseidoEntry = {
  w: string;
  u: string;
};
type SearchResult =
  | {
      id: string;
      title: string;
      description: string;
      href: string;
      kind: "vocabulary";
      label: string;
      tags: string[];
    }
  | {
      id: string;
      title: string;
      description: string;
      href: string;
      kind: "grammar";
      label: string;
      tags: string[];
    }
  | {
      id: string;
      title: string;
      description: string;
      href: string;
      kind: "junior-high";
      label: string;
      tags: string[];
    };

export function ReferencePage() {
  const [mode, setMode] = useState<ReferenceMode>("source");
  const [query, setQuery] = useState("");
  const searchQuery = query.toLowerCase().trim();

  const filteredWords = useMemo(() => {
    return vocabularyItems.filter((item) => {
      if (mode === "grammar" || mode === "source") return false;
      if (mode === "known" && !item.knows) return false;
      if (mode === "unknown" && item.knows) return false;
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
  }, [mode, searchQuery]);

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

    const wordResults: SearchResult[] = vocabularyItems
      .map((item) => {
        const tags = [formatVocabularyKind(item.type), ...item.sources.map((source) => source.tag)];
        const text = [
          item.word,
          item.normalizedWord,
          item.meaning,
          item.example,
          item.partOfSpeech,
          item.pos,
          item.japanese?.word,
          item.japanese?.reading,
          item.japanese?.meaning,
          item.jp_word,
          item.jp_reading,
          item.jp_meaning,
          ...item.tags,
          ...tags
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        if (!text.includes(searchQuery)) return null;

        return {
          id: `vocabulary-${item.id}`,
          title: item.word,
          description: item.meaning,
          href: `/reference/vocabulary/${item.id}`,
          kind: "vocabulary",
          label: formatVocabularyKind(item.type),
          tags
        };
      })
      .filter((item): item is SearchResult => Boolean(item));

    const grammarResults: SearchResult[] = grammarPoints
      .map((item) => {
        const tags = ["Grammar", item.tag, item.component.toUpperCase()];
        const text = [item.title, item.shortName, item.rule, item.pattern, item.tag, item.component, item.japanese?.title, item.japanese?.rule, ...tags]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        if (!text.includes(searchQuery)) return null;

        return {
          id: `grammar-${item.id}`,
          title: item.title,
          description: item.rule,
          href: `/reference/grammar/${item.id}`,
          kind: "grammar",
          label: "Grammar",
          tags
        };
      })
      .filter((item): item is SearchResult => Boolean(item));

    const sanseidoResults: SearchResult[] = (sanseidoIndex as SanseidoEntry[])
      .filter((item) => item.w.toLowerCase().includes(searchQuery))
      .slice(0, 60)
      .map((item) => ({
        id: `junior-high-${item.w}-${item.u}`,
        title: item.w,
        description: "Sanseido junior-high dictionary link.",
        href: item.u,
        kind: "junior-high",
        label: "Junior High",
        tags: ["Junior High", "Sanseido", "Year 1-3"]
      }));

    return [...wordResults, ...grammarResults, ...sanseidoResults].slice(0, 100);
  }, [searchQuery]);

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

        <div className="ref-tabs">
          <ModeButton active={mode === "source"} label="Source Tree" onClick={() => setMode("source")} />
          <ModeButton active={mode === "vocabulary"} label="Vocabulary" onClick={() => setMode("vocabulary")} />
          <ModeButton active={mode === "grammar"} label="Grammar" onClick={() => setMode("grammar")} />
          <ModeButton active={mode === "known"} label="I Know" onClick={() => setMode("known")} />
          <ModeButton active={mode === "unknown"} label="I Don't Know" onClick={() => setMode("unknown")} />
        </div>
      </aside>

      <section className="reference-main">
        {searchQuery ? <SearchResults query={query} results={searchResults} /> : null}
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
          />
        ) : null}
        {!searchQuery && mode === "grammar" ? <GrammarCards grammar={filteredGrammar} /> : null}
      </section>
    </div>
  );
}

function ModeButton({ active, label, onClick }: { active: boolean; label: string; onClick: () => void }) {
  return (
    <button className={active ? "active" : ""} onClick={onClick} type="button">
      {label}
    </button>
  );
}

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
          {[1, 2, 3, 4, 5, 6].map((level) => (
            <details key={level} open={level === 4}>
              <summary>Level {level}</summary>
              {level === 4 ? (
                <details open>
                  <summary>Unit 8 - That&apos;s Really Interesting!</summary>
                  <details open>
                    <summary>Vocabulary 1</summary>
                    {unit8Vocab1Items.map((word) => (
                      <TreeLink href={`/reference/vocabulary/${word.id}`} key={word.id} label={`${word.emoji} ${word.word}`} />
                    ))}
                  </details>
                  <details open>
                    <summary>Vocabulary 2</summary>
                    {unit8Vocab2Items.map((word) => (
                      <TreeLink href={`/reference/vocabulary/${word.id}`} key={word.id} label={`${word.emoji} ${word.word}`} />
                    ))}
                  </details>
                  <details open>
                    <summary>Grammar</summary>
                    {unit8GrammarItems.map((grammar) => (
                      <TreeLink href={`/reference/grammar/${grammar.id}`} key={grammar.id} label={`${grammar.component}: ${grammar.shortName}`} />
                    ))}
                  </details>
                  <details open>
                    <summary>Academic</summary>
                    {unit8AcademicItems.map((word) => (
                      <TreeLink href={`/reference/vocabulary/${word.id}`} key={word.id} label={`${word.emoji} ${word.word}`} />
                    ))}
                  </details>
                  <details open>
                    <summary>Glossary</summary>
                    {unit8GlossaryItems.map((word) => (
                      <TreeLink href={`/reference/vocabulary/${word.id}`} key={word.id} label={`${word.emoji} ${word.word}`} />
                    ))}
                  </details>
                </details>
              ) : (
                <span className="tree-placeholder">Units will appear here.</span>
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

function SearchResults({ query, results }: { query: string; results: SearchResult[] }) {
  return (
    <div className="reference-panel">
      <div className="panel-head">
        <span className="eyebrow">Search Everything</span>
        <h1>Results for &ldquo;{query}&rdquo;</h1>
        <p>Vocabulary, academic cards, content words, grammar, and junior-high dictionary links are searched together.</p>
      </div>

      {results.length ? (
        <div className="search-results">
          {results.map((result) =>
            result.kind === "junior-high" ? (
              <a className="search-result" href={result.href} key={result.id} rel="noreferrer" target="_blank">
                <SearchResultContent result={result} />
                <ExternalLink size={18} />
              </a>
            ) : (
              <Link className="search-result" href={result.href} key={result.id}>
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
        <span className={`result-kind result-kind-${result.kind}`}>{result.label}</span>
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

function ReferenceCards({ title, help, words }: { title: string; help: string; words: typeof vocabularyItems }) {
  return (
    <div className="reference-panel">
      <div className="panel-head">
        <span className="eyebrow">English Reference</span>
        <h1>{title}</h1>
        <p>{help}</p>
      </div>

      <div className="card-grid">
        {words.map((word) => (
          <Link className="mini-card" href={`/reference/vocabulary/${word.id}`} key={word.id}>
            <div className="mini-top">
              <strong>{word.word}</strong>
              <span>{word.emoji}</span>
            </div>
            <p>{word.meaning}</p>
            <div className="source-tags">
              {word.sources.map((source) => (
                <span key={`${word.id}-${source.tag}`}>{source.tag}</span>
              ))}
              {word.knows ? <span className="known-tag">KNOWN</span> : <span>LEARNING</span>}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function formatVocabularyKind(type: string) {
  if (type === "academic") return "Academic";
  if (type === "content") return "Content";
  if (type === "related") return "Related";
  if (type === "glossary") return "Glossary";
  return "Vocabulary";
}

function formatResultKind(kind: SearchResult["kind"]) {
  if (kind === "junior-high") return "Junior High";
  if (kind === "grammar") return "Grammar";
  return "Vocabulary";
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
