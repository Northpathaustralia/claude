# Negative Prompt Library

Standard negative blocks, referenced by name in every shot prompt. Combine NEG-CORE with the situational blocks the shot needs.

## NEG-CORE (every shot)

> plastic skin, waxy skin, airbrushed face, extra fingers, malformed hands, fused fingers, warped hands, distorted face, dead eyes, uncanny smile, random text, gibberish text, watermark, logo, cyberpunk, neon rim lighting, blue neon grade, teal-orange grade, HDR crunch, oversharpened, stock photo energy, corporate stock video, floating charts, holograms, lens flare, dramatic slow motion

## NEG-ENVIRONMENT (interiors)

> sterile studio, seamless background, perfect minimalism, showroom kitchen, staged apartment, ring-light glow as primary light, RGB gaming lights

## NEG-CAMERA

> drone shot, orbit shot, speed ramp, whip zoom, crash zoom, dolly through walls, unmotivated camera movement, gimbal float

## NEG-PHONE-UI (any shot with a device visible)

> fake phone interface, invented app UI, fabricated analytics dashboard, made-up numbers on screen, glowing screen edges
> (Real UI appears only as screen-recorded inserts composited in the edit — never generated.)

## NEG-FOOD (kitchen shots)

> glossy fake food, plastic food, steam overload, commercial food styling, floating ingredients

## NEG-FITNESS (gym shots)

> bodybuilder exaggeration, oiled skin, neon gym, mirror-selfie energy, supplement-ad aesthetic

## Usage note

Higgsfield model versions vary in how they accept negatives (dedicated field vs. inline "avoid:" phrasing). Each `higgsfield-prompts.md` writes them as an explicit "AVOID:" block so they survive either interface; if the current UI has a negative-prompt field, paste the block there instead.
