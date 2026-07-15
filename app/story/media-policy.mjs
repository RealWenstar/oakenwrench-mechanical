export function selectMediaMode({
  hasVideo,
  reducedMotion,
  canPlayVideo,
  videoFailed,
}) {
  if (!hasVideo) return "crossfade";
  if (reducedMotion || !canPlayVideo || videoFailed) return "poster";
  return "video";
}
