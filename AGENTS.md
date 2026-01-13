# AGENTS.md - Agent Guidelines for vc-blog

## Project Overview

Next.js 16 blog application with TypeScript, Prisma ORM, and PostgreSQL. Uses React 19, App Router, Tailwind CSS, Radix UI components, and Vitest for testing.

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
- **API Routes**: Use lowercase with hyphens for route paths

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
- Property-based tests use fast-check
- File naming: `*.test.ts` or `*.test.tsx`
- Use `beforeEach`/`afterEach` for setup/teardown
- Mock external dependencies in setup.ts

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

## Before Submitting Work

1. Run `npm run lint` and fix all issues
2. Run `npm run test:run` to ensure all tests pass
3. Follow the code style guidelines above
4. Add type annotations for all new functions/components
5. Include JSDoc comments for complex utilities (optional but recommended)
