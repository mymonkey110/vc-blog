# Technology Stack

## Architecture Philosophy

**CRITICAL: SSG (Static Site Generation) is paramount for blog frontend performance and visitor experience. All frontend blog pages MUST be statically generated.**

### Frontend Constraints

- **Blog pages** (`/`, `/article/*`, `/categories/*`): MUST use SSG only
- **No client-side rendering** for public blog content
- **No dynamic server rendering** that impacts static generation
- All tech decisions for public pages must preserve SSG capability

### Admin Console Freedom

- **Admin pages** (`/admin/*`): Can use any modern tech (SSR, CSR, dynamic features)
- No SSG constraints for admin functionality
- Can adopt latest patterns without impacting blog performance

## Core Framework

- **Next.js 16** - React framework with App Router (SSG for blog, flexible for admin)
- **React 19** - UI library
- **TypeScript 5.5** - Type-safe JavaScript

## Database & ORM

- **PostgreSQL** - Primary database
- **Prisma 7** - Database ORM with custom output directory (`src/generated/prisma`)
- **@prisma/adapter-pg** - PostgreSQL adapter

## Styling & UI

- **Tailwind CSS 3.4** - Utility-first CSS framework
- **Radix UI** - Headless UI components
- **Lucide React** - Icon library
- **Custom design system** with Chinese font support

## Content Management

- **MDX** - Markdown with React components (`next-mdx-remote`)
- **Vditor** - Rich text editor for admin
- **Prism.js** - Syntax highlighting
- **React Markdown** - Markdown rendering

## Development Tools

- **ESLint** - Code linting
- **Prettier** - Code formatting
- **TypeScript** - Static type checking

## Deployment & Analytics

- **Vercel** - Hosting platform
- **Vercel Analytics** - Performance monitoring
- **Google Tag Manager** - Analytics tracking

## Common Commands

```bash
# Development
npm run dev          # Start development server

# Build & Deploy
npm run build        # Generate Prisma client and build Next.js
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint

# Database
npx prisma generate  # Generate Prisma client
npx prisma migrate   # Run database migrations
```

## Environment Variables

- `DATABASE_URL` - PostgreSQL connection string
- `NEXT_PUBLIC_DOMAIN` - Public domain for metadata
- `GTM_ID` - Google Tag Manager ID

## Code Style & Conventions

- **ESM Modules**: Project uses ES modules (`"type": "module"` in package.json)
- **Path Aliases**: `@/*` maps to `./src/*` for clean imports
- **Font System**: Custom Chinese/English font stacks optimized for readability
- **Component Architecture**: Follows shadcn/ui patterns with Radix UI primitives
- **TypeScript**: Strict mode enabled with modern ES2023 target

### Naming Conventions

- **Components**: PascalCase (e.g., `ArticleCard`, `NavigationBar`)
- **Entity Fields**: camelCase (e.g., `createdAt`, `categoryName`)
- **Database Schema**: snake_case mapping (e.g., `created_at`, `category_name`)
- **Files/Functions**: Follow ordinary conventions (camelCase for functions, kebab-case for files)
- **API URL PATH**: camelCase (e.g., `/admim/api/generateDescription`)

## SSG Requirements

### Blog Frontend (MUST be SSG)

- Use `generateStaticParams()` for dynamic routes
- Implement `getStaticProps` patterns where needed
- No `useEffect` for data fetching on blog pages
- No client-side API calls for content rendering
- All blog content must be pre-rendered at build time

### Admin Console (No SSG constraints)

- Can use dynamic imports, client components freely
- Server actions and API routes allowed
- Real-time features and interactive components permitted
- Modern React patterns without SSG limitations
