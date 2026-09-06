import type { WorkStatus } from "@/lib/data/portfolio";

const styles: Record<WorkStatus, { label: string; className: string }> = {
  // Completed work needs no badge shouting at the reader — it is the default.
  complete: {
    label: "",
    className: "",
  },
  ongoing: {
    label: "Ongoing",
    className: "border-emerald-400/30 bg-emerald-400/10 text-emerald-400",
  },
  upcoming: {
    label: "Upcoming",
    className: "border-zinc-700 bg-zinc-800/50 text-zinc-400",
  },
};

/**
 * Marks work that is not finished. Deliberately renders nothing for
 * completed items so that "Ongoing" and "Upcoming" stay honest signals
 * rather than decoration.
 */
export function StatusBadge({ status }: { status: WorkStatus }) {
  const style = styles[status];
  if (!style.label) return null;

  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1 rounded-full border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide ${style.className}`}
    >
      {status === "ongoing" && (
        <span className="animate-blink h-1 w-1 rounded-full bg-emerald-400" aria-hidden="true" />
      )}
      {style.label}
    </span>
  );
}
