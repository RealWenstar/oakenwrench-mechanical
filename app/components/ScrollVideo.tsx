"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { progressToTime, shouldSeek } from "../story/progress.mjs";

const SEEK_STALL_MS = 3000;

function getContiguousStartBuffer(video: HTMLVideoElement) {
  if (!Number.isFinite(video.duration) || video.duration <= 0) return 0;

  let contiguousEnd = 0;
  for (let index = 0; index < video.buffered.length; index += 1) {
    const start = video.buffered.start(index);
    const end = video.buffered.end(index);
    if (start > contiguousEnd + 0.08) break;
    contiguousEnd = Math.max(contiguousEnd, end);
  }

  return Math.min(1, Math.max(0, contiguousEnd / video.duration));
}

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
  const seekRafRef = useRef<number | null>(null);
  const [frameReady, setFrameReady] = useState(false);
  const callbacks = useRef({ onReady, onBufferProgress, onStall });
  useEffect(() => {
    callbacks.current = { onReady, onBufferProgress, onStall };
  }, [onReady, onBufferProgress, onStall]);

  const clearStallTimer = useCallback(() => {
    if (stallTimer.current !== null) window.clearTimeout(stallTimer.current);
    stallTimer.current = null;
  }, []);

  const clearSeekRaf = useCallback(() => {
    if (seekRafRef.current !== null) window.cancelAnimationFrame(seekRafRef.current);
    seekRafRef.current = null;
  }, []);

  const seekToLatestTarget = useCallback(() => {
    const video = videoRef.current;
    if (!video || !Number.isFinite(video.duration)) return;

    const target = progressToTime(targetRef.current, video.duration);
    if (!shouldSeek(video.currentTime, target, video.seeking, 0.035)) return;

    clearStallTimer();
    stallTimer.current = window.setTimeout(() => callbacks.current.onStall(), SEEK_STALL_MS);
    video.currentTime = target;
  }, [clearStallTimer]);

  useEffect(() => {
    targetRef.current = progress;
    const frame = window.requestAnimationFrame(seekToLatestTarget);
    return () => window.cancelAnimationFrame(frame);
  }, [progress, seekToLatestTarget]);

  useEffect(() => {
    return () => {
      clearStallTimer();
      clearSeekRaf();
    };
  }, [clearStallTimer, clearSeekRaf]);

  const primedRef = useRef(false);

  const reportBufferProgress = useCallback(() => {
    const video = videoRef.current;
    if (!video) return 0;
    const next = getContiguousStartBuffer(video);
    callbacks.current.onBufferProgress?.(next);
    return next;
  }, []);

  const primeAndReady = useCallback(() => {
    if (primedRef.current) return;
    const video = videoRef.current;
    if (!video || video.readyState < 2) return;

    primedRef.current = true;
    // HAVE_CURRENT_DATA means a decoded frame exists; metadata or a play rejection do not.
    setFrameReady(true);
    reportBufferProgress();
    callbacks.current.onReady?.();
  }, [reportBufferProgress]);

  // Check readiness immediately and on events to prevent race conditions
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (video.readyState >= 2) {
      primeAndReady();
    }

    const checkState = () => {
      reportBufferProgress();
      if (video.readyState >= 2) {
        primeAndReady();
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        checkState();
        seekToLatestTarget();
      }
    };

    video.addEventListener("loadedmetadata", checkState);
    video.addEventListener("loadeddata", checkState);
    video.addEventListener("canplay", checkState);
    video.addEventListener("canplaythrough", checkState);
    video.addEventListener("durationchange", checkState);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    let polls = 0;
    const progressPoll = window.setInterval(() => {
      polls += 1;
      const buffered = reportBufferProgress();
      if (buffered >= 1 || polls >= 48) window.clearInterval(progressPoll);
    }, 250);

    return () => {
      video.removeEventListener("loadedmetadata", checkState);
      video.removeEventListener("loadeddata", checkState);
      video.removeEventListener("canplay", checkState);
      video.removeEventListener("canplaythrough", checkState);
      video.removeEventListener("durationchange", checkState);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.clearInterval(progressPoll);
    };
  }, [primeAndReady, reportBufferProgress, seekToLatestTarget]);

  const handleSeeked = useCallback(() => {
    clearStallTimer();
    clearSeekRaf();
    seekRafRef.current = window.requestAnimationFrame(seekToLatestTarget);
  }, [clearStallTimer, clearSeekRaf, seekToLatestTarget]);

  const handleProgress = useCallback(() => {
    clearStallTimer();
    reportBufferProgress();
  }, [clearStallTimer, reportBufferProgress]);

  return (
    <video
      ref={videoRef}
      className="media-video"
      style={{ opacity: frameReady ? 1 : 0 }}
      poster={poster}
      preload="auto"
      muted
      playsInline
      aria-hidden="true"
      onLoadedMetadata={primeAndReady}
      onLoadedData={primeAndReady}
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

