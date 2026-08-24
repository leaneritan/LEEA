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
  }
};

export default nextConfig;
