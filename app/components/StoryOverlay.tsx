"use client";

import { ContactGraphicHotspots } from "./ContactGraphicHotspots";
import { getActiveKeyStop } from "../story/keyStops.mjs";

export function StoryOverlay({
  progress,
  visible = true,
}: {
  progress: number;
  visible?: boolean;
}) {
  if (!visible) return null;
  const stop = getActiveKeyStop(progress);
  if (!stop) return null;
  const showContact = stop.id === "contact";

  return (
    <div className="story-overlay" data-stop-id={stop.id} data-effect={stop.effect}>
      <div className="story-copy" key={stop.id}>
        <h2>{stop.title}</h2>
        <p>{stop.body}</p>
      </div>
      {showContact ? <ContactGraphicHotspots /> : null}
    </div>
  );
}
