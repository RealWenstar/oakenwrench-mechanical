import manifest from "@/public/media/anchors/manifest.json";

export type StoryChapterId = "garage" | "truck" | "equipment" | "contact";

export type TimelineChapter = {
  id: StoryChapterId;
  label: string;
  start: number;
  end: number;
};

export type FallbackFrame = {
  progress: number;
  asset: string;
  position: string;
};

export type StoryTimeline = {
  version: 3;
  scrollVh: number;
  durationSeconds: number;
  video: string;
  mobileVideo: string;
  poster: string;
  fallbackFps: number;
  fallbackFrameCount: number;
  fallbackFramePattern: string;
  timeline: TimelineChapter[];
  fallbackFrames: FallbackFrame[];
};

export const storyTimeline = manifest as StoryTimeline;
