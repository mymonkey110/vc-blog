/**
 * AI Service Manager
 * Central service that coordinates AI operations using OpenAI-compatible API
 */

import { generateText } from 'ai'
import { getTextModel, validateApiKeys, getAvailableTextModels, getProviderInfo } from './ai-config'
import { AIServiceManager, ProviderInfo, AIServiceError } from '@/types/ai'

export class AIServiceManagerImpl implements AIServiceManager {
  /**
   * Generate description from article content using configured provider
   */
  async generateDescription(content: string, prompt?: string): Promise<string> {
    if (!content || content.trim().length === 0) {
      throw new AIServiceError(
        'Article content is required for description generation',
        'EMPTY_CONTENT'
      )
    }

    try {
      const textModel = await getTextModel()
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
      
      console.info(`ai description:${description}`)
      // Ensure description doesn't exceed 50 characters
      if (description.length > 50) {
        description = description.substring(0, 47) + '...'
      }

      return description
    } catch (error) {
      console.error('Description generation failed:', error)
      console.error('Error details:', {
        name: error instanceof Error ? error.name : 'Unknown',
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : 'No stack trace'
      })
      
      // Check if it's a network/connection error or Cloudflare Gateway error
      const isNetworkError = error instanceof Error && (
        error.message.includes('timeout') ||
        error.message.includes('connect') ||
        error.message.includes('network') ||
        error.message.includes('ENOTFOUND') ||
        error.message.includes('ECONNREFUSED')
      )

      const isCloudflareError = error instanceof Error && (
        error.message.includes('Internal Server Error') ||
        error.message.includes('cloudflare') ||
        error.message.includes('gateway.ai.cloudflare.com')
      )

      const isApiKeyError = error instanceof Error && (
        error.message.includes('Incorrect API key') ||
        error.message.includes('Invalid API key') ||
        error.message.includes('API key') ||
        error.message.includes('authentication') ||
        error.message.includes('unauthorized')
      )

      if (isNetworkError) {
        // Provide a fallback description based on content analysis
        console.warn('Network error detected, using fallback description generation')
        return this.generateFallbackDescription(content)
      }

      if (isCloudflareError) {
        console.warn('Cloudflare Gateway error detected, using fallback description generation')
        console.warn('建议: 检查 Cloudflare AI Gateway 配置或切换到其他 AI 提供商')
        return this.generateFallbackDescription(content)
      }

      if (isApiKeyError) {
        console.warn('API Key error detected, using fallback description generation')
        console.warn('建议: 1) 检查 API Key 是否正确 2) 确认 API Key 与提供商匹配 3) 检查 API Key 权限')
        return this.generateFallbackDescription(content)
      }
      
      // Provide more specific error messages based on the error type
      if (error instanceof AIServiceError) {
        throw error
      }
      
      throw new AIServiceError(
        `Failed to generate description: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'GENERATION_FAILED',
        true // retryable
      )
    }
  }

  /**
   * Generate a fallback description when AI service is unavailable
   */
  private generateFallbackDescription(content: string): string {
    // Simple content analysis for fallback
    const text = content.replace(/[#*`]/g, '').trim()
    const sentences = text.split(/[.!?。！？]/).filter(s => s.trim().length > 10)
    
    if (sentences.length === 0) {
      return '技术文章摘要'
    }

    // Take the first meaningful sentence and truncate to 50 characters
    let description = sentences[0].trim()
    if (description.length > 50) {
      description = description.substring(0, 47) + '...'
    }

    return description || '技术文章摘要'
  }

  /**
   * Validate configuration by checking API connectivity
   */
  async validateConfiguration(): Promise<boolean> {
    try {
      return await validateApiKeys()
    } catch (error) {
      console.error('Configuration validation failed:', error)
      return false
    }
  }

  /**
   * Get provider information
   */
  async getProviderInfo(): Promise<ProviderInfo> {
    try {
      return await getProviderInfo()
    } catch (error) {
      console.error('Failed to get provider info:', error)
      throw new AIServiceError(
        'Failed to get provider information. Please check your configuration.',
        'PROVIDER_INFO_FAILED'
      )
    }
  }

  /**
   * Check if AI services are properly configured and available
   */
  async isServiceAvailable(): Promise<boolean> {
    try {
      return await this.validateConfiguration()
    } catch (error) {
      return false
    }
  }

  /**
   * Get service status information
   */
  async getServiceStatus(): Promise<{
    available: boolean
    provider: ProviderInfo
    models: any[]
    lastChecked: Date
  }> {
    const available = await this.isServiceAvailable()
    const provider = available ? await this.getProviderInfo() : { baseUrl: '', model: '', isConfigured: false }
    const models = available ? await getAvailableTextModels() : []
    
    return {
      available,
      provider,
      models,
      lastChecked: new Date()
    }
  }
}

// Export singleton instance
export const aiServiceManager = new AIServiceManagerImpl()