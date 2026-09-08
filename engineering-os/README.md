# engineering-os

Engineering portfolio for Swastik Aditya Ranjan. Next.js 16 App Router,
TypeScript, Tailwind v4, no CMS.

## Running it

```bash
npm install
npm run dev          # http://localhost:3000
npm run build && npm run start
```

On Windows the Turbopack dev server can panic in the PostCSS worker and 500
every route. That is the environment, not the app — check `build && start`
before concluding anything is broken.

## Where the content lives

All of it is TypeScript, none of it is MDX.

| File | Holds |
|---|---|
| `lib/data/profile.ts` | Name, tagline, contact links, resume path |
| `lib/data/portfolio.ts` | The work inventory, plus competitions, internships, workshops |
| `lib/data/projects.ts` | Long-form case studies, keyed by a work item's `slug` |
| `lib/data/skills.ts` | The skill tree |
| `lib/site.ts` | Origin resolution and the shared per-page metadata helper |

A project gets a page by having a `slug`. `lib/data/projectPage.ts` asserts a
few invariants at module load, so a malformed entry fails the build rather
than shipping — including that a case study claiming technical rigor must
also document a real failure.

**Read `AGENTS.md` before editing.** It carries the no-fabrication rule that
governs every fact on the site, and the `next/og` constraints that are not
obvious from the code.

## Deploying

Through the Vercel GitHub integration, with **Root Directory set to
`engineering-os`** — the app is nested, not at the repo root. The Vercel CLI
fails on Windows with `EPERM: symlink`.

The site marks itself un-indexable until it knows its own origin. On Vercel
that resolves automatically; set `NEXT_PUBLIC_SITE_URL` only for a custom
domain.
