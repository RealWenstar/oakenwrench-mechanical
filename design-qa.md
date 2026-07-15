# Oakenwrench Mechanical — Design QA

- source visual truth: `F:\projects\oakenwrench-mechanical\public\media\anchors\garage-approved-b.jpg`
- supporting storyboard/spec: `F:\Main!\_Vault_Ops\Projects\Oakenwrench Mechanical — Scroll Storyboard.md`
- combined comparison evidence: `C:\Users\Wenstar\.codex\qa\oakenwrench-source-vs-implementation.png`
- implementation screenshot: `C:\Users\Wenstar\.codex\qa\oakenwrench-mobile-video-mid.png`
- viewport: 390 × 844, mobile portrait
- state: garage entry bridge at 4.073 / 5.042 seconds, driven by scroll

## Full-view comparison evidence

The combined left/right comparison shows the source garage and browser-rendered implementation in one image. The implementation keeps the approved compact low-ceiling garage, centered dark pickup, warm tungsten / cool-dawn split, deep navy shadows, worn concrete, and dense tool edges. The closer crop is intentional: scroll motion moves the camera from the closed door toward the truck while preserving the source composition and color language.

## Focused region evidence

A separate crop was not needed because the native 390 × 844 evidence keeps the wordmark, CTA, chapter progress, headline, vehicle, and garage detail readable at full resolution. The final CTA was additionally inspected at `C:\Users\Wenstar\.codex\qa\oakenwrench-mobile-contact-v2.png`; browser geometry confirmed its heading ends at x=356 in a 390-pixel viewport and all action buttons remain above the fixed chapter navigation.

## Required fidelity surfaces

- Fonts and typography: Barlow Condensed display type and Manrope body type create the intended utilitarian hierarchy. Headline wrapping, optical weight, line height, and mobile contact title were verified at 375, 390, 768, and 1440 widths.
- Spacing and layout rhythm: sticky media remains full-viewport; copy, top bar, and chapter rail preserve clear vertical zones. No horizontal overflow occurred at tested widths. At 375 × 667, the CTA actions end at y=557 and the chapter rail begins at y=607.
- Colors and tokens: deep navy, off-white, amber, warm tungsten, and cool exterior light match the approved source direction. Vignette opacity maintains text contrast without flattening the workshop.
- Image quality and asset fidelity: production anchors and two accepted Kling Video 3.0 Omni bridges are real raster/video assets. The inconsistent truck-service generation was not integrated; the chapter uses approved still continuity instead.
- Copy and content: service language is concise, locally grounded, and consistent with the supplied Calgary business details. No residential street address is exposed.
- Accessibility and behavior: fixed actions meet 44-pixel touch targets, focus-visible styling is present, video is muted/inline, and reduced-motion CSS disables animated crossfades and cues.

## Findings

No actionable P0/P1/P2 findings remain.

- [P3] The truck chapter intentionally uses a still crossfade rather than the rejected generated clip.
  Evidence: the generated clip introduced a component in front of the bumper; the production page keeps the approved truck and open-hood anchors instead.
  Follow-up: regenerate only if a future approval pass requests a more endpoint-faithful truck bridge.

## Comparison history

1. Initial mobile CTA pass found a P2 horizontal clip in “Oakenwrench Mechanical” at `C:\Users\Wenstar\.codex\qa\oakenwrench-mobile-contact.png`.
2. Fixed the contact-specific display size from 12vw to 10.4vw, capped the width at 100%, and tightened tracking in `app/globals.css`.
3. Post-fix evidence at `C:\Users\Wenstar\.codex\qa\oakenwrench-mobile-contact-v2.png` measured x=20..356 in a 390-pixel viewport with no overflow.

## Browser verification

- mobile 375 × 667: `C:\Users\Wenstar\.codex\qa\oakenwrench-375x667.png`
- mobile 390 × 844: `C:\Users\Wenstar\.codex\qa\oakenwrench-mobile-video-mid.png`
- tablet 768 × 1024: `C:\Users\Wenstar\.codex\qa\oakenwrench-768x1024.png`
- desktop 1440 × 900: `C:\Users\Wenstar\.codex\qa\oakenwrench-1440x900.png`
- primary interactions: chapter navigation, continuous garage and equipment video scrubbing, contact-link targets, fixed progress rail
- console errors/warnings: none
- local URL: `http://localhost:4173/`

final result: passed
