import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";
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

  const body = (
    <>
      <SpotlightEffect />

      <div className="relative z-10 flex h-full flex-col">
        {item.images && item.images.length > 0 && (
          <WorkPhotos images={item.images} />
        )}

        <div className="mb-2.5 flex items-start justify-between gap-3">
          <h3
            className={`text-base font-semibold leading-snug tracking-tight text-zinc-100 ${
              item.slug ? "transition-colors group-hover:text-emerald-400" : ""
            }`}
          >
            {item.title}
          </h3>
          <div className="flex shrink-0 items-center gap-1.5">
            {item.tier === "flagship" && (
              <span
                className="text-emerald-400/70"
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
          <p className="mb-2.5 font-mono text-xs text-zinc-500">{item.context}</p>
        )}

        <p className="mb-4 text-sm leading-relaxed text-zinc-400">{item.summary}</p>

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
          {item.slug && (
            <span className="mr-auto flex shrink-0 items-center gap-1.5 text-sm font-medium text-emerald-400">
              {ctaLabel}
              <ArrowRight
                size={14}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </span>
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
    "panel spotlight group relative isolate flex flex-col overflow-hidden p-5 transition-all duration-300";

  // Only the items backed by a real case study are clickable.
  if (item.slug) {
    return (
      <Link
        href={`/projects/${item.slug}`}
        className={`${shell} brackets hover:-translate-y-1 hover:border-zinc-700 hover:shadow-[0_16px_40px_-16px_rgba(0,0,0,0.9)]`}
      >
        {/* Crop marks */}
        <span className="bracket left-2.5 top-2.5 border-l border-t" aria-hidden="true" />
        <span className="bracket right-2.5 top-2.5 border-r border-t" aria-hidden="true" />
        <span className="bracket bottom-2.5 left-2.5 border-b border-l" aria-hidden="true" />
        <span className="bracket bottom-2.5 right-2.5 border-b border-r" aria-hidden="true" />
        {body}
      </Link>
    );
  }

  return <div className={shell}>{body}</div>;
}
