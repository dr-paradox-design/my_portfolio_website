import Image from "next/image";
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
/**
 * Two, not three. Names like "Pipelined microarchitecture" push a third tag
 * onto a second line, which makes some cards taller than their row-mates.
 * The full list is on the case study and on /projects.
 */
const MAX_TECHS = 2;

export function CompactWorkCard({ item }: { item: WorkItem }) {
  const shown = item.technologies.slice(0, MAX_TECHS);
  const overflow = item.technologies.length - shown.length;

  const hero = item.images?.[0];

  const body = (
    <>
      {/* The home grid is deliberately dense, so a photo cannot take a band of
          its own here without undoing that. Instead it sits behind the text as
          a faint wash — enough to give the card a subject at a glance, not
          enough to compete with it — and lifts on hover. Card height is
          unchanged either way. */}
      {hero && (
        <>
          <Image
            src={hero.src}
            alt="" /* decorative here; the real alt is on the /projects card */
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            style={{ objectPosition: hero.focus }}
            className="-z-10 object-cover opacity-[0.13] saturate-[0.55] transition-opacity duration-500 group-hover:opacity-[0.24]"
          />
          {/* Keeps the text side dark enough to stay readable over any photo. */}
          <div
            className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-r from-[#121215] via-[#121215]/85 to-[#121215]/35"
            aria-hidden="true"
          />
        </>
      )}

      <div className="mb-1.5 flex items-start justify-between gap-2">
        <h3
          className={`text-sm font-semibold leading-snug tracking-tight text-zinc-100 ${
            item.caseStudy ? "transition-colors group-hover:text-emerald-400" : ""
          }`}
        >
          {item.title}
        </h3>
        {/* Status sits up here rather than in the tag row, where it competed
            for horizontal space and forced the tags onto a second line. */}
        <div className="flex shrink-0 items-center gap-1.5">
          <StatusBadge status={item.status} />
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

      <p className="mb-2.5 line-clamp-2 text-xs leading-relaxed text-zinc-500">
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
      </div>
    </>
  );

  /* `isolate` matters: without a stacking context the -z-10 photo would paint
     behind the panel's own background and disappear entirely. */
  const shell =
    "panel isolate flex h-full flex-col overflow-hidden px-4 py-3.5 transition-all duration-300";

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
