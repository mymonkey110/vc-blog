'use client'

import React, { useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Wand2, RefreshCw, Check, X, Settings, Loader2 } from 'lucide-react'
import { GenerationState, DescriptionResult } from '@/types/ai'

interface DescriptionGeneratorUIProps {
  articleContent: string
  currentDescription?: string
  onDescriptionGenerated: (description: string) => void
  disabled?: boolean
  className?: string
}

export default function DescriptionGeneratorUI({
  articleContent,
  currentDescription = '',
  onDescriptionGenerated,
  disabled = false,
  className = ''
}: DescriptionGeneratorUIProps) {
  const [generationState, setGenerationState] = useState<GenerationState>({
    isGenerating: false,
    error: undefined,
    canRetry: false
  })
  const [generatedResult, setGeneratedResult] = useState<DescriptionResult | null>(null)
  const [showPromptEditor, setShowPromptEditor] = useState(false)
  const [customPrompt, setCustomPrompt] = useState('请帮我总结文章内容，提取关键信息形成摘要，内容不要超过50个字。')
  const [promptError, setPromptError] = useState<string | null>(null)
  // Generate description
  const handleGenerate = useCallback(async () => {
    if (!articleContent || articleContent.trim().length === 0) {
      setGenerationState({
        isGenerating: false,
        error: '请先输入文章内容',
        canRetry: false
      })
      return
    }

    setGenerationState({
      isGenerating: true,
      error: undefined,
      canRetry: false
    })

    try {
      // Call API route instead of direct service call
      const response = await fetch('/admin/api/ai/generate-description', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: articleContent,
          customPrompt: customPrompt
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '生成描述失败');
      }

      const result = await response.json();
      
      setGeneratedResult(result.data)
      setGenerationState({
        isGenerating: false,
        error: undefined,
        canRetry: false
      })
    } catch (error) {
      console.error('Description generation failed:', error)
      const errorMessage = error instanceof Error ? error.message : '生成描述失败，请重试'
      const canRetry = error instanceof Error && (
        error.message.includes('网络') || 
        error.message.includes('连接') ||
        error.message.includes('fetch')
      );

      setGenerationState({
        isGenerating: false,
        error: errorMessage,
        canRetry
      })
    }
  }, [articleContent, customPrompt])

  // Accept generated description
  const handleAccept = useCallback(() => {
    if (generatedResult) {
      onDescriptionGenerated(generatedResult.description)
      setGeneratedResult(null)
    }
  }, [generatedResult, onDescriptionGenerated])

  // Reject generated description
  const handleReject = useCallback(() => {
    setGeneratedResult(null)
  }, [])

  // Handle prompt change
  const handlePromptChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newPrompt = e.target.value
    setCustomPrompt(newPrompt)
    
    // Simple client-side validation
    if (!newPrompt.trim()) {
      setPromptError('提示词不能为空');
    } else if (newPrompt.length > 1000) {
      setPromptError('提示词不能超过1000个字符');
    } else {
      setPromptError(null);
    }
  }, [])

  // Reset to default prompt
  const handleResetPrompt = useCallback(() => {
    const defaultPrompt = '请帮我总结文章内容，提取关键信息形成摘要，内容不要超过50个字。';
    setCustomPrompt(defaultPrompt)
    setPromptError(null)
  }, [])

  const hasContent = articleContent && articleContent.trim().length > 0
  const canGenerate = hasContent && !generationState.isGenerating && !disabled

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Main Generation Section */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">AI 智能生成描述</Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowPromptEditor(!showPromptEditor)}
                className="text-xs"
              >
                <Settings className="h-3 w-3 mr-1" />
                自定义提示词
              </Button>
            </div>

            {/* Prompt Editor */}
            {showPromptEditor && (
              <div className="space-y-2 p-3 bg-stone-50 rounded-md">
                <Label htmlFor="custom-prompt" className="text-xs">
                  自定义提示词
                </Label>
                <Textarea
                  id="custom-prompt"
                  value={customPrompt}
                  onChange={handlePromptChange}
                  placeholder="输入自定义提示词..."
                  rows={3}
                  className="text-xs"
                />
                {promptError && (
                  <p className="text-xs text-red-600">{promptError}</p>
                )}
                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleResetPrompt}
                    className="text-xs"
                  >
                    重置默认
                  </Button>
                </div>
              </div>
            )}

            {/* Generation Button */}
            <Button
              type="button"
              onClick={handleGenerate}
              disabled={!canGenerate}
              className="w-full"
              variant="outline"
            >
              {generationState.isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  生成中...
                </>
              ) : (
                <>
                  <Wand2 className="h-4 w-4 mr-2" />
                  生成描述
                </>
              )}
            </Button>

            {/* Content Status */}
            {!hasContent && (
              <p className="text-xs text-stone-500 text-center">
                请先输入文章内容以生成描述
              </p>
            )}

            {/* Error Display */}
            {generationState.error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-700">{generationState.error}</p>
                {generationState.canRetry && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleGenerate}
                    className="mt-2 text-xs"
                  >
                    <RefreshCw className="h-3 w-3 mr-1" />
                    重试
                  </Button>
                )}
              </div>
            )}

            {/* Generated Result */}
            {generatedResult && (
              <div className="space-y-3 p-3 bg-green-50 border border-green-200 rounded-md">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <Label className="text-xs text-green-700">生成的描述：</Label>
                    <p className="text-sm text-green-800 mt-1">
                      {generatedResult.description}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-green-600">
                      <span>字数：{generatedResult.wordCount}</span>
                      {generatedResult.truncated && (
                        <span className="text-amber-600">已截断至50字</span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleReject}
                    className="text-xs"
                  >
                    <X className="h-3 w-3 mr-1" />
                    拒绝
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleGenerate}
                    className="text-xs"
                  >
                    <RefreshCw className="h-3 w-3 mr-1" />
                    重新生成
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    onClick={handleAccept}
                    className="text-xs bg-green-600 hover:bg-green-700"
                  >
                    <Check className="h-3 w-3 mr-1" />
                    采用
                  </Button>
                </div>
              </div>
            )}

            {/* Current Description Display */}
            {currentDescription && !generatedResult && (
              <div className="p-3 bg-stone-50 rounded-md">
                <Label className="text-xs text-stone-600">当前描述：</Label>
                <p className="text-sm text-stone-800 mt-1">{currentDescription}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}