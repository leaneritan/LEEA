export type ComponentTone =
  | "opener"
  | "vocab"
  | "grammar"
  | "reading"
  | "writing"
  | "song"
  | "review"
  | "activity";

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
  // The band test shares the review tone — it is checkpoint material, not a unit
  // lesson — but keeps its own cue and label so it never reads as another review.
  // The whole-level final sits beside the band tests and shares their tone, but
  // says which one it is — they can cover the same unit.
  if (component.includes("final-test")) return { emoji: "🎓", label: "Final Test", tone: "review" };
  // A unit's own quiz sits beside its lessons rather than in a checkpoint, so it
  // says "Quiz" — three assessments can land on the same unit.
  if (component.includes("quiz")) return { emoji: "📋", label: "Quiz", tone: "review" };
  if (component.includes("test")) return { emoji: "📝", label: "Test", tone: "review" };
  // Mission / Project / Reader apps are all free-play "activity" components —
  // not openers — so they get their own tone/tint instead of borrowing gold.
  if (component.includes("mission") || component.includes("project") || component.includes("reader")) {
    return { emoji: "🎯", label: "Activity", tone: "activity" };
  }
  return { emoji: "🎯", label: "Activity", tone: "activity" };
}
