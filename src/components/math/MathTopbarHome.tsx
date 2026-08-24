import { Home } from "lucide-react";
import Link from "next/link";

/**
 * The way out of 数学 and back to LEEA.
 *
 * Every other subject renders inside AppShell and gets the sidebar for free.
 * Math does not — it is a full-bleed scope with its own topbar — so until this
 * existed the only links out of it went to /math, which is still inside math.
 * The one link that did point at "/" was the 数学の学び brand on the curriculum
 * home, labelled as the math home while actually leaving it.
 */
export function MathTopbarHome() {
  return (
    <Link className="math-topbar-home" href="/" title="LEEA のホームにもどる">
      <Home size={14} strokeWidth={2.6} />
      ホーム
    </Link>
  );
}
