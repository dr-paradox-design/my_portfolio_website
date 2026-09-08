import { ImageResponse } from "next/og";
import { notFound } from "next/navigation";
import { getProjectPage, routedSlugs } from "@/lib/data/projectPage";
import { STATUS_LABELS } from "@/components/ui/StatusBadge";
import { BLUEPRINT_GRID } from "@/components/projects/blueprint";

/**
 * The card a *project* link renders as. Sharing `/projects/warehouse-drone`
 * shows the warehouse drone, not the site's front door.
 *
 * See `app/opengraph-image.tsx` for the shared constraints — one font weight,
 * flexbox only, no photographs. Two more apply only here, and both are
 * silent failures rather than errors, so they are worth stating:
 *
 *   1. **This route does not inherit the sibling `page.tsx`'s
 *      `generateStaticParams`.** It compiles to its own route, so it needs
 *      its own copy or nothing prerenders.
 *
 *   2. **`dynamicParams` is stripped from metadata image files.** See
 *      `createReExportsCode` in
 *      `next/dist/build/webpack/loaders/next-metadata-route-loader.js`, which
 *      filters out `default`, `generateSitemaps`, and `dynamicParams` when
 *      re-exporting userland config. Setting `export const dynamicParams =
 *      false` here would look right and do nothing. The `notFound()` below is
 *      the actual guard — the page's own is not in this code path.
 */

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/* `alt` is a static export, so it cannot vary per slug. `generateImageMetadata`
   could make it dynamic; a generic string is not worth that machinery. */
export const alt = "Project — Swastik Aditya Ranjan";

export function generateStaticParams() {
  return routedSlugs.map((slug) => ({ slug }));
}

/** Cut at a word boundary so a card never ends mid-word.
 *
 *  The budget is 260, which is four lines of body text at 27px/1.45 — about
 *  80 characters to a line at this width. It was 180, which is three, and
 *  three was cutting the last sentence off several summaries; on the NIDAR
 *  drones that sentence was "Placed Rank 6 of 70+ teams", i.e. the single
 *  fact most likely to make someone open the link. Four lines still leaves
 *  roughly 40px of slack against the tallest possible card (two-line title
 *  plus four-line body plus tags), so nothing clips. */
function clamp(text: string, max: number) {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  const atWord = cut.slice(0, cut.lastIndexOf(" "));
  /* Strip trailing punctuation before appending the ellipsis. When the cut
     lands just after a sentence ends, "…filter." + "…" renders as
     "filter....", which reads as a typo rather than as a truncation. The
     acoustic stack's summary did exactly that. */
  return `${atWord.replace(/[.,;:!?—–-]+$/, "")}…`;
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = getProjectPage(slug);
  if (!page) notFound();

  const { item, detail } = page;
  const title = detail?.title ?? item.title;
  const summary = detail?.summary ?? item.summary;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 88px",
          background: "#09090b",
          position: "relative",
        }}
      >
        {/* Sized explicitly rather than with `inset: 0`, and at 0.10 rather
            than the site's 0.05 — see `app/opengraph-image.tsx` for why both
            of those are load-bearing. */}
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

        {/* Eyebrow: domain, then status. Both are facts the work item already
            carries, so nothing here can drift from the page it advertises. */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            fontSize: 20,
            letterSpacing: 6,
            textTransform: "uppercase",
            color: "#34d399",
          }}
        >
          <div style={{ display: "flex" }}>{item.domain}</div>
          <div
            style={{ display: "flex", width: 4, height: 4, margin: "0 18px", background: "#3f3f46" }}
          />
          <div style={{ display: "flex", color: "#71717a" }}>{STATUS_LABELS[item.status]}</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 66, lineHeight: 1.12, color: "#fafafa" }}>
            {title}
          </div>
          <div
            style={{
              display: "flex",
              width: 96,
              height: 3,
              margin: "30px 0",
              background: "#34d399",
            }}
          />
          <div
            style={{ display: "flex", fontSize: 27, lineHeight: 1.45, color: "#a1a1aa" }}
          >
            {clamp(summary, 260)}
          </div>
        </div>

        {/* Four tags, not all of them — Tiburon has seven and they would wrap
            into a second row that unbalances the card. */}
        <div style={{ display: "flex", alignItems: "center" }}>
          {item.technologies.slice(0, 4).map((tech) => (
            <div
              key={tech}
              style={{
                display: "flex",
                marginRight: 12,
                padding: "8px 18px",
                borderRadius: 999,
                border: "1px solid #27272a",
                fontSize: 21,
                color: "#a1a1aa",
              }}
            >
              {tech}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size },
  );
}
