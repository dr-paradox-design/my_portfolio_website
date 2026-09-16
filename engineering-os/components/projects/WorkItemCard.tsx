import Link from "next/link";
import { ViewTransition } from "react";
import { ArrowRight, ArrowUpRight, Code2, Star } from "lucide-react";
import type { WorkItem } from "@/lib/data/portfolio";
import { hasCaseStudy } from "@/lib/data/projectPage";
import { Tag } from "@/components/ui/Tag";
import { SpotlightEffect } from "@/components/ui/SpotlightEffect";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { WorkPhotos } from "@/components/projects/WorkPhotos";

/**
 * Summary-depth card for the full work inventory. Items with a `slug` link
 * through to their own page; the rest are presented at the depth the
 * available information actually supports.
 */
export function WorkItemCard({ item }: { item: WorkItem }) {
  /* "Read case study" is a promise a photos-only page does not keep, so the
     label is derived from what is actually behind the link. */
  const ctaLabel = hasCaseStudy(item.slug) ? "Read case study" : "Open project";

  const title = (
    <h3
      className={`text-base font-semibold leading-snug tracking-tight text-board-50 ${
        item.slug ? "transition-colors group-hover:text-copper-400" : ""
      }`}
    >
      {item.title}
    </h3>
  );

  /* The card title and the `<h1>` on the page it opens are the same object,
     so they morph into each other rather than one vanishing while an
     unrelated one appears. The `name` is what pairs them across the two
     routes — `app/projects/[slug]/page.tsx` uses the identical string.

     Only linked cards get a name. A name has to be unique per page, and on
     an unlinked card it would be naming a thing that goes nowhere. */
  const heading = item.slug ? (
    <ViewTransition name={`project-title-${item.slug}`} share="project-title">
      {title}
    </ViewTransition>
  ) : (
    title
  );

  const body = (
    <>
      <SpotlightEffect />

      <div className="relative z-10 flex h-full flex-col">
        {item.images && item.images.length > 0 && (
          <WorkPhotos images={item.images} />
        )}

        <div className="mb-2.5 flex items-start justify-between gap-3">
          {heading}
          <div className="flex shrink-0 items-center gap-1.5">
            {item.tier === "flagship" && (
              <span
                className="text-copper-400"
                title="Flagship project"
                aria-label="Flagship project"
              >
                <Star size={12} fill="currentColor" />
              </span>
            )}
            <StatusBadge status={item.status} />
          </div>
        </div>

        {item.context && (
          <p className="mb-2.5 font-mono text-xs text-board-500">{item.context}</p>
        )}

        <p className="mb-4 text-sm leading-relaxed text-board-400">{item.summary}</p>

        {/* One row, not two: the call to action anchors left and the
            technology tags sit flush right.

            `justify-end` plus `mr-auto` on the CTA rather than
            `justify-between` — with no CTA present the tags still land
            right, without an empty spacer element in the DOM.

            `items-end` aligns the CTA with the *last* line of tags.
            Tiburon carries seven, so wrapping is the normal case, and
            `items-center` would float the link into the middle of a
            three-line tag block and read as accidental. */}
        <div className="mt-auto flex flex-wrap items-end justify-end gap-x-4 gap-y-3 pt-1">
          {item.slug ? (
            <span className="mr-auto flex shrink-0 items-center gap-1.5 text-sm font-medium text-copper-400">
              {ctaLabel}
              <ArrowRight
                size={14}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </span>
          ) : (
            /* The repo takes the slot the case-study link would have used, so
               a card with public source stops looking like a dead end. Only
               reachable on the `else` branch, which is also the branch where
               the shell is a plain div — the type forbids slug + repoUrl and
               projectPage.ts fails the build on it, but nesting the JSX in the
               same ternary means the invalid markup cannot be written here at
               all, guard or no guard. */
            item.repoUrl && (
              <a
                href={item.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group/repo mr-auto flex shrink-0 items-center gap-1.5 text-sm font-medium text-board-400 transition-colors hover:text-copper-400"
              >
                <Code2 size={14} aria-hidden="true" />
                Source on GitHub
                <ArrowUpRight
                  size={14}
                  className="transition-transform duration-300 group-hover/repo:-translate-y-0.5 group-hover/repo:translate-x-0.5"
                />
              </a>
            )
          )}
          <div className="flex flex-wrap items-center justify-end gap-x-2.5 gap-y-1.5">
            {item.technologies.map((tech) => (
              <Tag key={tech} label={tech} variant="tech" />
            ))}
          </div>
        </div>
      </div>
    </>
  );

  const shell =
    "panel probe group relative isolate flex flex-col overflow-hidden p-5";

  // Only the items backed by a real case study are clickable.
  if (item.slug) {
    return (
      <Link
        href={`/projects/${item.slug}`}
        /* Going deeper into the hierarchy, so the page transition slides
           rather than fades. The page's own "back to all projects" links
           carry `nav-back` and mirror it. */
        transitionTypes={["nav-forward"]}
        /* No lift and no drop shadow. These cards sit in a masonry column,
           and a card that rises on hover drags a shadow across the two it
           sits between — which looked like a rendering bug. The copper edge
           from `.panel-link` carries the affordance instead. */
        className={`${shell} panel-link marks`}
      >
        {/* Registration marks */}
        <span className="mark left-2 top-2 border-l border-t" aria-hidden="true" />
        <span className="mark right-2 top-2 border-r border-t" aria-hidden="true" />
        <span className="mark bottom-2 left-2 border-b border-l" aria-hidden="true" />
        <span className="mark bottom-2 right-2 border-b border-r" aria-hidden="true" />
        {body}
      </Link>
    );
  }

  return <div className={shell}>{body}</div>;
}
