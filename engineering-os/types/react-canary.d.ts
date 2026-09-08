/**
 * Loads the React canary type declarations project-wide.
 *
 * `<ViewTransition>` is declared in `@types/react/canary.d.ts`, which is not
 * picked up by default — the file's own header lists three ways to opt in, and
 * this triple-slash reference is one of them. Doing it here rather than in
 * `app/layout.tsx` keeps the opt-in in one place instead of at every call site.
 *
 * The runtime side is already handled: App Router runs on the React build
 * bundled with Next, which contains `ViewTransition`. The installed `react`
 * package in `node_modules` does not export it, so this declaration is
 * describing Next's copy, not that one. `experimental.viewTransition` in
 * `next.config.ts` is what makes navigations actually drive it.
 */

/// <reference types="react/canary" />

export {};
