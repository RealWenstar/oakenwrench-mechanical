export const OPENING_BUFFER_THRESHOLD: number;

export function canEnterStory(options: {
  mediaFailed: boolean;
  mediaReady: boolean;
  timedOut: boolean;
}): boolean;

export function getReserveProgress(bufferProgress: number, mediaReady?: boolean): number;
export function getSegmentLoad(progress: number, index: number, count: number): number;
