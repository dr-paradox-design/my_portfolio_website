"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowUpRight, Play } from "lucide-react";
import type { WorkVideo } from "@/lib/data/portfolio";
import { BLUEPRINT_GRID } from "@/components/projects/blueprint";

/**
 * The thing working, rather than photographs of the thing built.
 *
 * **A facade, not an embed.** Nothing from Google loads until the reader
 * asks for it. A YouTube iframe dropped straight into the page pulls roughly
 * a megabyte of player JS and sets cookies on a visitor who never pressed
 * play — on a page whose whole job is to load fast for someone skimming
 * between candidates. So the resting state is a local still and a button,
 * and the iframe is mounted on click.
 *
 * That is also the only reason this is a client component. It holds one
 * boolean. Following `SpotlightEffect`'s rule — only the leaf that needs JS
 * ships JS — the surrounding project page stays a server component.
 *
 * Two details that look like nits and are not:
 *
 *   - **`youtube-nocookie.com`.** Same player, no tracking cookie until
 *     playback. Costs nothing, so there is no argument for the other host.
 *
 *   - **`object-cover` here, unlike `ProjectGallery`.** The gallery refuses
 *     to crop because a photo's own aspect ratio is the honest way to show
 *     it. A video frame is 16:9 by construction, so the poster is being
 *     fitted to the shape the content already has. `poster.focus` is the
 *     escape hatch when the still is a portrait phone shot.
 */
export function ProjectVideo({ video }: { video: WorkVideo }) {
  const [playing, setPlaying] = useState(false);
  const { youtubeId, title, poster, caption, linkLabel } = video;

  return (
    <figure>
      <div className="relative aspect-video overflow-hidden rounded-lg border border-zinc-800/80 bg-zinc-900">
        {playing ? (
          <iframe
            /* `autoplay=1` is correct rather than intrusive: this iframe only
               exists because the reader just pressed play, and without it
               they would have to press play a second time. */
            src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="absolute inset-0 h-full w-full"
          />
        ) : (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            className="group absolute inset-0 cursor-pointer"
          >
            <Image
              src={poster.src}
              alt={poster.alt}
              placeholder="blur"
              sizes="(min-width: 640px) 36rem, 100vw"
              className="h-full w-full object-cover brightness-[0.72] transition duration-500 group-hover:brightness-90"
              style={poster.focus ? { objectPosition: poster.focus } : undefined}
            />

            {/* Same grid as the gallery and the OG cards — it is what keeps a
                raw phone still inside the design language. */}
            <span
              className="pointer-events-none absolute inset-0 opacity-[0.045]"
              style={BLUEPRINT_GRID}
              aria-hidden="true"
            />

            <span className="absolute inset-0 flex items-center justify-center">
              <span className="flex h-16 w-16 items-center justify-center rounded-full border border-emerald-400/30 bg-zinc-950/70 backdrop-blur-sm transition-all duration-300 group-hover:scale-105 group-hover:border-emerald-400/60 group-hover:bg-zinc-950/85 group-hover:shadow-[0_0_32px_-6px_rgba(52,211,153,0.55)]">
                {/* Nudged right so the triangle's optical centre, not its
                    bounding box, sits in the middle of the circle. */}
                <Play
                  size={22}
                  className="translate-x-[2px] fill-emerald-400 text-emerald-400"
                  aria-hidden="true"
                />
              </span>
            </span>

            <span className="sr-only">Play video: {title}</span>
          </button>
        )}
      </div>

      <figcaption className="mt-2.5 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 font-mono text-xs text-zinc-500">
        {caption && <span>{caption}</span>}
        {/* Always offered: an embed can be blocked by an extension, a network,
            or a country, and this is the fallback that still works. */}
        <a
          href={`https://www.youtube.com/watch?v=${youtubeId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="group ml-auto inline-flex items-center gap-1 transition-colors hover:text-emerald-400"
        >
          {linkLabel ?? "Watch on YouTube"}
          <ArrowUpRight
            size={12}
            className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </a>
      </figcaption>
    </figure>
  );
}
