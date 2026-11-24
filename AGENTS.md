# AGENTS.md — vc-blog

Next.js 16 (App Router) + React 19 + TypeScript blog with Prisma 7 (`@prisma/adapter-pg` / PostgreSQL), Tailwind CSS + Radix/shadcn UI, Vercel Blob uploads, Cloudflare AI Gateway / Turnstile, and Vitest.

Read `GLOSSARY.md` for canonical domain terminology (and legacy vs. active surfaces) and `docs/adr/` for architectural decisions before making structural changes.

## Commands

```bash
npm run dev           # Development server
npm run build         # prisma generate && next build
npm run start         # Production server
npm run lint          # ESLint (next/core-web-vitals)
npm run test          # Vitest watch mode
npm run test:run      # Run all tests once
npm test -- src/lib/__tests__/ai-config.test.ts   # Single test file
npm test -- -t "test name"                        # Filter by test name
```

## Non-Negotiable Architecture Rules

1. **Full SSG for Blog Frontend (`src/app/(pages)/`)** — See `docs/adr/0001-ssg-for-blog-frontend.md`.
   - Static pages (`/`, `/categories`, `/about`): export `dynamic = 'force-static'`.
   - Dynamic routes (`/page/[page]`, `/article/[yyyy]/[mm]/[dd]/[title]`, `/categories/[name]`): MUST export `generateStaticParams()`.
   - NEVER use `dynamic = 'force-dynamic'` or `revalidate` (no ISR) on public blog pages.
   - Next.js 16: always `await params` in dynamic pages and `generateMetadata`.
2. **Hexo URL & Disqus Compatibility** — See `docs/adr/0002-hexo-url-and-disqus-compatibility.md`.
   - Canonical article URLs are `/article/<YYYY>/<MM>/<DD>/<slug>` computed in **UTC** from `Article.createdAt`. Preserve `next.config.js` redirects and `Comment.tsx` Disqus identifiers.
3. **Admin Auth & Testing Boundaries** — See `docs/adr/0003-admin-auth-and-turnstile-protection.md`.
   - `/admin` is protected by `src/proxy.ts` and re-verified via `admin_token` JWT inside every Server Action and `/admin/api/**` route; login & AI generation endpoints also enforce Cloudflare Turnstile.
   - **Never** create auth-bypass routes or test backdoors. For manual `/admin` UI testing, use Chrome MCP and ask the user for login credentials when needed.
4. **Database & Media** — See `docs/adr/0004-database-markdown-and-media-storage.md` and `docs/adr/0005-ai-content-assistance-architecture.md`.
   - Always import the Prisma 7 singleton from `@/lib/db` (client generated to `src/generated/prisma`).
   - Use `Article.status` values `'publish'` / `'draft'` (never `'published'`).

## Repository Layout

```
prisma/schema.prisma   # Single PostgreSQL model: Article (table: article)
src/
├── proxy.ts           # Next.js 16 request proxy guarding /admin*
├── actions/           # Auth Server Actions (login/logout/verifySession)
├── app/(pages)/       # Public SSG blog pages
├── app/admin/         # Authenticated CMS UI, Server Actions, and /admin/api/*
├── components/        # UI (Radix/shadcn in ui/) and business components
├── lib/               # Prisma singleton, AI Gateway/Pollinations, Turnstile, cn()
├── types/             # TypeScript interfaces
├── utils/             # Slug, uploadService, URL/file validation, metadata
└── test/              # Vitest global setup (setup.ts) and markdown tests
```

## Conventions

- **Formatting & Linting**: Follow `.prettierrc` (single quotes, trailing commas, 2 spaces, semicolons, 100-col width) and `.eslintrc.json`.
- **Imports & Types**: Use `@/` path alias, `import type` for type-only imports, external imports before internal imports, and `cn()` from `@/lib/utils` for Tailwind class merging.
- **API Routes**: Place admin endpoints under `src/app/admin/api/` using kebab-case paths (e.g. `/admin/api/ai/generate-description`), verify `admin_token` via `cookies()`, validate/sanitize inputs, return `{ success: boolean, ... }` or `{ error: string }` with standard HTTP status codes (`200`/`201`/`400`/`403`/`500`), and use Chinese for user-facing error messages.
- **Testing**: Vitest with `jsdom` (`vitest.config.ts`, `src/test/setup.ts`). Co-locate tests in `__tests__/` or `src/test/`. Split complex component tests into focused files (`behavior`, `integration`, `error`, `property` with `fast-check`, `dragdrop`).

## Before Submitting Work

1. Run `npm run lint` and fix all issues.
2. Run `npm run test:run` and ensure all tests pass.
3. If modifying public pages or `prisma/schema.prisma`, run `npm run build` and confirm public routes remain static in the build output.

## Agent skills

### Issue tracker

Issues and specs are tracked as local markdown files under `.scratch/<feature>/`. See `docs/agents/issue-tracker.md`.

### Domain docs

Single-context layout (`GLOSSARY.md` and `docs/adr/` at the repo root). See `docs/agents/domain.md`.
