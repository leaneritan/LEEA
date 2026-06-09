"use client";

import Link from "next/link";
import { BookOpen, CheckSquare, GraduationCap, Home, PanelLeftClose, PanelLeftOpen, Search, Settings, UserRound } from "lucide-react";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { createContext, useContext, useEffect, useState } from "react";

type NavKey = "home" | "teacher" | "english" | "assignments" | "reference" | "profile" | "settings";

const navItems: Array<{ key: NavKey; label: string; href: string; icon: ReactNode }> = [
  { key: "home", label: "Home", href: "/", icon: <Home size={20} /> },
  { key: "teacher", label: "Neritan", href: "/teacher", icon: <GraduationCap size={20} /> },
  { key: "english", label: "English", href: "/lessons", icon: <BookOpen size={20} /> },
  { key: "assignments", label: "Leo", href: "/leo", icon: <CheckSquare size={20} /> },
  { key: "reference", label: "Reference", href: "/reference", icon: <Search size={20} /> },
  { key: "profile", label: "Profile", href: "/", icon: <UserRound size={20} /> },
  { key: "settings", label: "Settings", href: "/", icon: <Settings size={20} /> }
];

const mobileNavItems = navItems.filter((item) => ["home", "teacher", "english", "reference"].includes(item.key));

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
  const [japaneseOn, setJapaneseOn] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const saved = window.localStorage.getItem("leea-sidebar-collapsed");
    if (saved) setSidebarCollapsed(saved === "true");
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
          <span className="crest">L</span>
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
            </Link>
          ))}
        </nav>

        <div className="sidebar-progress">
          <strong>Leo&apos;s Progress</strong>
          <span>3 assignments left</span>
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
            <button
              className={japaneseOn ? "jp-toggle active" : "jp-toggle"}
              onClick={() => setJapaneseOn((current) => !current)}
              type="button"
            >
              Japanese {japaneseOn ? "ON" : "OFF"}
            </button>
            <Link className="home-pill" href="/">
              Home
            </Link>
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
  if (crumb === "Leo") return "/leo";
  if (crumb === "English") return "/lessons";
  if (crumb === "Our World") return "/lessons#our-world-l4-u8";
  if (crumb === "Unit 8") return "/lessons#our-world-l4-u8";
  if (crumb === "Reference") return "/reference";
  return pathname;
}

function CrumbButton({ crumb, current, href }: { crumb: string; current: boolean; href: string }) {
  return (
    <Link className={current ? "crumb-button current" : "crumb-button"} href={href}>
      {crumb}
    </Link>
  );
}
