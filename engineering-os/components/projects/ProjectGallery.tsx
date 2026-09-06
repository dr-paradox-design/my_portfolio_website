import Image from "next/image";
import type { WorkImage } from "@/lib/data/portfolio";
import { BLUEPRINT_GRID } from "@/components/projects/blueprint";

/**
 * The build log: a project's photographs in narrative order, numbered.
 *
 * Server component. No state, no client JS.
 *
 * Three decisions here are deliberate inversions of how the same photos are
 * treated on the cards, and they should not be "made consistent" later:
 *
 *   1. **Photos are never upscaled.** Each figure is capped at the image's
 *      own intrinsic width. These are WhatsApp-compressed phone shots
 *      ranging from about 200px to 570px on the long edge; stretching a
 *      202px photo across a 576px column would show a reader nothing but
 *      the compression. A small photo shown small is sharp and honest. The
 *      column therefore has a ragged right edge, on purpose — it reads like
 *      a lab notebook rather than a grid of uniform tiles.
 *
 *   2. **Natural aspect ratio, never `object-cover`.** Roughly half of
 *      these are portrait. Cropping them to a uniform band on the one page
 *      whose entire job is showing them would be self-defeating. `focus`
 *      exists for the card crops and has no meaning here.
 *
 *   3. **Full saturation at rest.** On cards, photos are dimmed and
 *      desaturated so they read as texture behind the text. Here they are
 *      the subject.
 *
 * There is no lightbox, and adding one would be a regression. A lightbox
 * exists to reveal a larger version of an image; there is no larger version
 * — the file on disk is already being shown at 1:1. It would cost a focus
 * trap, a scroll lock, and an Escape handler in order to display identical
 * pixels.
 */
export function ProjectGallery({ images }: { images: WorkImage[] }) {
  if (images.length === 0) return null;

  return (
    <ol className="space-y-8">
      {images.map((img, i) => (
        <li key={img.alt}>
          <figure>
            <div
              className="relative overflow-hidden rounded-lg border border-zinc-800/80 bg-zinc-900"
              /* See note 1: the cap is the file's own width, so the browser
                 never renders a pixel that isn't in the source. */
              style={{ maxWidth: img.src.width }}
            >
              {/* No `sizes` prop, deliberately. With one, Next generates a
                  full responsive srcset off `deviceSizes`, whose smallest
                  entry is 640 — so the browser requests w=640 for a 202px
                  photo, an upscale request for an image that must never be
                  upscaled. Without it Next emits a fixed-size 1x/2x srcset
                  from the file's own intrinsic width, which is exactly what
                  a never-upscaled image wants. See the next/image docs:
                  "Without sizes ... suitable for fixed-size images." */}
              <Image
                src={img.src}
                alt={img.alt}
                placeholder="blur"
                className="h-auto w-full"
              />
              {/* Same grid as the hero and the card photos — it is what
                  keeps a raw phone snapshot inside the design language
                  instead of sitting on top of it. */}
              <div
                className="pointer-events-none absolute inset-0 opacity-[0.045]"
                style={BLUEPRINT_GRID}
                aria-hidden="true"
              />
            </div>

            {img.caption && (
              <figcaption className="mt-2.5 flex items-baseline gap-2.5 font-mono text-xs text-zinc-500">
                {/* The numbering is what makes this read as a sequence
                    rather than a pile of photos. */}
                <span className="tabular-nums text-emerald-400/70">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span
                  className="h-px w-4 shrink-0 translate-y-[-0.2em] bg-zinc-800"
                  aria-hidden="true"
                />
                {img.caption}
              </figcaption>
            )}
          </figure>
        </li>
      ))}
    </ol>
  );
}
