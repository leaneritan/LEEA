/* Counts visual glyphs, not UTF-16 code points or JS string length. A single
   emoji can be made of several code points (variation selectors, ZWJ people
   sequences like "🏃‍♂️"), and naive length/Array.from checks miscount those
   as "multiple emoji" — which made single glyphs like "⚖️" or "🤸‍♀️⬆️"
   (one person-jumping glyph + one arrow) render at the wrong, shrunken size.
   Intl.Segmenter's grapheme granularity groups each of those sequences into
   one cluster, so only genuinely distinct concatenated emoji (e.g. "💪⚡")
   count as multi. */
export function isMultiEmoji(value: string): boolean {
  if (typeof Intl !== "undefined" && "Segmenter" in Intl) {
    const segmenter = new Intl.Segmenter("en", { granularity: "grapheme" });
    let count = 0;
    for (const _ of segmenter.segment(value)) {
      count += 1;
      if (count > 1) return true;
    }
    return false;
  }
  return Array.from(value).length > 1;
}
