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
      <span className="inline-block rounded-full border border-zinc-700/80 bg-zinc-800/40 px-2.5 py-0.5 text-xs text-zinc-400 transition-colors group-hover:border-zinc-600 group-hover:text-zinc-300">
        {label}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 font-mono text-xs text-emerald-400/90">
      {/* Via dot — a nod to a PCB pad, and it separates tags without commas */}
      <span
        className="h-1 w-1 rounded-full bg-emerald-400/40"
        aria-hidden="true"
      />
      {label}
    </span>
  );
}
