import Image from "next/image";
import type { WorkImage } from "@/lib/data/portfolio";

/**
 * Photo band that sits at the top of a work card.
 *
 * These are phone snapshots from labs, fields, and competition arenas —
 * dropped in raw they would fight a flat dark UI. Four things keep them
 * inside the design language instead of sitting on top of it:
 *
 *   1. A scrim at the bottom edge dissolves the photo into the panel
 *      surface, so there is no hard rectangle boundary.
 *   2. The same emerald blueprint grid used in the hero is laid over the
 *      image at very low opacity, tying it to the rest of the site.
 *   3. Photos are slightly desaturated and dimmed at rest and come up to
 *      full on hover — they read as texture until you look at them.
 *   4. Everything bleeds to the card edges (negative margins), so the
 *      photo is part of the card rather than an inset picture in it.
 *
 * The component assumes it is rendered inside a `group` with `p-5`.
 */

/** Extra photos beyond the hero. Four thumbs is already a busy card. */
const MAX_STRIP = 3;

/** Panel top colour from `.panel` in globals.css — the scrim fades into it. */
const PANEL = "#121215";

const BLUEPRINT = {
  backgroundImage:
    "linear-gradient(#34d399 1px, transparent 1px), linear-gradient(90deg, #34d399 1px, transparent 1px)",
  backgroundSize: "22px 22px",
} as const;

export function WorkPhotos({ images }: { images: WorkImage[] }) {
  if (images.length === 0) return null;

  const [hero, ...rest] = images;
  const strip = rest.slice(0, MAX_STRIP);

  return (
    <div className="relative -mx-5 -mt-5 mb-4 overflow-hidden">
      <div className="relative aspect-[16/9] overflow-hidden bg-zinc-900">
        <Image
          src={hero.src}
          alt={hero.alt}
          fill
          sizes="(min-width: 640px) 50vw, 100vw"
          style={{ objectPosition: hero.focus }}
          className="object-cover brightness-[0.85] saturate-[0.8] transition duration-700 ease-out group-hover:scale-[1.03] group-hover:brightness-100 group-hover:saturate-100"
        />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.05]"
          style={BLUEPRINT}
          aria-hidden="true"
        />

        {/* Caption rides the hero's lower edge instead of taking a row of its
            own, so a captioned card is exactly as tall as an uncaptioned one. */}
        {hero.caption && (
          <>
            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-black/75 to-transparent"
              aria-hidden="true"
            />
            <p className="absolute bottom-2.5 left-5 font-mono text-[11px] tracking-wide text-zinc-200">
              {hero.caption}
            </p>
          </>
        )}
      </div>

      {strip.length > 0 && (
        <div className="flex gap-px">
          {strip.map((img) => (
            <div
              key={img.src}
              className="relative aspect-[3/2] flex-1 overflow-hidden bg-zinc-900"
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="(min-width: 640px) 17vw, 33vw"
                style={{ objectPosition: img.focus }}
                className="object-cover brightness-[0.7] saturate-[0.65] transition duration-500 group-hover:brightness-95 group-hover:saturate-100"
              />
            </div>
          ))}
        </div>
      )}

      {/* Dissolves the bottom edge of the whole block into the card surface. */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-16"
        style={{
          backgroundImage: `linear-gradient(to top, ${PANEL} 0%, ${PANEL}cc 45%, transparent 100%)`,
        }}
        aria-hidden="true"
      />
    </div>
  );
}
