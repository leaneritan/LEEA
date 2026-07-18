"use client";

import { useState } from "react";

const SUITS = [
  { symbol: "♠", color: "black" as const },
  { symbol: "♣", color: "black" as const },
  { symbol: "♥", color: "red" as const },
  { symbol: "♦", color: "red" as const }
];
const MAX_HAND = 6;

type Card = { id: number; rank: number; suit: string; color: "black" | "red" };

function drawCard(): Card {
  const suit = SUITS[Math.floor(Math.random() * SUITS.length)];
  const rank = 1 + Math.floor(Math.random() * 9);
  return { id: Math.random(), rank, suit: suit.symbol, color: suit.color };
}

function cardValue(card: Card) {
  return card.color === "black" ? card.rank : -card.rank;
}

function formatSigned(value: number) {
  if (value === 0) return "0";
  return value > 0 ? `＋${value}` : `－${Math.abs(value)}`;
}

export function CardGameWidget() {
  const [hand, setHand] = useState<Card[]>([]);

  const total = hand.reduce((sum, card) => sum + cardValue(card), 0);
  const full = hand.length >= MAX_HAND;

  return (
    <div className="math-cardgame">
      <div className="math-cardgame-hand">
        {hand.length === 0 ? (
          <p className="math-cardgame-empty">「カードを引く」を押して、カードを引いてみましょう。</p>
        ) : (
          hand.map((card) => (
            <div className={`math-card-token math-card-token--${card.color}`} key={card.id}>
              <span className="math-card-token-rank">{card.rank}</span>
              <span className="math-card-token-suit">{card.suit}</span>
            </div>
          ))
        )}
      </div>

      {hand.length > 0 ? (
        <p className="math-cardgame-eq">
          {hand.map((card, index) => (index === 0 ? formatSigned(cardValue(card)) : ` + (${formatSigned(cardValue(card))})`))}
          {" = "}
          <strong>{formatSigned(total)}</strong>
        </p>
      ) : null}

      <div className="math-cardgame-controls">
        <button type="button" className="math-sieve-btn math-sieve-btn--primary" onClick={() => setHand((h) => [...h, drawCard()])} disabled={full}>
          カードを引く
        </button>
        <button type="button" className="math-sieve-btn" onClick={() => setHand([])}>
          リセット
        </button>
        {full ? <span className="math-cardgame-hint">6枚まで引けます</span> : null}
      </div>
    </div>
  );
}
