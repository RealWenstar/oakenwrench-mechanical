"use client";

import { useEffect, useState } from "react";
import { selectMediaMode } from "./media-policy.mjs";

type MediaMode = "poster" | "crossfade" | "video";

type NetworkNavigator = Navigator & {
  connection?: { saveData?: boolean };
};

export function useMediaMode(hasVideo: boolean, videoFailed: boolean): MediaMode {
  const [capabilities, setCapabilities] = useState({
    reducedMotion: false,
    saveData: false,
    canPlayVideo: false,
  });

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      const probe = document.createElement("video");
      const connection = (navigator as NetworkNavigator).connection;
      setCapabilities({
        reducedMotion: motion.matches,
        saveData: Boolean(connection?.saveData),
        canPlayVideo: Boolean(
          probe.canPlayType('video/mp4; codecs="avc1.42E01E"'),
        ),
      });
    };

    update();
    motion.addEventListener("change", update);
    return () => motion.removeEventListener("change", update);
  }, []);

  return selectMediaMode({ hasVideo, videoFailed, ...capabilities });
}
