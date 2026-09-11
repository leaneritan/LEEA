import { loadMathNoteSetIds } from "../../../../content/subjects/math/note/loadSection";
import { NoteHome } from "@/components/math/note/NoteHome";

export default function MathNotePage() {
  return <NoteHome setIds={loadMathNoteSetIds()} />;
}
