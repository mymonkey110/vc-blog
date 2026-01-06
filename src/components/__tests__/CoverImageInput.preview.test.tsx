import { render, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import fc from 'fast-check';
import CoverImageInput from '../CoverImageInput';

// Mock the upload utilities
vi.mock('@/utils/fileValidation', () => ({
  validateFile: vi.fn(() => ({ isValid: true }))
}));

vi.mock('@/utils/uploadService', () => ({
  uploadCoverImage: vi.fn()
}));

vi.mock('@/utils/urlValidation', () => ({
  validateUrl: vi.fn(() => ({ isValid: true }))
}));

import { uploadCoverImage } from '@/utils/uploadService';

describe('CoverImageInput Preview Property Tests', () => {
  /**
   * Feature: cover-image-upload, Property 4: Upload completion provides valid URL
   * For any successful image upload, the system should return a valid public URL 
   * and display an image preview
   * Validates: Requirements 1.5, 2.4
   */
  it('Property 4: Upload completion provides valid URL', async () => {
    fc.assert(
      fc.asyncProperty(
        fc.string({ minLength: 1, maxLength: 20 }),
        fc.webUrl(),
        async (filename, expectedUrl) => {
          const mockUploadCoverImage = vi.mocked(uploadCoverImage);
          const mockOnChange = vi.fn();
          
          // Mock successful upload
          mockUploadCoverImage.mockResolvedValueOnce({
            url: expectedUrl,
            filename: filename
          });
          
          const { container } = render(
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
            
            // Wait for upload to complete
            await waitFor(() => {
              // Verify onChange was called with the expected URL
              expect(mockOnChange).toHaveBeenCalledWith(expectedUrl);
              
              return true;
            }, { timeout: 200 });
            
            // Verify preview is displayed
            const preview = container.querySelector('img[alt="封面预览"]');
            expect(preview).toBeTruthy();
            if (preview) {
              expect(preview.getAttribute('src')).toBe(expectedUrl);
            }
          }
          
          mockUploadCoverImage.mockClear();
          return true;
        }
      ),
      { numRuns: 15 }
    );
  });

  /**
   * Feature: cover-image-upload, Property 7: URL validation and preview
   * For any valid image URL input, the system should validate the URL format 
   * and display an image preview
   * Validates: Requirements 4.1, 4.2
   */
  it('Property 7: URL validation and preview', () => {
    fc.assert(
      fc.property(
        fc.webUrl(),
        (validUrl) => {
          const mockOnChange = vi.fn();
          
          const { container } = render(
            <CoverImageInput value="" onChange={mockOnChange} />
          );
          
          // Should start in URL mode by default
          const urlInput = container.querySelector('input[type="url"]') as HTMLInputElement;
          expect(urlInput).toBeTruthy();
          
          if (urlInput) {
            // Enter a valid URL
            fireEvent.change(urlInput, { target: { value: validUrl } });
            
            // Verify onChange was called
            expect(mockOnChange).toHaveBeenCalledWith(validUrl);
            
            // Check that no error is displayed
            const errorText = container.textContent;
            expect(errorText).not.toContain('URL格式无效');
            expect(errorText).not.toContain('请输入有效的');
          }
          
          return true;
        }
      ),
      { numRuns: 50 }
    );
  });

  it('Property 7b: Invalid URLs show validation errors', () => {
    fc.assert(
      fc.property(
        fc.oneof(
          fc.constant('invalid-url'),
          fc.constant('ftp://example.com'),
          fc.constant('not-a-url-at-all'),
          fc.string({ minLength: 1, maxLength: 20 }).filter(s => !s.includes('http'))
        ),
        (invalidUrl) => {
          // Mock URL validation to return invalid for these cases
          const { validateUrl } = require('@/utils/urlValidation');
          vi.mocked(validateUrl).mockReturnValueOnce({
            isValid: false,
            error: 'URL格式无效'
          });
          
          const mockOnChange = vi.fn();
          
          const { container } = render(
            <CoverImageInput value="" onChange={mockOnChange} />
          );
          
          const urlInput = container.querySelector('input[type="url"]') as HTMLInputElement;
          
          if (urlInput) {
            // Enter an invalid URL
            fireEvent.change(urlInput, { target: { value: invalidUrl } });
            
            // Should still call onChange (to update form state)
            expect(mockOnChange).toHaveBeenCalledWith(invalidUrl);
            
            // Should show validation error
            const errorText = container.textContent;
            expect(errorText).toContain('URL格式无效');
          }
          
          return true;
        }
      ),
      { numRuns: 30 }
    );
  });
});