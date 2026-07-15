"use client";

import { useCallback, useEffect, useRef } from "react";
import { progressToTime, shouldSeek } from "../story/progress.mjs";

export function ScrollVideo({
  mobileSrc,
  onError,
  onStall,
  poster,
  progress,
  src,
}: {
  mobileSrc: string;
  onError: () => void;
  onStall: () => void;
  poster: string;
  progress: number;
  src: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const targetRef = useRef(0);
  const stallTimer = useRef<number | null>(null);

  const clearStallTimer = useCallback(() => {
    if (stallTimer.current !== null) window.clearTimeout(stallTimer.current);
    stallTimer.current = null;
  }, []);

  const seekToLatestTarget = useCallback(() => {
    const video = videoRef.current;
    if (!video || !Number.isFinite(video.duration)) return;

    const target = progressToTime(targetRef.current, video.duration);
    if (!shouldSeek(video.currentTime, target, video.seeking, 0.035)) return;

    clearStallTimer();
    stallTimer.current = window.setTimeout(onStall, 750);
    video.currentTime = target;
  }, [clearStallTimer, onStall]);

  useEffect(() => {
    targetRef.current = progress;
    const frame = window.requestAnimationFrame(seekToLatestTarget);
    return () => window.cancelAnimationFrame(frame);
  }, [progress, seekToLatestTarget]);

  useEffect(() => clearStallTimer, [clearStallTimer]);

  const handleLoadedMetadata = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    // A muted one-frame play primes iOS' decoder before the first inertial swipe.
    void video.play().then(() => {
      video.pause();
      seekToLatestTarget();
    }).catch(seekToLatestTarget);
  }, [seekToLatestTarget]);

  const handleSeeked = useCallback(() => {
    clearStallTimer();
    seekToLatestTarget();
  }, [clearStallTimer, seekToLatestTarget]);

  return (
    <video
      ref={videoRef}
      className="media-video"
      poster={poster}
      preload="auto"
      muted
      playsInline
      aria-hidden="true"
      onLoadedMetadata={handleLoadedMetadata}
      onSeeked={handleSeeked}
      onError={onError}
    >
      <source media="(max-width: 799px)" src={mobileSrc} type="video/mp4" />
      <source src={src} type="video/mp4" />
    </video>
  );
}
