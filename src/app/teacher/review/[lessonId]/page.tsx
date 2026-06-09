import { notFound } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { TeacherReviewPage } from "@/components/TeacherReviewPage";
import { getLessonById } from "@/data/lessons";

export default async function TeacherReviewRoute({ params }: { params: Promise<{ lessonId: string }> }) {
  const { lessonId } = await params;
  const lesson = getLessonById(lessonId);

  if (!lesson || lesson.mode !== "learner") {
    notFound();
  }

  return (
    <AppShell active="teacher" crumbs={["Home", "Neritan", "Review", lesson.title]}>
      <TeacherReviewPage lesson={lesson} />
    </AppShell>
  );
}
