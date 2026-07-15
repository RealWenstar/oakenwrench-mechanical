"use client";

import { type RefObject, useEffect, useState } from "react";
import {
  isActiveAtViewportCenter,
  normalizeProgress,
} from "./progress.mjs";

export function useChapterProgress(ref: RefObject<HTMLElement | null>) {
  const [state, setState] = useState({ progress: 0, active: false });

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      const element = ref.current;
      if (!element) return;

      const rect = element.getBoundingClientRect();
      const start = window.scrollY + rect.top;
      const scrollable = Math.max(1, element.offsetHeight - window.innerHeight);
      const next = {
        progress: normalizeProgress(window.scrollY, start, start + scrollable),
        active: isActiveAtViewportCenter(
          rect.top,
          rect.bottom,
          window.innerHeight,
        ),
      };
      setState((current) =>
        current.progress === next.progress && current.active === next.active
          ? current
          : next,
      );
    };

    const schedule = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    };

    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });

    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [ref]);

  return state;
}
