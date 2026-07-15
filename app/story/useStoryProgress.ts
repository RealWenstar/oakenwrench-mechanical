"use client";

import { type RefObject, useEffect, useState } from "react";
import { normalizeProgress } from "./progress.mjs";

export function useStoryProgress(ref: RefObject<HTMLElement | null>) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      const element = ref.current;
      if (!element) return;

      const rect = element.getBoundingClientRect();
      const start = window.scrollY + rect.top;
      const scrollable = Math.max(1, element.offsetHeight - window.innerHeight);
      const next = normalizeProgress(window.scrollY, start, start + scrollable);
      setProgress((current) => (Math.abs(current - next) < 0.0001 ? current : next));
    };

    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
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

  return progress;
}
