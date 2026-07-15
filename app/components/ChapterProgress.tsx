import type { StoryChapter, StoryChapterId } from "../story/story";

export function ChapterProgress({
  chapters,
  activeId,
  progress,
}: {
  chapters: StoryChapter[];
  activeId: StoryChapterId;
  progress: number;
}) {
  return (
    <nav className="chapter-nav" aria-label="Story chapters">
      {chapters.map((chapter) => {
        const active = chapter.id === activeId;
        return (
          <a
            key={chapter.id}
            href={`#${chapter.id}`}
            aria-current={active ? "step" : undefined}
            className="chapter-link"
          >
            <span className="chapter-track" aria-hidden="true">
              <span
                className="chapter-fill"
                style={{ transform: `scaleX(${active ? progress : 0})` }}
              />
            </span>
            <span>{chapter.label}</span>
          </a>
        );
      })}
    </nav>
  );
}
