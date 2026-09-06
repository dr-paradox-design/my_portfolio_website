import Link from "next/link";
import { ArrowUpRight, Star } from "lucide-react";
import type { WorkItem } from "@/lib/data/portfolio";
import { StatusBadge } from "@/components/ui/StatusBadge";

/**
 * Dense variant of WorkItemCard, used on the home page where the goal is to
 * fit more of the strongest work above the fold rather than to explain any
 * one item. The summary is clamped to two lines and the technology list is
 * capped, so every card occupies the same height regardless of how much
 * information sits behind it.
 *
 * Items without a case study are still shown — they are simply not clickable,
 * same rule as the full inventory.
 */
const MAX_TECHS = 3;

export function CompactWorkCard({ item }: { item: WorkItem }) {
  const shown = item.technologies.slice(0, MAX_TECHS);
  const overflow = item.technologies.length - shown.length;

  const body = (
    <>
      <div className="mb-1.5 flex items-start justify-between gap-2">
        <h3
          className={`text-sm font-semibold leading-snug tracking-tight text-zinc-100 ${
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
              <Star size={11} fill="currentColor" />
            </span>
          )}
          {item.caseStudy && (
            <ArrowUpRight
              size={14}
              className="text-zinc-600 transition-colors group-hover:text-emerald-400"
              aria-hidden="true"
            />
          )}
        </div>
      </div>

      <p className="mb-3 line-clamp-2 text-xs leading-relaxed text-zinc-500">
        {item.summary}
      </p>

      {/* Via dots separate the tags — several technology names contain spaces
          ("6-layer PCB"), so plain gaps alone blur the word boundaries. */}
      <div className="mt-auto flex flex-wrap items-center gap-x-2.5 gap-y-1 font-mono text-[11px] text-emerald-400/90">
        {shown.map((tech) => (
          <span key={tech} className="inline-flex items-center gap-1.5">
            <span
              className="h-1 w-1 shrink-0 rounded-full bg-emerald-400/40"
              aria-hidden="true"
            />
            {tech}
          </span>
        ))}
        {overflow > 0 && <span className="text-zinc-600">+{overflow}</span>}
        <StatusBadge status={item.status} />
      </div>
    </>
  );

  const shell = "panel flex h-full flex-col p-4 transition-all duration-300";

  if (item.caseStudy) {
    return (
      <Link
        href={`/projects/${item.caseStudy}`}
        className={`${shell} group hover:-translate-y-0.5 hover:border-zinc-700`}
      >
        {body}
      </Link>
    );
  }

  return <div className={shell}>{body}</div>;
}
