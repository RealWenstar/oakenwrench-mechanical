export type V2VariantId = "latest";
export type V2LaneId = "visual" | "audio" | "ui" | "qa";
export type V2ChapterId = "garage" | "truck" | "equipment" | "contact";

export type V2StoryManifest = {
  defaultVariant: V2VariantId;
  sound: { defaultEnabled: false; scrubTrack: string; durationSeconds: number };
  variants: Array<{ id: V2VariantId; label: string; video: string }>;
  lanes: Array<{
    id: V2LaneId;
    cues: Array<{ id: string; at: number; source?: string }>;
  }>;
  chapters: Array<{
    id: V2ChapterId;
    label: string;
    start: number;
    end: number;
  }>;
};

export function getStoryVariant(
  manifest: V2StoryManifest,
  variantId: string,
): V2StoryManifest["variants"][number];

export function getTimelineLane(
  manifest: V2StoryManifest,
  laneId: V2LaneId,
): V2StoryManifest["lanes"][number] | undefined;

export function getChapterAtProgress(
  manifest: V2StoryManifest,
  progress: number,
): V2StoryManifest["chapters"][number];
