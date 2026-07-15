export function selectMediaMode({
  hasVideo,
  videoFailed,
}) {
  if (!hasVideo) return "crossfade";
  if (videoFailed) return "poster";
  return "video";
}
