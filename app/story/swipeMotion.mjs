// Cosine velocity ramps over the first/last quarter; steady cruise in between.
// Peak speed is 4/3 of the mean (the previous cubic curve peaked at 3x).
export function swipeEase(value) {
  const t = Math.min(1, Math.max(0, value));
  const ramp = 0.25;
  const peak = 1 / (1 - ramp);
  if (t < ramp) return peak * (t / 2 - ramp * Math.sin(Math.PI * t / ramp) / (2 * Math.PI));
  if (t > 1 - ramp) return 1 - swipeEase(1 - t);
  return peak * (t - ramp / 2);
}

export function swipeDuration(from, to, factor = 1) {
  return Math.round(Math.abs(to - from) / 0.16 * 2200 * factor);
}
