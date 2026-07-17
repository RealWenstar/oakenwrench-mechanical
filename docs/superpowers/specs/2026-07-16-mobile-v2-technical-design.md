# Oakenwrench Mechanical v2 — mobile motion lab

Status: approved for implementation on 2026-07-16.

## Boundary

- v1 remains frozen at tag `mvp-ready` and keeps its current production URL.
- v2 is a separate mobile-first experiment and deploys to a separate Vercel project.
- The rendered story is always a centered 9:16 mobile surface. Desktop adds only a passive shader field at the sides; it never stretches the video.
- The page remains one sticky stage with one continuous scroll. Garage, Truck, Equipment and Contact are navigation chapters, not separate pages.

## Media variants

The construction build exposes two explicitly labelled sources:

1. **Raw** — the complete 50.54 second edit, re-encoded for deterministic seeking.
2. **Clean** — the editorial cut, approximately 30–35 seconds, with broken joins, long stalls and implausible simultaneous machine effects removed.

Both scrub videos are H.264, `yuv420p`, fast-start MP4, 30 fps and use a keyframe interval of four frames. Embedded audio is removed because scroll seeking an audio track produces clicks and browser-dependent playback.

## Four synchronized lanes

Every timeline marker belongs to one lane:

- `audio` — ambience or a one-shot cue that may play only after the user presses Sound.
- `visual` — what the user should see and the editorial intent of the frame.
- `ui` — copy, call to action or interaction state visible above the video.
- `qa` — known issue, cut rationale or verification checkpoint.

The construction timeline shows the current marker and can expand into a readable event list. Captions remain visible when sound is off.

## Sound contract

- No autoplay sound.
- `Sound off` is the initial state.
- Pressing Sound starts a quiet continuous garage bed and allows timeline one-shots.
- One-shots are edge-triggered, not replayed continuously while the scroll rests on a marker.
- Captions describe the intended sound and do not claim a sound played when the user kept sound disabled.

## Performance and accessibility

- The 608×1088 source is shown at no more than 430 CSS pixels wide, so no AI upscale is required for this iteration.
- `prefers-reduced-motion` keeps a static poster and removes decorative shader motion.
- `Save-Data` and decode failures fall back to the poster/frame path.
- All controls are native buttons with visible focus states and minimum 44 px touch targets.
- Social actions are HTML links. Baked icons in generated frames are never used as hit targets.

## Scroll mapping

- Raw target length: about `1150svh`.
- Clean target length: about `820svh`.
- Variant change preserves normalized story progress.
- Chapter navigation continues to map to the same four normalized chapter windows.
- The internal timeline may contain 12–16 markers without turning them into snap pages.

## Acceptance

- Build and automated tests pass.
- V2 uses only the latest user-edited 50.54 s cut; obsolete Raw/Clean derivatives are removed from the runtime.
- Sound remains opt-in and does not click during video scrubbing.
- Desktop shows a 9:16 phone column with side shaders.
- Visual verification covers 375×667, 390×844, 412×915 and 1440×900, including both variants and the expanded construction timeline.
