"use client";

export function TopBar({
  compact,
  loadingState = "active",
  onTapLogo,
  bufferProgress = 0,
}: {
  compact: boolean;
  loadingState?: "loading" | "ready" | "opening" | "active";
  onTapLogo?: () => void;
  bufferProgress?: number;
}) {
  return (
    <header
      className="topbar"
      data-compact={compact}
      data-state={loadingState}
    >
      <div className="brand-intro-stack">
        <a
          className="brand-beacon"
          href="#story"
          aria-label="Oakenwrench Mechanical — back to the garage"
          onClick={(e) => {
            if (loadingState === "ready" && onTapLogo) {
              e.preventDefault();
              onTapLogo();
            } else if (loadingState !== "active") {
              e.preventDefault();
            }
          }}
        >
          <img
            src="/media/brand/oakenwrench-mark.png"
            alt="Oakenwrench Mechanical"
            draggable={false}
          />
        </a>
        <div className="preloader-bar-container" aria-hidden="true">
          <div
            className="preloader-bar-fill"
            style={{ width: `${Math.round(bufferProgress * 100)}%` }}
          />
        </div>
        <div className="tap-cue" aria-hidden="true">Tap logo to open</div>
      </div>
    </header>
  );
}
