"use client";

import { useCallback, useState } from "react";
import { ChapterProgress } from "./ChapterProgress";
import { StoryChapter } from "./StoryChapter";
import { TopBar } from "./TopBar";
import { storyChapters, type StoryChapterId } from "../story/story";

export function StoryExperience() {
  const [activeId, setActiveId] = useState<StoryChapterId>("garage");
  const [progress, setProgress] = useState(0);

  const handleProgress = useCallback(
    (id: StoryChapterId, value: number) => {
      if (id === activeId) setProgress(value);
    },
    [activeId],
  );

  const handleActive = useCallback((id: StoryChapterId) => {
    setActiveId(id);
  }, []);

  const activeIndex = storyChapters.findIndex(({ id }) => id === activeId);
  const prefetchedId = storyChapters[activeIndex + 1]?.id;

  return (
    <main className="site-shell">
      <TopBar compact={activeId !== "garage"} />
      {storyChapters.map((chapter) => (
        <StoryChapter
          key={chapter.id}
          chapter={chapter}
          onActive={handleActive}
          onProgress={handleProgress}
          preloadVideo={chapter.id === activeId || chapter.id === prefetchedId}
        />
      ))}
      <ChapterProgress
        chapters={storyChapters}
        activeId={activeId}
        progress={progress}
      />
    </main>
  );
}
