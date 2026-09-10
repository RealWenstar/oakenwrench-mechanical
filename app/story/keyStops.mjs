export const STORY_KEY_STOPS = [
  {
    id: "heavy-duty",
    at: 0.17,
    navLabel: "Truck",
    effect: "slide-left",
    title: "Heavy-duty / automotive",
    body: "Pickup service, diagnostics and major mechanical work.",
  },
  {
    id: "big-small",
    at: 0.33,
    navLabel: "Jobs",
    effect: "glitch",
    title: "Big jobs. Small jobs.",
    body: "The same attention carries across the whole shop.",
  },
  {
    id: "seasonal",
    at: 0.44,
    navLabel: "Seasonal",
    effect: "fade",
    title: "Seasonal equipment",
    body: "Snowblowers and the machines Calgary counts on.",
  },
  {
    id: "landscaping",
    at: 0.56,
    navLabel: "Yard",
    effect: "slide-right",
    title: "Landscaping equipment",
    body: "Mowers, blowers, trimmers and commercial yard tools.",
  },
  {
    id: "compact",
    at: 0.69,
    navLabel: "Compact",
    effect: "rise",
    title: "Compact equipment",
    body: "Tracked loaders and the machinery behind the job.",
  },
  {
    id: "small-engines",
    at: 0.78,
    navLabel: "Engines",
    effect: "focus",
    title: "Small engines. Full attention.",
    body: "Chainsaws, blowers, trimmers and hard-working yard equipment.",
  },
  {
    id: "contact",
    at: 1,
    navLabel: "Contact",
    radius: 0.04,
    effect: "signal",
    title: "Choose a line. Reach Dave.",
    body: "Tap the phone, WhatsApp, Messenger or email control below.",
  },
];

const DEFAULT_RADIUS = 0.025;

export function getActiveKeyStop(progress, radius = DEFAULT_RADIUS) {
  const safeProgress = Math.min(1, Math.max(0, progress));
  let closest = null;
  let closestDistance = Number.POSITIVE_INFINITY;

  for (const stop of STORY_KEY_STOPS) {
    const distance = Math.abs(safeProgress - stop.at);
    const stopRadius = stop.radius ?? radius;
    if (distance <= stopRadius && distance < closestDistance) {
      closest = stop;
      closestDistance = distance;
    }
  }

  return closest;
}
