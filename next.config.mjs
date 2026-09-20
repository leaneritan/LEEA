/**
 * The build id is inlined into both the client and server bundles at build
 * time, which is what lets a page notice it is out of date: an open tab keeps
 * the JavaScript it loaded, so after a deploy it holds the old id while
 * /api/build — served by whatever deployment the alias now points at — returns
 * the new one.
 *
 * On Vercel the commit sha is the natural id. Locally there is none, so fall
 * back to the build's own timestamp; `npm run dev` restarts get a fresh value,
 * which is harmless because the prompt is disabled outside production.
 */
const buildId =
  process.env.VERCEL_GIT_COMMIT_SHA ??
  process.env.GITHUB_SHA ??
  `local-${Date.now()}`;

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_BUILD_ID: buildId
  },
  /**
   * Lesson code must be re-checked, never assumed.
   *
   * A lesson is not part of the app bundle: the shells under `/learn` and
   * `/lessons` and the shared `/components/*.js` they pull in are ordinary
   * static files, and a deck's sub-resources are fetched by the iframe's own
   * document where `LessonPage` cannot reach them to version the URL. Without
   * this a deploy can land, the app can be up to date, and the lesson inside
   * the frame can still be running last week's code.
   *
   * `no-cache` still lets the browser keep the file — it just has to ask
   * first, and gets a 304 when nothing changed.
   */
  async headers() {
    return [
      {
        source: "/:path(components|learn|lessons|tests|math-lessons|geography|history)/:file*",
        headers: [{ key: "Cache-Control", value: "public, max-age=0, must-revalidate" }]
      }
    ];
  }
};

export default nextConfig;
