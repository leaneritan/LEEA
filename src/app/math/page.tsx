import { loadMathExtraLessons } from "../../../content/subjects/math/loadSection";
import { CurriculumHome } from "@/components/math/CurriculumHome";

export default function MathPage() {
  const extraLessons = loadMathExtraLessons();
  return <CurriculumHome extraLessons={extraLessons} />;
}
