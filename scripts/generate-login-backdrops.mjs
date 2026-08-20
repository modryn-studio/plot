/* Generates the two /login backdrops on Replicate.
 *
 * The brief is Ogilvy's and Rams's, and every clause in it is load-bearing:
 *   - NADIR, north-up, orthographic. A tilted golden-hour drone view is what these models default
 *     to and it is a different data product: tilt reads as marketing, straight-down reads as a
 *     record. It is also literally what plot's own aerial is.
 *   - NO DRAWN LINES. The parcel boundary and house footprint are composited as SVG over the
 *     raster, because broken strokes and polygons that do not close are exactly what generative
 *     models render worst and exactly what is trivial to draw exactly.
 *   - LATE FALL / EARLY SPRING. Emerald turf is the "after" picture and the claim is "before you
 *     build on it". Green is also the subject's colour and would fight the drawn lines. Snow is
 *     wrong for a different reason: snow means you cannot build.
 *   - NO WATER, NO BLUE. The drawn lines are the only saturated thing in the frame, so blue has to
 *     mean "drawn" and nothing else. This is docs/design-system.md's water rule applied properly.
 *   - LARGE TONAL MASSES. A heavy scrim destroys fine detail, so the frame is designed at the
 *     fidelity that survives it: silhouette, mass and edge.
 *
 * THE SCRIM DOES THE DARKENING, NOT THE FILE. These render neutral on purpose: /login dims them
 * with `bg-bg` at 65%, which is a token, and baking that into the asset would put a colour
 * decision somewhere no one can find it and nothing can measure it.
 *
 * Run:  node --env-file=.env.local scripts/generate-login-backdrops.mjs
 * Writes public/login/backdrop-{portrait,landscape}.webp directly. Regenerating is safe and
 * idempotent apart from the model returning a different picture, which it will.
 */

import { writeFile, mkdir } from 'node:fs/promises';
import { createRequire } from 'node:module';

const sharp = createRequire(import.meta.url)('sharp');

const OUT = new URL('../public/login/', import.meta.url);

const TOKEN = process.env.REPLICATE_API_TOKEN;
if (!TOKEN) throw new Error('REPLICATE_API_TOKEN missing');

const SHARED = `A satellite orthophoto of a single ordinary residential property in rural Wisconsin, photographed straight down from directly overhead at nadir, north up, orthographic projection with no perspective and no tilt. Flat even light with the sun high near zenith, shadows very short and all falling the same direction. No horizon, no sky, no skyline.

Late autumn, after leaf drop and before snow. The turf is dormant: tan, straw, olive-brown, not green. Deciduous trees are bare, reading as fine grey branching structure and their own bare shadow on the ground. A couple of dark evergreens for mass. Ground tones are brown, gold, grey-green and dust.

A plain quarter-acre platted lot, not an estate. Mown open ground occupying most of the frame, a gravel and asphalt driveway, one small utilitarian outbuilding or shed. The yard is unimproved and unfinished: no designed planting beds, no ornamental borders, no edging, no mulch rings, no patio, no deck, no fire pit, no manicured landscaping of any kind. Large simple areas of open ground with nothing built on them.

Uniformly sharp across the entire frame, edge to edge, exactly like a real orthorectified survey tile. Infinite depth of field. No depth of field falloff, no tilt-shift, no miniature-faking, no blurred edges, no soft borders, no blurred margin or frame around the picture, no darkened border.

Photographic and realistic, like real high-resolution aerial survey imagery. Composed as a few large tonal masses rather than fine detail. Muted, low contrast, slightly desaturated, natural colour.

Strictly excluded: no text, no letters, no numbers, no labels, no street names, no house numbers, no signage, no north arrow, no scale bar, no legend. No drawn lines, no outlines, no boundary markings, no survey overlay, no graphics of any kind on the image. No water at all: no pond, no creek, no stream, no swimming pool, no puddles. Nothing blue anywhere in the frame: no blue roofs, no blue vehicles, no blue tarps. No people, no cars, no trucks, no boats, no trailers, no trampoline, no play equipment, no patio furniture, no garden ornaments, no animals. No construction site, no pallets, no equipment. No snow, no ice. No vignette, no lens flare, no bloom, no chromatic aberration, no film grain, no HDR halo. Not a tilted drone shot, not an aerial three-quarter view, not golden hour.`;

const VARIANTS = [
  {
    name: 'portrait',
    aspect_ratio: '9:16',
    width: 1080,
    framing: `Vertical frame. A modest single-storey house sits hard against the very TOP edge of the frame and is cropped by it, small, its roof reading as one flat dark simple shape with no visible detail. Below the house, the middle of the frame is the quietest part of the picture: a large uninterrupted expanse of open dormant lawn, even in tone, with nothing crossing it. Trees, the driveway and the outbuilding sit toward the left and right margins, never in the centre. The lower third of the frame is plain open ground.`,
  },
  {
    name: 'landscape',
    aspect_ratio: '16:9',
    width: 1920,
    framing: `Horizontal frame. The property is offset toward the LEFT of the frame, not centred. A modest single-storey house sits in the upper left, small, its roof reading as one flat dark simple shape with no visible detail. The centre and upper middle of the frame is the quietest part of the picture: a large uninterrupted expanse of open dormant lawn, even in tone, with nothing crossing it. Trees and the driveway sit toward the left edge and the far right. The bottom of the frame is plain open ground.`,
  },
];

async function generate({ name, aspect_ratio, framing, width }) {
  console.log(`\n[${name}] submitting ${aspect_ratio}...`);

  const res = await fetch('https://api.replicate.com/v1/models/google/nano-banana-pro/predictions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      'Content-Type': 'application/json',
      Prefer: 'wait',
    },
    body: JSON.stringify({
      input: {
        prompt: `${framing}\n\n${SHARED}`,
        aspect_ratio,
        resolution: '2K',
        output_format: 'png',
      },
    }),
  });

  const body = await res.json();
  if (!res.ok) throw new Error(`[${name}] ${res.status} ${JSON.stringify(body).slice(0, 300)}`);

  let pred = body;
  while (pred.status === 'starting' || pred.status === 'processing') {
    await new Promise((r) => setTimeout(r, 3000));
    const poll = await fetch(pred.urls.get, { headers: { Authorization: `Bearer ${TOKEN}` } });
    pred = await poll.json();
    console.log(`[${name}] ${pred.status}`);
  }

  if (pred.status !== 'succeeded') {
    throw new Error(`[${name}] ${pred.status}: ${pred.error ?? 'unknown'}`);
  }

  const url = Array.isArray(pred.output) ? pred.output[0] : pred.output;
  console.log(`[${name}] ${url}`);

  const img = await fetch(url);
  const raw = Buffer.from(await img.arrayBuffer());
  await mkdir(OUT, { recursive: true });

  /* RE-ENCODED, because the model returns an 8 MB PNG and these are the only files this repo ships
     to a phone before any session exists, on whatever connection that phone has (spec §1b: a back
     yard behind a house). q55 rather than something higher because the picture is under a 65%
     scrim by the time anyone sees it, which hides compression long before it hides content. */
  const file = new URL(`backdrop-${name}.webp`, OUT);
  const info = await sharp(raw).resize({ width }).webp({ quality: 55, effort: 6 }).toFile(file.pathname.slice(1));
  console.log(`[${name}] ${info.width}x${info.height}  ${(info.size / 1024).toFixed(0)} KB  (from ${(raw.length / 1024 / 1024).toFixed(1)} MB png)`);
}

for (const v of VARIANTS) {
  await generate(v);
}
console.log('\ndone');
