"use client";

export function TopBar({
  compact,
  introVisible = true,
  loadingState = "active",
  onTapLogo,
}: {
  compact: boolean;
  introVisible?: boolean;
  loadingState?: "black" | "ready" | "holding" | "opening" | "truck_exit" | "active" | "loading" | string;
  onTapLogo?: () => void;
}) {
  return (
    <header
      className="topbar"
      data-compact={compact}
      data-intro-visible={introVisible}
      data-state={loadingState}
    >
      <div className="brand-intro-stack">
        <a
          className="brand-beacon"
          href="#story"
          aria-label="Oakenwrench Mechanical — back to the garage"
          onClick={(e) => {
            if ((loadingState === "ready" || loadingState === "holding") && onTapLogo) {
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
      </div>
    </header>
  );
}
