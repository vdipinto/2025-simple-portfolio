// src/lib/site.ts

/** Public site URL (no trailing slash). Reads either NEXT_PUBLIC_SITE_URL or SITE_URL. */
const raw =
  process.env.NEXT_PUBLIC_SITE_URL ??
  process.env.SITE_URL ??
  "http://localhost:3000";

export const SITE_URL = raw.replace(/\/$/, "");

/** True only for real production (not preview/staging/dev) */
export const IS_PROD =
  process.env.NODE_ENV === "production" &&
  process.env.VERCEL_ENV !== "preview" &&
  process.env.VERCEL_ENV !== "development";

/** Build an absolute URL from a path */
export const absoluteUrl = (path = "/") =>
  `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
