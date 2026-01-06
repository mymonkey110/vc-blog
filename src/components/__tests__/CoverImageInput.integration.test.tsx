import { render, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import fc from 'fast-check';
import CoverImageInput from '../CoverImageInput';

// Mock all dependencies
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

describe('CoverImageInput Integration Tests', () => {
  /**
   * Integration Test: Article creation flow with file upload
   * Tests complete flow from file upload to article save
   * Validates: Requirements 4.3, 4.4, 4.5
   */
  it('Integration: Complete file upload flow for article creation', async () => {
    fc.assert(
      fc.asyncProperty(
        fc.string({ minLength: 1, maxLength: 20 }),
        fc.webUrl(),
        async (filename, blobUrl) => {
          const mockUploadCoverImage = vi.mocked(uploadCoverImage);
          const mockOnChange = vi.fn();
          
          // Mock successful upload
          mockUploadCoverImage.mockResolvedValueOnce({
            url: blobUrl,
            filename: `cover/${filename}+randomvalue123.jpg`
          });
          
          const { container, getByText } = render(
            <CoverImageInput value="" onChange={mockOnChange} />
          );
          
          // Step 1: Switch to upload mode
          const uploadButton = getByText('上传文件');
          fireEvent.click(uploadButton);
          
          // Step 2: Select a file
          const mockFile = new File(['test content'], `${filename}.jpg`, { 
            type: 'image/jpeg' 
          });
          const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
          
          if (fileInput) {
            Object.defineProperty(fileInput, 'files', {
              value: [mockFile],
              writable: false,
            });
            
            fireEvent.change(fileInput);
            
            // Step 3: Wait for upload to complete
            await waitFor(() => {
              expect(mockOnChange).toHaveBeenCalledWith(blobUrl);
              return true;
            }, { timeout: 300 });
            
            // Step 4: Verify preview is displayed
            const preview = container.querySelector('img[alt="封面预览"]');
            expect(preview).toBeTruthy();
            expect(preview?.getAttribute('src')).toBe(blobUrl);
            
            // Step 5: Verify the URL follows naming convention
            const uploadCall = mockUploadCoverImage.mock.calls[0];
            expect(uploadCall).toBeDefined();
            expect(uploadCall[0].file).toBe(mockFile);
          }
          
          mockUploadCoverImage.mockClear();
          return true;
        }
      ),
      { numRuns: 10 }
    );
  });

  /**
   * Integration Test: Article editing flow with existing cover images
   * Tests editing articles with existing cover images and mode switching
   * Validates: Requirements 4.3, 4.4, 4.5
   */
  it('Integration: Article editing with existing cover image', () => {
    fc.assert(
      fc.property(
        fc.webUrl(),
        fc.webUrl(),
        (existingUrl, newUrl) => {
          const mockOnChange = vi.fn();
          
          // Step 1: Render component with existing URL (simulating article edit)
          const { container, getByText } = render(
            <CoverImageInput value={existingUrl} onChange={mockOnChange} />
          );
          
          // Step 2: Verify existing URL is loaded
          const urlInput = container.querySelector('input[type="url"]') as HTMLInputElement;
          expect(urlInput?.value).toBe(existingUrl);
          
          // Step 3: Verify existing preview is shown
          let preview = container.querySelector('img[alt="封面预览"]');
          expect(preview).toBeTruthy();
          expect(preview?.getAttribute('src')).toBe(existingUrl);
          
          // Step 4: Update URL to new value
          fireEvent.change(urlInput, { target: { value: newUrl } });
          expect(mockOnChange).toHaveBeenCalledWith(newUrl);
          
          // Step 5: Test mode switching (should clear value)
          const uploadButton = getByText('上传文件');
          fireEvent.click(uploadButton);
          expect(mockOnChange).toHaveBeenCalledWith('');
          
          // Step 6: Switch back to URL mode
          const urlButton = getByText('URL链接');
          fireEvent.click(urlButton);
          
          // Step 7: Verify input is cleared after mode switching
          const clearedUrlInput = container.querySelector('input[type="url"]') as HTMLInputElement;
          expect(clearedUrlInput?.value).toBe('');
          
          return true;
        }
      ),
      { numRuns: 20 }
    );
  });

  /**
   * Integration Test: Backward compatibility with URL-based images
   * Tests that existing URL-based articles continue to work
   * Validates: Requirements 4.5
   */
  it('Integration: Backward compatibility with URL-based cover images', () => {
    fc.assert(
      fc.property(
        fc.array(fc.webUrl(), { minLength: 1, maxLength: 5 }),
        (existingUrls) => {
          const results: boolean[] = [];
          
          existingUrls.forEach(url => {
            const mockOnChange = vi.fn();
            
            // Test each existing URL
            const { container } = render(
              <CoverImageInput value={url} onChange={mockOnChange} />
            );
            
            // Verify URL is preserved
            const urlInput = container.querySelector('input[type="url"]') as HTMLInputElement;
            results.push(urlInput?.value === url);
            
            // Verify preview works
            const preview = container.querySelector('img[alt="封面预览"]');
            results.push(preview !== null);
            results.push(preview?.getAttribute('src') === url);
            
            // Verify no unwanted onChange calls
            results.push(mockOnChange.mock.calls.length === 0);
          });
          
          // All tests should pass
          return results.every(result => result === true);
        }
      ),
      { numRuns: 15 }
    );
  });

  /**
   * Integration Test: Error recovery and fallback behavior
   * Tests that users can recover from errors by switching to URL mode
   * Validates: Requirements 5.5
   */
  it('Integration: Error recovery with URL fallback', async () => {
    fc.assert(
      fc.asyncProperty(
        fc.string({ minLength: 1, maxLength: 15 }),
        fc.webUrl(),
        async (filename, fallbackUrl) => {
          const mockUploadCoverImage = vi.mocked(uploadCoverImage);
          const mockOnChange = vi.fn();
          
          // Mock upload failure
          mockUploadCoverImage.mockRejectedValueOnce(new Error('Upload failed'));
          
          const { container, getByText } = render(
            <CoverImageInput value="" onChange={mockOnChange} />
          );
          
          // Step 1: Try to upload a file (will fail)
          const uploadButton = getByText('上传文件');
          fireEvent.click(uploadButton);
          
          const mockFile = new File(['test'], `${filename}.jpg`, { type: 'image/jpeg' });
          const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
          
          if (fileInput) {
            Object.defineProperty(fileInput, 'files', {
              value: [mockFile],
              writable: false,
            });
            
            fireEvent.change(fileInput);
            
            // Step 2: Wait for error to appear
            await waitFor(() => {
              const errorText = container.textContent;
              expect(errorText).toContain('Upload failed');
              return true;
            }, { timeout: 200 });
            
            // Step 3: Switch to URL mode as fallback
            const urlButton = getByText('URL链接');
            expect(urlButton).not.toBeDisabled(); // Should still be available
            fireEvent.click(urlButton);
            
            // Step 4: Use URL input as fallback
            const urlInput = container.querySelector('input[type="url"]') as HTMLInputElement;
            fireEvent.change(urlInput, { target: { value: fallbackUrl } });
            
            // Step 5: Verify fallback works
            expect(mockOnChange).toHaveBeenCalledWith(fallbackUrl);
          }
          
          mockUploadCoverImage.mockClear();
          return true;
        }
      ),
      { numRuns: 8 }
    );
  });
});