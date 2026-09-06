/**
 * lib/data/projectPage.ts
 *
 * Joins a routed `WorkItem` to its optional `ProjectDetail` and enforces,
 * at build time, the two rules that keep project pages honest.
 *
 * Why the rules live here rather than in the type system: the previous
 * `Project` type required `technicalDecisions`, `validationResults`, and
 * `failuresAndLessons`. That made the compiler demand prose for every page,
 * which is fabrication pressure — the cheapest way to satisfy a required
 * `failuresAndLessons: FailureLesson[]` for a project you haven't written up
 * is to invent a failure. Making the fields optional removes that pressure
 * but would also remove the guarantee, so the guarantee is reinstated here
 * as a *conditional* assertion, which is strictly stronger than the type
 * was: a thin page is allowed to exist, but a page that claims engineering
 * rigour has to show the failures too.
 *
 * Both assertions throw. `next build` runs `generateStaticParams` and
 * renders every page, so a violation fails the build rather than shipping.
 */

import { routedWorkItems, type WorkItem } from "@/lib/data/portfolio";
import { projectDetails } from "@/lib/data/projects";
import type { ProjectDetail } from "@/types/project";

export interface ProjectPage {
  item: WorkItem & { slug: string };
  /** Absent for the common case: a project with photos but no write-up yet. */
  detail?: ProjectDetail;
}

const has = (arr: unknown[] | undefined) => Array.isArray(arr) && arr.length > 0;

/** Does this slug have prose behind it, or only media? Drives the card CTA. */
export function hasCaseStudy(slug: string | undefined): boolean {
  if (!slug) return false;
  const d = projectDetails.find((p) => p.slug === slug);
  return Boolean(d?.executiveSummary || has(d?.technicalDecisions));
}

export function getProjectPage(slug: string): ProjectPage | undefined {
  const item = routedWorkItems.find((w) => w.slug === slug);
  if (!item) return undefined;
  return { item, detail: projectDetails.find((p) => p.slug === slug) };
}

export const routedSlugs = routedWorkItems.map((item) => item.slug);

/* ── Build-time guards ──────────────────────────────────────────────
   Run once at module load. In production this is during `next build`, so
   a violation is a failed build; in dev it is a failed page render. */

for (const item of routedWorkItems) {
  const detail = projectDetails.find((p) => p.slug === item.slug);

  // 1. No empty pages. A slug is a promise that clicking through leads
  //    somewhere. Without photos, video, or a write-up it leads to a title
  //    the reader already read on the card.
  const hasSomething =
    has(item.images) || Boolean(item.video) || Boolean(detail);
  if (!hasSomething) {
    throw new Error(
      `"${item.title}" has slug "${item.slug}" but no photos, video, or deep ` +
        `content. Remove the slug until there is something to show.`,
    );
  }

  // 2. The honesty invariant. If a detail documents what was decided and
  //    what was measured, it must also document what went wrong. Every
  //    real project has something in that column; a page that lists only
  //    the parts that worked is selectively edited, not thin.
  if (
    detail &&
    (has(detail.technicalDecisions) || has(detail.validationResults)) &&
    !has(detail.failuresAndLessons)
  ) {
    throw new Error(
      `"${item.title}" documents technical decisions or validation results ` +
        `but no failures or lessons. Add at least one real failure, or cut ` +
        `the page back to what can be stated honestly.`,
    );
  }
}

/* Slugs listed in projects.ts that no work item routes to. This is a typo
   catcher: a mismatched slug would otherwise mean a case study silently
   never rendering anywhere. */
for (const detail of projectDetails) {
  if (!routedSlugs.includes(detail.slug)) {
    throw new Error(
      `projects.ts has a detail for slug "${detail.slug}", but no work item ` +
        `in portfolio.ts carries that slug, so it renders nowhere.`,
    );
  }
}
