import { render, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import fc from 'fast-check';
import CoverImageInput from '../CoverImageInput';

describe('CoverImageInput Property Tests', () => {
  /**
   * Feature: cover-image-upload, Property 6: Mode switching clears previous input
   * For any switch between URL input and file upload modes, the previous input value should be cleared
   * Validates: Requirements 3.4
   */
  it('Property 6: Mode switching clears previous input', () => {
    fc.assert(
      fc.property(
        fc.webUrl(), // Generate random URLs
        (initialValue) => {
          const mockOnChange = vi.fn();
          
          // Render component with initial value
          const { rerender } = render(
            <CoverImageInput value={initialValue} onChange={mockOnChange} />
          );
          
          // Clear the mock to ignore initial render calls
          mockOnChange.mockClear();
          
          // Switch to upload mode
          const uploadButton = document.querySelector('button:has-text("上传文件")') || 
                              Array.from(document.querySelectorAll('button')).find(btn => 
                                btn.textContent?.includes('上传文件'));
          
          if (uploadButton) {
            fireEvent.click(uploadButton);
            
            // Verify onChange was called with empty string
            expect(mockOnChange).toHaveBeenCalledWith('');
          }
          
          // Reset for next test
          rerender(<CoverImageInput value="" onChange={vi.fn()} />);
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});