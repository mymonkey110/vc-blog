/**
 * Server-side Cloudflare Turnstile validation utility
 * Validates Turnstile tokens received from client-side widget
 *
 * @see https://developers.cloudflare.com/turnstile/get-started/server-side-validation/
 */

/**
 * Turnstile validation response interface
 */
interface TurnstileValidationResponse {
  success: boolean;
  challenge_ts?: string;
  hostname?: string;
  'error-codes'?: string[];
  action?: string;
  cdata?: string;
}

/**
 * Validates a Cloudflare Turnstile token on the server side
 *
 * @param token - The Turnstile token received from the client
 * @param secret - The Turnstile secret key (from Cloudflare dashboard)
 * @param remoteIp - Optional: The visitor's IP address
 * @returns Promise with validation result
 */
export async function validateTurnstile(
  token: string,
  secret: string,
  remoteIp?: string,
): Promise<{ success: boolean; error?: string }> {
  // Prepare form data for Cloudflare API
  const formData = new FormData();
  formData.append('secret', secret);
  formData.append('response', token);

  if (remoteIp) {
    formData.append('remoteip', remoteIp);
  }

  try {
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      console.error('Turnstile validation HTTP error:', response.status, response.statusText);
      return {
        success: false,
        error: 'Failed to validate with Turnstile service',
      };
    }

    const result: TurnstileValidationResponse = await response.json();

    if (!result.success) {
      const errorCodes = result['error-codes'] || [];
      console.error('Turnstile validation failed:', errorCodes);
      return {
        success: false,
        error: errorCodes.join(', ') || 'Token validation failed',
      };
    }

    return { success: true };
  } catch (error) {
    console.error('Turnstile validation error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

/**
 * Extracts the Turnstile token from a request
 *
 * For POST requests with FormData, the token is in 'cf-turnstile-response' field
 * For POST requests with JSON, the token should be in the request body
 */
export function getTurnstileToken(request: Request): string | null {
  // Try to get from form data
  const contentType = request.headers.get('content-type');

  if (
    contentType?.includes('multipart/form-data') ||
    contentType?.includes('application/x-www-form-urlencoded')
  ) {
    return null; // Token will be in form data, handled by the caller
  }

  // For JSON requests, the token should be extracted from the body
  return null;
}
