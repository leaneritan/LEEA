"use client";

import { useEffect, useRef, useState } from "react";
import { isTypedAnswerCorrect } from "../../../../content/subjects/math/note/answer";

/**
 * 特訓ドリル — a timed run through one group of the drill page.
 *
 * Every 特訓ドリル page prints 「全問解くのにかかった時間　分　秒」 across the
 * top, so the clock is the book's own idea and not something added on. What
 * paper cannot do is start it, mark each answer the moment it is given, and
 * bring back only the ones that were missed — which is the entire reason this
 * page is worth putting on a screen rather than leaving as pencil work.
 *
 * The recorded score is the FIRST pass. A re-run of the missed items is for
 * learning them, and deliberately does not overwrite what he scored cold.
 */

type DrillItem = { expression: string; answer: string; accept?: string[]; note?: string; tag?: string };

function formatClock(ms: number) {
  const total = Math.floor(ms / 1000);
  return `${Math.floor(total / 60)}分 ${String(total % 60).padStart(2, "0")}秒`;
}

export function DrillWidget({
  hint,
  backRef,
  items,
  onFinish
}: {
  hint?: string;
  backRef?: string;
  items: DrillItem[];
  onFinish?: (correct: number, total: number) => void;
}) {
  const [phase, setPhase] = useState<"idle" | "running" | "done">("idle");
  /** Indices into `items` for this pass — the full list, or just the misses. */
  const [queue, setQueue] = useState<number[]>([]);
  const [at, setAt] = useState(0);
  const [typed, setTyped] = useState("");
  const [judged, setJudged] = useState<null | boolean>(null);
  /** First-pass result per item. A replay never rewrites this. */
  const [firstPass, setFirstPass] = useState<Record<number, boolean>>({});
  const [replaying, setReplaying] = useState(false);
  /** Correct answers in the pass currently running — a replay reports its own. */
  const [passCorrect, setPassCorrect] = useState(0);
  const [startedAt, setStartedAt] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const reported = useRef(false);

  useEffect(() => {
    if (phase !== "running") return;
    const id = setInterval(() => setElapsed(Date.now() - startedAt), 250);
    return () => clearInterval(id);
  }, [phase, startedAt]);

  useEffect(() => {
    if (phase === "running" && judged === null) inputRef.current?.focus();
  }, [phase, judged, at]);

  // Reporting the first-pass score belongs after the render that finished the
  // run, not inside a state updater — the same setState-in-render trap the
  // question sets hit.
  useEffect(() => {
    if (phase !== "done" || replaying || reported.current) return;
    reported.current = true;
    onFinish?.(Object.values(firstPass).filter(Boolean).length, items.length);
  }, [phase, replaying, firstPass, items.length, onFinish]);

  function start(indices: number[], isReplay: boolean) {
    setQueue(indices);
    setAt(0);
    setTyped("");
    setJudged(null);
    setPassCorrect(0);
    setReplaying(isReplay);
    setStartedAt(Date.now());
    setElapsed(0);
    setPhase("running");
  }

  function submit() {
    if (judged !== null || !typed.trim()) return;
    const index = queue[at];
    const item = items[index];
    const right = isTypedAnswerCorrect(typed, { accept: item.accept ?? [item.answer] });
    setJudged(right);
    if (right) setPassCorrect((n) => n + 1);
    if (!replaying) setFirstPass((current) => (index in current ? current : { ...current, [index]: right }));
  }

  function next() {
    if (at + 1 >= queue.length) {
      setPhase("done");
      return;
    }
    setAt(at + 1);
    setTyped("");
    setJudged(null);
  }

  const missed = items.map((_, i) => i).filter((i) => firstPass[i] === false);
  const correctCount = Object.values(firstPass).filter(Boolean).length;

  if (phase === "idle") {
    return (
      <div className="math-drill math-drill--idle">
        {hint ? <p className="math-drill-hint">{hint}</p> : null}
        <p className="math-drill-count">
          ぜんぶで {items.length}問{backRef ? `　（${backRef}）` : ""}
        </p>
        <button
          className="math-sieve-btn math-sieve-btn--primary"
          onClick={() => start(items.map((_, i) => i), false)}
          type="button"
        >
          スタート（時間をはかるよ）
        </button>
      </div>
    );
  }

  if (phase === "running") {
    const item = items[queue[at]];
    return (
      <div className="math-drill">
        <div className="math-drill-bar">
          <span className="math-drill-progress">
            {at + 1} / {queue.length}問目
          </span>
          {replaying ? <span className="math-drill-replay">まちがえた問題</span> : null}
          <span className="math-drill-clock">⏱ {formatClock(elapsed)}</span>
        </div>

        <div className="math-drill-question">
          {item.tag ? <span className="math-drill-tag">{item.tag}</span> : null}
          <p className="math-drill-expression">{item.expression}</p>
        </div>

        <div className="math-drill-answer">
          <input
            className={`math-drill-input${judged === null ? "" : judged ? " is-correct" : " is-wrong"}`}
            disabled={judged !== null}
            onChange={(event) => setTyped(event.target.value)}
            onKeyDown={(event) => {
              if (event.key !== "Enter") return;
              if (judged === null) submit();
              else next();
            }}
            placeholder="答え"
            ref={inputRef}
            type="text"
            value={typed}
          />
          {judged === null ? (
            <button className="math-sieve-btn math-sieve-btn--primary" disabled={!typed.trim()} onClick={submit} type="button">
              こたえる
            </button>
          ) : (
            <button className="math-sieve-btn math-sieve-btn--primary" onClick={next} type="button">
              {at + 1 >= queue.length ? "おわり" : "つぎへ"}
            </button>
          )}
        </div>

        {judged !== null ? (
          <p className={`math-drill-judge${judged ? " is-correct" : " is-wrong"}`}>
            {judged ? "○ せいかい！" : `× 答えは ${item.answer}`}
            {item.note ? <span className="math-drill-note">{item.note}</span> : null}
          </p>
        ) : null}
      </div>
    );
  }

  return (
    <div className="math-drill math-drill--done">
      <div className="math-drill-result">
        <div>
          <span className="math-drill-result-label">全問解くのにかかった時間</span>
          <strong>{formatClock(elapsed)}</strong>
        </div>
        <div>
          <span className="math-drill-result-label">{replaying ? "この回の正解" : "正解"}</span>
          <strong>{replaying ? `${passCorrect} / ${queue.length}問` : `${correctCount} / ${items.length}問`}</strong>
        </div>
      </div>

      {missed.length > 0 ? (
        <>
          <p className="math-drill-missed-title">まちがえた問題</p>
          <ul className="math-drill-missed">
            {missed.map((i) => (
              <li key={i}>
                <span>{items[i].expression}</span>
                <strong>{items[i].answer}</strong>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p className="math-drill-judge is-correct">ぜんぶ せいかい！</p>
      )}

      <div className="math-plot-controls">
        {missed.length > 0 ? (
          <button className="math-sieve-btn math-sieve-btn--primary" onClick={() => start(missed, true)} type="button">
            まちがえた問題だけ もう一度
          </button>
        ) : null}
        <button className="math-sieve-btn" onClick={() => start(items.map((_, i) => i), true)} type="button">
          はじめから
        </button>
      </div>
    </div>
  );
}
