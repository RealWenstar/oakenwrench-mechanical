"use client";

import { useEffect, useRef } from "react";

export function StorySoundscape({
  source,
  durationSeconds,
  enabled,
  progress,
}: {
  source: string;
  durationSeconds: number;
  enabled: boolean;
  progress: number;
}) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const pauseTimer = useRef<number | null>(null);

  useEffect(() => {
    if (!enabled) {
      audioRef.current?.pause();
      audioRef.current = null;
      return;
    }

    const track = new Audio(source);
    track.preload = "auto";
    track.volume = 0.34;
    audioRef.current = track;

    return () => {
      if (pauseTimer.current !== null) window.clearTimeout(pauseTimer.current);
      track.pause();
      track.src = "";
      audioRef.current = null;
    };
  }, [enabled, source]);

  useEffect(() => {
    const track = audioRef.current;
    if (!enabled || !track) return;

    const target = Math.min(durationSeconds - 0.05, Math.max(0, progress * durationSeconds));
    if (Math.abs(track.currentTime - target) > 0.18) track.currentTime = target;
    void track.play().catch(() => undefined);

    if (pauseTimer.current !== null) window.clearTimeout(pauseTimer.current);
    pauseTimer.current = window.setTimeout(() => track.pause(), 260);
  }, [durationSeconds, enabled, progress]);

  return null;
}
