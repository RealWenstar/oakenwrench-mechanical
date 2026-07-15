"use client";

import { selectMediaMode } from "./media-policy.mjs";

type MediaMode = "poster" | "crossfade" | "video";

export function useMediaMode(hasVideo: boolean, videoFailed: boolean): MediaMode {
  return selectMediaMode({ hasVideo, videoFailed });
}
