import type { Metadata } from "next";
import { ViewTransition } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { profile } from "@/lib/data/profile";
import { SITE_URL } from "@/lib/site";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  /* Required, not decorative. Without it, a relative `alternates.canonical`
     anywhere in the tree is a hard build error, and every og:image URL would
     ship relative — which no crawler will resolve. */
  metadataBase: new URL(SITE_URL),

  title: {
    default: `${profile.name} — ${profile.title}`,
    template: `%s — ${profile.name}`,
  },
  description: profile.tagline,

  authors: [{ name: profile.name, url: profile.social.github }],
  creator: profile.name,

  /* The defaults every page inherits. Child pages that need their own
     og:title must set `openGraph` themselves — see `pageMetadata` in
     lib/site.ts for why merging does not do this for us. */
  openGraph: {
    type: "website",
    siteName: profile.name,
    locale: "en_US",
    url: "/",
    title: `${profile.name} — ${profile.title}`,
    description: profile.tagline,
  },

  /* No `twitter-image` file anywhere, deliberately. `postProcessMetadata` in
     next/dist/lib/metadata/resolve-metadata.js copies openGraph's title,
     description, and images onto twitter whenever twitter has no images of
     its own. A second image file would double the build's render cost to
     emit identical bytes. Only `card` has to be stated. */
  twitter: { card: "summary_large_image" },

  alternates: { canonical: "/" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      {/* `grain` paints a fixed noise overlay via ::after — see globals.css */}
      <body className="grain flex min-h-full flex-col bg-zinc-950 text-zinc-200">
        <Navbar />
        {/* Every route change animates through here.

            `enter`/`exit` are keyed by transition type, which links opt into
            via `<Link transitionTypes={…}>`. Three cases:

              · `nav-forward` — going deeper (a work card into its project
                page). Old content slides left, new content arrives from the
                right.
              · `nav-back` — returning. The same motion, mirrored.
              · `default` — everything else, which is the top nav and any
                browser back/forward. Browser-initiated history navigation
                carries no type by design, so it lands here rather than
                animating in a direction that might contradict the one the
                user actually moved in.

            The default is a fade with a small upward drift rather than a
            slide, because a top-level nav between Projects and Skills is a
            lateral move with no depth to communicate — sliding it would be
            saying something untrue about the hierarchy. */}
        <main className="flex-1">
          <ViewTransition
            enter={{
              "nav-forward": "nav-forward",
              "nav-back": "nav-back",
              default: "page-enter",
            }}
            exit={{
              "nav-forward": "nav-forward",
              "nav-back": "nav-back",
              default: "page-exit",
            }}
          >
            {children}
          </ViewTransition>
        </main>
        <Footer />
      </body>
    </html>
  );
}
