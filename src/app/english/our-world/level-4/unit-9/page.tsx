import { AppShell } from "@/components/AppShell";
import { OurWorldUnitPage } from "@/components/OurWorldUnitPage";

export default function UnitNineRoute() {
  return <AppShell active="english" crumbs={["Home", "English", "Our World", "Unit 9"]}><OurWorldUnitPage unit={9} /></AppShell>;
}
