export type V2Chapter = {
  id: string;
  label: string;
  start: number;
  end: number;
};

export function V2ChapterNav({
  activeId,
  chapters,
  onSelect,
}: {
  activeId: string;
  chapters: V2Chapter[];
  onSelect: (chapter: V2Chapter) => void;
}) {
  if (chapters.length !== 4) {
    throw new Error("V2ChapterNav requires exactly four chapters");
  }

  return (
    <nav className="v2-chapter-nav" aria-label="Story chapters">
      {chapters.map((chapter) => (
        <button
          key={chapter.id}
          type="button"
          aria-current={chapter.id === activeId ? "step" : undefined}
          className="v2-chapter-link"
          onClick={() => onSelect(chapter)}
        >
          {chapter.label}
        </button>
      ))}
    </nav>
  );
}
