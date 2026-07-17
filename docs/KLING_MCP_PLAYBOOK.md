# Kling MCP playbook — Oakenwrench Mechanical

## 2026-07-16 — v2 assembly decision

Kling/Canvas remains the shot and keyframe generator, but it is not the final
editorial timeline. The current v2 follows the single user-edited 50.54 s
master without additional cuts. Each accepted output must therefore be judged
twice: first as a standalone generated shot, then at its exact timeline join.

The website consumes a video-only scrub master with a four-frame GOP. The
matching native audio is exported as one separate opt-in track; never leave it
embedded in the scroll-scrub MP4.

**Purpose:** preserve the proven workflow for creating the next generation of
scroll-film assets without losing visual continuity, mobile performance or
Kling credits. “Cling MCP” in project notes refers to **Kling MCP**.

## Non-negotiable output contract

- The website is one continuous scroll-film, not a collection of independently
  animated cards.
- Generate source material in **9:16, 2160×3840, 24fps, about 5 seconds, no
  audio**. Archive the untouched source master before making browser copies.
- Treat the final and opening frames of neighbouring clips as continuity
  anchors. Camera position, truck direction, lighting, garage scale and key
  equipment must carry across the hand-off.
- Keep a real compact Calgary workshop feel: weathered garage, concrete,
  plywood/wood walls, dense practical tools, warm tungsten workshop light with
  cool daylight spill. Use generic, recognisable North-American heavy-duty
  vehicles and machinery; do not request logos or trademarks.
- The only intended amber UI glow is the small Oakenwrench logo beacon. Do not
  generate or add a full-screen orange wash.

## v1.0 source record

The authoritative generation log is
[`kling-generation-log.md`](kling-generation-log.md). It records the account,
generation IDs, settings, accepted/rejected outcomes and credits used during
the original run. The v1.0 release reused the existing material and rebuilt it
as a single master; no additional Kling credits were spent for that final
reconstruction.

Archive source masters in:

```text
artifacts/kling-masters/
  garage-entry-4k.mp4
  truck-service-4k.mp4
  equipment-service-4k.mp4
```

The current production delivery media is deliberately separate:

```text
public/media/video/story-master-mobile.mp4
public/media/video/story-master-web.mp4
public/media/frames/story/frame-001.webp … frame-116.webp
public/media/anchors/manifest.json
```

## Credit and scope guard

1. Before generating, inspect the Kling credit balance and the existing source
   masters.
2. The project guard is **do not reduce the balance below 800 credits** unless
   the owner explicitly overrides that floor.
3. Generate one bridge at a time, inspect its ending frame and continuity, then
   decide whether a retry is justified. Do not batch speculative variants.
4. Record every run in `docs/kling-generation-log.md`: purpose, model/settings,
   generation ID, credits, accepted/rejected decision and archive path.
5. Do not replace a working master merely because a new clip is prettier in
   isolation. The scroll film is judged by the transition.

## Future generation workflow

### 1. Storyboard before credits

Write the exact requested bridge and specify its starting and ending visual
states. Current recommended structure:

| Segment | Required motion | Continuity target |
| --- | --- | --- |
| Garage entry | closed overhead door opens as the camera moves in | truck appears in the same compact shop |
| Truck service | camera advances toward the truck; hood/service detail is revealed | workshop scale, truck orientation and warm/cool lighting stay stable |
| Equipment reveal | camera leaves the truck service area for small-engine equipment | dense tools, blower/snowblower/loader context stays believable |
| Contact ending | settle into an uncluttered readable finish | enough dark contrast for contact overlay |

For any missing bridge, first create or select two still anchors. Then use
Kling's image-to-video/start-end-frame workflow so the generator has a concrete
visual target at both ends. Use the Kling Canvas/story workflow only to plan
those anchors and the clip order; the website still consumes the final mastered
video, not a Canvas export directly.

### 2. Prompt pattern

Use a prompt that describes a *single camera move*, not a montage. Example
template:

```text
Vertical 9:16, 2160x3840, 24fps, five-second continuous single shot.
Begin exactly from the supplied start frame and end aligned with the supplied
end frame. A compact real Calgary residential mechanic garage: warm tungsten
workshop lights, cool dawn daylight through the open door, stained concrete,
plywood walls, dense hand tools and small-engine equipment. The camera makes a
slow stable forward dolly [DESCRIBE ONE ACTION]. Preserve the generic heavy-duty
pickup's orientation, garage proportions and equipment placement. Photoreal,
cinematic but practical. No people, no text, no logos, no watermark, no
showroom, no dramatic orange lens flare, no jump cuts, no camera shake.
```

Replace only `[DESCRIBE ONE ACTION]`, for example: “while the sectional garage
door lifts and reveals the pickup inside.” Keep the negative constraints;
they protect the mobile background and overlay legibility.

### 3. Inspect and archive

- View the full clip, the first frame, last frame and the two join frames.
- Reject visual defects that break the story: impossible mechanical parts,
  altered vehicle proportions, a shifted garage, unreadable exposure or a
  camera jump.
- Rename and archive accepted original files in `artifacts/kling-masters/`.
- Update the generation log immediately, including rejected results. A rejected
  clip can remain archived for reference but must not silently enter production.

### 4. Assemble browser media

1. Stitch only accepted clips in chronological order with a short,
   visually justified crossfade (roughly `0.25–0.40s` if a seam remains).
2. Encode a scroll-seekable H.264 master for mobile and a separate web master.
   Include `faststart`; keep keyframes frequent enough for responsive seeking.
3. Extract an 8fps WebP frame fallback from the same master. Its frame count and
   duration must agree with `manifest.json`.
4. Update `public/media/anchors/manifest.json` atomically: duration, frame
   count, source paths and chapter ranges.
5. Never use one video per section for this experience. One master gives the
   browser one time axis and eliminates page-edge resets.

## Integration and QA checklist

1. Keep the global `400svh` timeline in `StoryExperience.tsx`; it maps scroll
   directly to the master video's `currentTime`.
2. Preserve the decoder-priming and latest-target seek queue in `ScrollVideo`.
3. Verify the fallback sequence by simulating a video error/stall.
4. Run `npm test` and the production build.
5. Verify preview and production at **375×667, 390×844, 412×915 and 1440×900**.
   Capture garage opening, mid-truck, equipment and contact end state.
6. Perform physical iPhone Safari and Android Chrome checks: touch drag,
   momentum scroll, revisit after backgrounding, low-power mode and slow
   network. Check for dropped frames, delayed seeking, vertical seams, visual
   flashes, text contrast and contact links.
7. Only deploy after explicit approval. Preserve the current v1.0 release as
   the rollback baseline.

## Definition of a successful future iteration

A new scene is complete only when the swipe makes the motion feel attached to
the finger, the previous and next clips read as one physical space, the first
frame is not accidentally held for multiple screens, and the contact state
remains interactive. A visually impressive isolated Kling output is not enough.
