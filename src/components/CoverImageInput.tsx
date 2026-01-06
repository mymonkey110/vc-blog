'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, Link, X } from 'lucide-react';
import { validateFile } from '@/utils/fileValidation';
import { uploadCoverImage } from '@/utils/uploadService';
import { validateUrl } from '@/utils/urlValidation';

interface CoverImageInputProps {
  value: string;
  onChange: (url: string) => void;
  disabled?: boolean;
  className?: string;
}

interface UploadState {
  isUploading: boolean;
  progress: number;
  error: string | null;
  abortController?: AbortController;
  canRetry: boolean;
}

type InputMode = 'url' | 'upload';

export default function CoverImageInput({
  value,
  onChange,
  disabled = false,
  className = '',
}: CoverImageInputProps) {
  const [mode, setMode] = useState<InputMode>('url');
  const [uploadState, setUploadState] = useState<UploadState>({
    isUploading: false,
    progress: 0,
    error: null,
    abortController: undefined,
    canRetry: false,
  });
  const [isDragOver, setIsDragOver] = useState(false);
  const [urlError, setUrlError] = useState<string | null>(null);
  const [lastUploadFile, setLastUploadFile] = useState<File | null>(null);
  const [urlInputValue, setUrlInputValue] = useState(value || '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync URL input value with prop value
  useEffect(() => {
    setUrlInputValue(value || '');
  }, [value]);

  // Handle mode switching without clearing the image
  const handleModeSwitch = useCallback((newMode: InputMode) => {
    if (newMode !== mode) {
      setMode(newMode);
      // Sync URL input with current value when switching to URL mode
      if (newMode === 'url') {
        setUrlInputValue(value || '');
      }
      // Don't clear the value when switching modes - keep the image
      setUploadState({
        isUploading: false,
        progress: 0,
        error: null,
        abortController: undefined,
        canRetry: false,
      });
    }
  }, [mode, value]);

  // Handle URL input change
  const handleUrlChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = e.target.value;
    setUrlInputValue(newUrl);
    
    // Validate URL format
    const validation = validateUrl(newUrl);
    if (!validation.isValid) {
      setUrlError(validation.error || 'URL格式无效');
    } else {
      setUrlError(null);
    }
  }, []);

  // Handle URL input blur (when user finishes editing)
  const handleUrlBlur = useCallback(() => {
    // Update the actual value when user finishes editing
    onChange(urlInputValue);
  }, [urlInputValue, onChange]);

  // Handle file selection
  const handleFileSelect = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, []);

  // Handle file input change
  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  }, []);

  // Handle file upload logic
  const handleFileUpload = useCallback(async (file: File) => {
    // Store file for potential retry
    setLastUploadFile(file);
    
    // Validate file
    const validation = validateFile(file);
    if (!validation.isValid) {
      setUploadState(prev => ({
        ...prev,
        error: validation.error || '文件验证失败',
        canRetry: false
      }));
      return;
    }

    // Create abort controller for cancellation
    const abortController = new AbortController();

    // Start upload
    setUploadState({
      isUploading: true,
      progress: 0,
      error: null,
      abortController,
      canRetry: false
    });

    try {
      const result = await uploadCoverImage({
        file,
        onProgress: (progress) => {
          setUploadState(prev => ({
            ...prev,
            progress
          }));
        },
        onError: (error) => {
          setUploadState(prev => ({
            ...prev,
            error: error.message
          }));
        }
      });

      // Upload successful
      onChange(result.url);
      setUploadState({
        isUploading: false,
        progress: 100,
        error: null,
        abortController: undefined,
        canRetry: false
      });

    } catch (error) {
      if (abortController.signal.aborted) {
        setUploadState({
          isUploading: false,
          progress: 0,
          error: null,
          abortController: undefined,
          canRetry: false
        });
      } else {
        const errorMessage = error instanceof Error ? error.message : '上传失败，请重试';
        const isNetworkError = errorMessage.includes('网络') || errorMessage.includes('连接') || 
                              errorMessage.includes('timeout') || errorMessage.includes('fetch');
        
        setUploadState({
          isUploading: false,
          progress: 0,
          error: errorMessage,
          abortController: undefined,
          canRetry: isNetworkError
        });
      }
    }
  }, [onChange]);

  // Handle retry upload
  const handleRetryUpload = useCallback(() => {
    if (lastUploadFile) {
      handleFileUpload(lastUploadFile);
    }
  }, [lastUploadFile, handleFileUpload]);

  // Handle upload cancellation
  const handleCancelUpload = useCallback(() => {
    if (uploadState.abortController) {
      uploadState.abortController.abort();
      setUploadState({
        isUploading: false,
        progress: 0,
        error: null,
        abortController: undefined,
        canRetry: false
      });
    }
  }, [uploadState.abortController]);

  // Drag and drop handlers
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled && mode === 'upload') {
      setIsDragOver(true);
    }
  }, [disabled, mode]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    if (disabled || mode !== 'upload') return;

    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(file => file.type.startsWith('image/'));
    
    if (imageFile) {
      handleFileUpload(imageFile);
    } else {
      setUploadState(prev => ({
        ...prev,
        error: '请拖拽图片文件'
      }));
    }
  }, [disabled, mode, handleFileUpload]);

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Mode Selection */}
      <div className="flex space-x-2">
        <Button
          type="button"
          variant={mode === 'url' ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleModeSwitch('url')}
          disabled={disabled}
          className="flex items-center gap-2"
        >
          <Link className="h-4 w-4" />
          URL链接
        </Button>
        <Button
          type="button"
          variant={mode === 'upload' ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleModeSwitch('upload')}
          disabled={disabled}
          className="flex items-center gap-2"
        >
          <Upload className="h-4 w-4" />
          上传文件
        </Button>
      </div>

      {/* URL Input Mode */}
      {mode === 'url' && (
        <div className="space-y-2">
          <Input
            type="url"
            placeholder="请输入封面图片URL (http:// 或 https://)"
            value={urlInputValue}
            onChange={handleUrlChange}
            onBlur={handleUrlBlur}
            disabled={disabled}
            maxLength={2048}
            className={urlError ? 'border-red-300' : ''}
          />
          <p className="text-xs text-stone-500">
            请输入有效的图片URL，支持 http:// 或 https:// 协议，最多2048个字符
          </p>
          {urlError && (
            <p className="text-xs text-red-600">{urlError}</p>
          )}
        </div>
      )}

      {/* File Upload Mode */}
      {mode === 'upload' && (
        <div className="space-y-2">
          <div 
            className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
              isDragOver 
                ? 'border-stone-400 bg-stone-50' 
                : 'border-stone-200'
            } ${
              uploadState.isUploading ? 'opacity-50 pointer-events-none' : ''
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <Upload className={`h-8 w-8 mx-auto mb-2 ${
              isDragOver ? 'text-stone-600' : 'text-stone-400'
            }`} />
            <p className="text-sm text-stone-600 mb-2">
              {isDragOver ? '释放文件开始上传' : '点击选择图片或拖拽图片到此处'}
            </p>
            <p className="text-xs text-stone-500 mb-4">
              支持 JPG、PNG、WebP、GIF 格式，最大 5MB
            </p>
            <Button
              type="button"
              variant="outline"
              onClick={handleFileSelect}
              disabled={disabled || uploadState.isUploading}
            >
              {uploadState.isUploading ? '上传中...' : '选择文件'}
            </Button>
          </div>
          
          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
            onChange={handleFileChange}
            className="hidden"
            disabled={disabled}
          />

          {/* Upload Progress */}
          {uploadState.isUploading && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>上传中...</span>
                <div className="flex items-center gap-2">
                  <span>{uploadState.progress}%</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleCancelUpload}
                    className="h-6 w-6 p-0"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <div className="w-full bg-stone-200 rounded-full h-2">
                <div
                  className="bg-stone-900 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadState.progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Upload Error */}
          {uploadState.error && (
            <div className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-md">
              <div className="flex-1">
                <p className="text-sm text-red-700">{uploadState.error}</p>
                {uploadState.canRetry && (
                  <p className="text-xs text-red-600 mt-1">
                    网络连接问题，您可以重试上传或切换到URL输入模式
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2 ml-2">
                {uploadState.canRetry && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleRetryUpload}
                    className="text-xs"
                  >
                    重试
                  </Button>
                )}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setUploadState(prev => ({ ...prev, error: null, canRetry: false }))}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Image Preview */}
      {value && (
        <div className="mt-4">
          <p className="text-xs text-stone-600 mb-2">预览：</p>
          <div className="w-48 h-32 border border-stone-200 rounded overflow-hidden">
            <img
              src={value}
              alt="封面预览"
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const parent = target.parentElement;
                if (parent) {
                  parent.innerHTML = '<div class="w-full h-full bg-red-50 flex items-center justify-center text-red-500 text-xs">图片加载失败</div>';
                }
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}