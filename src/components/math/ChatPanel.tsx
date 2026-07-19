"use client";

import { useRef, useState } from "react";
import type { MathBlock } from "../../../content/subjects/math/types";

type ChatTextMessage = { type: "text"; role: "user" | "ai"; text: string };
type QuizItem = { q: string; choices: string[]; answer: number; explain: string; sel: number | null };
type ChatQuizMessage = { type: "quiz"; items: QuizItem[] };
type ChatMessage = ChatTextMessage | ChatQuizMessage;

const SUGGESTIONS = ["この問題、なんでこう解くの？", "やさしく教えて"];

export function ChatPanel({
  chapterTitle,
  sectionTitle,
  blocks
}: {
  chapterTitle: string;
  sectionTitle: string;
  blocks: MathBlock[];
}) {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [busy, setBusy] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  function pushMessage(message: ChatMessage) {
    setMessages((current) => [...current, message]);
    requestAnimationFrame(() => {
      const el = scrollRef.current;
      if (el) el.scrollTop = el.scrollHeight;
    });
  }

  async function ask(text: string) {
    const trimmed = text.trim();
    if (!trimmed || busy) return;

    pushMessage({ type: "text", role: "user", text: trimmed });
    setInput("");
    setBusy(true);

    try {
      const history = messages
        .filter((message): message is ChatTextMessage => message.type === "text")
        .slice(-8)
        .map((message) => ({ role: message.role, text: message.text }));

      const response = await fetch("/api/math-tutor", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          mode: "explain",
          chapterTitle,
          sectionTitle,
          sectionBlocks: blocks,
          history,
          message: trimmed
        })
      });
      if (!response.ok) throw new Error("request failed");
      const data = (await response.json()) as { reply: string };
      pushMessage({ type: "text", role: "ai", text: data.reply });
    } catch {
      pushMessage({ type: "text", role: "ai", text: "ごめんね、うまくつながらなかったみたい。もう一度ためしてね。" });
    }

    setBusy(false);
  }

  async function generateQuiz() {
    if (busy) return;
    setBusy(true);

    const wrongQuestions = messages
      .filter((message): message is ChatQuizMessage => message.type === "quiz")
      .flatMap((message) => message.items.filter((item) => item.sel != null && item.sel !== item.answer).map((item) => item.q))
      .slice(-3);

    try {
      const response = await fetch("/api/math-tutor", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ mode: "quiz", chapterTitle, sectionTitle, sectionBlocks: blocks, wrongQuestions })
      });
      if (!response.ok) throw new Error("request failed");
      const data = (await response.json()) as { items: Array<{ q: string; choices: string[]; answer: number; explain: string }> };
      pushMessage({
        type: "quiz",
        items: data.items.slice(0, 3).map((item) => ({ ...item, sel: null }))
      });
    } catch {
      pushMessage({ type: "text", role: "ai", text: "クイズ作りに失敗しちゃった。もう一度「クイズを作って」を押してね。" });
    }

    setBusy(false);
  }

  function pickChoice(messageIndex: number, questionIndex: number, choiceIndex: number) {
    setMessages((current) =>
      current.map((message, index) => {
        if (index !== messageIndex || message.type !== "quiz") return message;
        return {
          ...message,
          items: message.items.map((item, i) => (i === questionIndex && item.sel == null ? { ...item, sel: choiceIndex } : item))
        };
      })
    );
  }

  return (
    <>
      <button
        className="math-chat-fab"
        onClick={() => setOpen(true)}
        style={{ display: open ? "none" : "flex" }}
        type="button"
      >
        💬 先生にきく
      </button>

      <div className={`math-chat-panel${open ? " math-chat-panel--open" : ""}${expanded ? " math-chat-panel--expanded" : ""}`}>
        <div className="math-chat-header">
          <span className="math-chat-avatar">🦉</span>
          <div className="math-chat-title">
            <div className="math-chat-name">数学の先生（レオくん専用）</div>
            <div className="math-chat-context">
              いま学習中：{chapterTitle} {sectionTitle}
            </div>
          </div>
          <button
            aria-label={expanded ? "チャットを元の大きさに戻す" : "チャットを大きくする（クイズが見やすくなります）"}
            className="math-chat-resize"
            onClick={() => setExpanded((current) => !current)}
            title={expanded ? "元の大きさに戻す" : "大きくする"}
            type="button"
          >
            {expanded ? "⤡ 縮小" : "⤢ 拡大"}
          </button>
          <button aria-label="チャットを閉じる" className="math-chat-close" onClick={() => setOpen(false)} title="閉じる" type="button">
            ✕
          </button>
        </div>

        <div className="math-chat-messages" ref={scrollRef}>
          <div className="math-chat-bubble">
            こんにちは、レオくん！わからない問題があったら、なんでもきいてね。「クイズを作って」と言えば、その場で練習問題も出すよ。
          </div>
          {messages.map((message, messageIndex) =>
            message.type === "text" ? (
              <div className={`math-chat-bubble${message.role === "user" ? " math-chat-bubble--user" : ""}`} key={messageIndex}>
                {message.text}
              </div>
            ) : (
              <QuizCard key={messageIndex} message={message} messageIndex={messageIndex} onPick={pickChoice} onRetry={generateQuiz} />
            )
          )}
          {busy ? <div className="math-chat-busy">考え中…</div> : null}
        </div>

        <div className="math-chat-footer">
          <div className="math-chat-suggestions">
            {SUGGESTIONS.map((suggestion) => (
              <button className="math-chat-suggestion" key={suggestion} onClick={() => ask(suggestion)} type="button">
                {suggestion}
              </button>
            ))}
            <button className="math-chat-quiz-btn" onClick={generateQuiz} type="button">
              ⚡ クイズを作って
            </button>
          </div>
          <div className="math-chat-input-row">
            <input
              className="math-chat-input"
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") ask(input);
              }}
              placeholder="質問をかいてね…"
              value={input}
            />
            <button className="math-chat-send" onClick={() => ask(input)} type="button">
              送信
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

