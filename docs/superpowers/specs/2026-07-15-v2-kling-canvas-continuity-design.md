# Oakenwrench v2 — Kling Canvas continuity design

> Historical generation brief. Superseded for assembly by
> `2026-07-16-mobile-v2-technical-design.md`: accepted frames are now selected and
> edited manually, while Canvas remains a source of individual shots rather than
> the final continuous timeline.

## Goal

Prepare a detailed Kling Canvas storyboard for a single vertical camera flight
that can later drive the four scroll stops of the Oakenwrench mobile landing
page. This pass may create still keyframes, but it must not generate video.

## Approved direction

The camera moves continuously inward through one compact Calgary residential
workshop. The pickup remains inside the garage. Natural foreground occlusions
hide transitions between the four visual chapters; the final camera position is
the small-engine workbench.

## Canvas structure

### 1. Garage

- Start: closed dark sectional door in cool blue dusk.
- Intermediate: a narrow warm slit appears below the lifting door.
- End: the door is open and the stationary heavy-duty pickup is revealed.
- Motion: low, stable forward dolly under the rising door.

### 2. Heavy-duty pickup

- Preserve the same generic black North-American pickup, orientation, scale,
  wheelbase, grille, headlights and workshop position.
- Move past the front-left quarter without making the vehicle leave.
- Let the headlight, grille edge or dark body panel fill the frame to create a
  physically motivated occlusion into the next chapter.

### 3. Compact and lawn equipment

- Reveal a plausible compact tracked loader, riding/zero-turn mower,
  snowblower, generator and push mower in the same plywood workshop.
- Travel deeper along the right wall; maintain the warm tungsten/cool daylight
  split and stained concrete floor.
- Use the loader bucket, track or mower wheel as the next full-frame occlusion.

### 4. Small-engine craft and contact finish

- End on the workbench with a chainsaw, backpack blower, mower engine and
  trimmer components.
- Finish on a stable, darker composition with sufficient negative space for
  the site's contact overlay.
- Do not bake contact icons, words, logos or UI into generated imagery. The
  Oakenwrench logo remains a separate website overlay.

## Source selection

Use the supplied 9:16 stills as reference-assisted anchors. Preferred sequence:

1. `938e6f9e-c2d4-4d01-9006-7d1e44b869a4.png` — closed door.
2. `23e33671-0607-43d3-b322-3d31fedf071e.png` — partial opening.
3. `907cfb4d-1845-4c35-8c4f-f58da7038f12.png` or
   `6b0949ae-dac5-47bb-9d0c-8fef3e7aab3d.png` — truck reveal.
4. `578cace5-a9e6-48a6-b299-b95d3d28a389.png` — loader/mower bridge.
5. `d21b8a70-315d-4f33-9f1c-4e11dccb3fce.png` — dense equipment.
6. `dd6cc9b7-00ce-4b31-a403-775a1be6b0e0.png` — workbench finish.

The moving-truck image is motion/style reference only. The image containing
baked social/contact icons is excluded from final anchors.

## Generation policy

- Preferred still model: Kling Image 3.0 Omni with image references.
- Output: 9:16, 2K or the highest still quality whose displayed price remains
  proportionate; generate one missing anchor family at a time.
- No video generation in this pass.
- Starting observed balance: 1756 credits.
- Owner explicitly overrides the older 800-credit project guard for this pass;
  hard stop is approximately 500 remaining credits. Never initiate a run whose
  displayed cost could cross that floor.
- Prefer existing anchors. Generate only when a spatial hand-off cannot be
  represented coherently with the supplied stills.

## Mechanical continuity QA

Reject or leave unselected any result with:

- changed garage geometry, door panels, tracks or camera axis;
- duplicated/missing pickup wheels, unstable wheelbase, grille, headlights,
  mirrors or body panels;
- impossible loader tracks, lift arms, bucket mounts or hydraulic routing;
- malformed mower decks, handles, augers, wheels, chainsaw bars/chains,
  blower tubes or engine housings;
- readable brand marks, invented text, people, UI, watermarks, full-frame amber
  flare, showroom styling, jump cuts or inconsistent lighting.

## Canvas completion criteria

- Four labelled chapter clusters are readable at an overview zoom.
- Source/reference nodes, prompt nodes and selected still anchors are connected
  in one unambiguous order.
- Each adjacent pair has a documented shared visual occlusion and matching
  camera direction.
- No generated video nodes have been executed.
- Final balance is visible and remains at or above the owner-authorized floor.

