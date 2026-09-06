"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { profile } from "@/lib/data/profile";

const navLinks = [
  { href: "/projects",   label: "Projects"   },
  { href: "/experience", label: "Experience" },
  { href: "/skills",     label: "Skills"     },
  { href: "/resume",     label: "Resume"     },
  { href: "/contact",    label: "Contact"    },
];

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [lastPath, setLastPath] = useState(pathname);

  // Navigating should always dismiss the mobile menu. Adjusting during render
  // (rather than in an effect) also covers back/forward, which an onClick
  // handler on the links would miss.
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setMenuOpen(false);
  }

  useEffect(() => {
    let frame = 0;

    const onScroll = () => {
      // Coalesce scroll events into one read per frame to avoid layout thrash.
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const scrollable =
          document.documentElement.scrollHeight - window.innerHeight;
        setScrolled(window.scrollY > 8);
        setProgress(scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0);
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  const opaque = scrolled || menuOpen;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        opaque
          ? "border-b border-zinc-800/70 bg-zinc-950/80 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Logo / name */}
        <Link
          href="/"
          className="group shrink-0 font-mono text-sm font-semibold tracking-tight text-emerald-400 transition-colors hover:text-emerald-300"
        >
          {profile.name.split(" ")[0].toLowerCase()}
          <span className="text-zinc-500">.</span>
          <span className="text-zinc-400 transition-colors group-hover:text-zinc-300">
            dev
          </span>
          <span className="animate-blink ml-0.5 text-emerald-400">_</span>
        </Link>

        {/* Desktop nav — five items no longer fit on a phone, so it collapses */}
        <nav aria-label="Main navigation" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {navLinks.map(({ href, label }) => {
              const active = isActive(href);
              return (
                <li key={href}>
                  <Link
                    href={href}
                    aria-current={active ? "page" : undefined}
                    className={`relative block rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                      active
                        ? "text-emerald-400"
                        : "text-zinc-400 hover:text-zinc-100"
                    }`}
                  >
                    {label}
                    {active && (
                      <span
                        className="absolute inset-x-3 -bottom-px h-px bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]"
                        aria-hidden="true"
                      />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Mobile trigger */}
        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          className="-mr-1 rounded-md p-2 text-zinc-400 transition-colors hover:text-emerald-400 md:hidden"
        >
          {menuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Mobile menu */}
      <nav
        id="mobile-nav"
        aria-label="Main navigation"
        hidden={!menuOpen}
        className="border-t border-zinc-800/60 bg-zinc-950/95 backdrop-blur-xl md:hidden"
      >
        <ul className="mx-auto max-w-6xl px-4 py-2 sm:px-6">
          {navLinks.map(({ href, label }) => {
            const active = isActive(href);
            return (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={`flex items-center gap-2.5 rounded-md px-2 py-2.5 text-sm font-medium transition-colors ${
                    active
                      ? "text-emerald-400"
                      : "text-zinc-400 hover:text-zinc-100"
                  }`}
                >
                  <span
                    className={`h-1 w-1 rounded-full ${
                      active ? "bg-emerald-400" : "bg-zinc-700"
                    }`}
                    aria-hidden="true"
                  />
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Reading progress */}
      <div
        className="absolute inset-x-0 bottom-0 h-px origin-left bg-gradient-to-r from-emerald-500 to-teal-300 transition-opacity duration-300"
        style={{ transform: `scaleX(${progress / 100})`, opacity: scrolled ? 1 : 0 }}
        aria-hidden="true"
      />
    </header>
  );
}
