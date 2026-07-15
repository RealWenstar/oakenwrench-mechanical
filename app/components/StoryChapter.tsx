"use client";

import { useEffect, useRef } from "react";
import { MediaStage } from "./MediaStage";
import { StoryOverlay } from "./StoryOverlay";
import { useChapterProgress } from "../story/useChapterProgress";
import type { StoryChapter as StoryChapterType } from "../story/story";

export function StoryChapter({
  chapter,
  onActive,
  onProgress,
  preloadVideo,
}: {
  chapter: StoryChapterType;
  onActive: (id: StoryChapterType["id"]) => void;
  onProgress: (id: StoryChapterType["id"], progress: number) => void;
  preloadVideo: boolean;
}) {
  const ref = useRef<HTMLElement>(null);
  const { active, progress } = useChapterProgress(ref);

  useEffect(() => {
    onProgress(chapter.id, progress);
  }, [chapter.id, onProgress, progress]);

  useEffect(() => {
    if (active) onActive(chapter.id);
  }, [active, chapter.id, onActive]);

  return (
    <section
      ref={ref}
      id={chapter.id}
      className="story-chapter"
      data-chapter={chapter.id}
      style={{ height: `${chapter.heightVh}vh` }}
    >
      <div className="sticky-stage">
        <MediaStage
          active={active}
          chapter={chapter}
          preloadVideo={preloadVideo}
          progress={progress}
        />
        <StoryOverlay chapterId={chapter.id} progress={progress} />
      </div>
    </section>
  );
}
