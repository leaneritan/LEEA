import { loadScienceBlockCounts } from "../../../content/subjects/science/loadSection";
import { loadScienceQrCounts } from "../../../content/subjects/science/qrLibrary";
import { CurriculumHome } from "@/components/science/CurriculumHome";

export default function SciencePage() {
  return <CurriculumHome blockCounts={loadScienceBlockCounts()} qrCounts={loadScienceQrCounts()} />;
}
