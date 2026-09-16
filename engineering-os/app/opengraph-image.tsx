import { ImageResponse } from "next/og";
import { profile } from "@/lib/data/profile";
import { BLUEPRINT_GRID } from "@/components/projects/blueprint";

/**
 * The card every link to this site renders as — in a LinkedIn message, a
 * WhatsApp chat, a recruiter's inbox.
 *
 * Three constraints shape everything below, and none of them are stylistic:
 *
 *   1. **One font weight, and not the site's typeface.** No `fonts` option is
 *      passed, so this renders in `@vercel/og`'s bundled `Geist-Regular.ttf`
 *      at weight 400 — the site itself now sets Space Grotesk, so the card no
 *      longer matches it letterform-for-letterform. Shipping Space Grotesk
 *      here means fetching and embedding the woff on every render, against a
 *      500KB bundle cap, to fix something nobody sees side by side. The card
 *      earns its family resemblance from the palette, the grid, and the
 *      two-ink name instead. Hierarchy comes from size ratio, colour, and
 *      letter-spacing: never reach for `fontWeight: bold` here, as satori
 *      would either ignore it or synthesise something ugly.
 *
 *   2. **Flexbox only, and a smaller CSS vocabulary than the browser's.**
 *      Satori supports no `display: grid`, and throws on any element with
 *      children that lacks an explicit `display: "flex"` — so the
 *      redundant-looking `display: "flex"` on single-child divs below is
 *      load-bearing. Properties it does *not* implement are dropped without
 *      an error, which is the more dangerous half: `inset: 0` on the grid
 *      overlay below silently produced a 0×0 element and a blank card.
 *
 *   3. **No photographs.** Static image imports resolve to hashed
 *      `/_next/static/media/…` paths, so the original file is not reachable
 *      from inside this route, and satori caps the whole bundle at 500KB.
 *      The card is typographic on purpose.
 *
 * The blueprint grid is the same constant the photo frames use. Satori
 * renders `linear-gradient` natively, so the card sits inside the site's
 * design language rather than beside it.
 */

/* Same split as `app/page.tsx`, kept local rather than shared: this route is
   bundled separately for satori, and importing a helper just to slice one
   string would pull page code into that bundle for no gain. */
const [givenName, ...restOfName] = profile.name.split(" ");
const familyName = restOfName.join(" ");

export const alt = `${profile.name} — ${profile.title}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "0 88px",
          /* These literals track globals.css by hand — satori cannot read a
             CSS custom property, so `--color-board-950` and friends are not
             reachable from here. If the palette moves, move these too:
             #0c0f14 board-950, #c98a52 copper-400, #f2eee8 board-50,
             #a3a099 board-400. */
          background: "#0c0f14",
          position: "relative",
        }}
      >
        {/* Three values here were each arrived at by rendering, not by taste:

            - **`top`/`left`/`width`/`height`, never `inset: 0`.** Satori does
              not implement the `inset` shorthand — it is not in its style
              parser at all, and unknown properties are dropped in silence.
              With no children and no size the overlay collapses to 0×0 and the
              grid never paints. There is no warning; the card just renders
              flat and looks intentional.

            - **40px, not the site's 22px.** At 1200×630 a 22px tile is ~1500
              repeats, which reads as noise rather than as a grid.

            - **0.10, not the site's 0.05.** On the site this grid sits over
              photographs, which give it something to bite against. Over flat
              #09090b at 5% it is invisible, and a share card is often
              displayed at half size or less. */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            opacity: 0.1,
            ...BLUEPRINT_GRID,
            backgroundSize: "40px 40px",
          }}
        />

        <div
          style={{
            display: "flex",
            fontSize: 22,
            letterSpacing: 8,
            textTransform: "uppercase",
            color: "#c98a52",
          }}
        >
          {profile.institution}
        </div>

        {/* Two inks, same split as the hero headline — given name in
            silkscreen white, family name in copper. A single flex row rather
            than nested spans, because satori's inline layout is the part of
            its CSS engine most likely to surprise. */}
        <div
          style={{
            display: "flex",
            fontSize: 78,
            lineHeight: 1.1,
            marginTop: 26,
          }}
        >
          <div style={{ display: "flex", color: "#f2eee8" }}>{givenName}</div>
          {familyName && (
            <div style={{ display: "flex", color: "#c98a52", marginLeft: 22 }}>
              {familyName}
            </div>
          )}
        </div>

        {/* The one horizontal rule. With a single font weight available,
            this is what separates the name from the sentence. */}
        <div
          style={{
            display: "flex",
            width: 96,
            height: 3,
            margin: "34px 0",
            background: "#c98a52",
          }}
        />

        <div
          style={{
            display: "flex",
            fontSize: 29,
            lineHeight: 1.45,
            maxWidth: 900,
            color: "#a3a099",
          }}
        >
          {profile.tagline}
        </div>
      </div>
    ),
    { ...size },
  );
}
