/**
 * AI Service Manager
 * Central service that coordinates AI operations and manages API configurations
 */

import { generateText } from 'ai'
import { getTextModel, validateApiKeys, getAvailableTextModels, getAvailableImageModels } from './ai-config'
import { AIServiceManager, ModelInfo, ImageGenerationOptions, AIServiceError } from '@/types/ai'

export class AIServiceManagerImpl implements AIServiceManager {
  /**
   * Generate description from article content using Gemini
   */
  async generateDescription(content: string, prompt?: string): Promise<string> {
    if (!content || content.trim().length === 0) {
      throw new AIServiceError(
        'Article content is required for description generation',
        'EMPTY_CONTENT'
      )
    }

    try {
      const textModel = getTextModel()
      const defaultPrompt = '请帮我总结文章内容，提取关键信息形成摘要，内容不要超过50个字。'
      const systemPrompt = prompt || defaultPrompt

      const result = await generateText({
        model: textModel,
        system: systemPrompt,
        prompt: `请为以下文章内容生成摘要：\n\n${content}`,
        maxOutputTokens: 100, // Limit tokens to keep description concise
        temperature: 0.3, // Lower temperature for more consistent results
      })

      let description = result.text.trim()
      
      // Ensure description doesn't exceed 50 characters
      if (description.length > 50) {
        description = description.substring(0, 47) + '...'
      }

      return description
    } catch (error) {
      console.error('Description generation failed:', error)
      throw new AIServiceError(
        'Failed to generate description. Please check your API key and try again.',
        'GENERATION_FAILED',
        true // retryable
      )
    }
  }

  /**
   * Generate cover image using Gemini Nano Banana Flash
   */
  async generateImage(prompt: string, options?: ImageGenerationOptions): Promise<string> {
    // Since Google Gemini doesn't support image generation, throw an appropriate error
    throw new AIServiceError(
      'Image generation is not supported with Google Gemini API. Google Gemini models are text-only and do not support image generation.',
      'IMAGE_GENERATION_NOT_SUPPORTED',
      false
    )
  }

  /**
   * Validate API keys by making test requests
   */
  async validateApiKeys(): Promise<boolean> {
    try {
      const results = await validateApiKeys()
      return results.google
    } catch (error) {
      console.error('API key validation failed:', error)
      return false
    }
  }

  /**
   * Get available models for both text and image generation
   */
  async getAvailableModels(): Promise<ModelInfo[]> {
    const textModels = getAvailableTextModels()
    const imageModels = getAvailableImageModels()
    return [...textModels, ...imageModels]
  }

  /**
   * Check if AI services are properly configured and available
   */
  async isServiceAvailable(): Promise<boolean> {
    try {
      return await this.validateApiKeys()
    } catch (error) {
      return false
    }
  }

  /**
   * Get service status information
   */
  async getServiceStatus(): Promise<{
    available: boolean
    models: ModelInfo[]
    lastChecked: Date
  }> {
    const available = await this.isServiceAvailable()
    const models = available ? await this.getAvailableModels() : []
    
    return {
      available,
      models,
      lastChecked: new Date()
    }
  }
}

// Export singleton instance
export const aiServiceManager = new AIServiceManagerImpl()