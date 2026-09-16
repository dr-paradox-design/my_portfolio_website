import type { WorkStatus } from "@/lib/data/portfolio";

/**
 * The word for each status, for places that state it outright.
 *
 * Separate from the badge below on purpose. On a card, a badge is an
 * interruption, so "complete" is shown by *not* badging it. Under an
 * explicit "Status" label — the project page spec strip — that same
 * silence would be a labelled empty cell, so the word is needed there.
 * Same fact, two registers.
 */
export const STATUS_LABELS: Record<WorkStatus, string> = {
  complete: "Complete",
  ongoing: "Ongoing",
  upcoming: "Upcoming",
};

const styles: Record<WorkStatus, { badge: boolean; className: string }> = {
  // Completed work needs no badge shouting at the reader — it is the default.
  complete: { badge: false, className: "" },
  ongoing: {
    badge: true,
    className: "border-copper-600 text-copper-300",
  },
  upcoming: {
    badge: true,
    className: "border-board-700 text-board-400",
  },
};

/**
 * Marks work that is not finished. Deliberately renders nothing for
 * completed items so that "Ongoing" and "Upcoming" stay honest signals
 * rather than decoration.
 */
export function StatusBadge({ status }: { status: WorkStatus }) {
  const style = styles[status];
  if (!style.badge) return null;

  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 border px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-widest ${style.className}`}
    >
      {/* The one status LED on the page. Round, because this is the single
          element that is genuinely an indicator rather than drawing
          furniture, and the shape difference is what makes it read as one. */}
      {status === "ongoing" && (
        <span
          className="animate-blink h-1 w-1 rounded-full bg-copper-300"
          aria-hidden="true"
        />
      )}
      {STATUS_LABELS[status]}
    </span>
  );
}
