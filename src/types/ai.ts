/**
 * AI Service Types and Interfaces
 * Defines the core types for AI-enhanced article editing functionality
 */

export interface AIConfiguration {
  textModel: {
    provider: 'google'
    modelId: string
    apiKey: string
  }
  imageModel: {
    provider: 'google'
    modelId: string
    apiKey: string
  }
  prompts: {
    defaultDescriptionPrompt: string
    defaultImagePrompt: string
  }
  limits: {
    maxDescriptionLength: number
    maxPromptLength: number
    requestTimeout: number
  }
}

export interface ModelInfo {
  id: string
  name: string
  type: 'text' | 'image'
  provider: string
}

export interface GenerationState {
  isGenerating: boolean
  progress?: number
  error?: string
  canRetry: boolean
  abortController?: AbortController
}

export interface DescriptionResult {
  description: string
  wordCount: number
  truncated: boolean
}

export interface ValidationResult {
  isValid: boolean
  error?: string
  suggestions?: string[]
}

export interface ImageGenerationOptions {
  aspectRatio?: string
  size?: string
  seed?: number
}

export interface ImageResult {
  imageUrl: string
  base64Data?: string
  metadata: {
    model: string
    prompt: string
    aspectRatio: string
    generationTime: number
  }
}

export interface AIServiceManager {
  generateDescription(content: string, prompt?: string): Promise<string>
  generateImage(prompt: string, options?: ImageGenerationOptions): Promise<string>
  validateApiKeys(): Promise<boolean>
  getAvailableModels(): Promise<ModelInfo[]>
}

export interface DescriptionGeneratorService {
  generateDescription(content: string, customPrompt?: string): Promise<DescriptionResult>
  validatePrompt(prompt: string): ValidationResult
  getDefaultPrompt(): string
  setDefaultPrompt(prompt: string): void
}

export interface ImageGeneratorService {
  generateImage(prompt: string, options?: ImageGenerationOptions): Promise<ImageResult>
  validateImagePrompt(prompt: string): ValidationResult
  getDefaultImagePrompt(): string
  setDefaultImagePrompt(prompt: string): void
}

// Error types for AI operations
export class AIServiceError extends Error {
  constructor(
    message: string,
    public code: string,
    public retryable: boolean = false
  ) {
    super(message)
    this.name = 'AIServiceError'
  }
}

export class AIValidationError extends Error {
  constructor(
    message: string,
    public field: string,
    public suggestions?: string[]
  ) {
    super(message)
    this.name = 'AIValidationError'
  }
}

// Default configuration values
export const DEFAULT_AI_CONFIG: Partial<AIConfiguration> = {
  prompts: {
    defaultDescriptionPrompt: '请帮我总结文章内容，提取关键信息形成摘要，内容不要超过50个字。',
    defaultImagePrompt: '为这篇文章生成一个专业、简洁的封面图片，风格现代，适合技术博客。'
  },
  limits: {
    maxDescriptionLength: 50,
    maxPromptLength: 1000,
    requestTimeout: 30000
  }
}