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

  return (
    <AppShell active="english" crumbs={["Home", "English", "Our World", `Unit ${lesson.unit}`, lesson.title]}>
      <LessonPage lesson={lesson} />
    </AppShell>
  );
}
