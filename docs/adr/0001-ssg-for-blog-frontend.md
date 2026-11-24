# ADR-0001: Full Static Site Generation (SSG) for Blog Frontend

- **Status**: Accepted
- **Scope**: `src/app/(pages)/**`, `src/components/BlogList.tsx`, `src/components/ui/CoverImage.tsx`

## Context

`vc-blog` is a read-only personal technical blog backed by PostgreSQL (Neon). Visitor requests should load instantaneously with strong SEO and Core Web Vitals, without paying database cold-start or per-request query latency. Content changes infrequently (only when the author publishes or edits an article).

## Decision

All public blog frontend pages under `src/app/(pages)/` MUST be statically generated at build time (full SSG):

1. **Static pages** (`/`, `/categories`, `/about`): declare `export const dynamic = 'force-static'` and render as React Server Components querying Prisma at build time.
2. **Dynamic routes** (`/page/[page]`, `/article/[yyyy]/[mm]/[dd]/[title]`, `/categories/[name]`): MUST export `generateStaticParams()` to pre-generate every valid path at build time.
3. **No ISR / No dynamic rendering**: Never export `revalidate` or `dynamic = 'force-dynamic'` on public blog pages. Content updates are reflected by rebuilding and redeploying the site.
4. **Next.js 16 async params**: Dynamic page components and `generateMetadata()` MUST `await params`.
5. **SSG-safe media**: `CoverImage` wraps its interactive fallback (`CoverImageClient`) in `<Suspense>` with a static `ImagePlaceholder` so build-time pre-rendering succeeds cleanly.

## Exceptions / Notes

- `/rss.xml` (`src/app/rss.xml/route.ts`) is currently an HTTP Route Handler returning XML with `Cache-Control: public, s-maxage=3600, stale-while-revalidate=86400`.
- `/admin/**` is dynamic and authenticated; SSG rules do not apply to the admin console.

## Consequences

- `npm run build` requires a reachable `DATABASE_URL` so Prisma can enumerate all articles, pages, and categories at build time.
- Editing or creating articles in `/admin` does not update the public blog until a new build runs.
- Changes to public routes must be verified against `next build` output to ensure pages remain statically generated (`○` / `●`) rather than dynamic (`ƒ`).
