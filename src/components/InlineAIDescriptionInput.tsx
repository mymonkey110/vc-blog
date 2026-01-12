'use client'

import React, { useState, useCallback, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { 
  Wand2, 
  RefreshCw, 
  Check, 
  X, 
  Settings, 
  Loader2, 
  RotateCcw,
  ChevronDown,
  ChevronUp
} from 'lucide-react'

interface InlineAIDescriptionInputProps {
  value: string
  onChange: (value: string) => void
  articleContent: string
  placeholder?: string
  disabled?: boolean
  originalValue?: string
  className?: string
  label?: string
  id?: string
  name?: string
  rows?: number
}

interface InlineAIState {
  isGenerating: boolean
  showPromptEditor: boolean
  customPrompt: string
  streamingText: string
  error?: string
  canReset: boolean
  showGeneratedOptions: boolean
}

export default function InlineAIDescriptionInput({
  value,
  onChange,
  articleContent,
  placeholder = "请输入文章描述",
  disabled = false,
  originalValue = '',
  className = '',
  label = "描述",
  id = "description",
  name = "description",
  rows = 3
}: InlineAIDescriptionInputProps) {
  const [state, setState] = useState<InlineAIState>({
    isGenerating: false,
    showPromptEditor: false,
    customPrompt: '请帮我总结文章内容，提取关键信息形成摘要，内容不要超过50个字。',
    streamingText: '',
    error: undefined,
    canReset: Boolean(originalValue && originalValue !== value),
    showGeneratedOptions: false
  })

  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  // Update reset capability when values change
  useEffect(() => {
    setState(prev => ({
      ...prev,
      canReset: Boolean(originalValue && originalValue !== value)
    }))
  }, [originalValue, value])

  // Generate description with Server-Sent Events
  const handleGenerate = useCallback(async () => {
    if (!articleContent || articleContent.trim().length === 0) {
      setState(prev => ({
        ...prev,
        error: '请先输入文章内容'
      }))
      return
    }

    // Cancel any existing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    const abortController = new AbortController()
    abortControllerRef.current = abortController

    setState(prev => ({
      ...prev,
      isGenerating: true,
      error: undefined,
      streamingText: '',
      showGeneratedOptions: false
    }))

    try {
      const response = await fetch('/admin/api/ai/generate-description', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: articleContent,
          customPrompt: state.customPrompt
        }),
        signal: abortController.signal
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || '生成描述失败')
      }

      // Handle AI SDK 6 native SSE streaming
      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let accumulatedText = ''

      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          
          if (done) break
          
          const chunk = decoder.decode(value, { stream: true })
          
          // Parse AI SDK 6 stream format
          const lines = chunk.split('\n')
          for (const line of lines) {
            if (line.startsWith('0:')) {
              try {
                // AI SDK 6 format: 0:"text chunk"
                const jsonStr = line.slice(2) // Remove '0:'
                const text = JSON.parse(jsonStr) // Parse the JSON string
                accumulatedText += text
                setState(prev => ({
                  ...prev,
                  streamingText: accumulatedText
                }))
              } catch (e) {
                console.warn('Failed to parse AI SDK chunk:', line, e)
              }
            } else if (line.startsWith('d:')) {
              try {
                // AI SDK 6 data format: d:{"type":"text-delta","textDelta":"chunk"}
                const jsonStr = line.slice(2) // Remove 'd:'
                const data = JSON.parse(jsonStr)
                if (data.type === 'text-delta' && data.textDelta) {
                  accumulatedText += data.textDelta
                  setState(prev => ({
                    ...prev,
                    streamingText: accumulatedText
                  }))
                }
              } catch (e) {
                console.warn('Failed to parse AI SDK data chunk:', line, e)
              }
            }
          }
        }
      }

      setState(prev => ({
        ...prev,
        isGenerating: false,
        showGeneratedOptions: true
      }))

    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return // Request was cancelled
      }

      console.error('Description generation failed:', error)
      const errorMessage = error instanceof Error ? error.message : '生成描述失败，请重试'
      
      setState(prev => ({
        ...prev,
        isGenerating: false,
        error: errorMessage,
        streamingText: ''
      }))
    } finally {
      abortControllerRef.current = null
    }
  }, [articleContent, state.customPrompt])

  // Accept generated description
  const handleAccept = useCallback(() => {
    if (state.streamingText.trim()) {
      // Limit to 50 characters as specified
      const trimmedText = state.streamingText.trim().substring(0, 50)
      onChange(trimmedText)
      setState(prev => ({
        ...prev,
        streamingText: '',
        showGeneratedOptions: false,
        canReset: Boolean(originalValue && originalValue !== trimmedText)
      }))
    }
  }, [state.streamingText, onChange, originalValue])

  // Reject generated description
  const handleReject = useCallback(() => {
    setState(prev => ({
      ...prev,
      streamingText: '',
      showGeneratedOptions: false
    }))
  }, [])

  // Reset to original value
  const handleReset = useCallback(() => {
    if (originalValue !== undefined) {
      onChange(originalValue)
      setState(prev => ({
        ...prev,
        canReset: false,
        streamingText: '',
        showGeneratedOptions: false,
        error: undefined
      }))
    }
  }, [originalValue, onChange])

  // Handle prompt change
  const handlePromptChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newPrompt = e.target.value
    setState(prev => ({
      ...prev,
      customPrompt: newPrompt
    }))
  }, [])

  // Reset to default prompt
  const handleResetPrompt = useCallback(() => {
    const defaultPrompt = '请帮我总结文章内容，提取关键信息形成摘要，内容不要超过50个字。'
    setState(prev => ({
      ...prev,
      customPrompt: defaultPrompt
    }))
  }, [])

  // Cancel generation
  const handleCancel = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    setState(prev => ({
      ...prev,
      isGenerating: false,
      streamingText: '',
      showGeneratedOptions: false
    }))
  }, [])

  const hasContent = articleContent && articleContent.trim().length > 0
  const canGenerate = hasContent && !state.isGenerating && !disabled
  const displayValue = state.isGenerating && state.streamingText 
    ? state.streamingText 
    : value

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Label and Action Buttons */}
      <div className="flex items-center justify-between">
        <Label htmlFor={id} className="text-sm font-medium">
          {label}
        </Label>
        <div className="flex items-center gap-1">
          {/* Reset Button */}
          {state.canReset && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleReset}
              disabled={disabled || state.isGenerating}
              className="h-7 px-2 text-xs text-stone-500 hover:text-stone-700"
              title="重置到原始值"
            >
              <RotateCcw className="h-3 w-3" />
            </Button>
          )}
          
          {/* Prompt Editor Toggle */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setState(prev => ({ ...prev, showPromptEditor: !prev.showPromptEditor }))}
            disabled={disabled || state.isGenerating}
            className="h-7 px-2 text-xs text-stone-500 hover:text-stone-700"
            title="自定义提示词"
          >
            <Settings className="h-3 w-3 mr-1" />
            {state.showPromptEditor ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          </Button>

          {/* AI Generate Button */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={state.isGenerating ? handleCancel : handleGenerate}
            disabled={!canGenerate && !state.isGenerating}
            className="h-7 px-2 text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 hover:text-blue-800"
            title={state.isGenerating ? "取消生成" : "智能生成"}
          >
            {state.isGenerating ? (
              <>
                <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                取消
              </>
            ) : (
              <>
                <Wand2 className="h-3 w-3 mr-1" />
                智能生成
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Prompt Editor */}
      {state.showPromptEditor && (
        <div className="p-3 bg-stone-50 rounded-md border space-y-2">
          <Label htmlFor="custom-prompt" className="text-xs font-medium">
            自定义提示词
          </Label>
          <Textarea
            id="custom-prompt"
            value={state.customPrompt}
            onChange={handlePromptChange}
            placeholder="输入自定义提示词..."
            rows={2}
            className="text-xs resize-none"
            disabled={disabled || state.isGenerating}
          />
          <div className="flex justify-end">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleResetPrompt}
              disabled={disabled || state.isGenerating}
              className="text-xs h-6"
            >
              重置默认
            </Button>
          </div>
        </div>
      )}

      {/* Main Textarea */}
      <div className="relative">
        <Textarea
          ref={textareaRef}
          id={id}
          name={name}
          value={displayValue}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          disabled={disabled || state.isGenerating}
          className={`resize-none ${state.isGenerating ? 'bg-blue-50' : ''} ${
            state.streamingText ? 'text-blue-700' : ''
          }`}
        />
        
        {/* Streaming Indicator */}
        {state.isGenerating && (
          <div className="absolute bottom-2 right-2 flex items-center gap-1 text-xs text-blue-600">
            <Loader2 className="h-3 w-3 animate-spin" />
            生成中...
            {state.streamingText && (
              <span className="text-blue-500">
                ({state.streamingText.length}/50)
              </span>
            )}
          </div>
        )}
      </div>

      {/* Generated Content Actions */}
      {state.showGeneratedOptions && state.streamingText && (
        <div className="flex items-center justify-between p-2 bg-green-50 border border-green-200 rounded-md">
          <div className="flex-1">
            <div className="text-xs text-green-700 mb-1">
              生成的描述 ({state.streamingText.length}/50字)
            </div>
            <div className="text-sm text-green-800 font-medium">
              {state.streamingText.substring(0, 50)}
              {state.streamingText.length > 50 && (
                <span className="text-amber-600 text-xs ml-1">(将截断)</span>
              )}
            </div>
          </div>
          <div className="flex gap-1 ml-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleReject}
              className="h-7 px-2 text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <X className="h-3 w-3" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleGenerate}
              className="h-7 px-2 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50"
            >
              <RefreshCw className="h-3 w-3" />
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleAccept}
              className="h-7 px-2 text-xs bg-green-600 hover:bg-green-700 text-white"
            >
              <Check className="h-3 w-3 mr-1" />
              采用
            </Button>
          </div>
        </div>
      )}

      {/* Error Display */}
      {state.error && (
        <div className="p-2 bg-red-50 border border-red-200 rounded-md">
          <div className="flex items-center justify-between">
            <p className="text-sm text-red-700">{state.error}</p>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleGenerate}
              disabled={!canGenerate}
              className="text-xs h-6 text-red-600 hover:text-red-700"
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              重试
            </Button>
          </div>
        </div>
      )}

      {/* Content Status */}
      {!hasContent && !state.error && (
        <p className="text-xs text-stone-500">
          请先输入文章内容以启用AI生成功能
        </p>
      )}
    </div>
  )
}