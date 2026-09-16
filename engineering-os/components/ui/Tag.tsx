/**
 * Signature element: monospace tech tags — not filled pill badges,
 * but `font-mono text-copper-400` inline labels. Quiet and precise.
 */

interface TagProps {
  label: string;
  variant?: "domain" | "tech";
}

export function Tag({ label, variant = "tech" }: TagProps) {
  if (variant === "domain") {
    return (
      <span className="inline-block border border-board-700 px-2 py-0.5 font-mono text-[11px] uppercase tracking-wider text-board-400 transition-colors group-hover:border-board-600 group-hover:text-board-300">
        {label}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 font-mono text-xs text-copper-400">
      {/* Via — a plated through-hole, and it separates tags without commas.
          Square rather than round to match the rest of the language; at 3px
          the shape barely reads, but it reads as *deliberate*. */}
      <span className="h-[3px] w-[3px] bg-copper-600" aria-hidden="true" />
      {label}
    </span>
  );
}
