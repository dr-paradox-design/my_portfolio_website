"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { profile } from "@/lib/data/profile";

const navLinks = [
  { href: "/projects", label: "Projects" },
  { href: "/skills",   label: "Skills"   },
  { href: "/resume",   label: "Resume"   },
  { href: "/contact",  label: "Contact"  },
];

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);

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

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-zinc-800/70 bg-zinc-950/80 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Logo / name */}
        <Link
          href="/"
          className="group shrink-0 font-mono text-xs font-semibold tracking-tight text-emerald-400 transition-colors hover:text-emerald-300 sm:text-sm"
        >
          {profile.name.split(" ")[0].toLowerCase()}
          <span className="text-zinc-500">.</span>
          <span className="text-zinc-400 transition-colors group-hover:text-zinc-300">
            dev
          </span>
          <span className="animate-blink ml-0.5 text-emerald-400">_</span>
        </Link>

        {/* Nav links */}
        <nav aria-label="Main navigation">
          <ul className="flex items-center gap-0.5 sm:gap-1">
            {navLinks.map(({ href, label }) => {
              const active = pathname === href || pathname.startsWith(href + "/");
              return (
                <li key={href}>
                  <Link
                    href={href}
                    aria-current={active ? "page" : undefined}
                    className={`relative block rounded-md px-2 py-1.5 text-xs font-medium transition-colors sm:px-3 sm:text-sm ${
                      active
                        ? "text-emerald-400"
                        : "text-zinc-400 hover:text-zinc-100"
                    }`}
                  >
                    {label}
                    {active && (
                      <span
                        className="absolute inset-x-2 -bottom-px h-px bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] sm:inset-x-3"
                        aria-hidden="true"
                      />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      {/* Reading progress */}
      <div
        className="absolute inset-x-0 bottom-0 h-px origin-left bg-gradient-to-r from-emerald-500 to-teal-300 transition-opacity duration-300"
        style={{ transform: `scaleX(${progress / 100})`, opacity: scrolled ? 1 : 0 }}
        aria-hidden="true"
      />
    </header>
  );
}
