import type { Metadata } from "next";
import { profile } from "@/lib/data/profile";

/**
 * Where this site lives, and the metadata helper that depends on knowing.
 *
 * Not under `lib/data/` on purpose — everything there is content Swastik
 * wrote. This is environment.
 */

/**
 * Resolve the public origin, or admit that we can't.
 *
 * The chain is not invented; it mirrors Next's own fallback in
 * `next/dist/lib/metadata/resolvers/resolve-url.js`, which reads
 * `VERCEL_BRANCH_URL || VERCEL_URL` on previews and
 * `VERCEL_PROJECT_PRODUCTION_URL` in production. Two deliberate differences:
 *
 *   - **`VERCEL_URL` is omitted.** It is per-deployment and changes on every
 *     push. Fine for a social image, poison in a canonical tag or a sitemap,
 *     both of which are promises about a *stable* address.
 *
 *   - **We resolve it ourselves anyway**, because Next's fallback only feeds
 *     social images. `alternates.canonical` and `app/sitemap.ts` get nothing
 *     from it, so an explicit `metadataBase` is still required.
 */
function resolveOrigin(): { url: string; isPlaceholder: boolean } {
  // Set this by hand only if there is a custom domain. A `.vercel.app`
  // address needs no configuration — the next branch finds it.
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return { url: explicit.replace(/\/$/, ""), isPlaceholder: false };

  // Stable production domain. Vercel sets this in *every* environment.
  const production = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (production) return { url: `https://${production}`, isPlaceholder: false };

  // Stable per branch. Preview deployments only.
  const branch = process.env.VERCEL_BRANCH_URL;
  if (branch) return { url: `https://${branch}`, isPlaceholder: false };

  return { url: `http://localhost:${process.env.PORT ?? 3000}`, isPlaceholder: true };
}

export const { url: SITE_URL, isPlaceholder: SITE_URL_IS_PLACEHOLDER } = resolveOrigin();

/**
 * The one case that should be unreachable: building *on* Vercel with no
 * origin. `VERCEL_PROJECT_PRODUCTION_URL` is always set there, so if this
 * fires something is genuinely wrong with the project configuration and a
 * silent localhost URL in every canonical tag would be worse than a failure.
 *
 * Note this is narrower than a `NODE_ENV === "production"` check would be.
 * A local `npm run build` legitimately has no domain, and failing that build
 * would punish the wrong person for a condition that isn't an error.
 * `app/robots.ts` handles that case instead, by refusing to be indexed.
 */
if (process.env.VERCEL === "1" && SITE_URL_IS_PLACEHOLDER) {
  throw new Error(
    "Building on Vercel but no site origin resolved. Expected VERCEL_PROJECT_PRODUCTION_URL " +
      "to be set, or NEXT_PUBLIC_SITE_URL if this site has a custom domain.",
  );
}

/**
 * Per-page metadata. Every page that isn't the home page should use this.
 *
 * **The `openGraph` key is the whole point, and it is not optional.** Next
 * merges metadata with `for (const key in metadata)` — see
 * `next/dist/lib/metadata/resolve-metadata.js` — so a child segment's
 * `openGraph` is only recomputed if that segment's object literally *has* an
 * `openGraph` key. A page exporting just `title` and `description` silently
 * inherits the root layout's resolved OpenGraph block, og:title included.
 *
 * Without this helper every page on the site — every individual project —
 * would share as "Swastik Aditya Ranjan — Electrical Engineer". The page
 * looks correct in a browser the entire time; the bug is only visible in
 * `view-source` or in the link preview itself.
 */
export function pageMetadata({
  title,
  description,
  path,
  image = "/opengraph-image",
}: {
  title: string;
  description: string;
  /** Root-relative, e.g. `/projects/tiburon-auv`. Resolved against `metadataBase`. */
  path: string;
  /**
   * The share image, or `null` to leave `images` unset.
   *
   * Defaulting to the site card is not belt-and-braces — without it these
   * pages have **no og:image at all**. Declaring `openGraph` replaces the
   * parent's resolved block wholesale, images included, and the root
   * `app/opengraph-image.tsx` is only re-applied to segments that own such a
   * file. So `/projects`, `/skills`, `/experience`, and `/contact` would
   * each share as a bare grey box while looking perfectly fine in a browser.
   *
   * Pass `null` from a segment that has its own `opengraph-image` file.
   * `mergeStaticMetadata` in next/dist/lib/metadata/resolve-metadata.js
   * applies the file **only** when the segment's own metadata has no
   * `images` key — so setting one here would shadow the better image.
   */
  image?: string | null;
}): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      // Spelled out rather than relying on the layout's `%s` template, which
      // applies to `title` and not to `openGraph.title`.
      title: `${title} — ${profile.name}`,
      description,
      url: path,
      type: "website",
      ...(image ? { images: [image] } : {}),
    },
  };
}
