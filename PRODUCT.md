# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Primary readers:** Chinese-speaking software engineers reading long-form technical deep dives (software architecture, DDD, distributed systems, cloud/Kubernetes, Vibe Coding, Java, TypeScript, Rust, and debugging postmortems). They arrive via search engines, RSS feeds, or direct/legacy links to learn, reference architecture patterns, or follow discussions.
- **Author & operator:** The single blog author (Michael Jiang / 麦克·蒋), using the private `/admin` CMS to draft Markdown posts, manage media, generate summaries and cover images with AI assistance, and publish articles.

## Product Purpose

`修行码农` (`vc-blog`, hosted at `michael-j.net`) is Michael Jiang's personal technical blog and long-term engineering knowledge archive, paired with a private AI-assisted CMS.

Success means delivering a fast, reliable, distraction-free reading experience for deep technical writing (including code snippets and system architecture diagrams) while keeping the solo authoring and publishing workflow frictionless.

## Positioning

A decade-plus (2014–present) single-author Chinese engineering archive originally built on Hexo and migrated to Next.js 16 + PostgreSQL. It combines 100% build-time static delivery and unbroken legacy Hexo URL/Disqus thread continuity with an integrated, Turnstile-protected private CMS featuring Vercel Blob media uploads and AI content assistance (Cloudflare AI Gateway + Pollinations).

## Operating Context

- **Public reading & discovery:** Readers access articles on desktop and mobile browsers, subscribe via `/rss.xml` (plus legacy `/rss2.xml`, `/atom.xml`, and `/feed` redirects), discover content through search indexing (`/sitemap.xml`, OpenGraph metadata), and comment via Disqus.
- **Authoring & publishing:** The author signs in at `/admin/login` (password + Cloudflare Turnstile + `admin_token` JWT), writes Markdown in `VditorEditor`, uploads inline or cover images directly to Vercel Blob, optionally streams a concise Chinese summary (`<= 50` chars) via Cloudflare AI Gateway or generates a cover image via Pollinations, and saves articles to PostgreSQL.
- **Static release cycle:** Because all public blog routes are statically generated at build time, newly published or edited articles go live on rebuild/deployment.

## Capabilities and Constraints

- **Two distinct surfaces:**
  - **Blog Frontend (`src/app/(pages)/`):** Public read-only SSG routes (`/`, `/page/[page]`, `/article/[yyyy]/[mm]/[dd]/[title]`, `/categories`, `/categories/[name]`, `/about`, `/rss.xml`, `/sitemap.xml`).
  - **Admin Console (`src/app/admin/`):** Private single-admin CMS (`/admin/login`, `/admin/articles`, `/admin/articles/new`, `/admin/articles/edit/[id]`, `/admin/api/*`).
- **Full SSG on public pages:** Static routes export `dynamic = 'force-static'`; dynamic routes export `generateStaticParams()`. Never introduce `force-dynamic` or ISR (`revalidate`) on public blog pages.
- **Hexo URL & Disqus compatibility:** Canonical article URLs are `/article/<YYYY>/<MM>/<DD>/<slug>` computed in UTC from `Article.createdAt`. Preserve `next.config.js` permanent redirects and `Comment.tsx` Disqus identifiers (`<yyyy>/<mm>/<dd>/<slug>/` and `about/index.html`).
- **Domain & schema invariants:** Single PostgreSQL `article` table (`Article` model in `prisma/schema.prisma`) with canonical `status` values `'publish'` and `'draft'` (never `'published'`), a single optional `category` string (no separate category or tag tables), `description` (not `excerpt`), `slug`, and optional `coverPic`.
- **Admin security boundary:** `/admin*` is guarded by `src/proxy.ts` and re-verified via `admin_token` JWT in every Server Action and `/admin/api/**` handler. Login and AI endpoints enforce Cloudflare Turnstile. Never add auth-bypass routes or test backdoors.
- **Language & attribution:** Primary content and UI language is Simplified Chinese (`zh-CN`). Articles display `CC BY-NC-SA 4.0` license attribution (`CCLicense.tsx`).
- **Active vs. legacy surfaces:** Build only on active surfaces documented in `GLOSSARY.md` (do not build on superseded files such as `/admin/articles/[id]/page.tsx`, `/admin/settings/ai`, or `src/utils/markdown.ts`).
- **Undecided product facts:** No specific accessibility compliance tier was set as a binding requirement, and existing decorative brand elements (tagline `代码❤技术❤生活` and the current inline SVG mark in `NavigationBar.tsx`) were not locked as mandatory constraints for future redesigns.

## Brand Commitments

- **Name & domain:** `修行码农` (`michael-j.net`), authored by Michael Jiang (`麦克·蒋`).
- **Attribution & copyright:** `CC BY-NC-SA 4.0` on articles; site copyright `2014 - <currentYear> Michael Jiang`.
- **Language:** Simplified Chinese (`zh-CN`) for public reading, metadata, and admin UI.

## Evidence on Hand

- **Author biography & timeline:** Real career/education timeline (2007–present), contact info (`mymonkey110@163.com`, `github.com/mymonkey110`, `michael-j.net`), and technical interest areas (DDD, Vibe Coding, Software Architecture & Theory, Java & WEB, TypeScript, Rust) in `src/app/(pages)/about/page.tsx`.
- **Site & author assets:** Author avatar (`public/images/avatar/avatar.png`), favicon (`public/favicon.png`), PWA manifest (`public/site.webmanifest`).
- **Technical article diagrams:** Real architecture and debugging images under `public/images/posts/` (DDD, Hexagonal Architecture, Kubernetes/PaaS Operator, ZooKeeper, Billing system architecture, Java profiling/debugging).
- **Architecture & domain docs:** `GLOSSARY.md`, `AGENTS.md`, and ADRs `docs/adr/0001`–`0005`.
- **Absences not to fabricate:** No readership/traffic claims, subscriber counts, testimonials, third-party endorsements, or fictional articles/metrics exist in the repository — future work must not invent them.

## Product Principles

1. **Comprehension for deep technical reading:** Long-form engineering prose, code blocks, and architecture diagrams come first on public pages.
2. **Archive permanence:** Preserve canonical UTC URLs, legacy Hexo redirects, Disqus threads, and `CC BY-NC-SA 4.0` attribution across all changes.
3. **Static speed by default:** Maintain 100% build-time static generation on the public blog with zero runtime database dependency.
4. **Frictionless solo publishing:** Keep `/admin` centered on a single author's real workflow — Markdown editing, direct media upload, and optional AI assistance — without multi-user complexity.
5. **Strict surface separation:** Keep the public reading site and the Turnstile/JWT-protected admin CMS cleanly bounded.
