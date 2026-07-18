"use client";

import { useEffect, useRef, useState } from "react";

export function TopBar({
  compact,
  loadingState = "active",
  onTapLogo,
  bufferProgress = 0,
}: {
  compact: boolean;
  loadingState?: "loading" | "ready" | "active";
  onTapLogo?: () => void;
  bufferProgress?: number;
}) {
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
      data-state={loadingState}
    >
      <a
        className="brand-beacon"
        href="#story"
        aria-label="Oakenwrench Mechanical — back to the garage"
        onClick={(e) => {
          if (loadingState === "ready" && onTapLogo) {
            e.preventDefault();
            onTapLogo();
          } else if (loadingState === "loading") {
            e.preventDefault();
          }
        }}
      >
        <img
          src="/media/brand/oakenwrench-mark.png"
          alt="Oakenwrench Mechanical"
          draggable={false}
        />
      </a>

      <div className="preloader-bar-container" aria-hidden="true">
        <div
          className="preloader-bar-fill"
          style={{ width: `${Math.round(bufferProgress * 100)}%` }}
        />
      </div>

      <div className="tap-cue" aria-hidden="true">
        Tap logo to open
      </div>
    </header>
  );
}
