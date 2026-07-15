import manifest from "@/public/media/anchors/manifest.json";

export type StoryChapterId = "garage" | "truck" | "equipment" | "contact";

export type StoryBeat = {
  progress: number;
  asset: string;
  position: string;
  scale: number;
};

export type StoryChapter = {
  id: StoryChapterId;
  label: string;
  heightVh: number;
  video?: string;
  beats: StoryBeat[];
};

export const storyChapters = manifest.chapters as StoryChapter[];
