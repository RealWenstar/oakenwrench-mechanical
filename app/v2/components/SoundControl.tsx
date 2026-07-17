"use client";

import { useState } from "react";

export function SoundControl({
  defaultEnabled = false,
  onChange,
}: {
  defaultEnabled?: boolean;
  onChange?: (enabled: boolean) => void;
}) {
  const [enabled, setEnabled] = useState(defaultEnabled);

  const toggle = () => {
    const next = !enabled;
    setEnabled(next);
    onChange?.(next);
  };

  return (
    <button
      type="button"
      aria-label="Sound"
      aria-pressed={enabled}
      className="sound-control"
      onClick={toggle}
    >
      {enabled ? "Sound on" : "Sound off"}
    </button>
  );
}
