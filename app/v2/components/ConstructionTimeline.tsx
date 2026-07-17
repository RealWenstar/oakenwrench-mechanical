"use client";

type Cue = { id: string; at: number; label?: string };
type Lane = { id: "visual" | "audio" | "ui" | "qa"; cues: Cue[] };

const laneLabels = {
  audio: "Audio",
  visual: "Visual",
  ui: "UI",
  qa: "QA",
};

function currentCue(cues: Cue[], progress: number) {
  return [...cues].reverse().find(({ at }) => at <= progress) ?? cues[0];
}

export function ConstructionTimeline({
  lanes,
  progress,
}: {
  lanes: Lane[];
  progress: number;
}) {
  return (
    <details className="construction-timeline">
      <summary>
        <span>Timeline</span>
        <span>{Math.round(progress * 100)}%</span>
      </summary>
      <div className="timeline-lanes">
        {lanes.map((lane) => {
          const active = currentCue(lane.cues, progress);
          return (
            <section key={lane.id} className="timeline-lane" data-lane={lane.id}>
              <strong>{laneLabels[lane.id]}</strong>
              <span>{active?.label ?? active?.id}</span>
              <div className="timeline-dots" aria-hidden="true">
                {lane.cues.map((cue) => (
                  <i
                    key={cue.id}
                    data-active={cue.id === active?.id}
                    style={{ left: `${cue.at * 100}%` }}
                  />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </details>
  );
}
