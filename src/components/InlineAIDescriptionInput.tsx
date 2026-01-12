'use client'

import React, { useState, useCallback, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { 
  Wand2, 
  RefreshCw, 
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
  error?: string
  canReset: boolean
  isAIGenerated: boolean
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
    error: undefined,
    canReset: Boolean(originalValue && originalValue !== value),
    isAIGenerated: false
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
      isAIGenerated: false
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

      // Handle AI SDK 6 data stream protocol with Server-Sent Events
      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let accumulatedText = ''

      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          
          if (done) break
          
          const chunk = decoder.decode(value, { stream: true })
          
          // Parse Server-Sent Events format
          const lines = chunk.split('\n')
          for (const line of lines) {
            // Skip empty lines
            if (!line.trim()) continue
            
            // Handle SSE data lines
            if (line.startsWith('data: ')) {
              const jsonStr = line.slice(6) // Remove 'data: ' prefix
              
              // Skip [DONE] termination signal
              if (jsonStr.trim() === '[DONE]') {
                continue
              }
              
              try {
                const data = JSON.parse(jsonStr)
                // Handle AI SDK 6 data stream protocol
                if (data.type === 'text-delta' && data.delta) {
                  // Text delta part - incremental text content
                  accumulatedText += data.delta
                  // Update the main value with full content (no 50 char limit during streaming)
                  onChange(accumulatedText)
                  setState(prev => ({
                    ...prev,
                    isAIGenerated: true
                  }))
                }
              } catch (e) {
                console.warn('Failed to parse SSE data:', jsonStr, e)
              }
            } else if (line.startsWith('event: ') || line.startsWith('id: ')) {
              // Skip SSE metadata lines
              continue
            } else if (line.trim() === '[DONE]') {
              // Handle direct [DONE] signal
              console.log('Stream completed')
              break
            }
          }
        }
      }

      setState(prev => ({
        ...prev,
        isGenerating: false
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
        isAIGenerated: false
      }))
    } finally {
      abortControllerRef.current = null
    }
  }, [articleContent, state.customPrompt])

  // Reset to original value
  const handleReset = useCallback(() => {
    if (originalValue !== undefined) {
      onChange(originalValue)
      setState(prev => ({
        ...prev,
        canReset: false,
        isAIGenerated: false,
        error: undefined
      }))
    }
  }, [originalValue, onChange])

  // Handle manual text change
  const handleTextChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value
    onChange(newValue)
    setState(prev => ({
      ...prev,
      isAIGenerated: false // Reset AI generated flag when manually editing
    }))
  }, [onChange])

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
      isAIGenerated: false
    }))
  }, [])

  const hasContent = articleContent && articleContent.trim().length > 0
  const canGenerate = hasContent && !state.isGenerating && !disabled
  const currentLength = value.length

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Label and Action Buttons */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Label htmlFor={id} className="text-sm font-medium">
            {label}
          </Label>
          {/* Character Count */}
          <span className="text-xs text-stone-500">
            {currentLength}字
          </span>
        </div>
        <div className="flex items-center gap-1">
          {/* Reset Button - always show if there's content */}
          {value && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                onChange('')
                setState(prev => ({
                  ...prev,
                  isAIGenerated: false,
                  error: undefined
                }))
              }}
              disabled={disabled || state.isGenerating}
              className="h-7 px-2 text-xs text-stone-500 hover:text-stone-700"
              title="清空内容"
            >
              <RotateCcw className="h-3 w-3" />
            </Button>
          )}

          {/* Reset to Original Button - only show if originalValue exists and differs */}
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
              原始
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
        <div className="p-3 bg-white rounded-md border space-y-2">
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
          value={value}
          onChange={handleTextChange}
          placeholder={placeholder}
          rows={rows}
          disabled={disabled || state.isGenerating}
          className={`resize-none transition-all duration-200 ${
            state.isGenerating ? 'bg-blue-50' : ''
          } ${
            state.isAIGenerated 
              ? 'border-green-400 shadow-sm shadow-green-100 bg-green-50/30' 
              : ''
          }`}
        />
        
        {/* Streaming Indicator */}
        {state.isGenerating && (
          <div className="absolute bottom-2 right-2 flex items-center gap-1 text-xs text-blue-600">
            <Loader2 className="h-3 w-3 animate-spin" />
            生成中...
            <span className="text-blue-500">
              {currentLength}字
            </span>
          </div>
        )}
      </div>

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