'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Upload, Link, X, Wand2, RefreshCw, Check, Settings, Loader2 } from 'lucide-react';
import { validateFile } from '@/utils/fileValidation';
import { uploadCoverImage } from '@/utils/uploadService';
import { validateUrl } from '@/utils/urlValidation';
import { GenerationState, ImageResult } from '@/types/ai';
import { buildPromptFromArticle, validateImagePrompt } from '@/lib/image-generator-service';

interface CoverImageInputProps {
  value: string;
  onChange: (url: string) => void;
  disabled?: boolean;
  className?: string;
  enableAIGeneration?: boolean;
  articleContent?: string;
  articleTitle?: string;
  onAIGenerationStart?: () => void;
  onAIGenerationComplete?: (result: ImageResult) => void;
  onAIGenerationError?: (error: string) => void;
}

interface UploadState {
  isUploading: boolean;
  progress: number;
  error: string | null;
  abortController?: AbortController;
  canRetry: boolean;
}

type InputMode = 'url' | 'upload' | 'ai';

export default function CoverImageInput({
  value,
  onChange,
  disabled = false,
  className = '',
  enableAIGeneration = false,
  articleContent = '',
  articleTitle = '',
  onAIGenerationStart,
  onAIGenerationComplete,
  onAIGenerationError,
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

  const [aiGenerationState, setAiGenerationState] = useState<GenerationState>({
    isGenerating: false,
    error: undefined,
    canRetry: false,
  });
  const [aiPrompt, setAiPrompt] = useState('');
  const [showAiPromptEditor, setShowAiPromptEditor] = useState(false);
  const [customAiPrompt, setCustomAiPrompt] = useState(
    '请在此处填入生成封面图的提示词，包括内容，风格，大小等',
  );
  const [aiPromptError, setAiPromptError] = useState<string | null>(null);
  const [generatedImageResult, setGeneratedImageResult] = useState<ImageResult | null>(null);
  const [isConvertingToWebp, setIsConvertingToWebp] = useState(false);
  const [isUploadingToBlob, setIsUploadingToBlob] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const [isZoomed, setIsZoomed] = useState(false);

  useEffect(() => {
    setUrlInputValue(value || '');
  }, [value]);

  const handleModeSwitch = useCallback(
    (newMode: InputMode) => {
      if (newMode !== mode) {
        setMode(newMode);
        if (newMode === 'url') {
          setUrlInputValue(value || '');
        }
        setUploadState({
          isUploading: false,
          progress: 0,
          error: null,
          abortController: undefined,
          canRetry: false,
        });
      }
    },
    [mode, value],
  );

  const handleUrlChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = e.target.value;
    setUrlInputValue(newUrl);

    const validation = validateUrl(newUrl);
    if (!validation.isValid) {
      setUrlError(validation.error || 'URL格式无效');
    } else {
      setUrlError(null);
    }
  }, []);

  const handleUrlBlur = useCallback(() => {
    onChange(urlInputValue);
  }, [urlInputValue, onChange]);

  const handleFileSelect = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, []);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  }, []);

  const handleFileUpload = useCallback(
    async (file: File) => {
      setLastUploadFile(file);

      const validation = validateFile(file);
      if (!validation.isValid) {
        setUploadState((prev) => ({
          ...prev,
          error: validation.error || '文件验证失败',
          canRetry: false,
        }));
        return;
      }

      const abortController = new AbortController();

      setUploadState({
        isUploading: true,
        progress: 0,
        error: null,
        abortController,
        canRetry: false,
      });

      try {
        const result = await uploadCoverImage({
          file,
          onProgress: (progress) => {
            setUploadState((prev) => ({
              ...prev,
              progress,
            }));
          },
          onError: (error) => {
            setUploadState((prev) => ({
              ...prev,
              error: error.message,
            }));
          },
        });

        onChange(result.url);
        setUploadState({
          isUploading: false,
          progress: 100,
          error: null,
          abortController: undefined,
          canRetry: false,
        });
      } catch (error) {
        if (abortController.signal.aborted) {
          setUploadState({
            isUploading: false,
            progress: 0,
            error: null,
            abortController: undefined,
            canRetry: false,
          });
        } else {
          const errorMessage = error instanceof Error ? error.message : '上传失败，请重试';
          const isNetworkError =
            errorMessage.includes('网络') ||
            errorMessage.includes('连接') ||
            errorMessage.includes('timeout') ||
            errorMessage.includes('fetch');

          setUploadState({
            isUploading: false,
            progress: 0,
            error: errorMessage,
            abortController: undefined,
            canRetry: isNetworkError,
          });
        }
      }
    },
    [onChange],
  );

  const handleRetryUpload = useCallback(() => {
    if (lastUploadFile) {
      handleFileUpload(lastUploadFile);
    }
  }, [lastUploadFile, handleFileUpload]);

  const handleCancelUpload = useCallback(() => {
    if (uploadState.abortController) {
      uploadState.abortController.abort();
      setUploadState({
        isUploading: false,
        progress: 0,
        error: null,
        abortController: undefined,
        canRetry: false,
      });
    }
  }, [uploadState.abortController]);

  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (!disabled && mode === 'upload') {
        setIsDragOver(true);
      }
    },
    [disabled, mode],
  );

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragOver(false);

      if (disabled || mode !== 'upload') return;

      const files = Array.from(e.dataTransfer.files);
      const imageFile = files.find((file) => file.type.startsWith('image/'));

      if (imageFile) {
        handleFileUpload(imageFile);
      } else {
        setUploadState((prev) => ({
          ...prev,
          error: '请拖拽图片文件',
        }));
      }
    },
    [disabled, mode, handleFileUpload],
  );

  const convertJpegToWebp = useCallback(async (jpegBlob: Blob): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }

      img.onerror = () => {
        URL.revokeObjectURL(jpegUrl);
        reject(new Error('Failed to load image'));
      };

      const jpegUrl = URL.createObjectURL(jpegBlob);

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        canvas.toBlob(
          (webpBlob) => {
            URL.revokeObjectURL(jpegUrl);
            if (webpBlob) {
              resolve(webpBlob);
            } else {
              reject(new Error('Failed to convert to WebP'));
            }
          },
          'image/webp',
          0.85,
        );
      };

      img.src = jpegUrl;
    });
  }, []);

  const generateWebpFilename = useCallback((): string => {
    const now = new Date();
    const datetime = now.toISOString().slice(0, 19).replace(/[T:]/g, '-');
    return `ai-${datetime}.webp`;
  }, []);

  const handleAiGenerate = useCallback(async () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    const finalPrompt = buildPromptFromArticle(articleTitle, articleContent, customAiPrompt);

    setAiGenerationState({
      isGenerating: true,
      error: undefined,
      canRetry: false,
    });

    onAIGenerationStart?.();

    try {
      const response = await fetch('/admin/api/ai/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: finalPrompt,
          options: {},
        }),
        signal: abortController.signal,
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || '图片生成失败');
      }

      setGeneratedImageResult(data.data);
      setAiGenerationState({
        isGenerating: false,
        error: undefined,
        canRetry: false,
      });

      onAIGenerationComplete?.(data.data);
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return;
      }

      console.error('AI image generation failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'AI生成失败，请重试';

      setAiGenerationState({
        isGenerating: false,
        error: errorMessage,
        canRetry: true,
      });

      onAIGenerationError?.(errorMessage);
    } finally {
      abortControllerRef.current = null;
    }
  }, [
    articleTitle,
    articleContent,
    customAiPrompt,
    onAIGenerationStart,
    onAIGenerationComplete,
    onAIGenerationError,
  ]);

  const handleAiPromptChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newPrompt = e.target.value;
    setAiPrompt(newPrompt);
  }, []);

  const handleCustomAiPromptChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newPrompt = e.target.value;
    setCustomAiPrompt(newPrompt);

    if (!newPrompt.trim()) {
      setAiPromptError('提示词不能为空');
    } else if (newPrompt.length > 1000) {
      setAiPromptError('提示词不能超过1000个字符');
    } else {
      setAiPromptError(null);
    }
  }, []);

  const handleResetAiPrompt = useCallback(() => {
    const defaultPrompt = '请在此处填入生成封面图的提示词，包括内容，风格，大小等';
    setCustomAiPrompt(defaultPrompt);
    setAiPromptError(null);
  }, []);

  const handleAcceptAiImage = useCallback(async () => {
    if (!generatedImageResult) return;

    setIsConvertingToWebp(true);
    setIsUploadingToBlob(true);

    try {
      const response = await fetch(generatedImageResult.imageUrl);
      const jpegBlob = await response.blob();

      const webpBlob = await convertJpegToWebp(jpegBlob);
      const filename = generateWebpFilename();
      const webpFile = new File([webpBlob], filename, { type: 'image/webp' });

      const uploadResult = await uploadCoverImage({
        file: webpFile,
        onProgress: (progress) => {
          console.log(`Upload progress: ${progress}%`);
        },
        onError: (error) => {
          console.error('Upload error:', error);
        },
      });

      onChange(uploadResult.url);
      setGeneratedImageResult(null);
    } catch (error) {
      console.error('Failed to upload generated image:', error);
      const errorMessage = error instanceof Error ? error.message : '上传失败，请重试';
      setAiGenerationState((prev) => ({
        ...prev,
        error: errorMessage,
      }));
    } finally {
      setIsConvertingToWebp(false);
      setIsUploadingToBlob(false);
    }
  }, [generatedImageResult, onChange, convertJpegToWebp, generateWebpFilename]);

  const handleRejectAiImage = useCallback(() => {
    setGeneratedImageResult(null);
  }, []);

  return (
    <div className={`space-y-4 ${className}`}>
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
        {enableAIGeneration && (
          <Button
            type="button"
            variant={mode === 'ai' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleModeSwitch('ai')}
            disabled={disabled}
            className="flex items-center gap-2"
          >
            <Wand2 className="h-4 w-4" />
            AI生成
          </Button>
        )}
      </div>

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
          {urlError && <p className="text-xs text-red-600">{urlError}</p>}
        </div>
      )}

      {mode === 'upload' && (
        <div className="space-y-2">
          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
              isDragOver ? 'border-stone-400 bg-stone-50' : 'border-stone-200'
            } ${uploadState.isUploading ? 'opacity-50 pointer-events-none' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <Upload
              className={`h-8 w-8 mx-auto mb-2 ${isDragOver ? 'text-stone-600' : 'text-stone-400'}`}
            />
            <p className="text-sm text-stone-600 mb-2">
              {isDragOver ? '释放文件开始上传' : '点击选择图片或拖拽图片到此处'}
            </p>
            <p className="text-xs text-stone-500 mb-4">支持 JPG、PNG、WebP、GIF 格式，最大 5MB</p>
            <Button
              type="button"
              variant="outline"
              onClick={handleFileSelect}
              disabled={disabled || uploadState.isUploading}
            >
              {uploadState.isUploading ? '上传中...' : '选择文件'}
            </Button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
            onChange={handleFileChange}
            className="hidden"
            disabled={disabled}
          />

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
                  onClick={() =>
                    setUploadState((prev) => ({ ...prev, error: null, canRetry: false }))
                  }
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {mode === 'ai' && enableAIGeneration && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="ai-prompt">AI 提示词（可选）</Label>
            <Textarea
              id="ai-prompt"
              value={customAiPrompt}
              onChange={handleCustomAiPromptChange}
              placeholder="留空则使用默认提示词：请根据文章摘要生成一张封面图，风格：科技；色系：柔和，暖色，文章摘要："
              rows={3}
              className="text-sm resize-none"
              disabled={aiGenerationState.isGenerating || isUploadingToBlob}
            />
            <div className="flex justify-between">
              <p className="text-xs text-stone-500">{customAiPrompt.length}/1000 字符</p>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleResetAiPrompt}
                disabled={aiGenerationState.isGenerating || isUploadingToBlob}
                className="text-xs h-6"
              >
                重置默认
              </Button>
            </div>
          </div>

          <Button
            type="button"
            onClick={handleAiGenerate}
            disabled={aiGenerationState.isGenerating || isUploadingToBlob}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            {aiGenerationState.isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                生成中...
              </>
            ) : (
              <>
                <Wand2 className="h-4 w-4 mr-2" />
                生成封面图
              </>
            )}
          </Button>

          {generatedImageResult && (
            <div className="space-y-3">
              <div className="p-4 border rounded-lg bg-green-50">
                <p className="text-sm font-medium text-green-800 mb-3">
                  ✓ 图片已生成（{generatedImageResult.metadata.aspectRatio}）
                </p>

                <div className="w-48 h-32 rounded-lg overflow-hidden bg-white mb-3 mx-auto border border-stone-200">
                  <img
                    src={generatedImageResult.imageUrl}
                    alt="AI生成的封面预览"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleRejectAiImage}
                    disabled={isUploadingToBlob}
                    className="flex-1"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    重新生成
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    onClick={handleAcceptAiImage}
                    disabled={isUploadingToBlob}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    {isUploadingToBlob ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        上传中...
                      </>
                    ) : (
                      <>
                        <Check className="h-4 w-4 mr-2" />
                        确认使用
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {aiGenerationState.error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <div className="flex items-center justify-between">
                <p className="text-sm text-red-700">{aiGenerationState.error}</p>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleAiGenerate}
                  className="text-xs"
                >
                  <RefreshCw className="h-3 w-3 mr-1" />
                  重试
                </Button>
              </div>
            </div>
          )}

          {!aiGenerationState.isGenerating && !generatedImageResult && !aiGenerationState.error && (
            <p className="text-xs text-stone-500">
              💡 提示：Pollinations API 每次请求间隔至少 5 秒
            </p>
          )}
        </div>
      )}

      {value && (
        <div className="mt-4">
          <p className="text-xs text-stone-600 mb-2">预览：</p>
          <div
            className="w-48 h-32 border border-stone-200 rounded overflow-hidden cursor-zoom-in relative group"
            onClick={() => setIsZoomed(true)}
            title="点击放大预览"
          >
            <img
              src={value}
              alt="封面预览"
              className="w-full h-full object-cover transition-transform group-hover:scale-105"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const parent = target.parentElement;
                if (parent) {
                  parent.innerHTML =
                    '<div class="w-full h-full bg-red-50 flex items-center justify-center text-red-500 text-xs">图片加载失败</div>';
                }
              }}
            />
          </div>

          {/* Zoom Modal */}
          {isZoomed && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 animate-in fade-in duration-200"
              onClick={() => setIsZoomed(false)}
            >
              <div className="relative max-w-full max-h-full" onClick={(e) => e.stopPropagation()}>
                <img
                  src={value}
                  alt="封面大图预览"
                  className="max-w-full max-h-[90vh] object-contain rounded shadow-2xl"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute -top-12 right-0 text-white hover:bg-white/20 rounded-full"
                  onClick={() => setIsZoomed(false)}
                >
                  <X className="h-6 w-6" />
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
