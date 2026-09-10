import type { CSSProperties } from "react";
import { getSegmentLoad } from "../../story/loading.mjs";

export type V2Stop = {
  id: string;
  at: number;
  navLabel: string;
  title: string;
};

export function V2StopNav({
  activeIndex,
  loadProgress,
  stops,
  onSelect,
}: {
  activeIndex: number;
  loadProgress: number;
  stops: V2Stop[];
  onSelect: (stop: V2Stop) => void;
}) {
  return (
    <nav className="v2-stop-nav" aria-label="Story stops">
      {stops.map((stop, index) => (
        <button
          key={stop.id}
          type="button"
          aria-label={`${stop.navLabel}: ${stop.title}`}
          aria-current={index === activeIndex ? "step" : undefined}
          className="v2-stop-link"
          onClick={() => onSelect(stop)}
        >
          <span
            className="v2-stop-load"
            aria-hidden="true"
            style={{
              "--segment-load": getSegmentLoad(loadProgress, index, stops.length),
            } as CSSProperties}
          />
          {stop.navLabel}
        </button>
      ))}
    </nav>
  );
}
