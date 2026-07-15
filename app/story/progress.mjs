export function normalizeProgress(scrollY, start, end) {
  if (end <= start) return 0;
  return Math.min(1, Math.max(0, (scrollY - start) / (end - start)));
}

export function isActiveAtViewportCenter(top, bottom, viewportHeight) {
  const center = viewportHeight / 2;
  return top <= center && bottom > center;
}

export function progressToTime(progress, duration) {
  const safeDuration = Math.max(0, duration);
  return Math.min(safeDuration, Math.max(0, progress * safeDuration));
}

export function getTimelineWindow(progress, timeline) {
  const safeProgress = Math.min(1, Math.max(0, progress));
  const index = Math.max(
    0,
    timeline.findIndex(
      ({ start, end }, candidate) =>
        safeProgress >= start &&
        (safeProgress < end || candidate === timeline.length - 1),
    ),
  );
  const chapter = timeline[index];
  const span = Math.max(Number.EPSILON, chapter.end - chapter.start);

  const localProgress = Math.min(
    1,
    Math.max(0, (safeProgress - chapter.start) / span),
  );

  return {
    id: chapter.id,
    index,
    localProgress: Math.round(localProgress * 1_000_000) / 1_000_000,
  };
}

export function getChapterJumpProgress(chapter) {
  if (chapter.start === 0) return 0;
  return Math.min(chapter.end, chapter.start + 0.001);
}

export function shouldSeek(currentTime, targetTime, seeking, threshold = 0.06) {
  return !seeking && Math.abs(currentTime - targetTime) > threshold;
}

export function sourceWidthForScale(sourceWidth, scale) {
  return sourceWidth / Math.max(1, scale);
}

export function getBeatWindow(progress, beats) {
  if (!beats.length) {
    return { fromIndex: 0, toIndex: 0, t: 0 };
  }

  if (progress >= beats.at(-1).progress) {
    const lastIndex = beats.length - 1;
    return { fromIndex: lastIndex, toIndex: lastIndex, t: 1 };
  }

  const toIndex = Math.max(
    1,
    beats.findIndex((beat) => beat.progress > progress),
  );
  const fromIndex = toIndex - 1;
  const from = beats[fromIndex].progress;
  const to = beats[toIndex].progress;
  const t = to === from ? 0 : (progress - from) / (to - from);

  return { fromIndex, toIndex, t: Math.min(1, Math.max(0, t)) };
}
