import { loadScienceQrLibrary } from "../../../../content/subjects/science/qrLibrary";
import { QrLibrary } from "@/components/science/QrLibrary";

export const metadata = { title: "QRコンテンツ｜理科の学び" };

export default function ScienceLibraryPage() {
  return <QrLibrary groups={loadScienceQrLibrary()} />;
}
