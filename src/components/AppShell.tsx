"use client";

import Link from "next/link";
import Image from "next/image";
import { BarChart3, BookOpen, CheckSquare, ChevronLeft, ChevronRight, Dumbbell, GraduationCap, Home, Library, Search } from "lucide-react";
import { usePathname } from "next/navigation";
import type { CSSProperties, ReactNode } from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { getOpenAssignmentCount, readAssignments, readAssignmentsFromCloud, subscribeToAssignmentChanges } from "@/data/assignments";
import { learnerLessons } from "@/data/lessons";
import { fetchLearnerCompletionTimestamps } from "@/data/learnerProgress";
import { useJapaneseSetting } from "@/components/useJapaneseSetting";
import { useKnownWordIds } from "@/components/useKnownWordIds";
import { allWords } from "@/components/reference/ref-data";
import { CloudSyncBadge } from "@/components/CloudSyncBadge";

type NavKey = "home" | "teacher" | "progress" | "english" | "math" | "geography" | "history" | "science" | "assignments" | "reference" | "search" | "practice";

const navItems: Array<{ key: NavKey; label: string; href: string; icon: ReactNode }> = [
  { key: "home", label: "Home", href: "/", icon: <Home size={20} strokeWidth={2} /> },
  { key: "assignments", label: "Leo", href: "/leo", icon: <CheckSquare size={20} strokeWidth={2} /> },
  { key: "teacher", label: "Neritan", href: "/teacher", icon: <GraduationCap size={20} strokeWidth={2} /> },
  { key: "reference", label: "Reference", href: "/reference", icon: <Library size={20} strokeWidth={2} /> },
  { key: "progress", label: "Progress", href: "/teacher/progress", icon: <BarChart3 size={20} strokeWidth={2} /> }
];

const mobileNavItems = [navItems[0], navItems[1], navItems[2], { key: "english" as const, label: "English", href: "/english", icon: <BookOpen size={20} /> }, navItems[3]];

const JapanesePreferenceContext = createContext(false);

export function useJapanesePreference() {
  return useContext(JapanesePreferenceContext);
}

