# Specification: V2 Discrete Swipe & Intro Design

This document details the functional specifications for the introduction screen and discrete swipe-based motion system of Oakenwrench Mechanical Motion V2.

## 1. Intro Screen & Preloader

### Loading State (Black Screen)
- Background is absolute black (`#000000`).
- The Oakenwrench logo brandmark is centered on the screen.
- A clean, horizontal progress bar (2px height, color `--amber`) is displayed directly below the logo, representing the buffering progress of the primary video file (`video.buffered`).
- All scrolling gestures and touch interactions are disabled (`overflow: hidden` on `html`/`body` and `touch-action: none`).

### Transition to Ready
- Once the video metadata is loaded and the video is ready to play through (`canplaythrough` event or sufficient buffer), the progress bar disappears.
- The logo animates smoothly from the screen center to the top-centered fixed position matching the final layout:
  - Final position is centered horizontally (`left: 50%; transform: translateX(-50%)`).
  - Size is adjusted smoothly via CSS Transitions.
- A subtle tap indicator appears below the logo: `"Scroll to enter"` or `"Tap logo to open"`.

### Starter Tap Trigger
- The page remains locked to scrolling until the user taps the logo.
- Tapping the logo triggers the initial playback of the video sequence from `0%` to `18%` (garage doors rising and the truck revealing).
- During this initial transition, the progress state is interpolated programmatically from `0.0` to `0.18`.
- Once the progress reaches `0.18` (Chapter: Truck), the gesture/scroll control is fully unlocked, and the interface enters the active interactive mode.

## 2. Discrete Swipe & Scroll Control

Instead of smooth, continuous scrolling, the story timeline is divided into exactly **six discrete points**:
`[0.0, 0.18, 0.33, 0.55, 0.77, 1.0]`

### Interaction Contract
- **Input Events**: The system intercepts scroll (`wheel` with delta threshold) and touch swipes (`touchstart` and `touchend` Y-delta comparison).
- **Step Advancing**:
  - One clear swipe up or wheel down advances the timeline to the next adjacent point (e.g., from `0.18` to `0.33`).
  - One clear swipe down or wheel up returns the timeline to the previous adjacent point (e.g., from `0.33` to `0.18`).
- **Gesture Lock**: Any new swipe or scroll input is ignored while a transition animation between points is in progress.

### State Interpolation
- Transitions between discrete points are animated smoothly over a fixed duration (e.g., 800ms) using a `requestAnimationFrame` loop with an ease-in-out timing function.
- The interpolated `visualProgress` value is used to update:
  - Video playback position (`video.currentTime`).
  - Active chapter highlights and progress bar fills.
  - Active text beats in the overlays.
- Upon landing on a point, all UI indicators, headings, copy, and the video frames must match perfectly:
  - **0% (Garage)**: "Heavy-duty. Small engines. Real work." / "Oakenwrench Mechanical · Calgary, Alberta"
  - **18% (Truck)**: "Heavy-duty / automotive" / "Pickup service, diagnostics and major mechanical work."
  - **33% (Truck)**: "Big jobs. Small jobs." / "The same attention carries across the whole shop."
  - **55% (Equipment)**: "Landscaping equipment" / "Mowers, blowers, trimmers and commercial yard tools."
  - **77% (Contact)**: "Licensed. Local. Ready to help." / "Heavy-duty and small-engine experience in Calgary."
  - **100% (Contact)**: "Oakenwrench Mechanical" / "Calgary, Alberta · Call for shop address." + full CTA button panel.

## 3. General Contracts

### Sound Opt-In
- Audio track stays muted by default.
- Clicking the `Sound` control toggles mute status. Audio track time matches the video position and pauses during inactive intervals.

### Device Layouts
- **Mobile Safari/Chrome**: The absolute source of truth. Fully locked viewport (`9:16`).
- **Desktop**: Mobile stage centered at `maxWidth: 430px`. Passive side shaders (saturate 0.72) fill the remainder of the viewport.

### Accessibility / Reduced Motion
- If `prefers-reduced-motion: reduce` is enabled, transition animations between points are disabled, and step changes jump instantly.

### Safety Guarantee
- The Oakenwrench v1 repository remains unmodified and untouched.
- No remote publishes or deployments are performed in this scope.
