"use client";

import { useEffect } from "react";

function frameSource(pattern: string, frame: number) {
  return pattern.replace("{frame}", String(frame).padStart(3, "0"));
}

export function FrameSequence({
  frameCount,
  pattern,
  progress,
}: {
  frameCount: number;
  pattern: string;
  progress: number;
}) {
  const frame = Math.min(
    frameCount,
    Math.max(1, Math.round(progress * (frameCount - 1)) + 1),
  );

  useEffect(() => {
    for (let offset = -4; offset <= 8; offset += 1) {
      const candidate = Math.min(frameCount, Math.max(1, frame + offset));
      const image = new Image();
      image.src = frameSource(pattern, candidate);
    }
  }, [frame, frameCount, pattern]);

  return (
    <img
      className="media-frame-fallback"
      src={frameSource(pattern, frame)}
      alt=""
      draggable={false}
      aria-hidden="true"
    />
  );
}
