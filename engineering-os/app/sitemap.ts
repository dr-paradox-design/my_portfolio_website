import type { MetadataRoute } from "next";
import { routedSlugs } from "@/lib/data/projectPage";
import { profile } from "@/lib/data/profile";
import { SITE_URL } from "@/lib/site";

/**
 * The crawl map, derived rather than listed.
 *
 * Hardcoding the routes here would repeat the mistake the home-page stats
 * already made once: a second copy of a list, drifting silently from the
 * first. `routedSlugs` is the same export `generateStaticParams` uses, so a
 * project page and its sitemap entry cannot disagree.
 *
 * `/resume` is conditional on `profile.resumePath` for the same reason the
 * page's own download button is: there is no PDF yet, so the route renders a
 * summary and no document. Listing it would be asking Google to index a
 * promise.
 *
 * URLs must be absolute. `metadataBase` does not reach route handlers.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const staticPaths = [
    "",
    "/projects",
    "/skills",
    "/experience",
    "/contact",
    ...(profile.resumePath ? ["/resume"] : []),
  ];

  return [
    ...staticPaths.map((path) => ({
      url: `${SITE_URL}${path}`,
      lastModified,
      priority: path === "" ? 1 : 0.6,
    })),
    ...routedSlugs.map((slug) => ({
      url: `${SITE_URL}/projects/${slug}`,
      lastModified,
      // Above the other secondary pages: the project write-ups are the
      // reason anyone is here.
      priority: 0.8,
    })),
  ];
}
