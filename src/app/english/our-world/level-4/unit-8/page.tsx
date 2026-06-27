import { AppShell } from "@/components/AppShell";
import { OurWorldUnitPage } from "@/components/OurWorldUnitPage";

export default function UnitEightRoute() {
  return <AppShell active="english" crumbs={["Home", "English", "Our World", "Unit 8"]}><OurWorldUnitPage /></AppShell>;
}
