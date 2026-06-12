export type ComponentTone =
  | "opener"
  | "vocab"
  | "grammar"
  | "reading"
  | "writing"
  | "song"
  | "review";

export type ComponentMeta = {
  emoji: string;
  label: string;
  tone: ComponentTone;
};

// Single source of truth for component emoji/label/tone — used by Leo's homework hero,
// Home's next-up card, and any other surface that wants a per-component visual cue.
// Adding a new component type also requires a `.leo-hero-card-<tone>` block in
// globals.css for the Leo hero, plus a `.next-card-<tone>` block for the Home card.
export function getComponentMeta(component: string): ComponentMeta {
  if (component.includes("opener")) return { emoji: "🎯", label: "Opener", tone: "opener" };
  if (component.includes("vocab")) return { emoji: "📚", label: "Vocabulary", tone: "vocab" };
  if (component.includes("grammar")) return { emoji: "🧩", label: "Grammar", tone: "grammar" };
  if (component.includes("reading")) return { emoji: "📖", label: "Reading", tone: "reading" };
  if (component.includes("writing")) return { emoji: "✏️", label: "Writing", tone: "writing" };
  if (component.includes("song")) return { emoji: "🎵", label: "Song", tone: "song" };
  if (component.includes("review")) return { emoji: "🔁", label: "Review", tone: "review" };
  return { emoji: "🎯", label: "Activity", tone: "opener" };
}
