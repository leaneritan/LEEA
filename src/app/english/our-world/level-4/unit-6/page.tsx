import { AppShell } from "@/components/AppShell";
import { OurWorldUnitPage } from "@/components/OurWorldUnitPage";

export default function UnitSixRoute() {
  return <AppShell active="english" crumbs={["Home", "English", "Our World", "Unit 6"]}><OurWorldUnitPage unit={6} /></AppShell>;
}
