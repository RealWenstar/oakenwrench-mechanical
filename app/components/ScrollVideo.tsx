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
  onReady,
  onBufferProgress,
}: {
  mobileSrc: string;
  onError: () => void;
  onStall: () => void;
  poster: string;
  progress: number;
  src: string;
  onReady?: () => void;
  onBufferProgress?: (progress: number) => void;
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

  const primedRef = useRef(false);

  const primeAndReady = useCallback(() => {
    if (primedRef.current) return;
    const video = videoRef.current;
    if (!video) return;

    primedRef.current = true;
    // A muted one-frame play primes iOS' decoder before the first inertial swipe.
    void video.play().then(() => {
      video.pause();
      seekToLatestTarget();
      onReady?.();
    }).catch(() => {
      seekToLatestTarget();
      onReady?.();
    });
  }, [seekToLatestTarget, onReady]);

  // Check readiness immediately and on events to prevent race conditions
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (video.readyState >= 2) {
      primeAndReady();
    }

    const checkState = () => {
      if (video.readyState >= 2) {
        primeAndReady();
      }
    };

    video.addEventListener("loadedmetadata", checkState);
    video.addEventListener("canplay", checkState);
    video.addEventListener("canplaythrough", checkState);

    return () => {
      video.removeEventListener("loadedmetadata", checkState);
      video.removeEventListener("canplay", checkState);
      video.removeEventListener("canplaythrough", checkState);
    };
  }, [primeAndReady]);

  const handleSeeked = useCallback(() => {
    clearStallTimer();
    seekToLatestTarget();
  }, [clearStallTimer, seekToLatestTarget]);


  const handleProgress = useCallback(() => {
    const video = videoRef.current;
    if (!video || video.buffered.length === 0) return;
    const bufferedEnd = video.buffered.end(video.buffered.length - 1);
    const duration = video.duration;
    if (duration > 0) {
      onBufferProgress?.(bufferedEnd / duration);
    }
  }, [onBufferProgress]);

  return (
    <video
      ref={videoRef}
      className="media-video"
      poster={poster}
      preload="auto"
      muted
      playsInline
      aria-hidden="true"
      onLoadedMetadata={primeAndReady}
      onCanPlay={primeAndReady}
      onSeeked={handleSeeked}
      onProgress={handleProgress}
      onError={onError}
    >
      <source media="(max-width: 799px)" src={mobileSrc} type="video/mp4" />
      <source src={src} type="video/mp4" />
    </video>
  );
}

