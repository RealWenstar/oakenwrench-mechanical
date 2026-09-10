"use client";

import { useEffect, useRef, useState } from "react";

export type PerformanceMode = "full" | "lite";

export function ExperienceTools({
  performanceMode,
  onPerformanceChange,
}: {
  performanceMode: PerformanceMode;
  onPerformanceChange: (mode: PerformanceMode) => void;
}) {
  const [infoOpen, setInfoOpen] = useState(false);
  const dialogRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!infoOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setInfoOpen(false);
    };
    document.addEventListener("keydown", closeOnEscape);
    dialogRef.current?.focus();
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [infoOpen]);

  const nextMode: PerformanceMode = performanceMode === "full" ? "lite" : "full";

  return (
    <div className="experience-tools">
      <div className="experience-tools-rail">
        <button
          type="button"
          className="performance-mode-toggle"
          aria-label={nextMode === "lite" ? "Use Lite mode" : "Use Full mode"}
          aria-pressed={performanceMode === "lite"}
          onClick={() => onPerformanceChange(nextMode)}
        >
          <span>{performanceMode === "full" ? "Lite" : "Full"}</span>
        </button>
        <button
          type="button"
          className="business-info-trigger"
          aria-label="Business information"
          aria-expanded={infoOpen}
          onClick={() => setInfoOpen(true)}
        >
          i
        </button>
      </div>

      {infoOpen ? (
        <div className="business-info-backdrop" onPointerDown={() => setInfoOpen(false)}>
          <section
            ref={dialogRef}
            className="business-info-sheet"
            role="dialog"
            aria-modal="true"
            aria-labelledby="business-info-title"
            tabIndex={-1}
            onPointerDown={(event) => event.stopPropagation()}
          >
            <div className="business-info-heading">
              <div>
                <span>Business information</span>
                <h2 id="business-info-title">Oakenwrench Mechanical</h2>
              </div>
              <button type="button" aria-label="Close business information" onClick={() => setInfoOpen(false)}>×</button>
            </div>

            <p><strong>Calgary, Alberta</strong> · Call for shop address.</p>
            <p>Licensed Heavy-Duty &amp; Small Engine Mechanic. Service and licence details can be confirmed directly with Dave.</p>
            <p>This website is an informational business card. It is not a diagnosis, binding quote, warranty, or repair authorization.</p>
            <p>Availability, inspection, estimates, parts and authorization are confirmed directly before work begins.</p>
            <p className="business-info-privacy">Privacy: this page does not submit or store personal information. Contact links open phone, email or third-party messaging services subject to their own terms.</p>

          </section>
        </div>
      ) : null}
    </div>
  );
}
