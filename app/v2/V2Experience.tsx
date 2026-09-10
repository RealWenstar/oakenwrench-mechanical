"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ScrollVideo } from "../components/ScrollVideo";
import { StoryOverlay } from "../components/StoryOverlay";
import { TopBar } from "../components/TopBar";
import { getTimelineWindow } from "../story/progress.mjs";
import { STORY_KEY_STOPS } from "../story/keyStops.mjs";
import { canEnterStory } from "../story/loading.mjs";
import { swipeEase, swipeDuration } from "../story/swipeMotion.mjs";
import {
  STEPS,
  getClosestStepIndex,
  shouldProcessGesture,
} from "../story/discreteSteps.mjs";
import { ExperienceTools, type PerformanceMode } from "./components/ExperienceTools";
import { LiteStepControls } from "./components/LiteStepControls";
import { V2LoadMeter } from "./components/V2LoadMeter";
import { PersistentCallButton } from "./components/PersistentCallButton";
import { type V2Chapter } from "./components/V2ChapterNav";
import { V2MobileShell } from "./components/V2MobileShell";
import { V2StopNav, type V2Stop } from "./components/V2StopNav";
import manifest from "./story-manifest.json";

export type IntroState = "black" | "ready" | "holding" | "opening" | "truck_exit" | "active";

type Variant = {
  id: "latest";
  label: string;
  video: string;
  durationSeconds: number;
  scrollVh: number;
};

const chapters = manifest.chapters as V2Chapter[];
const variant = manifest.variants[0] as Variant;
const storyStops = STORY_KEY_STOPS as V2Stop[];
const MAX_LOADING_MS = 12000;
const PASSIVE_HOLD_MS = 200;
const INTRO_DURATION_MS = 2760;
const STEP_DURATION_MS = 2200;
const SWIPE_THRESHOLD_PX = 28;

