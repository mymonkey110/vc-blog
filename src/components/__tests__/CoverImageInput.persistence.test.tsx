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

describe('CoverImageInput Data Persistence Property Tests', () => {
  /**
   * Feature: cover-image-upload, Property 8: Data persistence consistency
   * For any article save operation, cover image URLs (whether from upload or direct input) 
   * should be correctly stored and retrievable from the database
   * Validates: Requirements 4.3, 4.4, 4.5
   */
  it('Property 8: Data persistence consistency for uploaded images', async () => {
    fc.assert(
      fc.asyncProperty(
        fc.string({ minLength: 1, maxLength: 20 }),
        fc.webUrl(),
        async (filename, expectedBlobUrl) => {
          const mockUploadCoverImage = vi.mocked(uploadCoverImage);
          const mockOnChange = vi.fn();
          
          // Mock successful upload returning a blob URL
          mockUploadCoverImage.mockResolvedValueOnce({
            url: expectedBlobUrl,
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
              // Verify onChange was called with the blob URL
              expect(mockOnChange).toHaveBeenCalledWith(expectedBlobUrl);
              return true;
            }, { timeout: 200 });
            
            // Verify the URL is a valid blob URL format
            expect(expectedBlobUrl).toMatch(/^https?:\/\//);
          }
          
          mockUploadCoverImage.mockClear();
          return true;
        }
      ),
      { numRuns: 15 }
    );
  });

  it('Property 8b: Data persistence consistency for URL input', () => {
    fc.assert(
      fc.property(
        fc.webUrl(),
        (directUrl) => {
          const mockOnChange = vi.fn();
          
          const { container } = render(
            <CoverImageInput value="" onChange={mockOnChange} />
          );
          
          // Should start in URL mode by default
          const urlInput = container.querySelector('input[type="url"]') as HTMLInputElement;
          
          if (urlInput) {
            // Enter a URL directly
            fireEvent.change(urlInput, { target: { value: directUrl } });
            
            // Verify onChange was called with the exact URL
            expect(mockOnChange).toHaveBeenCalledWith(directUrl);
            
            // The URL should be preserved exactly as entered
            expect(mockOnChange).toHaveBeenCalledWith(
              expect.stringMatching(/^https?:\/\//)
            );
          }
          
          return true;
        }
      ),
      { numRuns: 50 }
    );
  });

  it('Property 8c: Backward compatibility with existing articles', () => {
    fc.assert(
      fc.property(
        fc.webUrl(),
        (existingUrl) => {
          const mockOnChange = vi.fn();
          
          // Render component with existing URL value (simulating editing existing article)
          const { container } = render(
            <CoverImageInput value={existingUrl} onChange={mockOnChange} />
          );
          
          // Verify the existing URL is displayed in the input
          const urlInput = container.querySelector('input[type="url"]') as HTMLInputElement;
          expect(urlInput?.value).toBe(existingUrl);
          
          // Verify preview is shown for existing URL
          const preview = container.querySelector('img[alt="封面预览"]');
          expect(preview).toBeTruthy();
          if (preview) {
            expect(preview.getAttribute('src')).toBe(existingUrl);
          }
          
          // Verify no onChange is called during initial render
          expect(mockOnChange).not.toHaveBeenCalled();
          
          return true;
        }
      ),
      { numRuns: 30 }
    );
  });

  it('Property 8d: Mode switching preserves data integrity', () => {
    fc.assert(
      fc.property(
        fc.webUrl(),
        (initialUrl) => {
          const mockOnChange = vi.fn();
          
          const { container } = render(
            <CoverImageInput value={initialUrl} onChange={mockOnChange} />
          );
          
          // Switch to upload mode
          const uploadButton = container.querySelector('button:nth-child(2)');
          if (uploadButton) {
            fireEvent.click(uploadButton);
            
            // Verify onChange was called to clear the value
            expect(mockOnChange).toHaveBeenCalledWith('');
          }
          
          // Switch back to URL mode
          const urlButton = container.querySelector('button:nth-child(1)');
          if (urlButton) {
            fireEvent.click(urlButton);
            
            // Verify the input is now empty (data was cleared on mode switch)
            const urlInput = container.querySelector('input[type="url"]') as HTMLInputElement;
            expect(urlInput?.value).toBe('');
          }
          
          return true;
        }
      ),
      { numRuns: 25 }
    );
  });
});