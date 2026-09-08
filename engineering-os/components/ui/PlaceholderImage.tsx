import Image from "next/image";
import { ImageIcon } from "lucide-react";
import type { MediaAsset } from "@/types/project";
import { BLUEPRINT_GRID } from "@/components/projects/blueprint";

interface PlaceholderImageProps {
  asset: MediaAsset;
  className?: string;
  /**
   * Not `priority`. Next 16 deprecated that prop in favour of `preload`
   * — see the v16.0.0 row of the version table in
   * `node_modules/next/dist/docs/01-app/03-api-reference/02-components/image.md`
   * — because "priority" named the intent rather than the mechanism, which
   * is a `<link rel="preload">`.
   */
  preload?: boolean;
}

export function ProjectImage({
  asset,
  className = "",
  preload = false,
}: PlaceholderImageProps) {
  if (asset.isPlaceholder) {
    return (
      <div
        className={`brackets group relative flex items-center justify-center overflow-hidden rounded-xl border border-dashed border-zinc-800 bg-zinc-900/30 ${className}`}
      >
        {/* Blueprint grid so an empty slot still reads as deliberate */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={BLUEPRINT_GRID}
          aria-hidden="true"
        />

        <span className="bracket left-3 top-3 border-l border-t" aria-hidden="true" />
        <span className="bracket right-3 top-3 border-r border-t" aria-hidden="true" />
        <span className="bracket bottom-3 left-3 border-b border-l" aria-hidden="true" />
        <span className="bracket bottom-3 right-3 border-b border-r" aria-hidden="true" />

        <div className="relative z-10 flex flex-col items-center gap-2 p-8 text-center">
          <ImageIcon size={20} className="text-zinc-700" aria-hidden="true" />
          <p className="font-mono text-xs text-zinc-500">{asset.alt}</p>
          <p className="font-mono text-[11px] text-zinc-700">
            public{asset.src}
          </p>
        </div>
      </div>
    );
  }

  return (
    <figure>
      {/* `className` sizes *this* box, not the <figure>. The caller passes
          `aspect-video w-full`, and a `fill` image is absolutely positioned
          against its nearest positioned ancestor — so when the ratio and the
          `relative` both sat on the <figure>, the image covered the entire
          element and the caption below it was painted over, clipped by the
          fixed aspect height. Keeping the ratio on an inner div leaves the
          <figure> a normal-flow block that grows to fit image + caption. */}
      <div className={`relative ${className}`}>
        {/* `object-contain`, not `object-cover`. The only caller renders
            `architectureDiagrams` into a fixed `aspect-video` box, and a
            block diagram is not a photograph: cropping it to fill the frame
            silently cuts the pin labels off the edges, which are the part
            worth reading. Letterboxing is the correct failure mode here. */}
        <Image
          src={asset.src}
          alt={asset.alt}
          fill
          className="rounded-xl object-contain"
          preload={preload}
        />
      </div>
      {asset.caption && (
        <figcaption className="mt-2 text-center text-xs text-zinc-500">
          {asset.caption}
        </figcaption>
      )}
    </figure>
  );
}
