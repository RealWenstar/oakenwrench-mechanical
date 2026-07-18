"use client";

import { useEffect, useRef, useState } from "react";

const INTERFACE_KEY = "oakenwrench-v2-interface-visible";

export function ControlCenter({
  defaultSoundEnabled = false,
  soundEnabled,
  onSoundChange,
  interfaceVisible,
  onInterfaceChange,
}: {
  defaultSoundEnabled?: boolean;
  soundEnabled: boolean;
  onSoundChange: (enabled: boolean) => void;
  interfaceVisible: boolean;
  onInterfaceChange: (visible: boolean) => void;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = window.localStorage.getItem(INTERFACE_KEY);
    if (saved === "false") onInterfaceChange(false);
  }, [onInterfaceChange]);

  useEffect(() => {
    const closeOutside = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", closeOutside);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOutside);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  const toggleInterface = () => {
    const next = !interfaceVisible;
    onInterfaceChange(next);
    window.localStorage.setItem(INTERFACE_KEY, String(next));
    setOpen(false);
  };

  return (
    <div ref={rootRef} className="control-center" data-open={open}>
      <button
        type="button"
        className="control-center-trigger"
        aria-label="Open control center"
        aria-expanded={open}
        aria-controls="v2-control-center-panel"
        onClick={() => setOpen((current) => !current)}
      >
        <span aria-hidden="true">••</span>
      </button>
      {open ? (
        <div id="v2-control-center-panel" className="control-center-panel" aria-label="Control center">
          <button
            type="button"
            aria-label="Sound"
            aria-pressed={soundEnabled}
            onClick={() => onSoundChange(!soundEnabled)}
          >
            <span>Sound</span>
            <strong>{soundEnabled ? "Sound on" : "Sound off"}</strong>
          </button>
          <button
            type="button"
            aria-label="Interface"
            aria-pressed={interfaceVisible}
            onClick={toggleInterface}
          >
            <span>Interface</span>
            <strong>{interfaceVisible ? "Hide interface" : "Show interface"}</strong>
          </button>
          <span className="sr-only">Sound starts {defaultSoundEnabled ? "on" : "off"}</span>
        </div>
      ) : null}
    </div>
  );
}
