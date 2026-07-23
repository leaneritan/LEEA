import { notFound } from "next/navigation";
import { getMathFreeLessonById } from "../../../../../content/subjects/math/freeLessons";
import { FreeLessonView } from "@/components/math/FreeLessonView";

export default async function MathFreeLessonPage({ params }: { params: Promise<{ lessonId: string }> }) {
  const { lessonId } = await params;
  const lesson = getMathFreeLessonById(lessonId);

  if (!lesson) {
    notFound();
  }

  return <FreeLessonView lesson={lesson} />;
}
