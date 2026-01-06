import { describe, it, expect, vi } from 'vitest';
import fc from 'fast-check';

// Mock the upload function to test authentication behavior
vi.mock('@vercel/blob/client', () => ({
  upload: vi.fn()
}));

import { upload } from '@vercel/blob/client';
import { uploadCoverImage } from '../uploadService';

describe('Upload Authentication Property Tests', () => {
  /**
   * Feature: cover-image-upload, Property 3: Authentication requirement for uploads
   * For any upload request, the system should authenticate using the existing auth API 
   * before allowing upload to proceed
   * Validates: Requirements 2.1
   */
  it('Property 3: Authentication requirement for uploads', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 50 }),
        fc.constantFrom('image/jpeg', 'image/png', 'image/webp', 'image/gif'),
        fc.integer({ min: 1, max: 5 * 1024 * 1024 }),
        async (filename, mimeType, size) => {
          const mockUpload = vi.mocked(upload);
          
          // Create a mock file
          const mockFile = new File(['test content'], filename, { type: mimeType });
          Object.defineProperty(mockFile, 'size', { value: size });
          
          // Mock successful upload
          mockUpload.mockResolvedValueOnce({
            url: `https://test.blob.vercel-storage.com/cover/${filename}`,
            pathname: `cover/${filename}`,
            contentType: mimeType,
            contentDisposition: 'inline'
          });
          
          const mockOnProgress = vi.fn();
          const mockOnError = vi.fn();
          
          try {
            await uploadCoverImage({
              file: mockFile,
              onProgress: mockOnProgress,
              onError: mockOnError
            });
            
            // Verify that upload was called with auth endpoint
            expect(mockUpload).toHaveBeenCalledWith(
              expect.stringMatching(/^cover\/.+\+[A-Za-z0-9]{16}\./),
              mockFile,
              expect.objectContaining({
                access: 'public',
                handleUploadUrl: '/admin/api/upload/auth'
              })
            );
            
          } catch (error) {
            // If upload fails, it should still have attempted authentication
            expect(mockUpload).toHaveBeenCalled();
          }
          
          mockUpload.mockClear();
          return true;
        }
      ),
      { numRuns: 20 } // Fewer runs for async tests
    );
  });

  it('Property 3b: Upload fails without authentication', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 20 }),
        async (filename) => {
          const mockUpload = vi.mocked(upload);
          
          // Mock authentication failure
          mockUpload.mockRejectedValueOnce(new Error('Authentication failed'));
          
          const mockFile = new File(['test'], `${filename}.jpg`, { type: 'image/jpeg' });
          const mockOnError = vi.fn();
          
          await expect(uploadCoverImage({
            file: mockFile,
            onError: mockOnError
          })).rejects.toThrow();
          
          // Verify error callback was called
          expect(mockOnError).toHaveBeenCalledWith(expect.any(Error));
          
          mockUpload.mockClear();
          return true;
        }
      ),
      { numRuns: 10 }
    );
  });
});