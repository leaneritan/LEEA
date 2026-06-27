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

// Single source of truth for component cue/label/tone across Home, Leo, teacher, and course maps.
export function getComponentMeta(component: string): ComponentMeta {
  if (component.includes("opener")) return { emoji: "💡", label: "Opener", tone: "opener" };
  if (component.includes("vocab")) return { emoji: "🔤", label: "Vocabulary", tone: "vocab" };
  if (component.includes("grammar")) return { emoji: "🧩", label: "Grammar", tone: "grammar" };
  if (component.includes("extra-reading")) return { emoji: "📖", label: "Extra Reading", tone: "reading" };
  if (component.includes("reading")) return { emoji: "📖", label: "Reading", tone: "reading" };
  if (component.includes("writing")) return { emoji: "✍️", label: "Writing", tone: "writing" };
  if (component.includes("song")) return { emoji: "🎵", label: "Song", tone: "song" };
  if (component.includes("review")) return { emoji: "🏁", label: "Review", tone: "review" };
  return { emoji: "💡", label: "Activity", tone: "opener" };
}
