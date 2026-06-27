import { AppShell } from "@/components/AppShell";
import { LessonsPage } from "@/components/LessonsPage";

export default function EnglishPage() {
  return <AppShell active="english" crumbs={["Home", "English"]}><LessonsPage /></AppShell>;
}
