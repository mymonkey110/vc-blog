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

import { uploadCoverImage } from '@/utils/uploadService';

describe('CoverImageInput State Management Property Tests', () => {
  /**
   * Feature: cover-image-upload, Property 5: Upload state management
   * For any upload in progress, the UI should display progress indicators 
   * and disable upload controls to prevent duplicate uploads
   * Validates: Requirements 3.2, 3.3
   */
  it('Property 5: Upload state management', async () => {
    fc.assert(
      fc.asyncProperty(
        fc.string({ minLength: 1, maxLength: 20 }),
        fc.integer({ min: 0, max: 100 }),
        async (filename, progressValue) => {
          const mockUploadCoverImage = vi.mocked(uploadCoverImage);
          const mockOnChange = vi.fn();
          
          // Mock upload with progress callback
          let progressCallback: ((progress: number) => void) | undefined;
          mockUploadCoverImage.mockImplementation(async ({ onProgress }) => {
            progressCallback = onProgress;
            
            // Simulate upload progress
            if (progressCallback) {
              progressCallback(progressValue);
            }
            
            // Return after a short delay to simulate upload time
            await new Promise(resolve => setTimeout(resolve, 10));
            
            return {
              url: `https://test.com/${filename}`,
              filename: filename
            };
          });
          
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
            
            // Wait for upload to start
            await waitFor(() => {
              // Check for progress indicator
              const progressText = container.textContent;
              expect(progressText).toContain('上传中');
              
              // Check that upload button is disabled during upload
              const selectButton = getByText('上传中...');
              expect(selectButton).toBeDisabled();
              
              return true;
            }, { timeout: 100 });
          }
          
          mockUploadCoverImage.mockClear();
          return true;
        }
      ),
      { numRuns: 20 }
    );
  });

  it('Property 5b: Upload controls are re-enabled after completion', async () => {
    fc.assert(
      fc.asyncProperty(
        fc.string({ minLength: 1, maxLength: 20 }),
        async (filename) => {
          const mockUploadCoverImage = vi.mocked(uploadCoverImage);
          const mockOnChange = vi.fn();
          
          // Mock successful upload
          mockUploadCoverImage.mockResolvedValueOnce({
            url: `https://test.com/${filename}`,
            filename: filename
          });
          
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
            
            // Wait for upload to complete
            await waitFor(() => {
              // Check that upload button is re-enabled
              const selectButton = getByText('选择文件');
              expect(selectButton).not.toBeDisabled();
              
              return true;
            }, { timeout: 200 });
          }
          
          mockUploadCoverImage.mockClear();
          return true;
        }
      ),
      { numRuns: 15 }
    );
  });
});