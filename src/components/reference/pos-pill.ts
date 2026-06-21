import type { PosTag } from "@/data/reference-shapes";

/* Map a normalized PosTag to a CSS class for color-coded POS pills. */
export function posPillClass(pos: PosTag): string {
  switch (pos) {
    case "verb":
      return "refv2-pos-pill--verb";
    case "noun":
      return "refv2-pos-pill--noun";
    case "adjective":
      return "refv2-pos-pill--adj";
    case "adverb":
      return "refv2-pos-pill--adv";
    case "adj/adv":
      return "refv2-pos-pill--adj";
    case "phrase":
    case "other":
    default:
      return "refv2-pos-pill--other";
  }
}
