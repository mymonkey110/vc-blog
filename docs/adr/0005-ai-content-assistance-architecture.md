# ADR-0005: Cloudflare AI Gateway for Text Summaries and Server-Proxied Pollinations for Cover Images

- **Status**: Accepted
- **Scope**: `src/lib/ai-config.ts`, `src/lib/ai-service-manager.ts`, `src/lib/image-generator-service.ts`, `src/app/admin/api/ai/**`, `src/components/InlineAIDescriptionInput.tsx`, `src/components/CoverImageInput.tsx`

## Context

The admin editor assists the author by generating concise article summaries (for SEO/excerpts) and blog cover images. The system needs provider flexibility without exposing API keys in the browser, responsive UX during generation, and reliable image fetching without browser CORS/Turnstile issues.

## Decision

1. **Text summary generation (Cloudflare AI Gateway + AI SDK 6 SSE)**:
   - `src/lib/ai-config.ts` constructs a text model via `createAiGateway` + `createUnified` (`ai-gateway-provider`) using server env vars (`CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_GATEWAY_NAME`, `CLOUDFLARE_API_KEY`, `AI_API_KEY`, `AI_MODEL`).
   - `POST /admin/api/ai/generate-description` streams output via `streamText(...).toUIMessageStreamResponse()`, consumed incrementally by `InlineAIDescriptionInput` (`text-delta` SSE events).
   - Default prompt requests a Chinese summary of `<= 50` characters (`maxOutputTokens: 100`, `temperature: 0.7`, input truncated to first 2,000 chars).
2. **Cover image generation (Server-proxied Pollinations + client WebP conversion)**:
   - `POST /admin/api/ai/generate-image` (`runtime = 'nodejs'`, `maxDuration = 30`) fetches `https://image.pollinations.ai/prompt/<prompt>?model=flux` server-side (`generateImageFromPollinationsServer`) with up to 3 retries (2s delay, skipping retries on 400/403) and returns base64 data.
   - When the author confirms the preview in `CoverImageInput`, the browser converts the image to WebP (`0.85` quality via `<canvas>`) and uploads it to Vercel Blob as `cover/ai-<timestamp>+<random>.webp`.

## Consequences

- Active AI provider/model configuration is controlled strictly by server environment variables. The `/admin/settings/ai` page (`AISettingsPanel` + `ai-settings-manager.ts`) writes legacy Gemini settings to browser `localStorage` and does **not** affect the active Cloudflare AI Gateway backend.
- Earlier non-streaming helpers (`description-generator-service.ts`, `ai-configuration-manager.ts`, `ai-cache-manager.ts`, `ai-progress-tracker.ts`, `ai-debouncer.ts`, `ai-error-handler.ts`, `DescriptionGeneratorUI.tsx`) are superseded by the SSE route and should not be assumed to be wired into the active editor.
