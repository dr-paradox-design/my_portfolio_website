import { ImageResponse } from "next/og";
import { profile } from "@/lib/data/profile";
import { BLUEPRINT_GRID } from "@/components/projects/blueprint";

/**
 * The card every link to this site renders as — in a LinkedIn message, a
 * WhatsApp chat, a recruiter's inbox.
 *
 * Three constraints shape everything below, and none of them are stylistic:
 *
 *   1. **One font weight.** No `fonts` option is passed, so this renders in
 *      `@vercel/og`'s bundled `Geist-Regular.ttf` — which happens to be the
 *      site's own typeface, for free, with no asset to ship. But only weight
 *      400 exists. Hierarchy therefore comes from size ratio, colour, and
 *      letter-spacing. Never reach for `fontWeight: bold` here; satori would
 *      either ignore it or synthesise something ugly.
 *
 *   2. **Flexbox only.** Satori supports no `display: grid`, and throws on
 *      any element with children that lacks an explicit `display: "flex"`.
 *      The redundant-looking `display: "flex"` on single-child divs below is
 *      load-bearing.
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
          background: "#09090b",
          position: "relative",
        }}
      >
        {/* 40px rather than the site's 22px: at 1200×630 a 22px tile is
            ~1500 repeats, which reads as noise instead of a grid. */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            opacity: 0.05,
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
            color: "#34d399",
          }}
        >
          {profile.institution}
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 78,
            lineHeight: 1.1,
            marginTop: 26,
            color: "#fafafa",
          }}
        >
          {profile.name}
        </div>

        {/* The one horizontal rule. With a single font weight available,
            this is what separates the name from the sentence. */}
        <div
          style={{
            display: "flex",
            width: 96,
            height: 3,
            margin: "34px 0",
            background: "#34d399",
          }}
        />

        <div
          style={{
            display: "flex",
            fontSize: 29,
            lineHeight: 1.45,
            maxWidth: 900,
            color: "#a1a1aa",
          }}
        >
          {profile.tagline}
        </div>
      </div>
    ),
    { ...size },
  );
}
