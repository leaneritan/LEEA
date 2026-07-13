import type { Metadata } from "next";
import { Albert_Sans, Anton, Bricolage_Grotesque, Noto_Sans_JP } from "next/font/google";
import "./globals.css";

const albertSans = Albert_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-albert-sans"
});

const bricolageGrotesque = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-bricolage-grotesque"
});

const notoSansJp = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-noto-sans-jp"
});

// World-tile wordmarks only (e.g. "OUR WORLD" / "TRAINING GROUND" on Leo's dashboard).
const anton = Anton({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-anton"
});

export const metadata: Metadata = {
  title: "LEEA",
  description: "Leo's Elite Education Academy"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${albertSans.variable} ${bricolageGrotesque.variable} ${notoSansJp.variable} ${anton.variable}`}>
      <body>{children}</body>
    </html>
  );
}
