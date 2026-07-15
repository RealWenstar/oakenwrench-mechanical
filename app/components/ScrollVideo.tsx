"use client";

import { useCallback, useEffect, useRef } from "react";
import { progressToTime } from "../story/progress.mjs";

export function ScrollVideo({
  active,
  onError,
  poster,
  preload,
  progress,
  src,
}: {
  active: boolean;
  onError: () => void;
  poster: string;
  preload: boolean;
  progress: number;
  src: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  const syncTime = useCallback(() => {
    const video = videoRef.current;
    if (!active || !video || !Number.isFinite(video.duration)) return;

    const target = progressToTime(progress, video.duration);
    if (Math.abs(video.currentTime - target) > 0.025) {
      video.currentTime = target;
    }
  }, [active, progress]);

  useEffect(() => {
    const frame = window.requestAnimationFrame(syncTime);
    return () => window.cancelAnimationFrame(frame);
  }, [syncTime]);

  return (
    <video
      ref={videoRef}
      className="media-video"
      src={src}
      poster={poster}
      preload={preload ? "auto" : "none"}
      muted
      playsInline
      aria-hidden="true"
      onLoadedMetadata={syncTime}
      onError={onError}
    />
  );
}