export function V2Experience() {
  const storyRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [performanceMode, setPerformanceMode] = useState<PerformanceMode>("full");
  const [videoFailed, setVideoFailed] = useState(false);
  const [introVisible, setIntroVisible] = useState(false);
  const [mediaReady, setMediaReady] = useState(false);
  const [bufferProgress, setBufferProgress] = useState(0);
  const [loadingTimedOut, setLoadingTimedOut] = useState(false);
  const tempoRef = useRef(1);
  const reducedMotionRef = useRef(false);
  const exitTimerRef = useRef<number | null>(null);

  const [loadingState, setLoadingState] = useState<IntroState>("black");
  const [visualProgress, setVisualProgress] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const visualProgressRef = useRef(0);
  const isAnimatingRef = useRef(false);
  const animationFrameRef = useRef<number | null>(null);
  const lastGestureTimeRef = useRef(0);
  const touchStartXRef = useRef(0);
  const touchStartYRef = useRef(0);
  const hasTappedRef = useRef(false);

  const active = getTimelineWindow(visualProgress, chapters);
  const currentStepIndex = getClosestStepIndex(visualProgress);
  const activeStopIndex = Math.max(0, currentStepIndex - 1);

  useEffect(() => {
    const tempo = new URLSearchParams(window.location.search).get("tempo");
    tempoRef.current = tempo === "fast" ? 0.8 : tempo === "slow" ? 1.2 : 1;
    reducedMotionRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotionRef.current) setPerformanceMode("lite");
    const maximumTimer = window.setTimeout(() => setLoadingTimedOut(true), MAX_LOADING_MS);
    return () => {
      window.clearTimeout(maximumTimer);
      if (exitTimerRef.current !== null) window.clearTimeout(exitTimerRef.current);
    };
  }, []);

  // State 1: "black" -> State 2: "ready" when playable readiness is met
  useEffect(() => {
    if (loadingState !== "black") return;
    if (
      !canEnterStory({
        mediaFailed: videoFailed,
        mediaReady,
        timedOut: loadingTimedOut,
      })
    )
      return;
    const revealFrame = window.requestAnimationFrame(() => {
    if (videoFailed || (loadingTimedOut && !mediaReady)) {
      setVideoFailed(true);
      setPerformanceMode("lite");
      visualProgressRef.current = 1;
      setVisualProgress(1);
      setLoadingState("active");
      setIntroVisible(true);
      return;
    }
    if (reducedMotionRef.current) {
      visualProgressRef.current = STEPS[1];
      setVisualProgress(STEPS[1]);
      setLoadingState("active");
      setIntroVisible(true);
      return;
    }
    setLoadingState("ready");
    setIntroVisible(true);
    });
    return () => window.cancelAnimationFrame(revealFrame);
  }, [bufferProgress, loadingState, loadingTimedOut, mediaReady, videoFailed]);

  // State 2: "ready" -> State 3: "holding" (passive 2-second hold)
  useEffect(() => {
    if (loadingState !== "ready") return;
    const frame = window.requestAnimationFrame(() => setLoadingState("holding"));
    return () => window.cancelAnimationFrame(frame);
  }, [loadingState]);

  useEffect(() => {
    visualProgressRef.current = visualProgress;
  }, [visualProgress]);

  useEffect(() => {
    isAnimatingRef.current = isAnimating;
  }, [isAnimating]);

  useEffect(() => () => {
    if (animationFrameRef.current !== null) {
      window.cancelAnimationFrame(animationFrameRef.current);
    }
  }, []);

  useEffect(() => {
    if (loadingState !== "opening" && loadingState !== "truck_exit" && loadingState !== "active") return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [loadingState]);

  const animateTo = useCallback((target: number, duration = STEP_DURATION_MS, onComplete?: () => void) => {
    if (animationFrameRef.current !== null) {
      window.cancelAnimationFrame(animationFrameRef.current);
    }

    const start = visualProgressRef.current;
    duration = duration === STEP_DURATION_MS
      ? swipeDuration(start, target, tempoRef.current)
      : duration * tempoRef.current;
    if (duration <= 0) {
      visualProgressRef.current = target;
      setVisualProgress(target);
      isAnimatingRef.current = false;
      setIsAnimating(false);
      animationFrameRef.current = null;
      onComplete?.();
      return;
    }
    if (Math.abs(target - start) < 0.0001) {
      isAnimatingRef.current = false;
      setIsAnimating(false);
      animationFrameRef.current = null;
      onComplete?.();
      return;
    }
    const startedAt = performance.now();
    isAnimatingRef.current = true;
    setIsAnimating(true);

    const tick = (now: number) => {
      const t = Math.min(1, (now - startedAt) / duration);
      const eased = swipeEase(t);
      const next = start + (target - start) * eased;
      visualProgressRef.current = next;
      setVisualProgress(next);

      if (t < 1) {
        animationFrameRef.current = window.requestAnimationFrame(tick);
      } else {
        visualProgressRef.current = target;
        setVisualProgress(target);
        isAnimatingRef.current = false;
        setIsAnimating(false);
        animationFrameRef.current = null;
        onComplete?.();
      }
    };

    animationFrameRef.current = window.requestAnimationFrame(tick);
  }, []);

  const triggerOpening = useCallback(() => {
    setLoadingState("opening");
    setIntroVisible(true);
    animateTo(0.17, INTRO_DURATION_MS, () => {
      setLoadingState("truck_exit");
      exitTimerRef.current = window.setTimeout(() => setLoadingState("active"), 300);
    });
  }, [animateTo]);

  useEffect(() => {
    if (loadingState !== "holding") return;
    const holdTimer = window.setTimeout(() => {
      if (hasTappedRef.current) return;
      hasTappedRef.current = true;
      triggerOpening();
    }, PASSIVE_HOLD_MS);
    return () => window.clearTimeout(holdTimer);
  }, [loadingState, triggerOpening]);

  const handleTapLogo = () => {
    if (loadingState !== "ready" && loadingState !== "holding") return;
    if (hasTappedRef.current) return;
    hasTappedRef.current = true;
    triggerOpening();
  };

  const jumpToStop = (stop: V2Stop) => {
    if (loadingState !== "active") return;
    animateTo(stop.at, performanceMode === "lite" ? 0 : STEP_DURATION_MS);
  };

  const stepToIndex = (index: number) => {
    const minIndex = loadingState === "active" ? 1 : 0;
    const nextIndex = Math.max(minIndex, Math.min(STEPS.length - 1, index));
    animateTo(STEPS[nextIndex], performanceMode === "lite" ? 0 : STEP_DURATION_MS);
  };

  const changePerformanceMode = (mode: PerformanceMode) => {
    setPerformanceMode(mode);
    if (mode === "lite") {
      const closestIndex = getClosestStepIndex(visualProgressRef.current);
      animateTo(STEPS[closestIndex], 0);
    }
  };

  const handleVideoError = () => {
    if (animationFrameRef.current !== null) window.cancelAnimationFrame(animationFrameRef.current);
    if (exitTimerRef.current !== null) window.clearTimeout(exitTimerRef.current);
    hasTappedRef.current = true;
    setVideoFailed(true);
    setPerformanceMode("lite");
    animateTo(1, 0);
    setIntroVisible(true);
    setLoadingState("active");
  };

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || loadingState !== "active") return;

    const isInteractiveTarget = (target: EventTarget | null) =>
      target instanceof Element && Boolean(target.closest('a, button, [role="button"], input, select, textarea'));

    const step = (direction: 1 | -1) => {
      const now = performance.now();
      if (!shouldProcessGesture(isAnimatingRef.current, lastGestureTimeRef.current, now)) return;
      const currentIndex = getClosestStepIndex(visualProgressRef.current);
      const minIndex = loadingState === "active" ? 1 : 0;
      const nextIndex = Math.max(minIndex, Math.min(STEPS.length - 1, currentIndex + direction));
      if (nextIndex === currentIndex) return;
      lastGestureTimeRef.current = now;
      animateTo(STEPS[nextIndex], performanceMode === "lite" ? 0 : STEP_DURATION_MS);
    };

    const handleWheel = (event: WheelEvent) => {
      if (isInteractiveTarget(event.target)) return;
      event.preventDefault();
      const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
      if (Math.abs(delta) < 12) return;
      step(delta > 0 ? 1 : -1);
    };

    const handleTouchStart = (event: TouchEvent) => {
      if (isInteractiveTarget(event.target)) return;
      touchStartXRef.current = event.touches[0]?.clientX ?? 0;
      touchStartYRef.current = event.touches[0]?.clientY ?? 0;
    };

    const handleTouchMove = (event: TouchEvent) => {
      if (isInteractiveTarget(event.target)) return;
      event.preventDefault();
    };

    const handleTouchEnd = (event: TouchEvent) => {
      if (isInteractiveTarget(event.target)) return;
      const endX = event.changedTouches[0]?.clientX ?? touchStartXRef.current;
      const endY = event.changedTouches[0]?.clientY ?? touchStartYRef.current;
      const deltaX = touchStartXRef.current - endX;
      const deltaY = touchStartYRef.current - endY;

      const absX = Math.abs(deltaX);
      const absY = Math.abs(deltaY);
      if (Math.max(absX, absY) < SWIPE_THRESHOLD_PX) return;

      const forward = absX > absY ? deltaX > 0 : deltaY > 0;
      step(forward ? 1 : -1);
    };

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
  }, [loadingState, performanceMode, animateTo]);

  useEffect(() => {
    if (loadingState !== "active") return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isAnimatingRef.current) return;
      const currentIndex = getClosestStepIndex(visualProgressRef.current);
      const forward = event.key === "ArrowDown" || event.key === "ArrowRight" || event.key === " ";
      const backward = event.key === "ArrowUp" || event.key === "ArrowLeft";
      if (!forward && !backward) return;
      event.preventDefault();
      const nextIndex = Math.max(1, Math.min(STEPS.length - 1, currentIndex + (forward ? 1 : -1)));
      animateTo(STEPS[nextIndex], performanceMode === "lite" ? 0 : STEP_DURATION_MS);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [loadingState, performanceMode, animateTo]);

  return (
    <main className="v2-site-shell" data-performance-mode={performanceMode}>
      <div className="v2-side-shader v2-side-shader-left" aria-hidden="true" />
      <div className="v2-side-shader v2-side-shader-right" aria-hidden="true" />
      <section
        ref={storyRef}
        id="story"
        className="v2-story-timeline"
        style={{ height: `${variant.scrollVh}dvh` }}
      >
        <div
          className="v2-sticky-stage"
          data-progress={visualProgress.toFixed(4)}
          data-chapter={active.id}
          data-animating={isAnimating}
        >
          <V2MobileShell>
            <div
              ref={stageRef}
              className="v2-phone-stage"
              data-performance-mode={performanceMode}
              style={{ touchAction: performanceMode === "full" ? "none" : "manipulation" }}
            >
              <div className="media-stage" aria-hidden="true" data-fallback={videoFailed}>
                <img className="media-layer media-poster" src={videoFailed ? manifest.contactPoster : manifest.poster} alt="" draggable={false} />
                {!videoFailed ? (
                  <ScrollVideo
                    src={variant.video}
                    mobileSrc={variant.video}
                    poster={manifest.poster}
                    progress={visualProgress}
                    onReady={() => setMediaReady(true)}
                    onBufferProgress={(next) => {
                      setBufferProgress((current) => Math.max(current, next));
                    }}
                    onError={handleVideoError}
                    onStall={() => undefined}
                  />
                ) : null}
                <div className="media-vignette" />
              </div>

              <TopBar
                compact={visualProgress > 0.08}
                introVisible={introVisible}
                loadingState={loadingState}
                onTapLogo={handleTapLogo}
              />

              <StoryOverlay
                progress={visualProgress}
                visible={loadingState === "active"}
              />
              {loadingState === "black" && !mediaReady ? (
                <V2LoadMeter progress={bufferProgress} mediaReady={mediaReady} />
              ) : null}
              {loadingState === "active" ? (
                <>
                  <ExperienceTools
                    performanceMode={performanceMode}
                    onPerformanceChange={changePerformanceMode}
                  />
                  <PersistentCallButton />
                </>
              ) : null}
              {loadingState === "active" && active.id !== "contact" && performanceMode === "full" ? (
                <div className="v2-interface-chrome">
                  <V2StopNav
                    activeIndex={activeStopIndex}
                    loadProgress={bufferProgress}
                    stops={storyStops}
                    onSelect={jumpToStop}
                  />
                </div>
              ) : null}
              {loadingState === "active" && active.id !== "contact" && performanceMode === "lite" ? (
                <LiteStepControls
                  currentIndex={currentStepIndex}
                  totalSteps={STEPS.length}
                  onPrevious={() => stepToIndex(currentStepIndex - 1)}
                  onNext={() => stepToIndex(currentStepIndex + 1)}
                />
              ) : null}
            </div>
          </V2MobileShell>
        </div>
      </section>
    </main>
  );
}
