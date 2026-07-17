"use client";

import { useRef, useState } from "react";
import { ScrollVideo } from "../components/ScrollVideo";
import { StoryOverlay } from "../components/StoryOverlay";
import { TopBar } from "../components/TopBar";
import { getChapterJumpProgress, getTimelineWindow } from "../story/progress.mjs";
import type { StoryChapterId } from "../story/story";
import { useStoryProgress } from "../story/useStoryProgress";
import { ConstructionTimeline, type ConstructionLane } from "./components/ConstructionTimeline";
import { SoundControl } from "./components/SoundControl";
import { StorySoundscape } from "./components/StorySoundscape";
import { V2ChapterNav, type V2Chapter } from "./components/V2ChapterNav";
import { V2MobileShell } from "./components/V2MobileShell";
import manifest from "./story-manifest.json";

type Variant = {
  id: "latest";
  label: string;
  video: string;
  durationSeconds: number;
  scrollVh: number;
};

const chapters = manifest.chapters as V2Chapter[];
const variant = manifest.variants[0] as Variant;
const lanes = manifest.lanes as ConstructionLane[];

export function V2Experience() {
  const storyRef = useRef<HTMLElement>(null);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const progress = useStoryProgress(storyRef);
  const active = getTimelineWindow(progress, chapters);

  const jumpTo = (chapter: V2Chapter) => {
    const story = storyRef.current;
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
    <main className="v2-site-shell">
      <div className="v2-side-shader v2-side-shader-left" aria-hidden="true" />
      <div className="v2-side-shader v2-side-shader-right" aria-hidden="true" />
      <TopBar compact={progress > 0.08} />
      <section
        ref={storyRef}
        id="story"
        className="v2-story-timeline"
        style={{ height: `${variant.scrollVh}svh` }}
      >
        <div className="v2-sticky-stage" data-progress={progress.toFixed(4)} data-chapter={active.id}>
          <V2MobileShell>
            <div className="v2-phone-stage">
              <div className="media-stage" aria-hidden="true" data-fallback={videoFailed}>
                {/* Generated cinematic poster; it is intentionally rendered as a full-bleed layer. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className="media-layer media-poster" src={manifest.poster} alt="" draggable={false} />
                {!videoFailed ? (
                  <ScrollVideo
                    src={variant.video}
                    mobileSrc={variant.video}
                    poster={manifest.poster}
                    progress={progress}
                    onError={() => setVideoFailed(true)}
                    onStall={() => setVideoFailed(true)}
                  />
                ) : null}
                <div className="media-vignette" />
              </div>
              <StoryOverlay
                chapterId={active.id as StoryChapterId}
                progress={active.localProgress}
              />
              <div className="v2-controls">
                <span className="v2-lab-label">Motion lab · v2</span>
                <SoundControl defaultEnabled={false} onChange={setSoundEnabled} />
              </div>
              <ConstructionTimeline lanes={lanes} progress={progress} />
              <V2ChapterNav activeId={active.id} chapters={chapters} onSelect={jumpTo} />
            </div>
          </V2MobileShell>
        </div>
      </section>
      <StorySoundscape
        source={manifest.sound.scrubTrack}
        durationSeconds={manifest.sound.durationSeconds}
        enabled={soundEnabled}
        progress={progress}
      />
    </main>
  );
}
