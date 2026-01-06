import { render, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import fc from 'fast-check';
import CoverImageInput from '../CoverImageInput';

// Mock the upload utilities
vi.mock('@/utils/fileValidation', () => ({
  validateFile: vi.fn()
}));

vi.mock('@/utils/uploadService', () => ({
  uploadCoverImage: vi.fn()
}));

vi.mock('@/utils/urlValidation', () => ({
  validateUrl: vi.fn()
}));

import { validateFile } from '@/utils/fileValidation';
import { uploadCoverImage } from '@/utils/uploadService';
import { validateUrl } from '@/utils/urlValidation';

describe('CoverImageInput Error Handling Property Tests', () => {
  /**
   * Feature: cover-image-upload, Property 9: Comprehensive error handling
   * For any upload error (network, authentication, quota, etc.), the system should 
   * display descriptive error messages and maintain URL input as a fallback option
   * Validates: Requirements 2.5, 5.2, 5.3, 5.4, 5.5
   */
  it('Property 9: Comprehensive error handling', async () => {
    const errorTypes = [
      'Network error',
      'Authentication failed', 
      'Storage quota exceeded',
      'File too large',
      'Invalid file type'
    ];

    fc.assert(
      fc.asyncProperty(
        fc.constantFrom(...errorTypes),
        fc.string({ minLength: 1, maxLength: 20 }),
        async (errorType, filename) => {
          const mockValidateFile = vi.mocked(validateFile);
          const mockUploadCoverImage = vi.mocked(uploadCoverImage);
          const mockOnChange = vi.fn();

          // Setup different error scenarios
          if (errorType.includes('Invalid file type') || errorType.includes('File too large')) {
            mockValidateFile.mockReturnValueOnce({
              isValid: false,
              error: errorType
            });
          } else {
            mockValidateFile.mockReturnValueOnce({ isValid: true });
            mockUploadCoverImage.mockRejectedValueOnce(new Error(errorType));
          }

          const { container, getByText } = render(
            <CoverImageInput value="" onChange={mockOnChange} />
          );

          // Switch to upload mode
          const uploadButton = container.querySelector('button:nth-child(2)');
          if (uploadButton) {
            fireEvent.click(uploadButton);
          }

          // Create and select a file
          const mockFile = new File(['test'], `${filename}.jpg`, { type: 'image/jpeg' });
          const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;

          if (fileInput) {
            Object.defineProperty(fileInput, 'files', {
              value: [mockFile],
              writable: false,
            });

            fireEvent.change(fileInput);

            // Wait for error to appear
            await waitFor(() => {
              const errorText = container.textContent;
              expect(errorText).toContain(errorType);
              return true;
            }, { timeout: 200 });

            // Verify URL input is still available as fallback
            const urlModeButton = getByText('URL链接');
            expect(urlModeButton).not.toBeDisabled();
            
            // Switch to URL mode to verify fallback works
            fireEvent.click(urlModeButton);
            
            const urlInput = container.querySelector('input[type="url"]');
            expect(urlInput).toBeTruthy();
          }

          mockValidateFile.mockClear();
          mockUploadCoverImage.mockClear();
          return true;
        }
      ),
      { numRuns: 20 }
    );
  });

  it('Property 9b: Network errors show retry option', async () => {
    fc.assert(
      fc.asyncProperty(
        fc.constantFrom('网络连接失败', 'timeout', 'fetch failed'),
        fc.string({ minLength: 1, maxLength: 15 }),
        async (networkError, filename) => {
          const mockValidateFile = vi.mocked(validateFile);
          const mockUploadCoverImage = vi.mocked(uploadCoverImage);
          const mockOnChange = vi.fn();

          mockValidateFile.mockReturnValueOnce({ isValid: true });
          mockUploadCoverImage.mockRejectedValueOnce(new Error(networkError));

          const { container, getByText } = render(
            <CoverImageInput value="" onChange={mockOnChange} />
          );

          // Switch to upload mode
          const uploadButton = container.querySelector('button:nth-child(2)');
          if (uploadButton) {
            fireEvent.click(uploadButton);
          }

          // Create and select a file
          const mockFile = new File(['test'], `${filename}.jpg`, { type: 'image/jpeg' });
          const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;

          if (fileInput) {
            Object.defineProperty(fileInput, 'files', {
              value: [mockFile],
              writable: false,
            });

            fireEvent.change(fileInput);

            // Wait for error and retry button to appear
            await waitFor(() => {
              const retryButton = getByText('重试');
              expect(retryButton).toBeTruthy();
              return true;
            }, { timeout: 200 });
          }

          mockValidateFile.mockClear();
          mockUploadCoverImage.mockClear();
          return true;
        }
      ),
      { numRuns: 15 }
    );
  });

  it('Property 9c: URL validation errors are displayed', () => {
    fc.assert(
      fc.property(
        fc.oneof(
          fc.constant('invalid-url'),
          fc.constant('not-a-url'),
          fc.string({ minLength: 1, maxLength: 10 }).filter(s => !s.includes('http'))
        ),
        (invalidUrl) => {
          const mockValidateUrl = vi.mocked(validateUrl);
          const mockOnChange = vi.fn();

          mockValidateUrl.mockReturnValueOnce({
            isValid: false,
            error: 'URL格式无效'
          });

          const { container } = render(
            <CoverImageInput value="" onChange={mockOnChange} />
          );

          // Should start in URL mode
          const urlInput = container.querySelector('input[type="url"]') as HTMLInputElement;

          if (urlInput) {
            fireEvent.change(urlInput, { target: { value: invalidUrl } });

            // Should show validation error
            const errorText = container.textContent;
            expect(errorText).toContain('URL格式无效');
          }

          mockValidateUrl.mockClear();
          return true;
        }
      ),
      { numRuns: 30 }
    );
  });
});