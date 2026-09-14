WARM WHITE

built a live working demo for augusta lights before applying:
live: https://augusta-lights-ai.vercel.app
code: https://github.com/exelentshakil/augusta-lights-ai

answers to your 8 questions:

1. architectural lock: two-stage pipeline. sam-2 mask locks pitches, windows, and trees at 100%. lighting composites on polylines, so the ai never mutates the house.
2. dusk & inpainting: blue-hour grade with 2700k window glow. driveway cars and bins are inpainted to clean concrete before lighting.
3. c9 15" spacing: polyline vectors calculate diodes at 15" intervals. candy cane uses modulo indexing for 2 red / 2 white repeating pairs.
4. omni permanent: 8" spacing rendering 30-degree downward wall-wash cones onto brick/stone facades.
5. 10-20s mobile roofline: tap-to-toggle segments on phone (390px). gm excludes rear ridges in 2 taps or taps "reset to front only". text/voice prompts update segment vectors.
6. 2x2 sheet: html5 canvas composites 4 styles on the identical locked house and exports 2k jpeg in 1 click.
7. dual ai failover: native fetch calling gpt-4o-mini with sub-second failover to gemini 2.0 flash, plus offline rule engine for zero-signal driveways. test chaos mode on demo.
8. timeline & $4k fixed: 10 days, 4 milestones ($1k dusk/mask, $1k c9/omni, $1k mobile, $1k 2x2/deploy).

12+ yrs exp, former lead engineer at legiit ($1m arr), 115+ delivered systems. intro: https://youtube.com/shorts/kK3XZd5PNOk

test it on your phone and lets talk.

shakil
