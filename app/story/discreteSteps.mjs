export const STEPS = [0, 0.18, 0.33, 0.55, 0.77, 1.0];

export function getClosestStepIndex(progress) {
  return STEPS.reduce((closestIdx, stepVal, currentIdx) => {
    const currentDiff = Math.abs(stepVal - progress);
    const closestDiff = Math.abs(STEPS[closestIdx] - progress);
    return currentDiff < closestDiff ? currentIdx : closestIdx;
  }, 0);
}

export function getStepProgress(index) {
  return STEPS[Math.max(0, Math.min(STEPS.length - 1, index))];
}

export function getNextStep(progress) {
  const currentIdx = getClosestStepIndex(progress);
  return getStepProgress(currentIdx + 1);
}

export function getPrevStep(progress) {
  const currentIdx = getClosestStepIndex(progress);
  return getStepProgress(currentIdx - 1);
}

export function shouldProcessGesture(isAnimating, lastEventTime, nowTime, cooldownMs = 150) {
  if (isAnimating) return false;
  if (nowTime - lastEventTime < cooldownMs) return false;
  return true;
}
