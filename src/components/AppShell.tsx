"use client";

import Link from "next/link";
import Image from "next/image";
import { BarChart3, BookOpen, CheckSquare, GraduationCap, Home, Library, PanelLeftClose, PanelLeftOpen, Search } from "lucide-react";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { getOpenAssignmentCount, readAssignments } from "@/data/assignments";
import { learnerLessons } from "@/data/lessons";
import { useJapaneseSetting } from "@/components/useJapaneseSetting";

type NavKey = "home" | "teacher" | "progress" | "english" | "assignments" | "reference" | "search";

const navItems: Array<{ key: NavKey; label: string; href: string; icon: ReactNode }> = [
  { key: "home", label: "Home", href: "/", icon: <Home size={20} /> },
  { key: "assignments", label: "Leo", href: "/leo", icon: <CheckSquare size={20} /> },
  { key: "teacher", label: "Neritan", href: "/teacher", icon: <GraduationCap size={20} /> },
  { key: "reference", label: "Reference", href: "/reference", icon: <Library size={20} /> },
  { key: "progress", label: "Progress", href: "/teacher/progress", icon: <BarChart3 size={20} /> }
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
        <Link className="brand" href="/">
          <span className="brand-logo-wrap">
            <Image alt="" className="brand-logo" height={48} src="/brand/leea_brand_mark.png" width={48} />
          </span>
          <span>
            <strong>LEEA</strong>
            <small>Leo&apos;s Elite Education Academy</small>
          </span>
        </Link>

        <button className="sidebar-toggle" onClick={toggleSidebar} type="button">
          {sidebarCollapsed ? <PanelLeftOpen size={20} /> : <PanelLeftClose size={20} />}
          <span>{sidebarCollapsed ? "Open menu" : "Collapse menu"}</span>
        </button>

        <nav className="side-nav" aria-label="Main navigation">
          {navItems.map((item) => (
            <Link className={active === item.key ? "active" : ""} href={item.href} key={item.key}>
              {item.icon}
              <span>{item.label}</span>
              {item.key === "assignments" && assignmentsLeft !== null && assignmentsLeft > 0 && (
                <b className="nav-count">{assignmentsLeft}</b>
              )}
            </Link>
          ))}
        </nav>

        <div className="sidebar-subjects">
          <span>Subjects</span>
          <Link className={active === "english" ? "active" : ""} href="/english"><i />English</Link>
          <span className="disabled"><i />Math</span>
          <span className="disabled"><i />Science</span>
        </div>

        <div className="sidebar-progress">
          <strong>{active === "teacher" || active === "progress" ? "This week" : active === "english" ? "Our World" : "Leo&apos;s Progress"}</strong>
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
