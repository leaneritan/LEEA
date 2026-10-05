import { AppShell } from "@/components/AppShell";
import { OurWorldUnitPage } from "@/components/OurWorldUnitPage";

export default function UnitFourRoute() {
  return <AppShell active="english" crumbs={["Home", "English", "Our World", "Unit 4"]}><OurWorldUnitPage unit={4} /></AppShell>;
}
