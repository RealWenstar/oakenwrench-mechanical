# Oakenwrench v2 Kling Canvas Storyboard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a detailed Kling Canvas storyboard for one continuous 9:16 camera flight across the Garage, Truck, Equipment and Contact scroll chapters without generating video.

**Architecture:** Kling MCP supplies identity, balance checks, uploads and any explicitly approved still-image jobs. Chrome controls the visual Canvas because the MCP exposes no Canvas-node API. Existing stills are the primary anchors; paid image generation is permitted only for an essential missing hand-off.

**Tech Stack:** Kling Canvas web app, Kling MCP, Chrome Computer Use, local PNG references, Image 3.0 Omni.

## Global Constraints

- Work in project `906530428340142094`; use `906532041570127964` only as a structural reference.
- Vertical 9:16 visual chain; still generation uses 2K unless the displayed price or model availability makes a lower tier materially safer.
- Do not generate video in this pass.
- Starting verified balance is 1756 credits; never initiate a paid job that could reduce the balance below approximately 500 credits.
- The camera moves inward; the pickup remains in the garage; the final frame is the small-engine workbench.
- No people, readable brand marks, baked UI, watermarks, full-frame amber flare or implausible machinery.

---

### Task 1: Establish the Canvas workspace

**Surfaces:**
- Open: Kling Canvas project `906530428340142094`
- Reference: `docs/superpowers/specs/2026-07-15-v2-kling-canvas-continuity-design.md`

- [ ] **Step 1: Verify account and balance through Kling MCP**

Expected: user `5343529`, VIP Standard, balance `1756` before paid work.

- [ ] **Step 2: Open the target Canvas and inspect existing nodes**

Expected: confirm project title and identify any existing source images or prompt nodes that can be reused.

- [ ] **Step 3: Create or preserve four readable spatial clusters**

Expected cluster labels and order: `01 GARAGE`, `02 TRUCK`, `03 EQUIPMENT`, `04 WORKBENCH / CONTACT`.

### Task 2: Load and sequence source anchors

**Inputs:**
- `C:/Users/Wenstar/Desktop/mech/938e6f9e-c2d4-4d01-9006-7d1e44b869a4.png`
- `C:/Users/Wenstar/Desktop/mech/23e33671-0607-43d3-b322-3d31fedf071e.png`
- `C:/Users/Wenstar/Desktop/mech/907cfb4d-1845-4c35-8c4f-f58da7038f12.png`
- `C:/Users/Wenstar/Desktop/mech/6b0949ae-dac5-47bb-9d0c-8fef3e7aab3d.png`
- `C:/Users/Wenstar/Desktop/mech/578cace5-a9e6-48a6-b299-b95d3d28a389.png`
- `C:/Users/Wenstar/Desktop/mech/d21b8a70-315d-4f33-9f1c-4e11dccb3fce.png`
- `C:/Users/Wenstar/Desktop/mech/dd6cc9b7-00ce-4b31-a403-775a1be6b0e0.png`

- [ ] **Step 1: Upload the seven preferred anchors**

Expected: each image appears once as a source/reference node; unchanged images reuse their uploaded Kling URL when possible.

- [ ] **Step 2: Place the Garage anchors**

Expected order: closed door → partial opening → open garage/truck reveal.

- [ ] **Step 3: Place the Truck, Equipment and Workbench anchors**

Expected order: stable truck hero → loader/mower bridge → dense equipment → workbench finish.

- [ ] **Step 4: Exclude unsuitable images from the final chain**

Expected: the moving pickup is a motion reference only; the image with baked social/contact icons is not a final anchor.

### Task 3: Encode the continuity logic

**Produces:** One unambiguous left-to-right or top-to-bottom story graph.

- [ ] **Step 1: Add the global continuity prompt node**

Prompt intent: one compact Calgary workshop, continuous inward camera direction, stable geometry and warm-tungsten/cool-dusk lighting.

- [ ] **Step 2: Add the Garage transition note**

Expected: rising sectional door and forward dolly; door panel count, rails and garage axis remain fixed.

- [ ] **Step 3: Add the Truck transition note**

Expected: stationary generic pickup; front-left headlight/grille/body panel becomes a full-frame natural occlusion.

- [ ] **Step 4: Add the Equipment transition note**

Expected: loader bucket/track or mower wheel becomes the next natural occlusion while the camera continues deeper along the right wall.

- [ ] **Step 5: Add the Workbench finish note**

Expected: stable dark finish with negative space for website contacts; no baked UI or logo.

### Task 4: Fill only essential missing still anchors

**Model:** `kling-image-v3_0_omni`

- [ ] **Step 1: Audit every adjacent anchor pair at useful zoom**

Expected: identify a paid generation only if camera direction, geometry or occlusion cannot be represented by the existing pair.

- [ ] **Step 2: Check balance and displayed price immediately before each job**

Expected: projected post-job balance remains at or above approximately 500 credits.

- [ ] **Step 3: Generate one reference-assisted 9:16 2K family**

Arguments when required: `img_resolution=2k`, `aspect_ratio=9:16`, `story_mode=false`; use the two adjacent supplied anchors as references and request only the minimum useful image count.

- [ ] **Step 4: Inspect outputs before any retry**

Expected: reject duplicated wheels, unstable pickup geometry, impossible loader hydraulics/tracks, malformed mower/chainsaw/blower components, brand text, people or lighting discontinuities. Do not auto-resubmit a failed or timed-out job.

- [ ] **Step 5: Add only accepted stills to the Canvas**

Expected: rejected results remain outside the selected story chain and are documented.

### Task 5: Final Canvas and credit verification

- [ ] **Step 1: Zoom out and verify graph readability**

Expected: four labelled clusters, visible source/prompt/selected-anchor relationships and one clear sequence.

- [ ] **Step 2: Verify no video generation was executed**

Expected: no new paid image-to-video or text-to-video task exists for this pass.

- [ ] **Step 3: Query final balance through Kling MCP**

Expected: balance remains at or above the owner-authorized floor.

- [ ] **Step 4: Record paid still jobs in the generation log**

Modify only if a paid job occurred: `docs/kling-generation-log.md`, recording model, settings, generation ID, credits and accepted/rejected outcome.

- [ ] **Step 5: Capture a Canvas overview for handoff**

Expected: screenshot shows the completed storyboard graph and current balance without starting video generation.

