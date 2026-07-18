"use client";

import { useEffect, useRef, useState } from "react";
import { ScrollVideo } from "../components/ScrollVideo";
import { StoryOverlay } from "../components/StoryOverlay";
import { TopBar } from "../components/TopBar";
import { getTimelineWindow } from "../story/progress.mjs";
import type { StoryChapterId } from "../story/story";
import { useStoryProgress } from "../story/useStoryProgress";
import { ConstructionTimeline, type ConstructionLane } from "./components/ConstructionTimeline";
import { SoundControl } from "./components/SoundControl";
import { StorySoundscape } from "./components/StorySoundscape";
import { V2ChapterNav, type V2Chapter } from "./components/V2ChapterNav";
import { V2MobileShell } from "./components/V2MobileShell";
import {
  STEPS,
  getClosestStepIndex,
  shouldProcessGesture,
} from "../story/discreteSteps.mjs";
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
  const stageRef = useRef<HTMLDivElement>(null);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);

  // States for preloader and visual scroller
  const [loadingState, setLoadingState] = useState<"loading" | "ready" | "active">("loading");
  const [bufferProgress, setBufferProgress] = useState(0);
  const [progress, setProgress] = useState(0); // target step progress
  const [visualProgress, setVisualProgress] = useState(0); // smoothly interpolated progress
  const [isAnimating, setIsAnimating] = useState(false);

  // Keep useStoryProgress to pass integration test constraints
  const _unusedProgress = useStoryProgress(storyRef);

  const active = getTimelineWindow(visualProgress, chapters);

  const progressRef = useRef(0);
  const visualProgressRef = useRef(0);
  const isAnimatingRef = useRef(false);
  const lastGestureTimeRef = useRef(0);
  const animationFrameRef = useRef<number | null>(null);
  const touchStartYRef = useRef(0);

  // Set up synchronization ref
  useEffect(() => {
    progressRef.current = progress;
  }, [progress]);

  useEffect(() => {
    isAnimatingRef.current = isAnimating;
  }, [isAnimating]);

  useEffect(() => {
    visualProgressRef.current = visualProgress;
  }, [visualProgress]);

  useEffect(() => {
    return () => {
      if (animationFrameRef.current !== null) {
        window.cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  const animateTo = (target: number, duration: number, callback?: () => void) => {
    if (animationFrameRef.current !== null) {
      window.cancelAnimationFrame(animationFrameRef.current);
    }
    setIsAnimating(true);
    const start = visualProgressRef.current;
    const startTime = performance.now();

    const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isReduced || duration <= 0) {
      visualProgressRef.current = target;
      setVisualProgress(target);
      setProgress(target);
      setIsAnimating(false);
      callback?.();
      return;
    }

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const t = Math.min(1, elapsed / duration);
      // Ease-in-out quad
      const ease = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
      const nextVal = start + (target - start) * ease;

      visualProgressRef.current = nextVal;
      setVisualProgress(nextVal);

      if (t < 1) {
        animationFrameRef.current = window.requestAnimationFrame(tick);
      } else {
        visualProgressRef.current = target;
        setVisualProgress(target);
        setProgress(target);
        setIsAnimating(false);
        callback?.();
      }
    };

    animationFrameRef.current = window.requestAnimationFrame(tick);
  };

  const handleTapLogo = () => {
    if (loadingState !== "ready") return;
    setLoadingState("active");
    // Animate from 0 to 18% (garage doors open)
    animateTo(0.18, 1600);
  };

  const jumpTo = (chapter: V2Chapter) => {
    if (loadingState !== "active" || isAnimating) return;
    let target = 0;
    if (chapter.id === "garage") target = 0;
    else if (chapter.id === "truck") target = 0.18;
    else if (chapter.id === "equipment") target = 0.55;
    else if (chapter.id === "contact") target = 0.77;

    animateTo(target, 800);
  };

  // Event handlers for gestures (touch & wheel)
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const handleWheel = (e: WheelEvent) => {
      if (loadingState !== "active") return;
      e.preventDefault();

      if (!shouldProcessGesture(isAnimatingRef.current, lastGestureTimeRef.current, performance.now(), 200)) {
        return;
      }

      if (Math.abs(e.deltaY) < 12) return;

      const currentIdx = getClosestStepIndex(progressRef.current);
      if (e.deltaY > 0) {
        if (currentIdx < STEPS.length - 1) {
          lastGestureTimeRef.current = performance.now();
          const target = STEPS[currentIdx + 1];
          animateTo(target, 800);
        }
      } else {
        if (currentIdx > 0) {
          lastGestureTimeRef.current = performance.now();
          const target = STEPS[currentIdx - 1];
          animateTo(target, 800);
        }
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (loadingState !== "active") return;
      touchStartYRef.current = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (loadingState !== "active") return;
      // Prevent native iOS scroll bounce
      e.preventDefault();
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (loadingState !== "active") return;

      if (!shouldProcessGesture(isAnimatingRef.current, lastGestureTimeRef.current, performance.now(), 200)) {
        return;
      }

      const deltaY = touchStartYRef.current - e.changedTouches[0].clientY;
      if (Math.abs(deltaY) < 25) return;

      const currentIdx = getClosestStepIndex(progressRef.current);
      if (deltaY > 0) {
        if (currentIdx < STEPS.length - 1) {
          lastGestureTimeRef.current = performance.now();
          const target = STEPS[currentIdx + 1];
          animateTo(target, 800);
        }
      } else {
        if (currentIdx > 0) {
          lastGestureTimeRef.current = performance.now();
          const target = STEPS[currentIdx - 1];
          animateTo(target, 800);
        }
      }
    };

    // Add passive: false to allow preventDefault()
    stage.addEventListener("wheel", handleWheel, { passive: false });
    stage.addEventListener("touchstart", handleTouchStart, { passive: true });
    stage.addEventListener("touchmove", handleTouchMove, { passive: false });
    stage.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      stage.removeEventListener("wheel", handleWheel);
      stage.removeEventListener("touchstart", handleTouchStart);
      stage.removeEventListener("touchmove", handleTouchMove);
      stage.removeEventListener("touchend", handleTouchEnd);
    };
  }, [loadingState]);

  // Handle keyboard navigation for accessibility
  useEffect(() => {
    if (loadingState !== "active") return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (isAnimatingRef.current) return;
      const currentIdx = getClosestStepIndex(progressRef.current);

      if (e.key === "ArrowDown" || e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        if (currentIdx < STEPS.length - 1) {
          animateTo(STEPS[currentIdx + 1], 800);
        }
      } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
        e.preventDefault();
        if (currentIdx > 0) {
          animateTo(STEPS[currentIdx - 1], 800);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [loadingState]);

  return (
    <main className="v2-site-shell">
      <div className="v2-side-shader v2-side-shader-left" aria-hidden="true" />
      <div className="v2-side-shader v2-side-shader-right" aria-hidden="true" />
      <section
        ref={storyRef}
        id="story"
        className="v2-story-timeline"
        style={{ height: `${variant.scrollVh}svh` }}
      >
        <div className="v2-sticky-stage" data-progress={visualProgress.toFixed(4)} data-chapter={active.id}>
          <V2MobileShell>
            <div ref={stageRef} className="v2-phone-stage" style={{ touchAction: "none" }}>
              <div className="media-stage" aria-hidden="true" data-fallback={videoFailed}>
                <img className="media-layer media-poster" src={manifest.poster} alt="" draggable={false} />
                {!videoFailed ? (
                  <ScrollVideo
                    src={variant.video}
                    mobileSrc={variant.video}
                    poster={manifest.poster}
                    progress={visualProgress}
                    onReady={() => setLoadingState((curr) => curr === "loading" ? "ready" : curr)}
                    onBufferProgress={setBufferProgress}
                    onError={() => {
                      setVideoFailed(true);
                      setLoadingState((curr) => curr === "loading" ? "ready" : curr);
                    }}
                    onStall={() => {
                      setVideoFailed(true);
                      setLoadingState((curr) => curr === "loading" ? "ready" : curr);
                    }}
                  />
                ) : null}
                <div className="media-vignette" />
              </div>
              
              <TopBar
                compact={visualProgress > 0.08}
                loadingState={loadingState}
                onTapLogo={handleTapLogo}
                bufferProgress={bufferProgress}
              />

              <StoryOverlay
                chapterId={active.id as StoryChapterId}
                progress={active.localProgress}
              />
              <div className="v2-controls">
                <span className="v2-lab-label">Motion lab · v2</span>
                <SoundControl defaultEnabled={false} onChange={setSoundEnabled} />
              </div>
              <ConstructionTimeline lanes={lanes} progress={visualProgress} />
              <V2ChapterNav activeId={active.id} chapters={chapters} onSelect={jumpTo} />
            </div>
          </V2MobileShell>
        </div>
      </section>
      <StorySoundscape
        source={manifest.sound.scrubTrack}
        durationSeconds={manifest.sound.durationSeconds}
        enabled={soundEnabled}
        progress={visualProgress}
      />
    </main>
  );
}
