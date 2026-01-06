import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import CoverImageInput from '../CoverImageInput';

describe('CoverImageInput', () => {
  const mockOnChange = vi.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it('renders both URL and upload mode buttons', () => {
    render(<CoverImageInput value="" onChange={mockOnChange} />);
    
    expect(screen.getByText('URL链接')).toBeInTheDocument();
    expect(screen.getByText('上传文件')).toBeInTheDocument();
  });

  it('starts in URL mode by default', () => {
    render(<CoverImageInput value="" onChange={mockOnChange} />);
    
    expect(screen.getByPlaceholderText(/请输入封面图片URL/)).toBeInTheDocument();
    expect(screen.queryByText('点击选择图片或拖拽图片到此处')).not.toBeInTheDocument();
  });

  it('switches to upload mode when upload button is clicked', () => {
    render(<CoverImageInput value="" onChange={mockOnChange} />);
    
    fireEvent.click(screen.getByText('上传文件'));
    
    expect(screen.getByText('点击选择图片或拖拽图片到此处')).toBeInTheDocument();
    expect(screen.queryByPlaceholderText(/请输入封面图片URL/)).not.toBeInTheDocument();
  });

  it('clears input when switching modes', () => {
    render(<CoverImageInput value="https://example.com/image.jpg" onChange={mockOnChange} />);
    
    fireEvent.click(screen.getByText('上传文件'));
    
    expect(mockOnChange).toHaveBeenCalledWith('');
  });

  it('calls onChange when URL input changes', () => {
    render(<CoverImageInput value="" onChange={mockOnChange} />);
    
    const urlInput = screen.getByPlaceholderText(/请输入封面图片URL/);
    fireEvent.change(urlInput, { target: { value: 'https://example.com/test.jpg' } });
    
    expect(mockOnChange).toHaveBeenCalledWith('https://example.com/test.jpg');
  });

  it('shows image preview when value is provided', () => {
    render(<CoverImageInput value="https://example.com/image.jpg" onChange={mockOnChange} />);
    
    expect(screen.getByText('预览：')).toBeInTheDocument();
    expect(screen.getByAltText('封面预览')).toBeInTheDocument();
  });

  it('disables inputs when disabled prop is true', () => {
    render(<CoverImageInput value="" onChange={mockOnChange} disabled={true} />);
    
    expect(screen.getByText('URL链接')).toBeDisabled();
    expect(screen.getByText('上传文件')).toBeDisabled();
  });
});