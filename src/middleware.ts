import { NextResponse, type NextRequest } from "next/server";
import learnerAppMap from "@/generated/learnerAppMap.json";

const routeByPath = learnerAppMap as Record<string, string>;

// Learner apps under /learn/*.html only push progress to Supabase when the
// LessonPage cloud-sync bridge has run (src/components/LessonPage.tsx). That
// bridge is injected client-side when the app is embedded via /lessons/[id];
// a direct top-level navigation to the static file (a bookmark, a link from
// before the fullscreen fix, browser history, someone pasting the URL) skips
// it entirely and strands progress in that browser's local storage only —
// this is exactly what happened to Unit 8 book-reading and Unit 9 vocab-1.
// Redirect any such direct navigation to the synced route instead.
export function middleware(request: NextRequest) {
  const lessonId = routeByPath[request.nextUrl.pathname];
  if (!lessonId) return NextResponse.next();

  // LessonPage.tsx fetches this same file with `fetch()` to read its raw text
  // before injecting the bridge and serving it via iframe srcDoc. That must
  // reach the real file unredirected. Fetch Metadata marks it "empty"/"iframe";
  // only an actual document navigation reports "document" — redirect that case
  // only. Browsers without Fetch Metadata support send no header, so this
  // fails open (no redirect) rather than risking breaking the internal fetch.
  if (request.headers.get("sec-fetch-dest") !== "document") return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = `/lessons/${lessonId}`;
  url.search = "?fullscreen=1";
  return NextResponse.redirect(url);
}

export const config = {
  matcher: "/learn/:path*"
};
