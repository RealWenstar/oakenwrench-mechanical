"use client";

import { useCallback, useEffect, useRef } from "react";
import { progressToTime, shouldSeek } from "../story/progress.mjs";

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
    if (shouldSeek(video.currentTime, target, video.seeking)) {
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
      onSeeked={syncTime}
      onError={onError}
    />
  );
}
