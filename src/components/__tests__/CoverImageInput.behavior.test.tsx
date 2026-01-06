import { render, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import CoverImageInput from '../CoverImageInput';

// Mock the upload utilities
vi.mock('@/utils/fileValidation', () => ({
  validateFile: vi.fn(() => ({ isValid: true }))
}));

vi.mock('@/utils/uploadService', () => ({
  uploadCoverImage: vi.fn(() => Promise.resolve({ 
    url: 'https://blob.vercel-storage.com/cover/test+abc123.jpg', 
    filename: 'test.jpg' 
  }))
}));

vi.mock('@/utils/urlValidation', () => ({
  validateUrl: vi.fn(() => ({ isValid: true }))
}));

describe('CoverImageInput Behavior Tests', () => {
  it('should preserve uploaded image when switching to URL mode', async () => {
    const mockOnChange = vi.fn();
    
    const { container, getByText, rerender } = render(
      <CoverImageInput value="" onChange={mockOnChange} />
    );
    
    // Switch to upload mode
    const uploadButton = getByText('上传文件');
    fireEvent.click(uploadButton);
    
    // Simulate file upload
    const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
    
    if (fileInput) {
      Object.defineProperty(fileInput, 'files', {
        value: [mockFile],
        writable: false,
      });
      
      fireEvent.change(fileInput);
      
      // Wait for upload to complete
      await waitFor(() => {
        expect(mockOnChange).toHaveBeenCalledWith('https://blob.vercel-storage.com/cover/test+abc123.jpg');
      });
      
      // Simulate parent component updating the value prop (like in real usage)
      rerender(
        <CoverImageInput 
          value="https://blob.vercel-storage.com/cover/test+abc123.jpg" 
          onChange={mockOnChange} 
        />
      );
      
      // Clear mock to test mode switching
      mockOnChange.mockClear();
      
      // Switch back to URL mode
      const urlButton = getByText('URL链接');
      fireEvent.click(urlButton);
      
      // The image should NOT be cleared when switching modes
      expect(mockOnChange).not.toHaveBeenCalledWith('');
      
      // The URL input should show the current value
      const urlInput = container.querySelector('input[type="url"]') as HTMLInputElement;
      expect(urlInput?.value).toBe('https://blob.vercel-storage.com/cover/test+abc123.jpg');
    }
  });

  it('should update image when URL input loses focus', async () => {
    const mockOnChange = vi.fn();
    
    const { container } = render(
      <CoverImageInput value="https://example.com/old.jpg" onChange={mockOnChange} />
    );
    
    const urlInput = container.querySelector('input[type="url"]') as HTMLInputElement;
    
    if (urlInput) {
      // Change the URL
      fireEvent.change(urlInput, { target: { value: 'https://example.com/new.jpg' } });
      
      // onChange should not be called yet (only on blur)
      expect(mockOnChange).not.toHaveBeenCalledWith('https://example.com/new.jpg');
      
      // Blur the input
      fireEvent.blur(urlInput);
      
      // Now onChange should be called
      expect(mockOnChange).toHaveBeenCalledWith('https://example.com/new.jpg');
    }
  });

  it('should show existing URL in input when switching to URL mode', () => {
    const mockOnChange = vi.fn();
    
    const { container, getByText } = render(
      <CoverImageInput value="https://example.com/existing.jpg" onChange={mockOnChange} />
    );
    
    // Switch to upload mode
    const uploadButton = getByText('上传文件');
    fireEvent.click(uploadButton);
    
    // Switch back to URL mode
    const urlButton = getByText('URL链接');
    fireEvent.click(urlButton);
    
    // The URL input should show the existing value
    const urlInput = container.querySelector('input[type="url"]') as HTMLInputElement;
    expect(urlInput?.value).toBe('https://example.com/existing.jpg');
  });
});