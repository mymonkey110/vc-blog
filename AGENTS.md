# AGENTS.md - Agent Guidelines for vc-blog

## Project Overview

Next.js 16 blog application with TypeScript, Prisma ORM, and PostgreSQL. Uses React 19, App Router, Tailwind CSS, Radix UI components, and Vitest for testing.

**CRITICAL: SSG (Static Site Generation) is paramount for blog frontend performance and visitor experience. All frontend blog pages MUST be statically generated.**

## Essential Commands

### Development

```bash
npm run dev           # Start development server
npm run build         # Build for production (includes prisma generate)
npm run start         # Start production server
```

### Code Quality

```bash
npm run lint          # Run ESLint (always run before committing)
```

### Testing

```bash
npm run test          # Run tests in watch mode
npm run test:run      # Run tests once
```

### Running Single Tests

```bash
# Run specific test file
npm test -- src/lib/__tests__/ai-config.test.ts

# Run tests matching a pattern
npm test -- ai-config

# Run specific test by name
npm test -- -t "should return false when Cloudflare configuration is missing"
```

### Test File Organization

For complex components, split tests into focused files:

- `behavior.test.tsx` - Component behavior and state management
- `integration.test.tsx` - Integration with other components/services
- `error.test.tsx` - Error handling and edge cases
- `property.test.tsx` - Property-based tests with fast-check
- `dragdrop.test.tsx` - Drag and drop functionality

## Code Style Guidelines

### Formatting (Prettier)

- **Quotes**: Single quotes (`'`)
- **Trailing commas**: Enabled everywhere
- **Indentation**: 2 spaces
- **Semicolons**: Required
- **Line width**: 100 characters

### TypeScript

- Strict mode enabled
- Use `import type { ... }` for type-only imports
- Always define interfaces for component props and API data
- Use `const` with explicit types when inference isn't clear

### Imports

- External imports first, then internal `@/` imports
- Sort groups alphabetically
- Use `@/` alias for src directory
- Example:
  ```typescript
  import React from 'react';
  import { NextResponse } from 'next/server';
  import prisma from '@/lib/db';
  import { validateUrl } from '@/utils/urlValidation';
  import type { ArticleData } from '@/types/article';
  ```

### Naming Conventions

- **Components**: PascalCase (`BlogList`, `CoverImageInput`)
- **Utilities/Functions**: camelCase (`isValidUrl`, `cn`)
- **Constants**: camelCase (`pageSize`) or UPPER_CASE for truly global constants
- **Interfaces/Types**: PascalCase (`ArticleData`, `GenerationState`)
- **Database Models**: PascalCase (`Article`)
- **Entity Fields**: camelCase (e.g., `createdAt`, `categoryName`)
- **Database Schema**: snake_case mapping (e.g., `created_at`, `category_name`)
- **API Routes**: camelCase (e.g., `/admim/api/generateDescription`)
- **Files/Functions**: Follow ordinary conventions (default camelCast)
- **API URL PATH**: camelCase (e.g., `/admim/api/generateDescription`)

### React Components

- Client components: Add `'use client';` at top
- Server components: Default (no directive needed)
- Props interfaces defined above component
- Use `cn()` utility from `@/lib/utils` for Tailwind classes
- Use Radix UI + shadcn/ui pattern for UI components

### Error Handling

- Wrap async code in try-catch blocks
- Use `NextResponse.json()` for API responses with appropriate status codes:
  - 200: Success
  - 201: Created
  - 400: Bad request (validation errors)
  - 403: Unauthorized
  - 500: Server error
- Log errors with `console.error()` for debugging
- User-facing error messages in Chinese when appropriate

### API Routes (App Router)

- Verify authentication using cookies from `next/headers`
- Validate user input before database operations
- Sanitize data (trim strings, validate URLs)
- Return consistent JSON response format: `{ success: boolean, ...data }` or `{ error: string }`

### Database (Prisma)

- Run `prisma generate` before building (included in build script)
- Use `@default()` for database-level defaults
- Use `@map()` for snake_case column names in PostgreSQL
- Models use PascalCase
- Use `await` for all Prisma operations

### Testing (Vitest)

- Environment: jsdom (configured in vitest.config.ts)
- Place test files in `__tests__` directories alongside source files or in `src/test/`
- Global test utilities in `src/test/setup.ts`
- Use `describe()` and `it()` for test organization
- Property-based tests use fast-check for complex validation logic
- File naming: `*.test.ts` or `*.test.tsx`
- Use `beforeEach`/`afterEach` for setup/teardown
- Mock external dependencies in setup.ts (CSS modules, react-syntax-highlighter, etc.)
- Multiple test files per component are acceptable (e.g., behavior.test.tsx, integration.test.tsx, property.test.ts)

