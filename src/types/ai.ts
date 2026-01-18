/**
 * AI Service Types and Interfaces
 * Defines the core types for AI-enhanced article editing functionality
 */

export interface AIConfiguration {
  // Primary AI provider configuration
  apiKey: string;
  model: string;

  // Cloudflare AI Gateway configuration
  cloudflare?: {
    accountId: string;
    gatewayName: string;
    apiKey: string;
  };

  // Backup providers (optional)
  backupProviders?: {
    openai?: { apiKey: string };
    anthropic?: { apiKey: string };
    deepseek?: { apiKey: string };
  };

  // Gateway options
  options?: {
    cacheTtl?: number;
    maxRetries?: number;
    retryDelayMs?: number;
    metadata?: { [key: string]: any };
  };

  // Legacy fields for backward compatibility
  baseUrl?: string;
  headers?: { [key: string]: string };

  // Prompt configuration
  prompts: {
    defaultDescriptionPrompt: string;
    customPrompts: { [key: string]: string };
  };

  // Service limits
  limits: {
    maxDescriptionLength: number;
    maxPromptLength: number;
    requestTimeout: number;
  };
}

// Legacy interface for backward compatibility
export interface LegacyAIConfiguration {
  textModel: {
    provider: 'google';
    modelId: string;
    apiKey: string;
  };
  imageModel: {
    provider: 'google';
    modelId: string;
    apiKey: string;
  };
  prompts: {
    defaultDescriptionPrompt: string;
    defaultImagePrompt: string;
  };
  limits: {
    maxDescriptionLength: number;
    maxPromptLength: number;
    requestTimeout: number;
  };
}

export interface ProviderInfo {
  baseUrl?: string;
  model: string;
  isConfigured: boolean;
}

export interface ModelInfo {
  id: string;
  name: string;
  type: 'text' | 'image';
  provider: string;
}

export interface GenerationState {
  isGenerating: boolean;
  progress?: number;
  error?: string;
  canRetry: boolean;
  abortController?: AbortController;
  currentModel?: string;
}

export interface DescriptionResult {
  description: string;
  wordCount: number;
  truncated: boolean;
  model: string;
}

export interface ValidationResult {
  isValid: boolean;
  error?: string;
  suggestions?: string[];
}

export interface ImageGenerationOptions {
  aspectRatio?: string;
  size?: string;
  seed?: number;
  width?: number;
  height?: number;
}

export interface ImageResult {
  imageUrl: string;
  base64Data?: string;
  metadata: {
    model: string;
    prompt: string;
    aspectRatio: string;
    generationTime: number;
  };
}

export interface AIServiceManager {
  generateDescription(content: string, prompt?: string): Promise<string>;
  validateConfiguration(): Promise<boolean>;
  getProviderInfo(): Promise<ProviderInfo>;
}

export interface AIConfigurationManager {
  loadConfiguration(): Promise<AIConfiguration>;
  saveConfiguration(config: AIConfiguration): Promise<void>;
  validateConfiguration(config: AIConfiguration): Promise<boolean>;
  getConfiguration(): AIConfiguration;
}

export interface DescriptionGeneratorService {
  generateDescription(content: string, customPrompt?: string): Promise<DescriptionResult>;
  validatePrompt(prompt: string): ValidationResult;
  getDefaultPrompt(): string;
  setDefaultPrompt(prompt: string): void;
}

export interface ImageGeneratorService {
  generateImage(prompt: string, options?: ImageGenerationOptions): Promise<ImageResult>;
  validateImagePrompt(prompt: string): ValidationResult;
  getDefaultImagePrompt(): string;
  setDefaultImagePrompt(prompt: string): void;
}

// Error types for AI operations
export class AIServiceError extends Error {
  constructor(
    message: string,
    public code: string,
    public retryable: boolean = false,
  ) {
    super(message);
    this.name = 'AIServiceError';
  }
}

export class AIValidationError extends Error {
  constructor(
    message: string,
    public field: string,
    public suggestions?: string[],
  ) {
    super(message);
    this.name = 'AIValidationError';
  }
}

// Default configuration values
export const DEFAULT_AI_CONFIG: AIConfiguration = {
  apiKey: '',
  model: 'gemini-1.5-flash',
  options: {
    cacheTtl: 3600,
    maxRetries: 3,
    retryDelayMs: 1000,
  },
  prompts: {
    defaultDescriptionPrompt: '请帮我总结文章内容，提取关键信息形成摘要，内容不要超过50个字。',
    customPrompts: {},
  },
  limits: {
    maxDescriptionLength: 50,
    maxPromptLength: 1000,
    requestTimeout: 30000,
  },
};
