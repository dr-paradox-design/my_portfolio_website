/**
 * The copper drawing grid, in one place.
 *
 * It was previously copy-pasted into `WorkPhotos` and `PlaceholderImage`
 * with different `backgroundSize` values (22px vs 24px), which is exactly
 * how a design language stops being one. The grid ties raw phone photos to
 * the rest of the site; that only works if it is the same grid everywhere.
 *
 * The colour is a literal because this object is spread into inline `style`,
 * which cannot resolve a Tailwind class. It must track `--color-copper-400`
 * in globals.css by hand — the one place in the app where that is true.
 */
export const BLUEPRINT_GRID = {
  backgroundImage:
    "linear-gradient(#c98a52 1px, transparent 1px), linear-gradient(90deg, #c98a52 1px, transparent 1px)",
  backgroundSize: "22px 22px",
} as const;

/** Panel fill from `.panel` in globals.css — scrims fade into it. */
export const PANEL_SURFACE = "#141821";
