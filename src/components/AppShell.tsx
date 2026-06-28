"use client";

import Link from "next/link";
import Image from "next/image";
import { BarChart3, BookOpen, CheckSquare, ChevronLeft, ChevronRight, GraduationCap, Home, Library, Search } from "lucide-react";
import { usePathname } from "next/navigation";
import type { CSSProperties, ReactNode } from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { getOpenAssignmentCount, readAssignments, readAssignmentsFromCloud } from "@/data/assignments";
import { learnerLessons } from "@/data/lessons";
import { useJapaneseSetting } from "@/components/useJapaneseSetting";

type NavKey = "home" | "teacher" | "progress" | "english" | "assignments" | "reference" | "search";

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
  const pathname = usePathname();

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
    return () => {
      window.removeEventListener("storage", refreshAssignments);
      window.removeEventListener("focus", refreshAssignments);
    };
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
            <Link className={active === item.key ? "active" : ""} data-tooltip={item.label} href={item.href} key={item.key}>
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
              {item.key === "assignments" && assignmentsLeft !== null && assignmentsLeft > 0 && (
                <b className="nav-count">{assignmentsLeft}</b>
              )}
            </Link>
          ))}
        </nav>

        <div className="sidebar-subjects">
          <span className="sidebar-subjects-title">Subjects</span>
          <Link className={active === "english" ? "active" : ""} data-tooltip="English" href="/english"><i className="dot-english" />English</Link>
          <span className="disabled" data-tooltip="Math"><i className="dot-disabled" />Math</span>
          <span className="disabled" data-tooltip="Science"><i className="dot-disabled" />Science</span>
        </div>

        <div
          className="sidebar-progress"
          data-tooltip={`${assignmentsLeft ?? 0} left`}
          data-ring-count={assignmentsLeft ?? 0}
          style={{ "--ring-pct": `${assignmentsLeft ? Math.min(100, Math.round(((12 - assignmentsLeft) / 12) * 100)) : 100}%` } as CSSProperties}
        >
          <strong className="progress-label">{active === "teacher" || active === "progress" ? "This week" : active === "english" ? "Our World" : "Leo&apos;s Progress"}</strong>
          <strong className="progress-ring-count">{assignmentsLeft ?? 0}</strong>
          {active === "english" ? (
            <><span>Level 4 · Unit 8</span><div className="sidebar-mini-progress"><i /></div></>
          ) : (
            <span>{assignmentsLeft === null ? "…" : assignmentsLeft === 0 ? "No homework waiting" : `${assignmentsLeft} assignment${assignmentsLeft === 1 ? "" : "s"} left`}</span>
          )}
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
            {active === "assignments" ? <span className="leo-top-greeting">Hi, Leo!</span> : (
              <>
                <Link className="top-search" href="/reference/search"><Search size={16} />Search words &amp; grammar</Link>
                <button
                  className={japaneseOn ? "jp-toggle active" : "jp-toggle"}
                  onClick={() => setJapaneseOn((current) => !current)}
                  type="button"
                >
                  Japanese {japaneseOn ? "ON" : "OFF"}
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

function getCrumbHref(crumb: string, pathname: string) {
  if (crumb === "Home") return "/";
  if (crumb === "Neritan") return "/teacher";
  if (crumb === "Progress") return "/teacher/progress";
  if (crumb === "Leo") return "/leo";
  if (crumb === "English") return "/english";
  if (crumb === "Our World") return "/english/our-world";
  if (crumb === "Unit 8") return "/english/our-world/level-4/unit-8";
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
