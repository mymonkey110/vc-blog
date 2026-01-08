/**
 * Image Generator Service
 * Manages AI-powered cover image generation (currently disabled)
 */

import { ImageGeneratorService, ImageResult, ImageGenerationOptions, ValidationResult, AIServiceError, AIValidationError } from '@/types/ai'

export class ImageGeneratorServiceImpl implements ImageGeneratorService {
  private defaultImagePrompt = '为这篇文章生成一个专业、简洁的封面图片，风格现代，适合技术博客。'
  private maxPromptLength = 1000

  /**
   * Generate cover image (currently not supported)
   */
  async generateImage(prompt: string, options?: ImageGenerationOptions): Promise<ImageResult> {
    // Image generation is not supported in the current configuration
    throw new AIServiceError(
      'Image generation is not supported in the current AI configuration. This feature focuses on text-based description generation only.',
      'IMAGE_GENERATION_NOT_SUPPORTED',
      false
    )
  }

  /**
   * Validate image generation prompt
   */
  validateImagePrompt(prompt: string): ValidationResult {
    if (!prompt || prompt.trim().length === 0) {
      return {
        isValid: false,
        error: 'Image prompt cannot be empty',
        suggestions: [
          'Describe the visual style you want',
          'Include relevant keywords about the article topic',
          'Specify colors, mood, or composition preferences'
        ]
      }
    }

    if (prompt.length > this.maxPromptLength) {
      return {
        isValid: false,
        error: `Prompt is too long (${prompt.length} characters). Maximum allowed is ${this.maxPromptLength} characters.`,
        suggestions: ['Shorten the prompt', 'Focus on key visual elements']
      }
    }

    // Check for potentially problematic content
    const problematicPatterns = [
      /nude|naked|sexual/i,
      /violence|violent|blood|gore/i,
      /hate|racist|discrimination/i,
      /illegal|drugs|weapon/i
    ]

    for (const pattern of problematicPatterns) {
      if (pattern.test(prompt)) {
        return {
          isValid: false,
          error: 'Prompt contains inappropriate content that may violate content policies',
          suggestions: [
            'Use professional, family-friendly descriptions',
            'Focus on abstract concepts or technical themes',
            'Describe visual style rather than specific content'
          ]
        }
      }
    }

    // Check for image-related keywords (helpful but not required)
    const imageKeywords = [
      '图片', '图像', '封面', '背景', '设计', '风格', '颜色', '构图',
      'image', 'picture', 'cover', 'background', 'design', 'style', 'color', 'composition'
    ]
    
    const hasImageKeyword = imageKeywords.some(keyword => 
      prompt.toLowerCase().includes(keyword.toLowerCase())
    )

    if (!hasImageKeyword) {
      return {
        isValid: true,
        error: undefined,
        suggestions: [
          'Consider adding visual style keywords like "modern", "minimalist", or "professional"',
          'Describe the mood or atmosphere you want to convey'
        ]
      }
    }

    return {
      isValid: true
    }
  }

  /**
   * Get default image prompt template
   */
  getDefaultImagePrompt(): string {
    return this.defaultImagePrompt
  }

  /**
   * Set default image prompt template
   */
  setDefaultImagePrompt(prompt: string): void {
    const validation = this.validateImagePrompt(prompt)
    if (!validation.isValid) {
      throw new AIValidationError(
        validation.error || 'Invalid image prompt',
        'prompt',
        validation.suggestions
      )
    }
    this.defaultImagePrompt = prompt
  }

  /**
   * Generate image with article context (currently not supported)
   */
  async generateImageWithContext(
    articleTitle: string, 
    articleContent: string, 
    customPrompt?: string,
    options?: ImageGenerationOptions
  ): Promise<ImageResult> {
    // Image generation is not supported in the current configuration
    throw new AIServiceError(
      'Image generation is not supported in the current AI configuration. This feature focuses on text-based description generation only.',
      'IMAGE_GENERATION_NOT_SUPPORTED',
      false
    )
  }

  /**
   * Extract relevant context from article for image generation
   */
  private extractArticleContext(title: string, content: string): string {
    // Extract key themes and topics
    const techKeywords = [
      'JavaScript', 'TypeScript', 'React', 'Vue', 'Angular', 'Node.js',
      'Python', 'Java', 'Go', 'Rust', 'Docker', 'Kubernetes',
      'AI', '人工智能', '机器学习', '深度学习', '算法', '数据结构',
      '前端', '后端', '全栈', '数据库', '云计算', '微服务'
    ]

    const foundKeywords = techKeywords.filter(keyword => 
      title.toLowerCase().includes(keyword.toLowerCase()) ||
      content.toLowerCase().includes(keyword.toLowerCase())
    )

    if (foundKeywords.length > 0) {
      return foundKeywords.slice(0, 3).join('、') + '技术'
    }

    // Fallback to generic tech theme
    return '现代科技、编程开发'
  }

  /**
   * Get supported aspect ratios
   */
  getSupportedAspectRatios(): string[] {
    return ['1:1', '3:4', '4:3', '9:16', '16:9']
  }

  /**
   * Get configuration limits
   */
  getLimits() {
    return {
      maxPromptLength: this.maxPromptLength,
      supportedAspectRatios: this.getSupportedAspectRatios()
    }
  }
}

// Export singleton instance
export const imageGeneratorService = new ImageGeneratorServiceImpl()