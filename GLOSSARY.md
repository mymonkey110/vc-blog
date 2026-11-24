# Glossary — VC Blog（修行码农）

Canonical domain vocabulary, invariants, and system boundaries for `vc-blog` (`michael-j.net`).
Use these terms consistently across issues, specs, code, and tests.

## System Context

`vc-blog` is a single-author technical blog migrated from Hexo to Next.js 16 (App Router) + PostgreSQL (Prisma 7). It has two distinct surfaces backed by one `article` table:

- **Blog Frontend (`src/app/(pages)/`)**: Public, read-only, build-time statically generated (SSG) pages for readers and search engines (`/`, `/page/[page]`, `/article/[yyyy]/[mm]/[dd]/[title]`, `/categories`, `/categories/[name]`, `/about`, plus `/sitemap.xml` and `/rss.xml`).
- **Admin Console (`src/app/admin/`)**: Authenticated CMS for authoring articles (`/admin/articles`, `/admin/articles/new`, `/admin/articles/edit/[id]`), uploading media to Vercel Blob, and invoking AI assistance (`/admin/api/ai/*`).

## Domain Terms

### Article（文章）

The sole persisted domain entity, mapped to PostgreSQL table `article` (`prisma/schema.prisma`, Prisma model `Article`).

| Field | Column | Type / Constraint | Meaning |
| --- | --- | --- | --- |
| `id` | `id` | UUID string | Primary key |
| `title` | `title` | `VARCHAR(255)` | Display title |
| `description` | `description` | nullable text | Short summary/excerpt for SEO and list cards |
| `content` | `content` | text | Raw Markdown body rendered via `MarkdownRenderer` |
| `createdAt` | `created_at` | `DateTime` (UTC) | Publication timestamp; determines URL date segment |
| `category` | `category` | nullable `VARCHAR(128)` | Single category name (no separate Category table) |
| `status` | `status` | `VARCHAR(10)`, default `'publish'` | Publication state (`'publish'` or `'draft'`) |
| `slug` | `slug` | nullable `VARCHAR(255)`, default `""` | Hexo-compatible URL slug |
| `coverPic` | `cover_pic` | nullable `VARCHAR(2048)` | Optional HTTP/HTTPS cover image URL |

- **Avoid**: Calling the DB entity `Post` in code/schema; assuming `tags`, multi-category arrays, or `updatedAt` exist in the database.

### Publication Status（发布状态）

The lifecycle state stored in `Article.status`.

- **Canonical values**: `'publish'` (publicly visible) and `'draft'` (unpublished work in progress).
- **Avoid**: `'published'` (only appears in legacy/unused `src/types/article.ts` and `src/app/admin/(dashboard)/articles/[id]/page.tsx`).
- **Known gap**: `BlogList` and `sitemap.ts` filter `status: 'publish'`, while `page/[page]`, `article/[yyyy]/[mm]/[dd]/[title]`, `categories`, and `rss.xml` do not currently filter by `status`.

### Article Slug & Canonical URL（文章别名与规范链接）

- **Canonical URL**: `/article/<YYYY>/<MM>/<DD>/<slug>`, where `<YYYY>/<MM>/<DD>` is derived from `Article.createdAt` in **UTC** (`getUTCFullYear`, `getUTCMonth() + 1`, `getUTCDate()`).
- **Route parameter quirk**: The dynamic route segment is named `[title]` (`src/app/(pages)/article/[yyyy]/[mm]/[dd]/[title]/page.tsx`), but it matches `Article.slug` (`decodeURIComponent(params.title) === article.slug`), not `Article.title`.
- **Slugification (`toSlug` in `src/utils/slug.ts`)**: Hexo-compatible — collapses ASCII symbols and whitespace into `-` while preserving Chinese punctuation (e.g. `：`, `——`).
- **Legacy redirects (`next.config.js`)**: `/:year/:month/:day/:slug` (with or without trailing slash) permanently redirects to `/article/:year/:month/:day/:slug`; `/rss2.xml`, `/atom.xml`, and `/feed` permanently redirect to `/rss.xml`.
- **Known gap**: Active admin write paths (`src/app/admin/(dashboard)/articles/actions.ts` and `/admin/api/articles`) do not currently set `slug` on create/update, whereas `generateStaticParams()` skips articles with an empty `slug`.

### Category（分类）

A single optional grouping string on `Article.category`. There is no separate `Category` table; `/categories` aggregates via `prisma.article.groupBy({ by: ['category'] })` excluding `null` and `""`.

