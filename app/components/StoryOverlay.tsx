"use client";

import { ContactActions } from "./ContactActions";
import { getBeatWindow } from "../story/progress.mjs";
import { storyCopy } from "../story/copy";
import type { StoryChapterId } from "../story/story";

export function StoryOverlay({
  chapterId,
  progress,
}: {
  chapterId: StoryChapterId;
  progress: number;
}) {
  const copy = storyCopy[chapterId];
  const { fromIndex, toIndex, t } = getBeatWindow(progress, copy);
  const visibleIndex = t > 0.5 ? toIndex : fromIndex;
  const beat = copy[visibleIndex];
  const showContact = chapterId === "contact" && progress >= 0.48;

  return (
    <div className="story-overlay" data-chapter={chapterId}>
      <div className="story-copy" key={`${chapterId}-${visibleIndex}`}>
        {chapterId === "garage" && visibleIndex === 0 ? (
          <h1>{beat.title}</h1>
        ) : (
          <h2>{beat.title}</h2>
        )}
        <p>{beat.body}</p>
      </div>
      {showContact ? <ContactActions /> : null}
      {chapterId === "garage" && progress < 0.18 ? (
        <div className="scroll-cue" aria-hidden="true">
          <span /> Scroll to enter
        </div>
      ) : null}
    </div>
  );
}
