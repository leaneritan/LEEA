"use client";

import { useState } from "react";

const MAGNITUDES = [2, 3, 4, 2, 3];

type Tile = { id: number; magnitude: number; sign: 1 | -1 };

function formatSigned(value: number) {
  return value >= 0 ? `＋${value}` : `－${Math.abs(value)}`;
}

function makeTiles(count: number): Tile[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    magnitude: MAGNITUDES[i % MAGNITUDES.length],
    sign: i % 2 === 0 ? 1 : -1
  }));
}

export function SignedProductWidget({ tileCount = 2 }: { tileCount?: number }) {
  const [tiles, setTiles] = useState<Tile[]>(() => makeTiles(tileCount));

  function toggleSign(id: number) {
    setTiles((current) => current.map((tile) => (tile.id === id ? { ...tile, sign: (tile.sign * -1) as 1 | -1 } : tile)));
  }

  function addTile() {
    setTiles((current) => {
      if (current.length >= 5) return current;
      const nextId = current.length;
      return [...current, { id: nextId, magnitude: MAGNITUDES[nextId % MAGNITUDES.length], sign: 1 }];
    });
  }

  function removeTile() {
    setTiles((current) => (current.length <= 2 ? current : current.slice(0, -1)));
  }

  const negativeCount = tiles.filter((tile) => tile.sign === -1).length;
  const isEven = negativeCount % 2 === 0;
  const magnitudeProduct = tiles.reduce((acc, tile) => acc * tile.magnitude, 1);
  const productSign = isEven ? 1 : -1;
  const product = magnitudeProduct * productSign;

  return (
    <div className="math-signprod">
      <div className="math-signprod-tiles">
        {tiles.map((tile) => (
          <button
            type="button"
            key={tile.id}
            className={`math-signprod-tile${tile.sign === 1 ? " math-signprod-tile--pos" : " math-signprod-tile--neg"}`}
            onClick={() => toggleSign(tile.id)}
          >
            {formatSigned(tile.sign * tile.magnitude)}
          </button>
        ))}
      </div>
      <div className="math-signprod-controls">
        <button type="button" className="math-sieve-btn" onClick={removeTile} disabled={tiles.length <= 2}>
          数を減らす
        </button>
        <button type="button" className="math-sieve-btn" onClick={addTile} disabled={tiles.length >= 5}>
          数を増やす
        </button>
      </div>
      <p className="math-signprod-eq">
        {tiles.map((tile, index) => (index === 0 ? formatSigned(tile.sign * tile.magnitude) : ` × (${formatSigned(tile.sign * tile.magnitude)})`))}
        {" = "}
        <strong>{formatSigned(product)}</strong>
      </p>
      <p className="math-signprod-rule">
        負の数は<strong>{negativeCount}個</strong>（{isEven ? "偶数" : "奇数"}） → 積の符号は<strong>{productSign === 1 ? "正" : "負"}</strong>
      </p>
    </div>
  );
}