### Description / Summary（文章摘要）

Stored in `Article.description`. Shown on home/paginated cards, article detail lead-in, RSS items, and `<meta name="description">`. AI summary generation targets `<= 50` Chinese characters (`maxOutputTokens: 100`).

- **Avoid**: Calling it `excerpt` in new code (`excerpt` is a legacy alias in `src/types/article.ts`).

### Cover Image（封面图）

Stored in `Article.coverPic` (must be an `http:` or `https:` URL, `<= 2048` chars). Authored via `CoverImageInput` using three modes:

1. **URL**: Direct external HTTP/HTTPS link.
2. **Upload**: Client-direct upload to Vercel Blob via `/admin/api/upload/auth` (JPG/PNG/WebP/GIF, `<= 5MB`), stored under `cover/<name>+<16-char-alnum>.<ext>`.
3. **AI Generate**: Server-proxied Pollinations (`flux`) image converted to WebP in browser canvas and uploaded to Vercel Blob under `cover/`.

Inline Markdown images pasted/uploaded in `VditorEditor` also upload to Vercel Blob via `/admin/api/upload/auth`, stored under `images/<timestamp>-<rand>.<ext>`.

### Disqus Identifier（评论标识）

Computed in `src/components/Comment.tsx` to preserve comment threads migrated from Hexo:

- Article pages: `<yyyy>/<mm>/<dd>/<slug>/` (derived by stripping `/article/` and appending `/`).
- About page: `about/index.html`.

### Admin Session（管理员会话）

Single-admin authentication backed by `VC_ADMIN_PASSWORD` and `JWT_SECRET` (`src/actions/auth.ts`).

- Login requires both the admin password and a valid Cloudflare Turnstile token (`TURNSTILE_SECRET_KEY`).
- On success, issues an `HS256` JWT (`jose`, 1-day expiry) in the `admin_token` cookie (`HttpOnly`, `SameSite=Strict`, `Secure` in production).
- Enforced at the request boundary by Next.js 16 `src/proxy.ts` (`/admin`, `/admin/:path*`) and re-verified inside every Server Action (`requireAuth`) and `/admin/api/**` route handler.

### AI Gateway / Content Assistance（AI 内容助手）

- **Description generation**: `POST /admin/api/ai/generate-description` streams via Vercel AI SDK 6 (`streamText` + `toUIMessageStreamResponse()`) through Cloudflare AI Gateway's Unified Provider (`src/lib/ai-config.ts`). Configured solely by server environment variables (`CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_GATEWAY_NAME`, `CLOUDFLARE_API_KEY`, `AI_API_KEY`, `AI_MODEL`).
- **Cover image generation**: `POST /admin/api/ai/generate-image` (`nodejs` runtime, `maxDuration = 30`, up to 3 retries) calls Pollinations (`image.pollinations.ai`, `flux`) server-side and returns base64 image data.
- **Bot protection**: Both AI generation endpoints validate `cfTurnstileResponse` server-side before invoking upstream providers.

## Active vs. Legacy Surfaces

Several earlier prototypes or superseded layers still exist in the repo. Do not build new features on legacy surfaces without explicitly migrating or removing them:

| Area | Active (Source of Truth) | Legacy / Superseded |
| --- | --- | --- |
| Article authoring UI | `/admin/articles/new`, `/admin/articles/edit/[id]` + Server Actions (`articles/actions.ts`) | `/admin/articles/[id]/page.tsx` (hardcoded mock editor with tags & `'published'`) |
| Article REST API | `/admin/api/articles` & `/admin/api/articles/[id]` (has `coverPic` validation; not called by current UI) | Docs in `doc/后台/文章编辑与发布.md` (`/api/admin/article/*`) |
| Markdown rendering | `src/components/MarkdownRenderer.tsx` (`react-markdown` + `remark-gfm` + Prism) | `src/utils/markdown.ts` (`content/posts` filesystem + `next-mdx-remote`) |
| AI description flow | `InlineAIDescriptionInput` -> SSE `/admin/api/ai/generate-description` -> `src/lib/ai-config.ts` | `DescriptionGeneratorUI`, `description-generator-service.ts`, `ai-configuration-manager.ts`, `ai-cache-manager.ts`, `ai-progress-tracker.ts`, `ai-debouncer.ts`, `ai-error-handler.ts` |
| AI settings | Server env vars read by `src/lib/ai-config.ts` | `/admin/settings/ai` (`AISettingsPanel` + `ai-settings-manager.ts` saving Gemini options to `localStorage`) |
