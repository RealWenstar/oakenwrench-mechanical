export const OPENING_BUFFER_THRESHOLD = 0.18;

function clamp01(value) {
  return Math.min(1, Math.max(0, Number.isFinite(value) ? value : 0));
}

export function canEnterStory({
  mediaFailed,
  mediaReady,
  timedOut,
}) {
  if (mediaFailed || timedOut) return true;
  return Boolean(mediaReady);
}

export function getReserveProgress(bufferProgress, mediaReady = false) {
  if (mediaReady) return 1;
  return clamp01(clamp01(bufferProgress) / OPENING_BUFFER_THRESHOLD);
}

export function getSegmentLoad(progress, index, count) {
  const safeCount = Math.max(1, Math.floor(count));
  const safeIndex = Math.max(0, Math.floor(index));
  return clamp01(clamp01(progress) * safeCount - safeIndex);
}
