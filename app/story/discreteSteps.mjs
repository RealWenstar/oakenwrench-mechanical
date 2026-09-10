export const STEPS = [0, 0.17, 0.33, 0.44, 0.56, 0.69, 0.78, 1];

export function getClosestStepIndex(progress) {
  return STEPS.reduce((closestIndex, step, index) => {
    const distance = Math.abs(step - progress);
    const closestDistance = Math.abs(STEPS[closestIndex] - progress);
    return distance < closestDistance ? index : closestIndex;
  }, 0);
}

export function getNextStep(progress) {
  const index = getClosestStepIndex(progress);
  return STEPS[Math.min(STEPS.length - 1, index + 1)];
}

export function getPrevStep(progress) {
  const index = getClosestStepIndex(progress);
  return STEPS[Math.max(0, index - 1)];
}

export function shouldProcessGesture(isAnimating, lastEventTime, nowTime, cooldownMs = 180) {
  return !isAnimating && nowTime - lastEventTime >= cooldownMs;
}
