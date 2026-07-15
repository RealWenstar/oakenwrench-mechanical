"use client";

import { useEffect, useRef, useState } from "react";

export function TopBar({ compact }: { compact: boolean }) {
  const [scrolling, setScrolling] = useState(false);
  const idleTimer = useRef<number | null>(null);

  useEffect(() => {
    let frame = 0;
    const signalScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        setScrolling(true);
        if (idleTimer.current) window.clearTimeout(idleTimer.current);
        idleTimer.current = window.setTimeout(() => setScrolling(false), 180);
      });
    };

    window.addEventListener("scroll", signalScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", signalScroll);
      window.cancelAnimationFrame(frame);
      if (idleTimer.current) window.clearTimeout(idleTimer.current);
    };
  }, []);

  return (
    <header
      className="topbar"
      data-compact={compact}
      data-scrolling={scrolling}
    >
      <a
        className="brand-beacon"
        href="#story"
        aria-label="Oakenwrench Mechanical — back to the garage"
      >
        <img
          src="/media/brand/oakenwrench-mark.png"
          alt="Oakenwrench Mechanical"
          draggable={false}
        />
      </a>
    </header>
  );
}
