import type { MetadataRoute } from "next";
import { SITE_URL, SITE_URL_IS_PLACEHOLDER } from "@/lib/site";

/**
 * Crawler rules — and the failure mode for an unknown domain.
 *
 * When no real origin resolves, `SITE_URL` is `http://localhost:3000`. Every
 * canonical tag, og:image, and sitemap entry built from it is wrong. The
 * question is what to do about that, and the answer is *not* to throw: a
 * local `npm run build` legitimately has no domain, and failing it would
 * punish the wrong person for a condition that isn't an error.
 *
 * So the site refuses to be indexed instead. A `Disallow: /` is trivially
 * reversible the moment a domain exists, whereas a page indexed under a
 * localhost canonical is a mess to unpick. Fail safe, not loud.
 *
 * On Vercel this branch is unreachable — `VERCEL_PROJECT_PRODUCTION_URL` is
 * always set, and `lib/site.ts` throws if it somehow isn't.
 */
export default function robots(): MetadataRoute.Robots {
  if (SITE_URL_IS_PLACEHOLDER) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
