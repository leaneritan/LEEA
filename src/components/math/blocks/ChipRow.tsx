import type { MathChip } from "../../../../content/subjects/math/types";

const CHIP_ICON: Record<MathChip["kind"], string> = {
  simulation: "▶",
  worksheet: "✎",
  flashcard: "⚡",
  "hint-answer": "💡",
  video: "▶",
  "dialogue-sheet": "💬"
};

/** Chip `<span>`s only, no wrapping row — for callers that need to place other
    elements (e.g. the できた toggle) in the same flex row as the chips. */
export function ChipList({ chips }: { chips?: MathChip[] }) {
  if (!chips || chips.length === 0) return null;

  return (
    <>
      {chips.map((chip) => (
        <span className={`math-chip math-chip--${chip.kind}`} key={chip.kind + chip.label}>
          {CHIP_ICON[chip.kind]} {chip.label}
        </span>
      ))}
    </>
  );
}

export function ChipRow({ chips }: { chips?: MathChip[] }) {
  if (!chips || chips.length === 0) return null;

  return (
    <div className="math-chip-row">
      <ChipList chips={chips} />
    </div>
  );
}
