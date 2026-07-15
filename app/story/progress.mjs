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