function QuizCard({
  message,
  messageIndex,
  onPick,
  onRetry
}: {
  message: ChatQuizMessage;
  messageIndex: number;
  onPick: (messageIndex: number, questionIndex: number, choiceIndex: number) => void;
  onRetry: () => void;
}) {
  const answered = message.items.filter((item) => item.sel != null).length;
  const score = message.items.filter((item) => item.sel === item.answer).length;
  const showScore = answered === message.items.length;

  return (
    <div className="math-quiz-card">
      <div className="math-quiz-header">⚡ その場クイズ</div>
      <div className="math-quiz-body">
        {message.items.map((item, questionIndex) => {
          const done = item.sel != null;
          return (
            <div key={questionIndex}>
              <div className="math-quiz-question-label">
                問{questionIndex + 1} {item.q}
              </div>
              <div className="math-quiz-choices">
                {item.choices.map((choice, choiceIndex) => {
                  const picked = item.sel === choiceIndex;
                  const isAnswer = item.answer === choiceIndex;
                  const variant = done && isAnswer ? " math-quiz-choice--correct" : picked ? " math-quiz-choice--wrong" : "";
                  return (
                    <button
                      className={`math-quiz-choice${variant}`}
                      disabled={done}
                      key={choiceIndex}
                      onClick={() => onPick(messageIndex, questionIndex, choiceIndex)}
                      type="button"
                    >
                      {done && isAnswer ? "⭕ " : picked ? "❌ " : ""}
                      {choice}
                    </button>
                  );
                })}
              </div>
              {done ? (
                <div className="math-quiz-explain">
                  {item.sel === item.answer ? "⭕ せいかい！" : `❌ ざんねん…正解は「${item.choices[item.answer]}」`} {item.explain}
                </div>
              ) : null}
            </div>
          );
        })}
        {showScore ? (
          <div className="math-quiz-score">
            <span className="math-quiz-score-text">
              {message.items.length}問中 {score}問 せいかい！{score === message.items.length ? "すごい！🎉" : "もう少し！"}
            </span>
            <button className="math-quiz-retry" onClick={onRetry} type="button">
              にたクイズをもう一回
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
