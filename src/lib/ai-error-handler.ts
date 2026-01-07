/**
 * AI Error Handler
 * Comprehensive error handling for AI operations
 */

import { AIServiceError, AIValidationError } from '@/types/ai'

export interface ErrorHandlingResult {
  userMessage: string
  canRetry: boolean
  retryDelay?: number
  shouldFallback: boolean
  logLevel: 'error' | 'warn' | 'info'
}

export class AIErrorHandler {
  private static retryAttempts = new Map<string, number>()
  private static readonly MAX_RETRY_ATTEMPTS = 3
  private static readonly BASE_RETRY_DELAY = 1000 // 1 second

  /**
   * Handle AI service errors with appropriate user messaging and retry logic
   */
  static handleError(error: unknown, operation: string): ErrorHandlingResult {
    console.error(`AI operation failed: ${operation}`, error)

    // Handle known AI service errors
    if (error instanceof AIServiceError) {
      return this.handleAIServiceError(error, operation)
    }

    // Handle validation errors
    if (error instanceof AIValidationError) {
      return this.handleValidationError(error)
    }

    // Handle network errors
    if (error instanceof Error) {
      if (this.isNetworkError(error)) {
        return this.handleNetworkError(error, operation)
      }

      if (this.isQuotaError(error)) {
        return this.handleQuotaError(error)
      }

      if (this.isAuthenticationError(error)) {
        return this.handleAuthenticationError(error)
      }

      if (this.isContentPolicyError(error)) {
        return this.handleContentPolicyError(error)
      }
    }

    // Handle unknown errors
    return this.handleUnknownError(error, operation)
  }

  /**
   * Handle AI service specific errors
   */
  private static handleAIServiceError(error: AIServiceError, operation: string): ErrorHandlingResult {
    const retryCount = this.getRetryCount(operation)

    switch (error.code) {
      case 'EMPTY_CONTENT':
      case 'INSUFFICIENT_CONTENT':
        return {
          userMessage: '请先输入足够的文章内容再生成描述',
          canRetry: false,
          shouldFallback: false,
          logLevel: 'info'
        }

      case 'EMPTY_PROMPT':
        return {
          userMessage: '请输入图片描述再生成封面图',
          canRetry: false,
          shouldFallback: false,
          logLevel: 'info'
        }

      case 'NO_IMAGE_DATA':
      case 'NO_IMAGE_GENERATED':
        return {
          userMessage: 'AI服务未返回图片数据，请重试',
          canRetry: retryCount < this.MAX_RETRY_ATTEMPTS,
          retryDelay: this.calculateRetryDelay(retryCount),
          shouldFallback: retryCount >= this.MAX_RETRY_ATTEMPTS,
          logLevel: 'warn'
        }

      case 'GENERATION_FAILED':
        return {
          userMessage: error.retryable && retryCount < this.MAX_RETRY_ATTEMPTS
            ? 'AI生成失败，正在重试...'
            : 'AI生成失败，请检查网络连接后重试',
          canRetry: error.retryable && retryCount < this.MAX_RETRY_ATTEMPTS,
          retryDelay: this.calculateRetryDelay(retryCount),
          shouldFallback: !error.retryable || retryCount >= this.MAX_RETRY_ATTEMPTS,
          logLevel: 'error'
        }

      default:
        return {
          userMessage: error.message || 'AI服务出现未知错误',
          canRetry: error.retryable && retryCount < this.MAX_RETRY_ATTEMPTS,
          retryDelay: this.calculateRetryDelay(retryCount),
          shouldFallback: retryCount >= this.MAX_RETRY_ATTEMPTS,
          logLevel: 'error'
        }
    }
  }

  /**
   * Handle validation errors
   */
  private static handleValidationError(error: AIValidationError): ErrorHandlingResult {
    let userMessage = error.message

    if (error.suggestions && error.suggestions.length > 0) {
      userMessage += `\n建议：${error.suggestions[0]}`
    }

    return {
      userMessage,
      canRetry: false,
      shouldFallback: false,
      logLevel: 'info'
    }
  }

  /**
   * Handle network errors
   */
  private static handleNetworkError(error: Error, operation: string): ErrorHandlingResult {
    const retryCount = this.getRetryCount(operation)

    return {
      userMessage: retryCount < this.MAX_RETRY_ATTEMPTS
        ? '网络连接不稳定，正在重试...'
        : '网络连接失败，请检查网络后重试',
      canRetry: retryCount < this.MAX_RETRY_ATTEMPTS,
      retryDelay: this.calculateRetryDelay(retryCount),
      shouldFallback: retryCount >= this.MAX_RETRY_ATTEMPTS,
      logLevel: 'warn'
    }
  }

  /**
   * Handle quota/rate limit errors
   */
  private static handleQuotaError(error: Error): ErrorHandlingResult {
    return {
      userMessage: 'API使用量已达上限，请稍后再试或联系管理员',
      canRetry: false,
      shouldFallback: true,
      logLevel: 'warn'
    }
  }

  /**
   * Handle authentication errors
   */
  private static handleAuthenticationError(error: Error): ErrorHandlingResult {
    return {
      userMessage: 'AI服务认证失败，请联系管理员检查API密钥配置',
      canRetry: false,
      shouldFallback: true,
      logLevel: 'error'
    }
  }

