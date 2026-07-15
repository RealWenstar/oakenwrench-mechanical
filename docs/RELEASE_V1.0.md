# Oakenwrench Mechanical — Release v1.0

**Status:** complete and frozen as the approved MVP baseline  
**Recorded:** 2026-07-15  
**Production domain:** https://oakenwrench-mechanical.vercel.app/  
**Production deployment:** `dpl_2u8GsysHeqYnGbk5P4JZXZ4gciR2` (`Ready`)  
**Release commit:** `7f041d6` — `fix: remove full-stage amber light wash`  
**Release tag:** `mvp-ready`

## What v1.0 proves

The mobile landing page is a single, continuous scroll-film rather than a stack
of separate pages. The interaction now behaves as intended on mobile: a thumb
swipe advances the garage door, truck service, small-equipment scene, and the
contact end state without a visible chapter seam. This validates the core
hypothesis: generated image-to-video material can be used as a responsive,
high-impact mobile landing-page background when it is authored as one mastered
timeline rather than played as unrelated cards.

## Approved v1.0 experience

- One sticky, full-screen stage; no route changes and no chapter-page jumps.
- Approximately three thumb swipes through one `400svh` controller timeline.
- Garage `0–0.32` → Truck `0.32–0.62` → Equipment `0.62–0.84` → Contact
  `0.84–1.0`.
- A 14.5-second mastered story video is seeked from scroll progress. The garage
  door visibly opens early in the timeline; the final moment remains in the
  same scene and reveals contact actions.
- The transparent Oakenwrench logo is the only amber signal: a small pulse is
  retained on the logo. The former full-screen amber/WebGL wash is intentionally
  removed.
- Direct contact actions are retained: phone, WhatsApp, Messenger, Facebook and
  email.

## Technical baseline

| Area | v1.0 implementation |
| --- | --- |
| Scroll controller | `app/components/StoryExperience.tsx`: one `story-timeline` and one sticky stage |
| Media | `app/components/TimelineMedia.tsx`, `ScrollVideo.tsx` |
| Delivery assets | `public/media/video/story-master-mobile.mp4` and `story-master-web.mp4` |
| Fallback | 116 local WebP frames under `public/media/frames/story/` |
| Timeline contract | `public/media/anchors/manifest.json` (version 3) |
| Source masters | `artifacts/kling-masters/` |

`ScrollVideo` warms the decoder, accepts the latest requested seek target, and
falls back to the local WebP sequence on unsupported video, error, or stall.
This is intentional: the mobile story remains usable even if a browser cannot
seek the video reliably.

## Verification recorded for this release

- `npm test` passed: 19/19 tests.
- Production build completed successfully.
- Production mobile verification at `390×844`: one sticky stage; scroll height
  `3376px` (`400svh`); garage-door motion visible around progress `.16`;
  contact end state visible around `.97`; five contact links present; no
  horizontal overflow or browser-console errors.
- Additional responsive checks covered `375×667`, `412×915`, and desktop
  smoke-checking at `1440×900`.
- The final field review confirmed the mobile animation, transitions and logo
  treatment; the orange full-screen wash was removed after that review.

## Freeze rule

Treat `mvp-ready` as the product baseline. Future work must start from a new
branch/release label and must not alter the current production experience until
it has passed local, preview and physical-mobile checks. This release requires
no further deployment or changes.

## Deferred work (v1.1+)

1. Improve desktop/2K media sharpness separately; do not trade mobile quality
   or scroll responsiveness for it.
2. Do physical-device testing on current iPhone Safari and Android Chrome,
   especially momentum scrolling, low-power mode and constrained networks.
3. Generate only genuinely missing transition bridges, then rebuild the master
   timeline; do not add independent looping backgrounds per section.
4. If richer graphics are revisited, keep effects inside the visual media
   treatment. Do not reintroduce a full-stage colour wash or a scrolling-page
   structure.

See [KLING_MCP_PLAYBOOK.md](KLING_MCP_PLAYBOOK.md) for the repeatable asset and
generation workflow.
