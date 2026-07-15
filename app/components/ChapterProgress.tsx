"use client";

import type { StoryChapterId, TimelineChapter } from "../story/story";
import { getChapterJumpProgress } from "../story/progress.mjs";

export function ChapterProgress({
  activeId,
  chapters,
  progress,
}: {
  activeId: StoryChapterId;
  chapters: TimelineChapter[];
  progress: number;
}) {
  const jumpTo = (chapter: TimelineChapter) => {
    const story = document.getElementById("story");
    if (!story) return;
    const start = window.scrollY + story.getBoundingClientRect().top;
    const distance = Math.max(1, story.offsetHeight - window.innerHeight);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({
      top: start + getChapterJumpProgress(chapter) * distance,
      behavior: reduced ? "auto" : "smooth",
    });
  };

  return (
    <nav className="chapter-nav" aria-label="Story timeline">
      {chapters.map((chapter) => {
        const active = chapter.id === activeId;
        const fill =
          progress >= chapter.end
            ? 1
            : progress <= chapter.start
              ? 0
              : (progress - chapter.start) / (chapter.end - chapter.start);
        return (
          <button
            key={chapter.id}
            type="button"
            aria-current={active ? "step" : undefined}
            className="chapter-link"
            onClick={() => jumpTo(chapter)}
          >
            <span className="chapter-track" aria-hidden="true">
              <span
                className="chapter-fill"
                style={{ transform: `scaleX(${fill})` }}
              />
            </span>
            <span>{chapter.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
