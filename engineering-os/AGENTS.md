<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Content rule: no fabrication

Every fact on this site is about a real person's real work. Never invent metrics, part
numbers, technologies, dates, URLs, credentials, or filler prose to make a section look
complete. If a detail is missing or unconfirmed, ask Swastik or leave it out — a thin,
honest page beats a padded, fabricated one. `lib/data/projectPage.ts` enforces one version
of this at build time (a page can't claim technical rigor without also listing a real
failure); that check is a floor, not the whole rule — it doesn't catch fabrication, only
one specific omission.

## `next/og` (satori) fails silently, not loudly

Image routes (`opengraph-image.tsx`) render through `@vercel/og`'s bundled satori, which is
a much smaller CSS engine than a browser and — critically — **drops properties it doesn't
implement instead of erroring**. `inset: 0` is a real example that shipped broken: it
silently collapsed an overlay to 0×0 for an entire build cycle before anyone noticed the
grid wasn't rendering. Prefer explicit `top`/`left`/`width`/`height`. Also: `display: grid`
doesn't exist (flexbox only, and every element with children needs an explicit
`display: "flex"` or satori throws); metadata image routes do **not** inherit a sibling
`page.tsx`'s `generateStaticParams`, and `dynamicParams` is silently stripped from them
(`next/dist/build/webpack/loaders/next-metadata-route-loader.js`) — guard with `notFound()`
in the body instead. See the doc comments in `app/opengraph-image.tsx` and
`app/projects/[slug]/opengraph-image.tsx` for the full reasoning, and `lib/site.ts` for why
per-page metadata must always set its own `openGraph` key (Next's merge is per-segment
key-presence, not a deep merge — an inherited object replaces a missing key wholesale).

## Windows environment, not code bugs

- `npm run dev` (Turbopack) can panic with `0xc0000142` / `STATUS_DLL_INIT_FAILED` in the
  PostCSS worker, 500-ing every route. This is not a regression in the app — verify against
  `npm run build && npm run start` before concluding something is broken.
- `vercel deploy` (the CLI) fails here with `EPERM: operation not permitted, symlink`
  because Windows blocks symlinks without Developer Mode. Deploys go through the Vercel
  GitHub integration instead, with **Root Directory set to `engineering-os`** (the Next app
  is nested, not at the repo root).

## Why `vercel.json` exists

It sets exactly one thing: `"framework": "nextjs"`. The Vercel project was created with the
preset unset (`framework: null` in the API), which is the "Other" preset. That combination
builds *correctly* — the log shows a full `next build`, every route prerendered, "Deployment
completed" — and then serves the wrong thing, because "Other" ignores `.next` and publishes
`public/` as a flat static site. The symptom is unmistakable once you've seen it: `/resume.pdf`
returns 200 while **every** application route, including `/robots.txt` and `/sitemap.xml`,
returns Vercel's `NOT_FOUND`. Nothing in the build output hints at it.

Keeping the fix in the repo rather than in the dashboard means it survives a project being
recreated, and it's reviewable. Don't delete this file assuming Vercel will auto-detect —
detection only runs when the project is first created.
