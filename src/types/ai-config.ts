export interface AISettings {
  // Model configuration
  textModel: string;
  imageModel: string;
  
  // API configuration
  googleApiKey?: string;
  
  // Prompt templates
  descriptionPrompt: string;
  imagePrompt: string;
  
  // Feature toggles
  enableDescriptionGeneration: boolean;
  enableImageGeneration: boolean;
  
  // Performance settings
  requestTimeout: number;
  maxRetries: number;
}

export interface AISettingsUpdate {
  textModel?: string;
  imageModel?: string;
  googleApiKey?: string;
  descriptionPrompt?: string;
  imagePrompt?: string;
  enableDescriptionGeneration?: boolean;
  enableImageGeneration?: boolean;
  requestTimeout?: number;
  maxRetries?: number;
}

export const DEFAULT_AI_SETTINGS: AISettings = {
  textModel: 'gemini-1.5-flash',
  imageModel: 'gemini-2.5-flash-image',
  descriptionPrompt: '请帮我总结文章内容，提取关键信息形成摘要，内容不要超过50个字。',
  imagePrompt: '根据文章内容生成一个现代简洁的封面图片，风格专业，适合技术博客。',
  enableDescriptionGeneration: true,
  enableImageGeneration: true,
  requestTimeout: 30000,
  maxRetries: 3,
};

export interface AISettingsValidation {
  isValid: boolean;
  errors: Record<string, string>;
}