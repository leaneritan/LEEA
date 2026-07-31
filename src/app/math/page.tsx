import { loadMathExtraLessonCounts } from "../../../content/subjects/math/loadSection";
import { CurriculumHome } from "@/components/math/CurriculumHome";

export default function MathPage() {
  const extraLessonCounts = loadMathExtraLessonCounts();
  return <CurriculumHome extraLessonCounts={extraLessonCounts} />;
}
