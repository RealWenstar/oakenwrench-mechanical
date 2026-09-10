"use client";

import { useRef } from "react";
import { ChapterProgress } from "./ChapterProgress";
import { StoryOverlay } from "./StoryOverlay";
import { TimelineMedia } from "./TimelineMedia";
import { TopBar } from "./TopBar";
import { getTimelineWindow } from "../story/progress.mjs";
import { storyTimeline } from "../story/story";
import { useStoryProgress } from "../story/useStoryProgress";

export function StoryExperience() {
  const storyRef = useRef<HTMLElement>(null);
  const progress = useStoryProgress(storyRef);
  const active = getTimelineWindow(progress, storyTimeline.timeline);

  return (
    <main className="site-shell">
      <TopBar compact={progress > 0.12} />
      <section
        ref={storyRef}
        id="story"
        className="story-timeline"
        style={{ height: `${storyTimeline.scrollVh}svh` }}
      >
        <div
          className="sticky-stage"
          data-progress={progress.toFixed(4)}
          data-chapter={active.id}
        >
          <TimelineMedia story={storyTimeline} progress={progress} />
          <StoryOverlay progress={progress} />
        </div>
      </section>
      <ChapterProgress
        chapters={storyTimeline.timeline}
        activeId={active.id}
        progress={progress}
      />
    </main>
  );
}
