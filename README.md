# modryn-base

The Modryn starting point. Next.js 16 · React 19 · TypeScript 6 · Tailwind v4 · Neon + Drizzle ·
Better Auth · Vercel AI SDK.

A working backend and a deliberately bare frontend. Sign-in (emailed 6-digit code + Google), a
Postgres schema with migrations, a self-hosted analytics funnel, an admin page, and founder email
alerts all work on first run. The design layer is five primitives and a token skeleton, because the
brand is the one thing that should never be inherited.

## Start

```bash
cp .env.local.example .env.local   # fill DATABASE_URL, BETTER_AUTH_SECRET, ANTHROPIC_API_KEY
npm install
npx drizzle-kit generate && npx drizzle-kit migrate
npm run dev
```

`CLAUDE.md` is the real documentation — setup steps, what to strip, and the scar tissue.
