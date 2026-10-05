import { AppShell } from "@/components/AppShell";
import { OurWorldUnitPage } from "@/components/OurWorldUnitPage";

export default function UnitFiveRoute() {
  return <AppShell active="english" crumbs={["Home", "English", "Our World", "Unit 5"]}><OurWorldUnitPage unit={5} /></AppShell>;
}