export function AppShell({
  active,
  crumbs,
  children
}: {
  active: NavKey;
  crumbs: string[];
  children: ReactNode;
}) {
  const [japaneseOn, setJapaneseOn] = useJapaneseSetting();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [assignmentsLeft, setAssignmentsLeft] = useState<number | null>(null);
  const [streakDays, setStreakDays] = useState(0);
  const pathname = usePathname();
  const { knownWordSet } = useKnownWordIds();
  const isReferenceContext = active === "reference" || active === "search" || active === "practice";
  const knownWordCount = knownWordSet.size;
  const reviewWordCount = Math.max(0, allWords.length - knownWordCount);

  useEffect(() => {
    const saved = window.localStorage.getItem("leea-sidebar-collapsed");
    if (saved) setSidebarCollapsed(saved === "true");

    function refreshAssignments() {
      setAssignmentsLeft(getOpenAssignmentCount(readAssignments(learnerLessons)));
      void readAssignmentsFromCloud(learnerLessons).then((assignments) => {
        setAssignmentsLeft(getOpenAssignmentCount(assignments));
      });
    }

    refreshAssignments();
    window.addEventListener("storage", refreshAssignments);
    window.addEventListener("focus", refreshAssignments);
    // "storage" is other-tab only, and an assignment closes itself in this one.
    const unsubscribe = subscribeToAssignmentChanges(refreshAssignments);
    return () => {
      window.removeEventListener("storage", refreshAssignments);
      window.removeEventListener("focus", refreshAssignments);
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    // Real day-streak, derived from Supabase's completed_at timestamps — the
    // only trustworthy "when did Leo finish this" signal in the app. When
    // that data isn't available (offline/local dev) this honestly shows 0
    // rather than a fabricated number.
    void fetchLearnerCompletionTimestamps(learnerLessons).then((timestamps) => {
      setStreakDays(computeStreakDays(Object.values(timestamps)));
    });
  }, []);

  function toggleSidebar() {
    setSidebarCollapsed((current) => {
      const next = !current;
      window.localStorage.setItem("leea-sidebar-collapsed", String(next));
      return next;
    });
  }

  return (
    <JapanesePreferenceContext.Provider value={japaneseOn}>
      <div className={`${japaneseOn ? "app jp-on" : "app"} ${sidebarCollapsed ? "sidebar-collapsed" : ""}`}>
        <aside className="sidebar">
        <div className="brand-row">
          <Link className="brand" href="/">
            <span className="brand-logo-wrap">
              <Image alt="" className="brand-logo" height={42} src="/brand/leea_brand_logo.png" width={42} />
            </span>
            <span className="brand-text">
              <strong>LEEA</strong>
              <small>Elite Education Academy</small>
            </span>
          </Link>
          <button className="sidebar-toggle" onClick={toggleSidebar} type="button" aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}>
            {sidebarCollapsed ? <ChevronRight size={16} strokeWidth={2.5} /> : <ChevronLeft size={16} strokeWidth={2.5} />}
          </button>
        </div>

        <nav className="side-nav" aria-label="Main navigation">
          {navItems.map((item) => (
            <Link className={active === item.key || (item.key === "reference" && isReferenceContext) ? "active" : ""} data-tooltip={item.label} href={item.href} key={item.key}>
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
              {item.key === "assignments" && assignmentsLeft !== null && assignmentsLeft > 0 && (
                <b className="nav-count">{assignmentsLeft}</b>
              )}
            </Link>
          ))}
        </nav>

        {isReferenceContext ? (
          <div className="sidebar-subjects sidebar-reference">
            <span className="sidebar-subjects-title">Reference</span>
            <Link className={active === "reference" ? "active" : ""} data-tooltip="Browse" href="/reference"><Library size={16} strokeWidth={2.4} />Browse</Link>
            <Link className={active === "search" ? "active" : ""} data-tooltip="Search" href="/reference/search"><Search size={16} strokeWidth={2.4} />Search</Link>
            <Link className={active === "practice" ? "active" : ""} data-tooltip="Practice" href="/reference/practice"><Dumbbell size={16} strokeWidth={2.4} />Practice</Link>
          </div>
        ) : null}

        <div className="sidebar-subjects">
          <span className="sidebar-subjects-title">Subjects</span>
          <Link className={active === "english" ? "active" : ""} data-tooltip="English" href="/english"><i className="dot-english" />English</Link>
          <Link className={active === "math" ? "active" : ""} data-tooltip="Math" href="/math"><i className="dot-math" />Math</Link>
          <Link className={active === "geography" ? "active" : ""} data-tooltip="Geography" href="/geography"><i className="dot-geography" />Geography</Link>
          <Link className={active === "history" ? "active" : ""} data-tooltip="History" href="/history"><i className="dot-history" />History</Link>
          <Link className={active === "science" ? "active" : ""} data-tooltip="Science" href="/science"><i className="dot-science" />Science</Link>
        </div>

        {isReferenceContext ? (
          <div
            className="sidebar-progress"
            data-tooltip={`${knownWordCount} known · ${reviewWordCount} to review`}
            data-ring-count={knownWordCount}
            style={{ "--ring-pct": `${allWords.length ? Math.min(100, Math.round((knownWordCount / allWords.length) * 100)) : 0}%` } as CSSProperties}
          >
            <strong className="progress-label">Reference</strong>
            <strong className="progress-ring-count">{knownWordCount}</strong>
            <span>{knownWordCount} known · {reviewWordCount} to review</span>
          </div>
        ) : (
          <div
            className="sidebar-progress"
            data-tooltip={`${assignmentsLeft ?? 0} left`}
            data-ring-count={assignmentsLeft ?? 0}
            style={{ "--ring-pct": `${assignmentsLeft ? Math.min(100, Math.round(((12 - assignmentsLeft) / 12) * 100)) : 100}%` } as CSSProperties}
          >
            <strong className="progress-label">{active === "teacher" || active === "progress" ? "This week" : active === "english" ? "Our World" : "Leo’s Progress"}</strong>
            <strong className="progress-ring-count">{assignmentsLeft ?? 0}</strong>
            {active === "english" ? (
              <><span>Level 4 · Unit 8</span><div className="sidebar-mini-progress"><i /></div></>
            ) : (
              <span>{assignmentsLeft === null ? "…" : assignmentsLeft === 0 ? "No homework waiting" : `${assignmentsLeft} assignment${assignmentsLeft === 1 ? "" : "s"} left`}</span>
            )}
          </div>
        )}

        <div className="sidebar-streak" data-tooltip={`${streakDays} day streak`}>
          <span className="sidebar-streak-label">Day streak</span>
          <div className="sidebar-streak-count">
            <strong>{streakDays}</strong>
            <small>days 🔥</small>
          </div>
          <div className="sidebar-streak-bar">
            {Array.from({ length: 5 }).map((_, index) => (
              <i className={index < Math.min(streakDays, 5) ? "filled" : ""} key={index} />
            ))}
          </div>
        </div>
        </aside>

        <main className="main">
          <header className="topbar">
          <div className="crumbs">
            {crumbs.map((crumb, index) => (
              <span key={`${crumb}-${index}`}>
                <CrumbButton crumb={crumb} current={index === crumbs.length - 1} href={getCrumbHref(crumb, pathname)} />
              </span>
            ))}
          </div>
          <div className="top-actions">
            <CloudSyncBadge />
            {active === "assignments" ? <span className="leo-top-greeting">Hi, Leo!</span> : (
              <>
                {/* The labels are spans so a phone can drop them: the search box
                    alone is 230px wide, which is most of a 390px viewport. */}
                <Link className="top-search" href="/reference/search" title="Search words & grammar">
                  <Search size={16} />
                  <span className="top-search-label">Search words &amp; grammar</span>
                </Link>
                <button
                  className={japaneseOn ? "jp-toggle active" : "jp-toggle"}
                  onClick={() => setJapaneseOn((current) => !current)}
                  title={`Japanese ${japaneseOn ? "ON" : "OFF"}`}
                  type="button"
                >
                  <span className="jp-toggle-long">Japanese {japaneseOn ? "ON" : "OFF"}</span>
                  <span className="jp-toggle-short">JP {japaneseOn ? "ON" : "OFF"}</span>
                </button>
              </>
            )}
            <span className="profile-avatar" aria-label={active === "teacher" || active === "progress" ? "Neritan" : "Leo"}>
              {active === "teacher" || active === "progress" ? "N" : "L"}
            </span>
          </div>
          </header>

          <div className="content">{children}</div>
        </main>

        <nav className="mobile-nav" aria-label="Mobile navigation">
          {mobileNavItems.map((item) => (
            <Link className={active === item.key ? "active" : ""} href={item.href} key={item.key}>
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </JapanesePreferenceContext.Provider>
  );
}

// Consecutive-day streak, counting backward from today (or from yesterday if
// nothing is done yet today, so the streak isn't marked "broken" mid-day).
// Returns 0 — not a guess — once the trail of completed days has a gap.
function computeStreakDays(completedAtTimestamps: string[]): number {
  const days = new Set<string>();
  for (const iso of completedAtTimestamps) {
    const date = new Date(iso);
    if (!Number.isNaN(date.getTime())) days.add(toLocalDateKey(date));
  }
  if (!days.size) return 0;

  const cursor = new Date();
  if (!days.has(toLocalDateKey(cursor))) cursor.setDate(cursor.getDate() - 1);

  let streak = 0;
  while (days.has(toLocalDateKey(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

function toLocalDateKey(date: Date) {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

function getCrumbHref(crumb: string, pathname: string) {
  if (crumb === "Home") return "/";
  if (crumb === "Neritan") return "/teacher";
  if (crumb === "Progress") return "/teacher/progress";
  if (crumb === "Leo") return "/leo";
  if (crumb === "English") return "/english";
  if (crumb === "Geography") return "/geography";
  if (crumb === "History") return "/history";
  if (crumb === "Science") return "/science";
  if (crumb === "Our World") return "/english/our-world";
  // Was a single hardcoded "Unit 8" case, so the Unit 7 and Unit 9 pages —
  // which pass the same shape of crumb — fell through to a self-link.
  const unitCrumb = /^Unit (\d+)$/.exec(crumb);
  if (unitCrumb) return `/english/our-world/level-4/unit-${unitCrumb[1]}`;
  if (crumb === "Reference") return "/reference";
  if (crumb === "Search") return "/reference/search";
  return pathname;
}

function CrumbButton({ crumb, current, href }: { crumb: string; current: boolean; href: string }) {
  return (
    <Link className={current ? "crumb-button current" : "crumb-button"} href={href}>
      {crumb}
    </Link>
  );
}
