import Image from "next/image";
import Link from "next/link";
import { ViewTransition } from "react";
import { ArrowUpRight, Code2, Star } from "lucide-react";
import { coverImage, type WorkItem } from "@/lib/data/portfolio";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { BLUEPRINT_GRID, PANEL_SURFACE } from "@/components/projects/blueprint";

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

  const hero = coverImage(item.images);

  /* Shares its `name` with the `<h1>` on the project page, so the title
     morphs across the navigation. Identical mechanism to WorkItemCard —
     the home grid and /projects are never on screen at the same time, so
     both may claim the same name. */
  const titleEl = (
    <h3
      className={`text-sm font-semibold leading-snug tracking-tight text-board-50 ${
        item.slug ? "transition-colors group-hover:text-copper-400" : ""
      }`}
    >
      {item.title}
    </h3>
  );
  const heading = item.slug ? (
    <ViewTransition name={`project-title-${item.slug}`} share="project-title">
      {titleEl}
    </ViewTransition>
  ) : (
    titleEl
  );

  const body = (
    <>
      {/* The photo takes a band of its own rather than sitting behind the text
          as a faint wash. The wash kept every card exactly as tall as a
          text-only one, but it also meant you could not actually see any of
          the work from the home page — six dark rectangles with a suggestion
          of a shape in them. A real band costs one row of height and is the
          difference between a grid of cards and a grid of projects.

          Full-bleed via negative margins that cancel the shell's own `px-4
          py-3.5`, so the photo meets the cell rules with no inset frame. */}
      <div className="-mx-4 -mt-3.5 mb-3">
        {hero ? (
          <div className="relative aspect-[16/7] overflow-hidden bg-board-950">
            <Image
              src={hero.src}
              alt="" /* decorative here; the real alt is on the /projects card */
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              style={{ objectPosition: hero.focus }}
              className="object-cover brightness-[0.78] saturate-[0.7] transition duration-700 ease-out group-hover:scale-[1.03] group-hover:brightness-100 group-hover:saturate-100"
            />
            {/* Ties a raw phone snapshot back into the drawing language, same
                as the /projects cards and the OG images. */}
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.05]"
              style={BLUEPRINT_GRID}
              aria-hidden="true"
            />
            {/* Dissolves the lower edge into the card surface so the band has
                no hard boundary against the title below it. */}
            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 h-10"
              style={{
                backgroundImage: `linear-gradient(to top, ${PANEL_SURFACE} 0%, transparent 100%)`,
              }}
              aria-hidden="true"
            />
          </div>
        ) : (
          /* Not every item has been photographed. An empty band would make
             that card the odd one out; a ruled panel carrying the item's own
             domain keeps the row's rhythm and still says something true. */
          <div className="relative flex aspect-[16/7] items-center justify-center overflow-hidden border-b border-dashed border-board-800 bg-board-950">
            <div
              className="absolute inset-0 opacity-[0.07]"
              style={BLUEPRINT_GRID}
              aria-hidden="true"
            />
            <p className="field relative z-10 px-4 text-center text-board-600">
              {item.domain}
            </p>
          </div>
        )}
      </div>

      <div className="mb-1.5 flex items-start justify-between gap-2">
        {heading}
        {/* Status sits up here rather than in the tag row, where it competed
            for horizontal space and forced the tags onto a second line. */}
        <div className="flex shrink-0 items-center gap-1.5">
          <StatusBadge status={item.status} />
          {item.tier === "flagship" && (
            <span
              className="text-copper-400"
              title="Flagship project"
              aria-label="Flagship project"
            >
              <Star size={11} fill="currentColor" />
            </span>
          )}
          {/* The affordance in this corner tells you what the card does. With
              a slug the whole card is the link, so the arrow is decorative and
              hidden from assistive tech. Without one, the only thing to open
              is the repo, so the icon *is* the control and has to carry its
              own accessible name.

              Icon-only because this grid is deliberately dense — "Source on
              GitHub" in full is on the /projects card, which has the room.
              A 14px icon is well under the 24px minimum target size, so the
              padding grows the hit area to 26px and the matching negative
              margin pulls the box back so the glyph does not move. The two
              must stay equal and opposite; changing one alone shifts the
              icon. The extra 6px overlaps the star, which is not a control,
              and stays inside the card's own px-4 padding. */}
          {item.slug ? (
            <ArrowUpRight
              size={14}
              className="text-board-600 transition-colors group-hover:text-copper-400"
              aria-hidden="true"
            />
          ) : (
            item.repoUrl && (
              <a
                href={item.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="Source on GitHub"
                aria-label={`${item.title} — source on GitHub`}
                className="-m-1.5 p-1.5 text-board-600 transition-colors hover:text-copper-400"
              >
                <Code2 size={14} />
              </a>
            )
          )}
        </div>
      </div>

      <p className="mb-2.5 line-clamp-2 text-xs leading-relaxed text-board-400">
        {item.summary}
      </p>

      {/* Vias separate the tags — several technology names contain spaces
          ("6-layer PCB"), so plain gaps alone blur the word boundaries. */}
      <div className="mt-auto flex flex-wrap items-center gap-x-2.5 gap-y-1 font-mono text-[11px] text-copper-400">
        {shown.map((tech) => (
          <span key={tech} className="inline-flex items-center gap-1.5">
            <span
              className="h-[3px] w-[3px] shrink-0 bg-copper-600"
              aria-hidden="true"
            />
            {tech}
          </span>
        ))}
        {overflow > 0 && <span className="text-board-600">+{overflow}</span>}
      </div>
    </>
  );

  /* No border and no `.panel`: the home grid draws its own rules with
     `gap-px` over a `board-800` background, so a border here would double
     every internal line and thicken the outer frame.

     `relative` is load-bearing and must not be dropped along with `.panel`,
     which is where it used to come from. `<Image fill>` is absolutely
     positioned, so with no positioned ancestor it resolves against the
     viewport — which is exactly how one card's photo once ended up painted
     across the whole page as a grey wash over the hero. */
  const shell =
    "relative flex h-full flex-col overflow-hidden bg-board-900 px-4 py-3.5";

  if (item.slug) {
    return (
      <Link
        href={`/projects/${item.slug}`}
        /* Same direction signal as the full card on /projects. */
        transitionTypes={["nav-forward"]}
        /* The cell lightens rather than lifting. A translate would break the
           ruled grid — the card would pull away from its own dividing lines
           and leave a gap where the rule used to be. */
        className={`${shell} group transition-colors duration-200 hover:bg-board-800`}
      >
        {body}
      </Link>
    );
  }

  return <div className={shell}>{body}</div>;
}
