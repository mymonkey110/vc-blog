import { upload } from '@vercel/blob/client';

export interface UploadOptions {
  file: File;
  onProgress?: (progress: number) => void;
  onError?: (error: Error) => void;
}

export interface UploadResult {
  url: string;
  filename: string;
}

/**
 * Generates a filename following the required naming pattern:
 * cover/{filename}+{16位base64随机值}.${ext}
 */
export function generateCoverImageFilename(originalFilename: string): string {
  const ext = originalFilename.split('.').pop() || 'png';
  let nameWithoutExt = originalFilename.replace(/\.[^/.]+$/, '').trim();
  
  // Handle edge cases: empty or whitespace-only names
  if (!nameWithoutExt) {
    nameWithoutExt = 'image';
  }
  
  // Generate 16-character alphanumeric random value
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let randomValue = '';
  const randomBytes = new Uint8Array(16);
  crypto.getRandomValues(randomBytes);
  
  for (let i = 0; i < 16; i++) {
    randomValue += chars[randomBytes[i] % chars.length];
  }
  
  return `cover/${nameWithoutExt}+${randomValue}.${ext}`;
}

/**
 * Uploads a cover image file to Vercel Blob storage
 * @param options - Upload configuration
 * @returns Promise resolving to upload result
 */
export async function uploadCoverImage(options: UploadOptions): Promise<UploadResult> {
  const { file, onProgress, onError } = options;
  
  try {
    // Generate filename with required pattern
    const filename = generateCoverImageFilename(file.name);
    
    // Report initial progress
    onProgress?.(0);
    
    // Upload to Vercel Blob using existing auth API
    const blob = await upload(filename, file, {
      access: 'public',
      handleUploadUrl: '/admin/api/upload/auth',
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total) {
          const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
          onProgress?.(progress);
        }
      }
    });
    
    // Report completion
    onProgress?.(100);
    
    return {
      url: blob.url,
      filename: filename
    };
    
  } catch (error) {
    const uploadError = error instanceof Error ? error : new Error('Upload failed');
    onError?.(uploadError);
    throw uploadError;
  }
}

/**
 * Cancels an ongoing upload (if supported by the upload library)
 * Note: Vercel Blob client doesn't directly support cancellation,
 * but this provides a consistent interface for future implementations
 */
export function cancelUpload(): void {
  // TODO: Implement upload cancellation if supported by Vercel Blob
  console.warn('Upload cancellation not yet implemented');
}

/**
 * Validates that a URL is a valid Vercel Blob URL
 * @param url - URL to validate
 * @returns boolean indicating if URL is valid
 */
export function isValidBlobUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    // Vercel Blob URLs typically follow pattern: https://*.public.blob.vercel-storage.com/*
    return urlObj.hostname.includes('blob.vercel-storage.com') || 
           urlObj.hostname.includes('vercel.app');
  } catch {
    return false;
  }
}

/**
 * Extracts filename from a Vercel Blob URL
 * @param url - Blob URL
 * @returns extracted filename or null if not extractable
 */
export function extractFilenameFromBlobUrl(url: string): string | null {
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    const filename = pathname.split('/').pop();
    return filename || null;
  } catch {
    return null;
  }
}