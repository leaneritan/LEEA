"use client";

import Link from "next/link";
import { Dumbbell, Presentation } from "lucide-react";
import { useMemo, useState } from "react";
import { useKnownWordIds } from "@/components/useKnownWordIds";
import { irregularVerbs } from "@/data/irregularVerbs";

export function IrregularVerbsList() {
  const { knownWordSet } = useKnownWordIds();
  const [query, setQuery] = useState("");

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return irregularVerbs;
    return irregularVerbs.filter(
      (verb) =>
        verb.infinitive.toLowerCase().includes(q) ||
        verb.past.toLowerCase().includes(q) ||
        verb.pastParticiple.toLowerCase().includes(q)
    );
  }, [query]);

  const knownCount = irregularVerbs.filter((verb) => knownWordSet.has(verb.card.id)).length;

  return (
    <section className="irrv">
      <header className="irrv-head">
        <div>
          <span>Reference · Our World 4</span>
          <h1>Irregular Verbs</h1>
          <p>
            The {irregularVerbs.length} irregular verbs from the back of the Level 4 book. Tap any verb to see its own
            card. {knownCount} of {irregularVerbs.length} marked known.
          </p>
        </div>
        <div className="irrv-head-actions">
          <Link className="primary-button irrv-test-link" href="/reference/irregular-verbs/test">
            <Dumbbell size={16} strokeWidth={2.6} />
            Take the test
          </Link>
          {/* The teaching deck behind this list — what the three forms are for,
              and how to pick between them. Training Ground, not a unit lesson. */}
          <Link className="ghost-button irrv-test-link" href="/lessons/tg-verb-time-machine">
            <Presentation size={16} strokeWidth={2.6} />
            The Verb Time Machine
          </Link>
        </div>
      </header>

      <input
        className="irrv-search"
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search a verb…"
        type="search"
        value={query}
      />

      <div className="irrv-table-wrap">
        <table className="irrv-table">
          <thead>
            <tr>
              <th>Infinitive</th>
              <th>Simple past</th>
              <th>Past participle</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((verb) => {
              const known = knownWordSet.has(verb.card.id);
              return (
                <tr key={verb.id} className={known ? "is-known" : ""}>
                  <td>
                    <Link className="irrv-word" href={verb.href}>
                      <span className="irrv-emoji" aria-hidden>{verb.card.emoji}</span>
                      {verb.infinitive}
                    </Link>
                  </td>
                  <td>{verb.past}</td>
                  <td>{verb.pastParticiple}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {rows.length === 0 ? <p className="irrv-empty">No verbs match &ldquo;{query}&rdquo;.</p> : null}
      </div>
    </section>
  );
}
