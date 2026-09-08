import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    /* Turns on Next's integration with React's `<ViewTransition>`: route
       navigations become React Transitions the browser can animate, and
       `<Link transitionTypes={…}>` forwards its types to
       `React.addTransitionType`. Without this flag the `<ViewTransition>`
       elements in `app/layout.tsx` still render their children and nothing
       else happens — no error, no warning, just no animation. See
       `next/dist/docs/01-app/03-api-reference/05-config/01-next-config-js/viewTransition.md`.

       Experimental, and the downside is understood: if a future release
       renames or drops the flag, the site falls back to instant page swaps —
       which is what it did before this, and what it still does today in any
       browser without the View Transitions API. No content depends on it. */
    viewTransition: true,
  },
};

export default nextConfig;
