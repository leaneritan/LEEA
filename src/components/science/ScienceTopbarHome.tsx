import { Home } from "lucide-react";
import Link from "next/link";

/**
 * The way out of 理科 and back to LEEA.
 *
 * Same reason math has one: 理科 is a full-bleed scope with its own topbar
 * rather than an AppShell page, so it does not get the sidebar for free, and
 * without this every link out of it would still land inside 理科.
 */
export function ScienceTopbarHome() {
  return (
    <Link className="sci-topbar-home" href="/" title="LEEA のホームにもどる">
      <Home size={14} strokeWidth={2.6} />
      ホーム
    </Link>
  );
}