  /**
   * Handle content policy violations
   */
  private static handleContentPolicyError(error: Error): ErrorHandlingResult {
    return {
      userMessage: '内容不符合AI服务政策，请修改描述后重试',
      canRetry: false,
      shouldFallback: false,
      logLevel: 'warn'
    }
  }

  /**
   * Handle unknown errors
   */
  private static handleUnknownError(error: unknown, operation: string): ErrorHandlingResult {
    const retryCount = this.getRetryCount(operation)

    return {
      userMessage: retryCount < this.MAX_RETRY_ATTEMPTS
        ? '服务暂时不可用，正在重试...'
        : '服务暂时不可用，请稍后重试',
      canRetry: retryCount < this.MAX_RETRY_ATTEMPTS,
      retryDelay: this.calculateRetryDelay(retryCount),
      shouldFallback: retryCount >= this.MAX_RETRY_ATTEMPTS,
      logLevel: 'error'
    }
  }

  /**
   * Check if error is a network error
   */
  private static isNetworkError(error: Error): boolean {
    const networkErrorPatterns = [
      /network/i,
      /connection/i,
      /timeout/i,
      /fetch/i,
      /ECONNREFUSED/i,
      /ENOTFOUND/i,
      /ETIMEDOUT/i
    ]

    return networkErrorPatterns.some(pattern => 
      pattern.test(error.message) || pattern.test(error.name)
    )
  }

  /**
   * Check if error is a quota/rate limit error
   */
  private static isQuotaError(error: Error): boolean {
    const quotaErrorPatterns = [
      /quota/i,
      /rate limit/i,
      /too many requests/i,
      /429/,
      /usage limit/i,
      /billing/i
    ]

    return quotaErrorPatterns.some(pattern => 
      pattern.test(error.message) || pattern.test(error.name)
    )
  }

  /**
   * Check if error is an authentication error
   */
  private static isAuthenticationError(error: Error): boolean {
    const authErrorPatterns = [
      /unauthorized/i,
      /authentication/i,
      /api key/i,
      /invalid key/i,
      /401/,
      /403/,
      /permission/i
    ]

    return authErrorPatterns.some(pattern => 
      pattern.test(error.message) || pattern.test(error.name)
    )
  }

  /**
   * Check if error is a content policy violation
   */
  private static isContentPolicyError(error: Error): boolean {
    const policyErrorPatterns = [
      /safety/i,
      /policy/i,
      /content filter/i,
      /inappropriate/i,
      /blocked/i,
      /violation/i
    ]

    return policyErrorPatterns.some(pattern => 
      pattern.test(error.message) || pattern.test(error.name)
    )
  }

  /**
   * Get retry count for an operation
   */
  private static getRetryCount(operation: string): number {
    return this.retryAttempts.get(operation) || 0
  }

  /**
   * Increment retry count for an operation
   */
  static incrementRetryCount(operation: string): number {
    const currentCount = this.getRetryCount(operation)
    const newCount = currentCount + 1
    this.retryAttempts.set(operation, newCount)
    return newCount
  }

  /**
   * Reset retry count for an operation
   */
  static resetRetryCount(operation: string): void {
    this.retryAttempts.delete(operation)
  }

  /**
   * Calculate retry delay with exponential backoff
   */
  private static calculateRetryDelay(retryCount: number): number {
    return this.BASE_RETRY_DELAY * Math.pow(2, retryCount)
  }

  /**
   * Check if AI services are available
   */
  static async checkServiceAvailability(): Promise<{
    available: boolean
    message: string
  }> {
    try {
      // This would typically make a lightweight test request
      // For now, we'll just check if the API key is configured
      const hasApiKey = !!process.env.GOOGLE_API_KEY
      
      if (!hasApiKey) {
        return {
          available: false,
          message: 'AI服务未配置，请联系管理员'
        }
      }

      return {
        available: true,
        message: 'AI服务正常'
      }
    } catch (error) {
      return {
        available: false,
        message: 'AI服务暂时不可用'
      }
    }
  }

  /**
   * Create a graceful fallback message
   */
  static createFallbackMessage(operation: 'description' | 'image'): string {
    switch (operation) {
      case 'description':
        return 'AI描述生成暂时不可用，请手动输入文章描述'
      case 'image':
        return 'AI图片生成暂时不可用，请使用URL链接或上传文件方式添加封面图'
      default:
        return 'AI功能暂时不可用，请使用手动方式'
    }
  }
}

/**
 * Utility function for handling async operations with error handling
 */
export async function withErrorHandling<T>(
  operation: () => Promise<T>,
  operationName: string,
  onError?: (result: ErrorHandlingResult) => void
): Promise<T | null> {
  try {
    const result = await operation()
    AIErrorHandler.resetRetryCount(operationName)
    return result
  } catch (error) {
    const errorResult = AIErrorHandler.handleError(error, operationName)
    
    if (onError) {
      onError(errorResult)
    }

    if (errorResult.canRetry) {
      AIErrorHandler.incrementRetryCount(operationName)
      
      if (errorResult.retryDelay) {
        await new Promise(resolve => setTimeout(resolve, errorResult.retryDelay))
      }
      
      // Recursive retry
      return withErrorHandling(operation, operationName, onError)
    }

    return null
  }
}