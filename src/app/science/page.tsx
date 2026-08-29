import { loadScienceBlockCounts } from "../../../content/subjects/science/loadSection";
import { CurriculumHome } from "@/components/science/CurriculumHome";

export default function SciencePage() {
  return <CurriculumHome blockCounts={loadScienceBlockCounts()} />;
}
