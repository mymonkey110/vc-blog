export interface UrlValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Validates if a string is a valid URL
 * @param url - URL string to validate
 * @returns ValidationResult indicating if URL is valid
 */
export function validateUrl(url: string): UrlValidationResult {
  if (!url.trim()) {
    return { isValid: true }; // Empty URL is valid (optional field)
  }

  try {
    const urlObj = new URL(url);
    
    // Check if protocol is http or https
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      return {
        isValid: false,
        error: '请输入有效的 HTTP 或 HTTPS URL'
      };
    }

    return { isValid: true };
  } catch {
    return {
      isValid: false,
      error: '请输入有效的URL格式'
    };
  }
}

/**
 * Validates if a URL points to an image
 * @param url - URL to validate
 * @returns Promise resolving to validation result
 */
export async function validateImageUrl(url: string): Promise<UrlValidationResult> {
  const urlValidation = validateUrl(url);
  if (!urlValidation.isValid) {
    return urlValidation;
  }

  if (!url.trim()) {
    return { isValid: true };
  }

  try {
    // Try to load the image to verify it's accessible
    return new Promise((resolve) => {
      const img = new Image();
      
      img.onload = () => {
        resolve({ isValid: true });
      };
      
      img.onerror = () => {
        resolve({
          isValid: false,
          error: '无法加载图片，请检查URL是否正确'
        });
      };
      
      // Set a timeout to avoid hanging
      setTimeout(() => {
        resolve({
          isValid: false,
          error: '图片加载超时，请检查URL'
        });
      }, 5000);
      
      img.src = url;
    });
  } catch {
    return {
      isValid: false,
      error: '图片URL验证失败'
    };
  }
}