# Oakenwrench Mobile Motion v2 — latest-cut baseline

Status: implementation baseline, 2026-07-17.

## Source of truth

V2 uses exactly one user-edited source video:

`C:\Users\Wenstar\Downloads\Telegram Desktop\video_2026-07-16_22-05-18.mp4`

SHA-256: `EDFAF7727F0BCF9D98A5A89376486E17048CB7A9040F454F3D92B54EC018EE57`

No v1 video, v1 fallback frame, Raw/Clean derivative, or earlier generated still is referenced by v2. The v1 production baseline remains unchanged.

## Scroll time zones

| Zone | Progress | Source time | Visual focus |
| --- | ---: | ---: | --- |
| Garage | 0–18% | 0.00–9.10 s | Closed door, opening, first warm reveal |
| Truck | 18–34% | 9.10–17.18 s | Heavy-duty pickup reveal and pass-by |
| Equipment | 34–72% | 17.18–36.39 s | Loader, mower, compact and small-engine equipment |
| Contact | 72–100% | 36.39–50.54 s | Workbench detail, tools, contact device and CTA hold |

The page is one continuous sticky mobile film. Chapter controls jump within the same timeline; they do not navigate to separate pages.

## Current media

| File | Duration | Purpose |
| --- | ---: | --- |
| `public/media/v2/oakenwrench-v2-latest-scrub.mp4` | 50.533 s | H.264 High, 608×1088, 30 fps, video-only, dense 4-frame GOP, faststart |
| `public/media/v2/audio/oakenwrench-v2-latest.m4a` | 50.538 s | Matching AAC stereo soundtrack for opt-in scroll audio |
| `public/media/v2/oakenwrench-v2-latest-poster.webp` | first frame | Fallback generated from the same latest video |

Sound stays off until the visitor presses `Sound`. While scrolling, the matching audio track follows the current video time and pauses after scroll inactivity. Timeline captions remain readable with sound disabled.

## Layout contract

- Primary target: mobile Safari/Chrome.
- Mobile stage: full viewport, 9:16 source treatment.
- Desktop: the same mobile stage centered at maximum 430 px; passive shaders fill the sides.
- Four visible construction lanes: Visual, Audio, UI, QA.
- Contact actions: Call, WhatsApp, Messenger, Facebook, Email.

## Rebuild

```powershell
Set-Location F:\projects\_worktrees\oakenwrench-v2-motion
.\scripts\build-v2-media.ps1
npm test
npm run lint
```
