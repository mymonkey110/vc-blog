/**
 * Validation utilities for article cover images
 */

/**
 * Validates if a string is a valid URL for cover images
 * @param url - The URL string to validate
 * @returns true if valid, false otherwise
 */
export function isValidCoverImageUrl(url: string): boolean {
  if (!url || typeof url !== 'string') {
    return false;
  }

  // Check length constraint (max 2048 characters as defined in schema)
  if (url.length > 2048) {
    return false;
  }

  try {
    const urlObj = new URL(url);
    
    // Only allow http and https protocols
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

/**
 * Validates and sanitizes cover image URL
 * @param url - The URL string to validate and sanitize
 * @returns sanitized URL or null if invalid
 */
export function validateAndSanitizeCoverImageUrl(url: string | null | undefined): string | null {
  if (!url) {
    return null;
  }

  const trimmedUrl = url.trim();
  
  if (!trimmedUrl) {
    return null;
  }

  if (!isValidCoverImageUrl(trimmedUrl)) {
    return null;
  }

  return trimmedUrl;
}