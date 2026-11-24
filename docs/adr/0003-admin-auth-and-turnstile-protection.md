# ADR-0003: Single-Admin JWT Auth (`proxy.ts`) and Cloudflare Turnstile Protection

- **Status**: Accepted
- **Scope**: `src/proxy.ts`, `src/actions/auth.ts`, `src/lib/turnstile.ts`, `src/components/Turnstile.tsx`, `src/app/admin/**`

## Context

`vc-blog` has a single author/administrator. A multi-user RBAC or OAuth stack would add unnecessary operational complexity, but `/admin` pages, write APIs, Server Actions, and cost-bearing AI endpoints must still be protected against unauthorized access and automated bot abuse.

## Decision

1. **Single-admin password + HS256 JWT**:
   - `login()` (`src/actions/auth.ts`) compares the submitted password against `VC_ADMIN_PASSWORD` and signs an `HS256` JWT (`jose`, `JWT_SECRET`, 1-day expiry) stored in the `admin_token` cookie (`HttpOnly`, `SameSite=Strict`, `Secure` in production).
2. **Next.js 16 `proxy.ts` boundary**:
   - `src/proxy.ts` matches `['/admin/:path*', '/admin']`, validates `admin_token` via `verifySession()`, redirects unauthenticated page requests to `/admin/login`, redirects authenticated `/admin/login` visits to `/admin`, and returns `403` JSON for unauthenticated `/admin/api/*` requests.
3. **Defense-in-depth**:
   - Every Server Action in `src/app/admin/(dashboard)/articles/actions.ts` (`requireAuth()`) and every `/admin/api/**` route handler independently reads and verifies `admin_token` from `cookies()`.
4. **Cloudflare Turnstile bot verification**:
   - Server-side validation (`validateTurnstile` against `challenges.cloudflare.com/turnstile/v0/siteverify` using `TURNSTILE_SECRET_KEY`) is enforced on `login()` and on both AI generation endpoints (`/admin/api/ai/generate-description`, `/admin/api/ai/generate-image`).

## Consequences

- Auth-bypass routes or test backdoors MUST NOT be added for automated or manual testing of `/admin`.
- Because AI generation APIs enforce `cfTurnstileResponse` server-side, any client component calling `/admin/api/ai/generate-description` or `/admin/api/ai/generate-image` must collect and forward a Turnstile token (note: `InlineAIDescriptionInput` and `CoverImageInput` currently omit `cfTurnstileResponse` in their `fetch` payloads — a known gap to address when touching AI flows).
- Note that `src/proxy.ts` still contains a legacy check for `/api/articles`, though its `matcher` only covers `/admin` and `/admin/:path*`; all active admin APIs live under `/admin/api/*`.
