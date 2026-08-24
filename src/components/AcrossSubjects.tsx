"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { mathChapters } from "../../content/subjects/math/curriculum";
import { geographyMaps, isGeographyMapReady } from "../../content/subjects/geography/maps";
import {
  getWeakItemIds,
  readGeographyProgress,
  syncGeographyProgressWithCloud,
  type GeographyProgressMap
} from "@/data/geographyProgress";
import { readMathProgress, syncMathProgressWithCloud, type MathBlockProgressMap } from "@/data/mathProgress";
import { useKnownWordIds } from "./useKnownWordIds";

/**
 * The one thing waiting in each subject.
 *
 * Every subject already tracked what Leo was struggling with — weak words in
 * Reference, half-finished 節 in Math, 苦手 items on the maps — and each kept it
 * behind its own front door. Nothing put them side by side, so the answer to
 * "what should I do now?" meant opening three subjects to find out.
 *
 * Each row picks the most useful next step for its subject and links straight
 * to it: something Leo got wrong beats something unfinished, which beats
 * something untouched.
 */

type NextThing = {
  key: "english" | "math" | "geography";
  subject: string;
  icon: string;
  title: string;
  detail: string;
  action: string;
  href: string;
  /** True when there is nothing outstanding, so the row reads as a win. */
  clear?: boolean;
};

export function AcrossSubjects({ mathPracticeCounts }: { mathPracticeCounts: Record<string, number> }) {
  const { weakWordIds, confidenceRecords } = useKnownWordIds();
  const [mathProgress, setMathProgress] = useState<MathBlockProgressMap>({});
  const [geoProgress, setGeoProgress] = useState<GeographyProgressMap>({});

  useEffect(() => {
    const math = readMathProgress();
    setMathProgress(math);
    void syncMathProgressWithCloud(math).then(setMathProgress);

    const geo = readGeographyProgress();
    setGeoProgress(geo);
    void syncGeographyProgressWithCloud(geo).then(setGeoProgress);
  }, []);

  const items: NextThing[] = [
    englishNext(weakWordIds, Object.keys(confidenceRecords).length),
    mathNext(mathPracticeCounts, mathProgress),
    geographyNext(geoProgress)
  ];

  return (
    <section className="across-subjects" aria-label="What is waiting in each subject">
      <header>
        <h2>Across subjects</h2>
        <span>The one thing waiting in each</span>
      </header>
      <div className="across-grid">
        {items.map((item) => (
          <Link className={`across-card across-card--${item.key}${item.clear ? " is-clear" : ""}`} href={item.href} key={item.key}>
            <span className="across-subject">
              <b>{item.icon}</b>
              {item.subject}
            </span>
            <strong className="across-title">{item.title}</strong>
            <p className="across-detail">{item.detail}</p>
            <span className="across-action">{item.action}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}

/** Words he has been asked and keeps missing come first; otherwise just practise. */
function englishNext(weakWordIds: string[], recordCount: number): NextThing {
  if (weakWordIds.length) {
    return {
      key: "english",
      subject: "English",
      icon: "📖",
      title: "Words to work on",
      detail: `${weakWordIds.length} ${weakWordIds.length === 1 ? "word keeps" : "words keep"} coming out wrong`,
      action: "Practise these",
      href: "/reference/practice"
    };
  }
  return {
    key: "english",
    subject: "English",
    icon: "📖",
    title: recordCount ? "Nothing weak right now" : "Try a practice round",
    detail: recordCount ? "Ten questions keeps the older words fresh" : "Ten questions from the Reference words",
    action: "Start practice",
    href: "/reference/practice",
    clear: Boolean(recordCount)
  };
}

/** A 節 already started beats one never opened — finishing something beats starting. */
function mathNext(counts: Record<string, number>, progress: MathBlockProgressMap): NextThing {
  const doneCount = (sectionId: string) =>
    Object.values(progress).filter((record) => record.sectionId === sectionId && record.status === "done").length;

  type Candidate = { chapterId: string; sectionId: string; name: string; num: string; done: number; total: number };
  let started: Candidate | null = null;
  let untouched: Candidate | null = null;

  for (const chapter of mathChapters) {
    for (const section of chapter.sections) {
      const total = counts[section.id];
      if (!total) continue;
      const done = doneCount(section.id);
      if (done >= total) continue;
      const entry = { chapterId: chapter.id, sectionId: section.id, name: section.name, num: chapter.num, done, total };
      if (done > 0) {
        started = started ?? entry;
      } else {
        untouched = untouched ?? entry;
      }
    }
  }

  const pick = started ?? untouched;
  if (!pick) {
    return {
      key: "math",
      subject: "Math",
      icon: "🔢",
      title: "Every 節 finished",
      detail: "Nothing left unticked in 新しい数学1",
      action: "Open 数学",
      href: "/math",
      clear: true
    };
  }

  return {
    key: "math",
    subject: "Math",
    icon: "🔢",
    title: `${pick.num}章 ${pick.name}`,
    detail: pick.done ? `${pick.done} / ${pick.total} 問 done` : `${pick.total} 問, not started`,
    action: pick.done ? "Keep going" : "Start this 節",
    href: `/math/${pick.chapterId}/${pick.sectionId}`
  };
}

/** A map with 苦手 items beats one merely unfinished. */
function geographyNext(progress: GeographyProgressMap): NextThing {
  const live = geographyMaps.filter(isGeographyMapReady);

  for (const map of live) {
    const weak = getWeakItemIds(progress[map.id]?.items);
    if (weak.length) {
      return {
        key: "geography",
        subject: "Geography",
        icon: "🗺️",
        title: map.jpShortTitle,
        detail: `${weak.length} 苦手 waiting on this map`,
        action: "Review these",
        href: `/geography/${map.id}`
      };
    }
  }

  const unfinished = live.find((map) => (progress[map.id]?.status ?? "not-done") !== "done");
  if (unfinished) {
    const status = progress[unfinished.id]?.status ?? "not-done";
    return {
      key: "geography",
      subject: "Geography",
      icon: "🗺️",
      title: unfinished.jpShortTitle,
      detail: status === "explored" ? "Explored, quiz not finished" : "Not opened yet",
      action: status === "explored" ? "Finish the quiz" : "Open this map",
      href: `/geography/${unfinished.id}`
    };
  }

  return {
    key: "geography",
    subject: "Geography",
    icon: "🗺️",
    title: "Every map done",
    detail: `All ${live.length} finished with nothing marked 苦手`,
    action: "Open 地理",
    href: "/geography",
    clear: true
  };
}
