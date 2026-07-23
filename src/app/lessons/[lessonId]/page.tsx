import { notFound } from "next/navigation";
import { Suspense } from "react";
import { AppShell } from "@/components/AppShell";
import { LessonPage } from "@/components/LessonPage";
import { getCourseLabel, getLessonById } from "@/data/lessons";

export default async function LessonRoute({ params }: { params: Promise<{ lessonId: string }> }) {
  const { lessonId } = await params;
  const lesson = getLessonById(lessonId);

  if (!lesson) {
    notFound();
  }

  const active = lesson.mode === "learner" ? "assignments" : "english";
  const courseLabel = getCourseLabel(lesson.course);
  const crumbs = [
    "Home",
    lesson.mode === "learner" ? "Leo" : "English",
    courseLabel,
    ...(lesson.unit ? [`Unit ${lesson.unit}`] : []),
    lesson.title
  ];

  return (
    <AppShell active={active} crumbs={crumbs}>
      <Suspense fallback={null}>
        <LessonPage lesson={lesson} />
      </Suspense>
    </AppShell>
  );
}