### Linting (ESLint)

- Config extends `next/core-web-vitals`
- Rule `react/react-in-jsx-scope` is disabled (not needed in React 17+ with new JSX transform)
- Always run `npm run lint` before committing

### Admin Backend Testing Rules

- **Authentication required**: `/admin` routes require authentication, do not create test pages that bypass auth
- **For manual testing**: When authentication blocks automated testing, use chrome mcp to interact with the admin UI
- **Test coordination**: Provide clear test steps for manual execution when chrome mcp is needed
- **Password handling**: User will provide login credentials when chrome mcp requires authentication
- **Do not**: Create dedicated test routes or pages to circumvent authorization

### File Structure

```
src/
├── app/              # Next.js App Router pages and API routes
├── components/       # React components (UI, business logic)
├── lib/             # Core utilities, services, database
├── types/           # TypeScript type definitions
├── utils/           # Helper functions
└── test/            # Global test utilities
```

## SSG (Static Site Generation) - CRITICAL ARCHITECTURE PRINCIPLE

**Static Site Generation is NON-NEGOTIABLE for all blog frontend pages.**

### Why SSG is Mandatory

Blog pages (article list, article detail, categories, etc.) are read-only content that:

- Does not change frequently
- Benefits from pre-rendering at build time
- Must load instantly for best visitor experience
- Improves SEO and Core Web Vitals

### SSG Implementation Patterns

#### 1. Static Pages (Home, About, Categories, Tags)

```typescript
// Force static generation
export const dynamic = 'force-static'

export default async function Page() {
  // Server component - data fetched at build time
  const articles = await prisma.article.findMany(...)
  return <BlogList articles={articles} />
}
```

#### 2. Dynamic Routes (Article Detail Pages)

**USE `generateStaticParams()` for ALL dynamic routes:**

```typescript
// Generate all static pages at build time
export async function generateStaticParams() {
  const articles = await prisma.article.findMany({
    select: { title: true, createdAt: true, slug: true },
  });

  return articles.flatMap((article) => {
    if (!article.createdAt || !article.slug) return [];
    const d = new Date(article.createdAt);
    const yyyy = d.getUTCFullYear().toString();
    const mm = String(d.getUTCMonth() + 1).padStart(2, '0');
    const dd = String(d.getUTCDate()).padStart(2, '0');
    return [{ yyyy, mm, dd, title: article.slug }];
  });
}

// Dynamic metadata generation
export async function generateMetadata({
  params,
}: {
  params: Promise<{ yyyy: string; mm: string; dd: string; title: string }>;
}): Promise<Metadata> {
  const p = await params;
  // Fetch article and generate metadata
  const article = await prisma.article.findUnique({ ... })
  return { title: article.title, description: article.description }
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ yyyy: string; mm: string; dd: string; title: string }>;
}) {
  const p = await params;
  // Fetch and render article (all at build time)
  const article = await prisma.article.findUnique({ ... })
  return <ArticleContent article={article} />
}
```

#### 3. SSG Rules Checklist

For EVERY blog frontend page:

- [ ] **Static pages**: Add `export const dynamic = 'force-static'`
- [ ] **Dynamic routes**: MUST use `generateStaticParams()` to pre-generate ALL possible paths
- [ ] **NO ISR (Incremental Static Regeneration)**: Full SSG required for blog content
- [ ] **NO `revalidate` export**: Blog pages should be fully static, rebuild on content changes
- [ ] **Server components**: Default (no 'use client'), fetch data directly
- [ ] **Await params**: Next.js 16 requires `const p = await params`
- [ ] **Next.js build output**: Check `next build` shows static pages being generated

### Anti-Patterns (NEVER DO)

❌ **Dynamic rendering for blog content**:

```typescript
// WRONG - This defeats SSG purpose
export const dynamic = 'force-dynamic';
```

❌ **Missing `generateStaticParams()` on dynamic routes**:

```typescript
// WRONG - This will cause dynamic rendering at request time
// Must pre-generate all paths at build time
export default async function ArticlePage({ params }) {
  // Directly fetching without generateStaticParams
}
```

❌ **Using `export const revalidate` for blog pages**:

```typescript
// WRONG - Blog content should be fully static
// Rebuild on content changes instead
export const revalidate = 3600;
```

## Before Submitting Work

1. Run `npm run lint` and fix all issues
2. Run `npm run test:run` to ensure all tests pass
3. Follow the code style guidelines above
4. Add type annotations for all new functions/components
5. Include JSDoc comments for complex utilities (optional but recommended)
