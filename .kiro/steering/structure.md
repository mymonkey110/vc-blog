# Project Structure

## Root Directory Organization

```
├── src/                    # Main application source code
├── prisma/                 # Database schema and migrations
├── public/                 # Static assets (images, icons, etc.)
├── scripts/                # Utility scripts for data migration
├── doc/                    # Project documentation
├── ui/                     # UI mockups and design references
└── .kiro/                  # Kiro AI assistant configuration
```

## Source Code Structure (`src/`)

## Source Code Structure (`src/`)

### App Router (`src/app/`)

- **Next.js 13+ App Router** structure with nested layouts
- **Route Groups**: `(dashboard)` for admin layout isolation
- **Dynamic Routes**: `[yyyy]/[mm]/[dd]/[title]` for article URLs
- **API Routes**: RESTful endpoints in `api/` directories

### Architecture Separation

#### Blog Frontend (SSG Required)

- `/` - Homepage with static article list
- `/article/[yyyy]/[mm]/[dd]/[title]` - Static article pages
- `/categories/*` - Static category pages
- `/page/[page]` - Static pagination
- **All must use `generateStaticParams()` and static generation**

#### Admin Console (No SSG Constraints)

- `/admin/*` - Dynamic admin interface
- `/admin/api/*` - Server-side API endpoints
- Can use server actions, real-time features, client components freely

### Key Directories

```
src/
├── app/                    # Next.js App Router pages and layouts
│   ├── admin/             # Admin dashboard (protected routes)
│   ├── article/           # Article detail pages with date-based routing
│   ├── categories/        # Category listing and detail pages
│   └── api/               # API endpoints
├── components/            # Reusable React components
│   └── ui/               # Base UI components (shadcn/ui style)
├── lib/                   # Utility libraries and configurations
├── utils/                 # Helper functions
├── types/                 # TypeScript type definitions
├── styles/                # Global CSS and component styles
└── generated/             # Auto-generated code (Prisma client)
```

## Naming Conventions

### Files & Directories

- **Pages**: `page.tsx` (App Router convention)
- **Layouts**: `layout.tsx` (App Router convention)
- **Components**: PascalCase (e.g., `NavigationBar.tsx`)
- **Utilities**: camelCase (e.g., `metadata.ts`)
- **Types**: camelCase with `.ts` extension

### URL Structure

- **Articles**: `/article/YYYY/MM/DD/title-slug`
- **Categories**: `/categories` and `/categories/[name]`
- **Admin**: `/admin/*` (protected routes)
- **API**: `/admin/api/*` for admin endpoints

## Database Schema Location

- **Schema**: `prisma/schema.prisma`
- **Generated Client**: `src/generated/prisma/`
- **Database Config**: `src/lib/db.ts`

## Static Assets

- **Images**: `public/images/` with organized subdirectories
- **Article Images**: `public/images/posts/[article-title]/`
- **Icons**: `public/favicon.png`, `public/site.webmanifest`

## Configuration Files

- **Next.js**: `next.config.js` (includes redirects for legacy URLs)
- **TypeScript**: `tsconfig.json` with path aliases (`@/*`)
- **Tailwind**: `tailwind.config.js` with custom design system
- **Prisma**: `prisma.config.ts` for database configuration
