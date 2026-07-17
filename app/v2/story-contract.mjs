export function getStoryVariant(manifest, variantId) {
  return (
    manifest.variants.find(({ id }) => id === variantId) ??
    manifest.variants.find(({ id }) => id === manifest.defaultVariant)
  );
}

export function getTimelineLane(manifest, laneId) {
  return manifest.lanes.find(({ id }) => id === laneId);
}

export function getChapterAtProgress(manifest, progress) {
  const safeProgress = Math.min(1, Math.max(0, progress));
  return (
    manifest.chapters.find(
      ({ start, end }, index) =>
        safeProgress >= start &&
        (safeProgress < end || index === manifest.chapters.length - 1),
    ) ?? manifest.chapters[0]
  );
}

