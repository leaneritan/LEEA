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

// Single source of truth for component cue/label/tone. The cue is intentionally
// text-safe because this repo is edited across Windows terminals and cloud tools.
export function getComponentMeta(component: string): ComponentMeta {
  if (component.includes("opener")) return { emoji: "OP", label: "Opener", tone: "opener" };
  if (component.includes("vocab")) return { emoji: "V", label: "Vocabulary", tone: "vocab" };
  if (component.includes("grammar")) return { emoji: "G", label: "Grammar", tone: "grammar" };
  if (component.includes("extra-reading")) return { emoji: "ER", label: "Extra Reading", tone: "reading" };
  if (component.includes("reading")) return { emoji: "R", label: "Reading", tone: "reading" };
  if (component.includes("writing")) return { emoji: "W", label: "Writing", tone: "writing" };
  if (component.includes("song")) return { emoji: "S", label: "Song", tone: "song" };
  if (component.includes("review")) return { emoji: "OK", label: "Review", tone: "review" };
  return { emoji: "OP", label: "Activity", tone: "opener" };
}
