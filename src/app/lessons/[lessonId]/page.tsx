import { notFound } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { LessonPage } from "@/components/LessonPage";
import { getLessonById } from "@/data/lessons";

export default async function LessonRoute({ params }: { params: Promise<{ lessonId: string }> }) {
  const { lessonId } = await params;
  const lesson = getLessonById(lessonId);

  if (!lesson) {
    notFound();
  }

  const active = lesson.mode === "learner" ? "assignments" : "english";
  const crumbs = lesson.mode === "learner" ? ["Home", "Leo", "Our World", `Unit ${lesson.unit}`, lesson.title] : ["Home", "English", "Our World", `Unit ${lesson.unit}`, lesson.title];

  return (
    <AppShell active={active} crumbs={crumbs}>
      <LessonPage lesson={lesson} />
    </AppShell>
  );
}
