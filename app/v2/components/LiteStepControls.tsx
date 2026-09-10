export function LiteStepControls({
  currentIndex,
  totalSteps,
  onPrevious,
  onNext,
}: {
  currentIndex: number;
  totalSteps: number;
  onPrevious: () => void;
  onNext: () => void;
}) {
  return (
    <nav className="lite-step-controls" aria-label="Lite story controls">
      <button
        type="button"
        aria-label="Previous scene"
        disabled={currentIndex <= 0}
        onClick={onPrevious}
      >
        <span aria-hidden="true">←</span>
        Back
      </button>
      <span aria-live="polite">{currentIndex + 1} / {totalSteps}</span>
      <button
        type="button"
        aria-label="Next scene"
        disabled={currentIndex >= totalSteps - 1}
        onClick={onNext}
      >
        Next
        <span aria-hidden="true">→</span>
      </button>
    </nav>
  );
}
