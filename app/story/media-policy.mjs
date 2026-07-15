export function selectMediaMode({
  hasVideo,
  reducedMotion,
  saveData,
  canPlayVideo,
  videoFailed,
}) {
  if (!hasVideo) return "crossfade";
  if (reducedMotion || saveData || !canPlayVideo || videoFailed) return "poster";
  return "video";
}
