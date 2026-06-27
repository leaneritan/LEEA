import { AppShell } from "@/components/AppShell";
import { OurWorldPage } from "@/components/OurWorldPage";

export default function OurWorldRoute() {
  return <AppShell active="english" crumbs={["Home", "English", "Our World"]}><OurWorldPage /></AppShell>;
}
