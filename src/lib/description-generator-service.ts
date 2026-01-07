/**
 * Description Generator Service
 * Handles intelligent description generation from article content with caching and progress tracking
 */

import { generateText } from 'ai'
import { getTextModel } from './ai-config'
import { DescriptionGeneratorService, DescriptionResult, ValidationResult, AIServiceError, AIValidationError } from '@/types/ai'
import { aiCacheManager } from './ai-cache-manager'
import { aiProgressTracker } from './ai-progress-tracker'

export interface DescriptionOptions {
  useCache?: boolean;
  progressId?: string;
}

export class DescriptionGeneratorServiceImpl implements DescriptionGeneratorService {
  private defaultPrompt = '请帮我总结文章内容，提取关键信息形成摘要，内容不要超过50个字。'
  private maxPromptLength = 1000
  private maxDescriptionLength = 50

  /**
   * Generate description from article content
   */
  async generateDescription(
    content: string, 
    customPrompt?: string,
    options: DescriptionOptions = {}
  ): Promise<DescriptionResult> {
    const { useCache = true, progressId } = options;

    // Start progress tracking
    let abortController: AbortController | undefined;
    if (progressId) {
      abortController = aiProgressTracker.startOperation(progressId, 'description', '准备生成描述...');
    }

    try {
      // Validate inputs
      if (!content || content.trim().length === 0) {
        throw new AIServiceError(
          'Article content cannot be empty',
          'EMPTY_CONTENT'
        )
      }

      if (content.trim().length < 10) {
        throw new AIServiceError(
          'Article content is too short to generate a meaningful description',
          'INSUFFICIENT_CONTENT'
        )
      }

      const prompt = customPrompt || this.defaultPrompt
      const promptValidation = this.validatePrompt(prompt)
      if (!promptValidation.isValid) {
        throw new AIValidationError(
          promptValidation.error || 'Invalid prompt',
          'prompt',
          promptValidation.suggestions
        )
      }

      // Update progress
      if (progressId) {
        aiProgressTracker.updateProgress(progressId, 10, '内容验证完成...');
      }

      // Check cache first
      if (useCache) {
        const cacheKey = `${content}-${prompt}`;
        const cached = aiCacheManager.get<DescriptionResult>('description', cacheKey);
        
        if (cached) {
          if (progressId) {
            aiProgressTracker.completeOperation(progressId, '从缓存获取结果');
          }
          return cached;
        }
      }

      // Update progress
      if (progressId) {
        aiProgressTracker.updateProgress(progressId, 30, '正在生成描述...');
      }

      const textModel = getTextModel()
      
      const result = await generateText({
        model: textModel,
        system: prompt,
        prompt: `请为以下文章内容生成摘要：\n\n${content}`,
        maxOutputTokens: 100,
        temperature: 0.3, // Lower temperature for consistent results
        abortSignal: abortController?.signal
      })

      // Update progress
      if (progressId) {
        aiProgressTracker.updateProgress(progressId, 80, '处理生成结果...');
      }

      let description = result.text.trim()
      let truncated = false

      // Handle length constraints
      if (description.length > this.maxDescriptionLength) {
        // Try to truncate at word boundary
        const truncateAt = this.maxDescriptionLength - 3 // Reserve space for "..."
        let truncatedDesc = description.substring(0, truncateAt)
        
        // Find last complete word
        const lastSpaceIndex = truncatedDesc.lastIndexOf(' ')
        if (lastSpaceIndex > truncateAt * 0.7) { // Only if we don't lose too much content
          truncatedDesc = truncatedDesc.substring(0, lastSpaceIndex)
        }
        
        description = truncatedDesc + '...'
        truncated = true
      }

      // Count characters (Chinese characters count as 1)
      const wordCount = description.length

      const descriptionResult: DescriptionResult = {
        description,
        wordCount,
        truncated
      };

      // Cache the result
      if (useCache) {
        const cacheKey = `${content}-${prompt}`;
        aiCacheManager.set('description', cacheKey, descriptionResult, undefined, {
          ttl: 10 * 60 * 1000 // 10 minutes
        });
      }

      // Complete progress
      if (progressId) {
        aiProgressTracker.completeOperation(progressId, '描述生成完成');
      }

      return descriptionResult;

    } catch (error) {
      if (progressId) {
        const errorMessage = error instanceof Error ? error.message : '生成失败';
        aiProgressTracker.failOperation(progressId, errorMessage);
      }

      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('描述生成已取消');
      }

      console.error('Description generation failed:', error)
      if (error instanceof AIServiceError || error instanceof AIValidationError) {
        throw error
      }
      throw new AIServiceError(
        'Failed to generate description. Please try again.',
        'GENERATION_FAILED',
        true
      )
    }
  }

  /**
   * Validate prompt template
   */
  validatePrompt(prompt: string): ValidationResult {
    if (!prompt || prompt.trim().length === 0) {
      return {
        isValid: false,
        error: 'Prompt cannot be empty',
        suggestions: ['Use the default prompt', 'Provide a clear instruction for summarization']
      }
    }

    if (prompt.length > this.maxPromptLength) {
      return {
        isValid: false,
        error: `Prompt is too long (${prompt.length} characters). Maximum allowed is ${this.maxPromptLength} characters.`,
        suggestions: ['Shorten the prompt', 'Focus on essential instructions only']
      }
    }

    // Check for potentially problematic content
    const problematicPatterns = [
      /ignore\s+previous\s+instructions/i,
      /forget\s+everything/i,
      /act\s+as\s+if/i,
      /pretend\s+to\s+be/i
    ]

    for (const pattern of problematicPatterns) {
      if (pattern.test(prompt)) {
        return {
          isValid: false,
          error: 'Prompt contains potentially problematic instructions',
          suggestions: ['Focus on summarization instructions', 'Avoid role-playing or instruction overrides']
        }
      }
    }

    // Check if prompt is related to summarization
    const summarizationKeywords = ['总结', '摘要', '概括', '提取', 'summarize', 'summary', 'extract']
    const hasSummarizationKeyword = summarizationKeywords.some(keyword => 
      prompt.toLowerCase().includes(keyword.toLowerCase())
    )

    if (!hasSummarizationKeyword) {
      return {
        isValid: true, // Still valid, but provide suggestion
        error: undefined,
        suggestions: ['Consider including summarization keywords like "总结" or "摘要" for better results']
      }
    }

    return {
      isValid: true
    }
  }

  /**
   * Get default prompt template
   */
  getDefaultPrompt(): string {
    return this.defaultPrompt
  }

  /**
   * Set default prompt template
   */
  setDefaultPrompt(prompt: string): void {
    const validation = this.validatePrompt(prompt)
    if (!validation.isValid) {
      throw new AIValidationError(
        validation.error || 'Invalid prompt',
        'prompt',
        validation.suggestions
      )
    }
    this.defaultPrompt = prompt
  }

  /**
   * Get configuration limits
   */
  getLimits() {
    return {
      maxPromptLength: this.maxPromptLength,
      maxDescriptionLength: this.maxDescriptionLength
    }
  }

  /**
   * Extract key information from content for better summarization
   */
  private extractKeyInfo(content: string): string {
    // Remove markdown formatting for better processing
    let cleanContent = content
      .replace(/```[\s\S]*?```/g, '[代码块]') // Replace code blocks
      .replace(/`[^`]+`/g, '[代码]') // Replace inline code
      .replace(/!\[.*?\]\(.*?\)/g, '[图片]') // Replace images
      .replace(/\[.*?\]\(.*?\)/g, '') // Remove links but keep text
      .replace(/#{1,6}\s+/g, '') // Remove markdown headers
      .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold formatting
      .replace(/\*(.*?)\*/g, '$1') // Remove italic formatting
      .trim()

    // If content is very long, focus on the first few paragraphs
    if (cleanContent.length > 1000) {
      const paragraphs = cleanContent.split('\n\n')
      cleanContent = paragraphs.slice(0, 3).join('\n\n')
    }

    return cleanContent
  }

  /**
   * Generate description with content preprocessing
   */
  async generateDescriptionWithPreprocessing(
    content: string, 
    customPrompt?: string,
    options: DescriptionOptions = {}
  ): Promise<DescriptionResult> {
    const processedContent = this.extractKeyInfo(content)
    return this.generateDescription(processedContent, customPrompt, options)
  }
}

// Export singleton instance
export const descriptionGeneratorService = new DescriptionGeneratorServiceImpl()