import { notFound } from "next/navigation";
import { getSpecialLessonById } from "../../../../../content/subjects/math/specialLessons";
import { FreeLessonView } from "@/components/math/FreeLessonView";

export default async function MathFreeLessonPage({ params }: { params: Promise<{ lessonId: string }> }) {
  const { lessonId } = await params;
  const lesson = getSpecialLessonById(lessonId);

  if (!lesson) {
    notFound();
  }

  return <FreeLessonView lesson={lesson} />;
}
