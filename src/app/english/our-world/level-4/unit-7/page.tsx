import { AppShell } from "@/components/AppShell";
import { OurWorldUnitPage } from "@/components/OurWorldUnitPage";

export default function UnitSevenRoute() {
  return <AppShell active="english" crumbs={["Home", "English", "Our World", "Unit 7"]}><OurWorldUnitPage unit={7} /></AppShell>;
}
