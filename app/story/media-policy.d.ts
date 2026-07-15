export type MediaMode = "poster" | "crossfade" | "video";

export function selectMediaMode(options: {
  hasVideo: boolean;
  videoFailed: boolean;
}): MediaMode;
