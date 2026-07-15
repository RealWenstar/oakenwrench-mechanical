# Kling production generation log

Date: 2026-07-14  
Account: VIP Standard, user 5343529  
Credit guard: stop before 1000 credits  
Starting balance: 2222  
Final balance: 1756

| Purpose | Model / settings | Generation ID | Credits | Outcome | Local asset |
|---|---|---|---:|---|---|
| Four-frame visual continuity series | Image 3.0 Omni, 4K, 9:16, story mode | `AZ1NTJY55hOo2M3THSLZmGcpHVWauQ3_28clXzJmp5y_FJdWmSdN2RlflHzQbcLDHROtWxZb` | 16 | Accepted as source sheet; extracted chapter anchors | `artifacts/kling-masters/garage-closed-4k.png` and production crops under `public/media/anchors/` |
| Garage door → truck entry bridge | Video 3.0 Omni, 4K, 9:16, 5 s, single shot, no audio | `AcCpD98nvVsxarie5uv0jg5i7VdbTT1OuH3Qio1X7jO49MgqlFBjeGDrqarfNYaXNzy5AgAX` | 150 | Accepted; door motion and endpoint continuity clean | `public/media/video/garage-entry-web.mp4` |
| Centered truck → open-hood service bridge | Video 3.0 Omni, 4K, 9:16, 5 s, single shot, no audio | `ASJPj1QkmLXh54uCnZ7Ch-INmEffCudZZ59Fi5GUX-C9CPjm0Ud86eS7vNfm5MDVS14XCJOC` | 150 | Rejected; introduced an implausible component in front of the bumper. Not referenced by the site. | `artifacts/kling-masters/truck-service-4k.mp4` |
| Truck service → small equipment bench bridge | Video 3.0 Omni, 4K, 9:16, 5 s, single shot, no audio | `AQ5vvObl9Tk8L7PIcpoPKcSxE_3GZCkO8kPSU52hObgC-SC7ErTd2xcvyOnN8TiwqHtCrwJY` | 150 | Accepted; coherent camera travel and equipment reveal | `public/media/video/equipment-service-web.mp4` |

## Production treatment

- Accepted 4K masters are archived in `artifacts/kling-masters/`.
- Browser delivery versions are H.264 1080×1920, muted, `faststart`, with keyframes every eight frames for responsive scroll seeking.
- The page never autoplays. Chapter progress maps continuously onto `currentTime` and stops when scrolling stops.
- Reduced motion, save-data, unsupported-codec, and failed-video states fall back to a static local poster.
