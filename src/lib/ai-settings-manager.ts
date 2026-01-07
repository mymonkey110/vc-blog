import { AISettings, AISettingsUpdate, AISettingsValidation, DEFAULT_AI_SETTINGS } from '@/types/ai-config';

/**
 * AI Settings Manager
 * Handles persistence and validation of AI configuration settings
 */
export class AISettingsManager {
  private static instance: AISettingsManager;
  private settings: AISettings;
  private readonly STORAGE_KEY = 'ai-settings';

  private constructor() {
    this.settings = this.loadSettings();
  }

  public static getInstance(): AISettingsManager {
    if (!AISettingsManager.instance) {
      AISettingsManager.instance = new AISettingsManager();
    }
    return AISettingsManager.instance;
  }

  /**
   * Load settings from localStorage or use defaults
   */
  private loadSettings(): AISettings {
    if (typeof window === 'undefined') {
      return { ...DEFAULT_AI_SETTINGS };
    }

    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return { ...DEFAULT_AI_SETTINGS, ...parsed };
      }
    } catch (error) {
      console.warn('Failed to load AI settings from localStorage:', error);
    }

    return { ...DEFAULT_AI_SETTINGS };
  }

  /**
   * Save settings to localStorage
   */
  private saveSettings(): void {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.settings));
    } catch (error) {
      console.error('Failed to save AI settings to localStorage:', error);
    }
  }

  /**
   * Get current settings
   */
  public getSettings(): AISettings {
    return { ...this.settings };
  }

  /**
   * Update settings with validation
   */
  public updateSettings(updates: AISettingsUpdate): AISettingsValidation {
    const validation = this.validateSettings({ ...this.settings, ...updates });
    
    if (validation.isValid) {
      this.settings = { ...this.settings, ...updates };
      this.saveSettings();
    }

    return validation;
  }

  /**
   * Reset settings to defaults
   */
  public resetToDefaults(): void {
    this.settings = { ...DEFAULT_AI_SETTINGS };
    this.saveSettings();
  }

  /**
   * Validate settings
   */
  public validateSettings(settings: Partial<AISettings>): AISettingsValidation {
    const errors: Record<string, string> = {};

    // Validate text model
    if (settings.textModel && !this.isValidTextModel(settings.textModel)) {
      errors.textModel = '无效的文本模型';
    }

    // Validate image model
    if (settings.imageModel && !this.isValidImageModel(settings.imageModel)) {
      errors.imageModel = '无效的图片模型';
    }

    // Validate prompts
    if (settings.descriptionPrompt !== undefined) {
      if (!settings.descriptionPrompt.trim()) {
        errors.descriptionPrompt = '描述提示词不能为空';
      } else if (settings.descriptionPrompt.length > 1000) {
        errors.descriptionPrompt = '描述提示词不能超过1000个字符';
      }
    }

    if (settings.imagePrompt !== undefined) {
      if (!settings.imagePrompt.trim()) {
        errors.imagePrompt = '图片提示词不能为空';
      } else if (settings.imagePrompt.length > 1000) {
        errors.imagePrompt = '图片提示词不能超过1000个字符';
      }
    }

    // Validate timeout
    if (settings.requestTimeout !== undefined) {
      if (settings.requestTimeout < 5000 || settings.requestTimeout > 120000) {
        errors.requestTimeout = '请求超时时间必须在5-120秒之间';
      }
    }

    // Validate retries
    if (settings.maxRetries !== undefined) {
      if (settings.maxRetries < 0 || settings.maxRetries > 10) {
        errors.maxRetries = '最大重试次数必须在0-10之间';
      }
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }

  /**
   * Check if text model is valid
   */
  private isValidTextModel(model: string): boolean {
    const validModels = [
      'gemini-1.5-flash',
      'gemini-1.5-pro',
      'gemini-2.0-flash-exp'
    ];
    return validModels.includes(model);
  }

  /**
   * Check if image model is valid
   */
  private isValidImageModel(model: string): boolean {
    const validModels = [
      'gemini-2.5-flash-image'
    ];
    return validModels.includes(model);
  }

  /**
   * Get available text models
   */
  public getAvailableTextModels(): Array<{ value: string; label: string; description: string }> {
    return [
      {
        value: 'gemini-1.5-flash',
        label: 'Gemini 1.5 Flash',
        description: '快速响应，适合日常使用'
      },
      {
        value: 'gemini-1.5-pro',
        label: 'Gemini 1.5 Pro',
        description: '更高质量，适合复杂任务'
      },
      {
        value: 'gemini-2.0-flash-exp',
        label: 'Gemini 2.0 Flash (实验版)',
        description: '最新模型，功能更强大'
      }
    ];
  }

  /**
   * Get available image models
   */
  public getAvailableImageModels(): Array<{ value: string; label: string; description: string }> {
    return [
      {
        value: 'gemini-2.5-flash-image',
        label: 'Gemini 2.5 Flash Image',
        description: '专业图片生成模型'
      }
    ];
  }

  /**
   * Export settings as JSON
   */
  public exportSettings(): string {
    return JSON.stringify(this.settings, null, 2);
  }

  /**
   * Import settings from JSON
   */
  public importSettings(jsonString: string): AISettingsValidation {
    try {
      const imported = JSON.parse(jsonString);
      return this.updateSettings(imported);
    } catch (error) {
      return {
        isValid: false,
        errors: { import: '无效的JSON格式' }
      };
    }
  }
}

// Export singleton instance
export const aiSettingsManager = AISettingsManager.getInstance();