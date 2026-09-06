import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";
import type { WorkItem } from "@/lib/data/portfolio";
import { Tag } from "@/components/ui/Tag";
import { SpotlightEffect } from "@/components/ui/SpotlightEffect";
import { StatusBadge } from "@/components/ui/StatusBadge";

/**
 * Summary-depth card for the full work inventory. Items with a `caseStudy`
 * slug link through to their deep write-up; the rest are presented at the
 * depth the available information actually supports.
 */
export function WorkItemCard({ item }: { item: WorkItem }) {
  const body = (
    <>
      <SpotlightEffect />

      <div className="relative z-10 flex h-full flex-col">
        <div className="mb-2.5 flex items-start justify-between gap-3">
          <h3
            className={`text-base font-semibold leading-snug tracking-tight text-zinc-100 ${
              item.caseStudy ? "transition-colors group-hover:text-emerald-400" : ""
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

        <div className="mt-auto">
          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5">
            {item.technologies.map((tech) => (
              <Tag key={tech} label={tech} variant="tech" />
            ))}
          </div>

          {item.caseStudy && (
            <div className="mt-4 flex items-center gap-1.5 text-sm font-medium text-emerald-400">
              Read case study
              <ArrowRight
                size={14}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </div>
          )}
        </div>
      </div>
    </>
  );

  const shell =
    "panel spotlight group relative isolate flex flex-col overflow-hidden p-5 transition-all duration-300";

  // Only the items backed by a real case study are clickable.
  if (item.caseStudy) {
    return (
      <Link
        href={`/projects/${item.caseStudy}`}
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
