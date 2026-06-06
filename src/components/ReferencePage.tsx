"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { BookOpen, Search } from "lucide-react";
import { grammarPoints, vocabularyItems } from "@/data/reference";

type ReferenceMode = "source" | "vocabulary" | "grammar" | "known" | "unknown";

export function ReferencePage() {
  const [mode, setMode] = useState<ReferenceMode>("source");
  const [query, setQuery] = useState("");

  const filteredWords = useMemo(() => {
    const q = query.toLowerCase().trim();
    return vocabularyItems.filter((item) => {
      if (mode === "grammar" || mode === "source") return false;
      if (mode === "known" && !item.knows) return false;
      if (mode === "unknown" && item.knows) return false;
      if (!q) return true;
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
      return text.includes(q);
    });
  }, [mode, query]);

  const filteredGrammar = useMemo(() => {
    const q = query.toLowerCase().trim();
    return grammarPoints.filter((item) => {
      if (mode !== "grammar") return false;
      if (!q) return true;
      const text = [item.title, item.shortName, item.rule, item.pattern, item.tag, item.japanese?.title, item.japanese?.rule]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return text.includes(q);
    });
  }, [mode, query]);

  return (
    <div className="reference-layout">
      <aside className="reference-side">
        <label className="search-box">
          <Search size={18} />
          <input
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search words, grammar, tags..."
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
        {mode === "source" ? <SourceTree /> : null}
        {mode === "vocabulary" || mode === "known" || mode === "unknown" ? (
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
        {mode === "grammar" ? <GrammarCards grammar={filteredGrammar} /> : null}
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
                  <summary>Unit 8 · That&apos;s Really Interesting!</summary>
                  <TreeLink href="/reference" label="Vocabulary 1" />
                  <TreeLink href="/reference/grammar/ow_l4_u8_g1_who_clauses" label="Grammar 1" />
                  <TreeLink href="/reference" label="Academic" />
                  <TreeLink href="/reference" label="Glossary" />
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
