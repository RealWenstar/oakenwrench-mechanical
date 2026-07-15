"use client";

import { useState } from "react";
import { getBeatWindow, sourceWidthForScale } from "../story/progress.mjs";
import type { StoryChapter } from "../story/story";
import { useMediaMode } from "../story/useMediaMode";
import { ScrollVideo } from "./ScrollVideo";

export function MediaStage({
  active,
  chapter,
  preloadVideo,
  progress,
}: {
  active: boolean;
  chapter: StoryChapter;
  preloadVideo: boolean;
  progress: number;
}) {
  const [videoFailed, setVideoFailed] = useState(false);
  const mediaMode = useMediaMode(Boolean(chapter.video), videoFailed);
  const { fromIndex, toIndex, t } = getBeatWindow(progress, chapter.beats);
  const from =
    mediaMode === "poster" ? chapter.beats[0] : chapter.beats[fromIndex];
  const to = chapter.beats[toIndex];
  const fromScale = from.scale + t * 0.015;
  const toScale = to.scale - (1 - t) * 0.015;

  return (
    <div className="media-stage" aria-hidden="true">
      <img
        className="media-layer media-layer-from"
        src={from.asset}
        alt=""
        draggable={false}
        style={{
          objectPosition: from.position,
          opacity: toIndex === fromIndex ? 1 : 1 - t,
          transform: `translateX(var(--media-shift-x, 0%)) scale(${fromScale})`,
          width: `min(100%, ${sourceWidthForScale(1080, fromScale)}px)`,
        }}
      />
      {mediaMode === "crossfade" && toIndex !== fromIndex ? (
        <img
          className="media-layer media-layer-to"
          src={to.asset}
          alt=""
          draggable={false}
          style={{
            objectPosition: to.position,
            opacity: t,
            transform: `translateX(var(--media-shift-x, 0%)) scale(${toScale})`,
            width: `min(100%, ${sourceWidthForScale(1080, toScale)}px)`,
          }}
        />
      ) : null}
      {mediaMode === "video" && chapter.video ? (
        <ScrollVideo
          active={active}
          onError={() => setVideoFailed(true)}
          src={chapter.video}
          poster={from.asset}
          preload={preloadVideo}
          progress={progress}
        />
      ) : null}
      <div className="media-vignette" />
    </div>
  );
}
