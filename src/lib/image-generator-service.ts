/**
 * Image Generator Utilities
 * AI-powered cover image generation using Pollinations API (frontend direct calls)
 */

import { ImageResult, ImageGenerationOptions, ValidationResult } from '@/types/ai';

const POLLINATIONS_API_URL = 'https://image.pollinations.ai/prompt';
const DEFAULT_WIDTH = 200;
const DEFAULT_HEIGHT = 133;
const DEFAULT_MODEL = 'flux';

/**
 * Build Pollinations API URL
 */
function buildPollinationsUrl(
  prompt: string,
  width: number = DEFAULT_WIDTH,
  height: number = DEFAULT_HEIGHT,
  model: string = DEFAULT_MODEL,
): string {
  const encodedPrompt = encodeURIComponent(prompt);
  return `${POLLINATIONS_API_URL}/${encodedPrompt}?width=${width}&height=${height}&model=${model}`;
}

/**
 * Generate image from Pollinations API (frontend direct call)
 */
export async function generateImageFromPollinations(
  prompt: string,
  options?: ImageGenerationOptions & { signal?: AbortSignal },
): Promise<ImageResult> {
  const startTime = Date.now();
  const width = options?.aspectRatio === '1:1' ? 133 : DEFAULT_WIDTH;
  const height = options?.aspectRatio === '1:1' ? 133 : DEFAULT_HEIGHT;

  const apiUrl = buildPollinationsUrl(prompt, width, height);

  const response = await fetch(apiUrl, {
    signal: options?.signal,
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`Pollinations API error: ${response.status}`);
  }

  const blob = await response.blob();
  const base64Data = await blobToBase64(blob);

  return {
    imageUrl: base64Data,
    base64Data,
    metadata: {
      model: DEFAULT_MODEL,
      prompt,
      aspectRatio: `${width}:${height}`,
      generationTime: Date.now() - startTime,
    },
  };
}

/**
 * Generate image from Pollinations API (server-side call without browser headers)
 * This bypasses Turnstile validation by not sending Origin/Referer headers
 */
export async function generateImageFromPollinationsServer(
  prompt: string,
  options?: ImageGenerationOptions & { timeout?: number },
): Promise<ImageResult> {
  const startTime = Date.now();
  const width = options?.aspectRatio === '1:1' ? 133 : DEFAULT_WIDTH;
  const height = options?.aspectRatio === '1:1' ? 133 : DEFAULT_HEIGHT;
  const timeout = options?.timeout || 30000;

  const apiUrl = buildPollinationsUrl(prompt, width, height);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'vc-blog-server/1.0',
        Accept: 'image/jpeg',
      },
      signal: controller.signal,
      cache: 'no-store',
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      throw new Error(`Pollinations API error: ${response.status} - ${errorText}`);
    }

    const blob = await response.blob();
    const base64Data = await blobToBase64(blob);

    return {
      imageUrl: base64Data,
      base64Data,
      metadata: {
        model: DEFAULT_MODEL,
        prompt,
        aspectRatio: `${width}:${height}`,
        generationTime: Date.now() - startTime,
      },
    };
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error(`Request timeout after ${timeout}ms`);
      }
      throw error;
    }

    throw new Error('Unknown error during image generation');
  }
}

/**
 * Build prompt from article content
 */
export function buildPromptFromArticle(
  articleTitle: string,
  articleContent: string,
  customPrompt?: string,
): string {
  if (customPrompt && customPrompt.trim()) {
    return customPrompt.trim();
  }

  const description = extractDescription(articleContent);
  const defaultPrompt = `请根据文章摘要生成一张封面图，风格：科技；色系：柔和，暖色，文章摘要：${description}`;

  return defaultPrompt;
}

/**
 * Extract article description (first 500 characters)
 */
function extractDescription(content: string): string {
  const maxChars = 500;
  const plainText = content
    .replace(/[#*`~_\[\]]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  return plainText.slice(0, maxChars);
}

/**
 * Convert Blob to Base64 (browser and Node.js compatible)
 */
export async function blobToBase64(blob: Blob): Promise<string> {
  // Check if we're in a browser environment (has FileReader)
  if (typeof FileReader !== 'undefined') {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  // Node.js environment: use Buffer
  const arrayBuffer = await blob.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const base64 = buffer.toString('base64');

  // Determine MIME type from blob
  const mimeType = blob.type || 'image/jpeg';

  return `data:${mimeType};base64,${base64}`;
}

/**
 * Validate image generation prompt
 */
export function validateImagePrompt(prompt: string): ValidationResult {
  if (!prompt || prompt.trim().length === 0) {
    return {
      isValid: false,
      error: '提示词不能为空',
    };
  }

  if (prompt.length > 1000) {
    return {
      isValid: false,
      error: `提示词过长（${prompt.length}字符），最多1000字符`,
    };
  }

  return {
    isValid: true,
  };
}

/**
 * Get supported aspect ratios
 */
export function getSupportedAspectRatios(): string[] {
  return ['1:1', '3:4', '4:3', '9:16', '16:9', '200:133'];
}

/**
 * Get configuration limits
 */
export function getLimits() {
  return {
    maxPromptLength: 1000,
    supportedAspectRatios: getSupportedAspectRatios(),
    defaultDimensions: {
      width: DEFAULT_WIDTH,
      height: DEFAULT_HEIGHT,
    },
  };
}
