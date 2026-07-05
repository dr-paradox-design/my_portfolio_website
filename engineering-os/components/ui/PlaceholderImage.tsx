import Image from "next/image";
import type { MediaAsset } from "@/types/project";

interface PlaceholderImageProps {
  asset: MediaAsset;
  className?: string;
  priority?: boolean;
}

export function ProjectImage({ asset, className = "", priority = false }: PlaceholderImageProps) {
  if (asset.isPlaceholder) {
    return (
      <div className={`flex items-center justify-center bg-zinc-900 border border-zinc-800 rounded-lg ${className}`}>
        <div className="text-center p-8">
          <div className="text-3xl mb-2">📷</div>
          <p className="text-xs font-mono text-zinc-500">{asset.alt}</p>
          <p className="text-xs text-zinc-600 mt-1">Drop image at public{asset.src}</p>
        </div>
      </div>
    );
  }
  return (
    <figure className={className}>
      <Image
        src={asset.src}
        alt={asset.alt}
        fill
        className="object-cover rounded-lg"
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
