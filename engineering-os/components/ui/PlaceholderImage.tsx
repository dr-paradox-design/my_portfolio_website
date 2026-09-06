import Image from "next/image";
import { ImageIcon } from "lucide-react";
import type { MediaAsset } from "@/types/project";

interface PlaceholderImageProps {
  asset: MediaAsset;
  className?: string;
  priority?: boolean;
}

export function ProjectImage({
  asset,
  className = "",
  priority = false,
}: PlaceholderImageProps) {
  if (asset.isPlaceholder) {
    return (
      <div
        className={`brackets group relative flex items-center justify-center overflow-hidden rounded-xl border border-dashed border-zinc-800 bg-zinc-900/30 ${className}`}
      >
        {/* Blueprint grid so an empty slot still reads as deliberate */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(#34d399 1px, transparent 1px), linear-gradient(90deg, #34d399 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
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
    /* `relative` is required — the Image below uses `fill`. */
    <figure className={`relative ${className}`}>
      <Image
        src={asset.src}
        alt={asset.alt}
        fill
        className="rounded-xl object-cover"
        priority={priority}
      />
      {asset.caption && (
        <figcaption className="mt-2 text-center text-xs text-zinc-500">
          {asset.caption}
        </figcaption>
      )}
    </figure>
  );
}
