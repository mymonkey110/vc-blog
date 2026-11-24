# ADR-0002: Hexo-Compatible UTC URLs, Redirects, and Disqus Identifiers

- **Status**: Accepted
- **Scope**: `next.config.js`, `src/utils/slug.ts`, `src/app/(pages)/article/[yyyy]/[mm]/[dd]/[title]/page.tsx`, `src/components/BlogList.tsx`, `src/app/sitemap.ts`, `src/app/rss.xml/route.ts`, `src/components/Comment.tsx`

## Context

`vc-blog` was migrated from a Hexo static blog (`michael-j.net`) with existing search engine backlinks, RSS subscribers, and Disqus comment threads. Breaking article URLs, feed URLs, or Disqus thread identifiers would cause 404s and orphan years of historical comments.

## Decision

1. **Canonical article URL**: `/article/<YYYY>/<MM>/<DD>/<slug>`, where `<YYYY>`, `<MM>`, and `<DD>` are ALWAYS computed from `Article.createdAt` in **UTC** (`getUTCFullYear`, `getUTCMonth() + 1`, `getUTCDate()`), zero-padded to 2 digits for month/day.
2. **Hexo-compatible slugging**: `toSlug()` (`src/utils/slug.ts`) collapses ASCII symbols and whitespace into `-` while preserving Chinese punctuation (such as `：` and `——`), matching historical Hexo URL slugs.
3. **Permanent redirects (`next.config.js`)**:
   - `/:year(\d{4})/:month(\d{2})/:day(\d{2})/:slug` (and trailing-slash variant) -> `/article/:year/:month/:day/:slug`
   - `/rss2.xml`, `/atom.xml`, `/feed` -> `/rss.xml`
4. **Disqus thread identifier (`src/components/Comment.tsx`)**:
   - Article pages strip the `/article/` prefix and append `/` (`<yyyy>/<mm>/<dd>/<slug>/`).
   - The About page uses `about/index.html`.

## Consequences

- Never switch URL date formatting from UTC to server/local timezone — doing so shifts dates near midnight UTC and breaks `generateStaticParams` lookups and external links.
- Although the Next.js route folder parameter is named `[title]`, it matches `Article.slug` (URL-decoded); renaming it requires updating `generateStaticParams`, `generateMetadata`, and `Page` together.
- Never alter the Disqus `identifier` algorithm without running a Disqus URL/identifier migration.
