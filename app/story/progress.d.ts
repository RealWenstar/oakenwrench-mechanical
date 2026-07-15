export type ProgressBeat = { progress: number };

export function normalizeProgress(
  scrollY: number,
  start: number,
  end: number,
): number;

export function isActiveAtViewportCenter(
  top: number,
  bottom: number,
  viewportHeight: number,
): boolean;

export function progressToTime(progress: number, duration: number): number;

export function shouldSeek(
  currentTime: number,
  targetTime: number,
  seeking: boolean,
  threshold?: number,
): boolean;

export function sourceWidthForScale(
  sourceWidth: number,
  scale: number,
): number;

export function getBeatWindow(
  progress: number,
  beats: ProgressBeat[],
): { fromIndex: number; toIndex: number; t: number };
