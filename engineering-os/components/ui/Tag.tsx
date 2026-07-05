/**
 * Signature element: monospace tech tags — not filled pill badges,
 * but `font-mono text-emerald-400` inline labels. Quiet and precise.
 */

interface TagProps {
  label: string;
  variant?: "domain" | "tech";
}

export function Tag({ label, variant = "tech" }: TagProps) {
  if (variant === "domain") {
    return (
      <span className="inline-block rounded-full border border-zinc-700 px-2.5 py-0.5 text-xs text-zinc-400">
        {label}
      </span>
    );
  }
  return (
    <span className="font-mono text-xs text-emerald-400">
      {label}
    </span>
  );
}
