"use client";

import { useCallback, useState } from "react";
import type { StoryTimeline } from "../story/story";
import { FrameSequence } from "./FrameSequence";
import { ScrollVideo } from "./ScrollVideo";

export function TimelineMedia({
  progress,
  story,
}: {
  progress: number;
  story: StoryTimeline;
}) {
  const [fallback, setFallback] = useState(false);
  const activateFallback = useCallback(() => setFallback(true), []);

  return (
    <div className="media-stage" aria-hidden="true" data-fallback={fallback}>
      <img
        className="media-layer media-poster"
        src={story.poster}
        alt=""
        draggable={false}
      />
      {!fallback ? (
        <ScrollVideo
          src={story.video}
          mobileSrc={story.mobileVideo}
          poster={story.poster}
          progress={progress}
          onError={activateFallback}
          onStall={activateFallback}
        />
      ) : (
        <FrameSequence
          frameCount={story.fallbackFrameCount}
          pattern={story.fallbackFramePattern}
          progress={progress}
        />
      )}
      <div className="media-vignette" />
    </div>
  );
}
