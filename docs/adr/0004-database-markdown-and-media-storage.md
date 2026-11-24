# ADR-0004: PostgreSQL + Prisma 7, Server-Side Markdown Rendering, and Vercel Blob Uploads

- **Status**: Accepted
- **Scope**: `prisma/schema.prisma`, `prisma.config.ts`, `src/lib/db.ts`, `src/components/MarkdownRenderer.tsx`, `src/app/admin/api/upload/auth/route.ts`, `src/utils/uploadService.ts`, `src/components/VditorEditor.tsx`

## Context

The blog evolved from local Markdown files (`content/posts/` parsed with `gray-matter` and `next-mdx-remote`) into a web-managed CMS backed by Neon PostgreSQL, supporting rich Markdown authoring in the browser and direct image uploads.

## Decision

1. **Database & Prisma 7 driver adapter**:
   - A single PostgreSQL table (`article`, model `Article`) stores all blog content and metadata.
   - Prisma 7 uses the `prisma-client` generator outputting to `src/generated/prisma`, instantiated with `@prisma/adapter-pg` (`PrismaPg`) as a singleton in `src/lib/db.ts`.
   - `npm run build` runs `prisma generate && next build`.
2. **Markdown authoring & rendering**:
   - Admin authoring uses `VditorEditor` (`vditor`, split-view `sv` mode by default, cache disabled to avoid SSR/hydration mismatches).
   - Public rendering uses `MarkdownRenderer` (`react-markdown` + `remark-gfm` + `react-syntax-highlighter` Prism `vscDarkPlus`) directly on raw `Article.content` inside Server Components, superseding the legacy `next-mdx-remote` pipeline in `src/utils/markdown.ts`.
   - Remote images in Markdown use native `<img>` in development (avoiding local DNS/private-IP issues) and `next/image` in production.
3. **Client-direct media uploads via Vercel Blob**:
   - Browser clients (`uploadCoverImage` in `src/utils/uploadService.ts` and `VditorEditor`) upload directly to Vercel Blob (`access: 'public'`) using short-lived tokens minted by `POST /admin/api/upload/auth` (`handleUpload` from `@vercel/blob/client`).
   - Upload constraints: `<= 5MB`, image MIME allowlist (`jpeg`, `jpg`, `png`, `gif`, `webp`, `svg+xml` on server; `jpeg`, `jpg`, `png`, `webp`, `gif` in client `fileValidation.ts`).
   - Blob key prefixes: `cover/<name>+<16-char-random>.<ext>` for cover images, `images/<timestamp>-<rand>.<ext>` for inline article images.

## Consequences

- Always import the Prisma client from `@/lib/db`; never instantiate a new `PrismaClient` directly.
- `next.config.js` `images.remotePatterns` must keep `*.public.blob.vercel-storage.com` allowed for `next/image`.
- `src/utils/markdown.ts` and `next-mdx-remote` remain in the repo only as legacy artifacts (upgraded to v6 to address a vulnerability, see `docs/plans/2026-06-15-fix-next-mdx-remote-v6-vulnerability.md`) and are not used by live blog routes.
