"use client";

import { useEffect, useRef } from "react";

/**
 * Tracks the pointer and writes its position into `--mx` / `--my` on the
 * nearest positioned ancestor, which `.spotlight` in globals.css reads to
 * place a radial glow.
 *
 * It attaches to its own parent rather than wrapping children, so the
 * surrounding card can stay a server component — only this leaf ships JS.
 * Drop it anywhere inside an element that has the `spotlight` class.
 */
export function SpotlightEffect() {
  const marker = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const target = marker.current?.parentElement;
    if (!target) return;

    // Coarse pointers never hover, so the listener would only ever add cost.
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const onMove = (event: PointerEvent) => {
      const rect = target.getBoundingClientRect();
      target.style.setProperty("--mx", `${event.clientX - rect.left}px`);
      target.style.setProperty("--my", `${event.clientY - rect.top}px`);
    };

    target.addEventListener("pointermove", onMove);
    return () => target.removeEventListener("pointermove", onMove);
  }, []);

  return <span ref={marker} aria-hidden="true" className="hidden" />;
}
