export type MediaMode = "poster" | "crossfade" | "video";

export function selectMediaMode(options: {
  hasVideo: boolean;
  reducedMotion: boolean;
  saveData: boolean;
  canPlayVideo: boolean;
  videoFailed: boolean;
}): MediaMode;
