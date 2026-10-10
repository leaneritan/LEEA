import { AppShell } from "@/components/AppShell";
import { OurWorldUnitPage } from "@/components/OurWorldUnitPage";

export default function UnitThreeRoute() {
  return <AppShell active="english" crumbs={["Home", "English", "Our World", "Unit 3"]}><OurWorldUnitPage unit={3} /></AppShell>;
}
