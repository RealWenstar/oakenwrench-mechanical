import type { CSSProperties } from "react";
import { getReserveProgress, getSegmentLoad } from "../../story/loading.mjs";

const SEGMENT_COUNT = 7;

export function V2LoadMeter({
  progress,
  mediaReady = false,
}: {
  progress: number;
  mediaReady?: boolean;
}) {
  const percent = mediaReady
    ? 100
    : Math.min(99, Math.round(Math.min(1, Math.max(0, progress)) * 100));
  const reserveProgress = getReserveProgress(progress, mediaReady);

  return (
    <div
      className="v2-load-meter"
      role="progressbar"
      aria-label="Loading workshop media"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={percent}
    >
      <div className="v2-load-meter-copy">
        <span>Loading workshop</span>
        <span>{percent}%</span>
      </div>
      <div className="v2-load-meter-segments" aria-hidden="true">
        {Array.from({ length: SEGMENT_COUNT }, (_, index) => (
          <i
            key={index}
            style={{
              "--segment-load": getSegmentLoad(reserveProgress, index, SEGMENT_COUNT),
            } as CSSProperties}
          />
        ))}
      </div>
    </div>
  );
}
