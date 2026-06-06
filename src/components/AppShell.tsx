"use client";

import Link from "next/link";
import { BookOpen, CheckSquare, Home, Search, Settings, UserRound } from "lucide-react";
import type { ReactNode } from "react";
import { useState } from "react";

type NavKey = "home" | "english" | "assignments" | "reference" | "profile" | "settings";

const navItems: Array<{ key: NavKey; label: string; href: string; icon: ReactNode }> = [
  { key: "home", label: "Home", href: "/", icon: <Home size={20} /> },
  { key: "english", label: "English", href: "/", icon: <BookOpen size={20} /> },
  { key: "assignments", label: "Assignments", href: "/", icon: <CheckSquare size={20} /> },
  { key: "reference", label: "Reference", href: "/reference", icon: <Search size={20} /> },
  { key: "profile", label: "Profile", href: "/", icon: <UserRound size={20} /> },
  { key: "settings", label: "Settings", href: "/", icon: <Settings size={20} /> }
];

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

  return (
    <div className={japaneseOn ? "app jp-on" : "app"}>
      <aside className="sidebar">
        <Link className="brand" href="/">
          <span className="crest">L</span>
          <span>
            <strong>LEEA</strong>
            <small>Leo&apos;s Elite Education Academy</small>
          </span>
        </Link>

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
                {index > 0 ? " / " : ""}
                <b>{index === crumbs.length - 1 ? crumb : null}</b>
                {index !== crumbs.length - 1 ? crumb : null}
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
        {navItems.slice(0, 4).map((item) => (
          <Link className={active === item.key ? "active" : ""} href={item.href} key={item.key}>
            {item.icon}
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
