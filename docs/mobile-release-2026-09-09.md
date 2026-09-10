# Mobile v2.0 candidate — 2026-09-09

This release snapshot includes the user's pre-existing mobile work and the loading/motion changes from September 9. Production v1 is unchanged.

## Local validation

Run `npm run test:vercel` for the actual Next.js/Vercel build path. Default build still uses Vinext. No dependency changes were introduced.

Use `/`, `/?tempo=fast`, and `/?tempo=slow` to compare the standard duration, 0.8x duration and 1.2x duration. The easing curve has a peak velocity of 4/3 the average, with cosine acceleration/deceleration. Ordinary step duration is proportional to source distance. Commands during a step are ignored rather than queued.

The selected video is `public/media/v2/oakenwrench-v2-mobile-608-intraframe.mp4`, 28,764,179 bytes, SHA-256 `C775540066E2F2444694DC4C4D6C6300AC99872A955338929A1BA867AD49AF80`. It is derived from the locally preserved 1080x1920 upscaled master. Use `scripts/build-mobile-candidate.ps1 -Source <master> -Destination <new-file>` to encode another candidate without deleting anything. Do not run the older media build script for this release: it deletes derivatives and targets a different source cut.

Startup waits for decoded image data, not metadata or decorative dwell timers. The poster remains visible. A missing first frame exits to contact poster after 12 seconds; an explicit video error exits immediately. Reduced motion uses Lite mode without the automatic opening.

## Acceptance still required

- Real Safari/Android and remote-control round trip over mobile data.
- User choice of tempo; source-video effects remain unchanged. Quarter-second contact sheets are an editorial review aid, not a claim of frame-by-frame repair.
- The requested chapter boundaries differ from actual shot boundaries. Retained current source-aligned mapping pending an editorial decision.
- Sound is intentionally deferred until motion acceptance and a matching audio cut.
- Business/publication approval, domain account and permanent maintenance access.

## Transfer and maintenance

Keep ongoing source/deploy/rollback access after Dave takes ownership: prefer our own scoped project/repository membership. Store any retained token in a protected credential manager on the home machine, never in this repository or chats. A Deploy Hook alone is insufficient for source updates. Verify an authenticated preview update and access to rollback history after transfer.

The current connector sees the team but lists zero projects; the saved v2 project ID returns 404. DNS currently points to Namecheap contact-verification nameservers, not Cloudflare. Establish actual ownership and DNS records before drafting changes. No DNS or ownership mutation is included in this candidate.

Before edits, 305 files were copied and hash-verified at `F:\projects\_snapshots\oakenwrench-v2-before-20260909`. Restore selectively from that snapshot if needed; do not overwrite newer work blindly. External deployment and domain switching still require their scoped approval and target verification.
