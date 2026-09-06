/**
 * The emerald blueprint grid, in one place.
 *
 * It was previously copy-pasted into `WorkPhotos` and `PlaceholderImage`
 * with different `backgroundSize` values (22px vs 24px), which is exactly
 * how a design language stops being one. The grid ties raw phone photos to
 * the rest of the site; that only works if it is the same grid everywhere.
 */
export const BLUEPRINT_GRID = {
  backgroundImage:
    "linear-gradient(#34d399 1px, transparent 1px), linear-gradient(90deg, #34d399 1px, transparent 1px)",
  backgroundSize: "22px 22px",
} as const;

/** Panel top colour from `.panel` in globals.css — scrims fade into it. */
export const PANEL_SURFACE = "#121215";
