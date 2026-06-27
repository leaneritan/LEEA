import { AppShell } from "@/components/AppShell";
import { TrainingGroundPage } from "@/components/TrainingGroundPage";

export default function TrainingGroundRoute() {
  return <AppShell active="english" crumbs={["Home", "English", "Training Ground"]}><TrainingGroundPage /></AppShell>;
}
