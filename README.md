# plot

A measured model of your property, and what it lets you build.

You type your address. It pulls your lot lines, your house footprint and a scaled aerial from
public records, works out your hardiness zone, your slope and which way it faces, and models your
sun month by month. You confirm it. Then you photograph the corner of the yard you're thinking
about, draw a rough shape on the photo, say what you want it to look like, and it renders that
into your actual picture. When you like it, you flip to the overhead plan and give the shape a
real size — which produces a shopping list with waste already in it, and a build guide with the
tools, the steps and the checks between them, using your numbers.

When you finish, it stays on the property. Next year starts from what's already built.

**The two-surface rule is the core architectural decision:** the photo carries the *look*, the
plan carries the *size*, and they are the same project. A phone photo has no scale, so no quantity
can ever come from it. An overhead plan has real geometry but sells nobody on anything. Every
competitor picked one and lost the other.

## Docs

The blueprint artifacts live in [`docs/`](docs/) and are the source of truth, not this file.

| | |
|---|---|
| [`docs/problem-brief.md`](docs/problem-brief.md) | Phase 1 — who this is for and why it can't be cloned |
| [`docs/spec.md`](docs/spec.md) | Phase 2 — **what v1 is.** Point agents here, not at your memory of it |
| [`docs/walkthrough.md`](docs/walkthrough.md) | The same spec as a story, for picturing the flow |
| [`docs/design-system.md`](docs/design-system.md) | Phase 3 — every visual rule, decided once |
| [`docs/recon.md`](docs/recon.md) | The competitive read, and why the category fails |
| [`docs/reference/`](docs/reference/) | Per-product teardowns from live drives |

## Stack

Next.js 16 · React 19 · TypeScript 6 · Tailwind v4 · Neon + Drizzle · Better Auth ·
Vercel AI SDK · Replicate.

## Data sources

All four are settled and proven, not assumed.

| What | Source | Notes |
|---|---|---|
| Parcel boundary | Wisconsin Statewide Parcel DB (ArcGIS) | Free, no key, all 72 counties. **Wisconsin only** — returns nothing outside rather than guessing a line you'd measure off. |
| Aerial imagery | Google Static Maps satellite | z18–21, north-up Web Mercator, metres-per-pixel computed in closed form. |
| Sun | Google Solar API `monthlyFlux` | 12 bands, 0.5 m grid. **Modelled**, never presented as measured. |
| Slope + aspect | USGS 3DEP ImageServer | 1 m, no key, national. `Slope Degrees` / `Aspect Degrees`. |
| Image generation | Replicate | Renders the drawn region into the user's own photo. |

Prior art for the first four is in `modryn-builds/yard` (`src/lib/parcel.ts`, `site-imagery.ts`,
`solar.ts`) — read it before reimplementing.

## Start

```bash
cp .env.local.example .env.local
npm install
npx drizzle-kit generate && npx drizzle-kit migrate
npm run dev
```

Required in `.env.local`: `DATABASE_URL`, `BETTER_AUTH_SECRET`, `ANTHROPIC_API_KEY`,
`GOOGLE_MAPS_API_KEY`, `REPLICATE_API_TOKEN`.

`CLAUDE.md` carries the setup detail and the scar tissue.
