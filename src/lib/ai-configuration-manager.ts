/**
 * AI Configuration Manager
 * Manages OpenAI-compatible API configuration from environment variables
 */

import { AIConfiguration, AIConfigurationManager, DEFAULT_AI_CONFIG, AIServiceError } from '@/types/ai'

export class AIConfigurationManagerImpl implements AIConfigurationManager {
  private config: AIConfiguration | null = null

  /**
   * Load configuration from environment variables
   */
  async loadConfiguration(): Promise<AIConfiguration> {
    if (this.config) {
      return this.config
    }

    try {
      // Start with default configuration
      const config: AIConfiguration = {
        ...DEFAULT_AI_CONFIG,
        prompts: { ...DEFAULT_AI_CONFIG.prompts },
        limits: { ...DEFAULT_AI_CONFIG.limits },
        headers: { ...DEFAULT_AI_CONFIG.headers }
      }

      // Load from environment variables
      this.loadFromEnvironment(config)

      // Validate configuration
      if (!config.apiKey) {
        throw new AIServiceError(
          'AI API key not configured. Please set AI_API_KEY environment variable.',
          'MISSING_API_KEY'
        )
      }

      this.config = config
      return config
    } catch (error) {
      console.error('Failed to load AI configuration:', error)
      throw new AIServiceError(
        'Failed to load AI configuration. Please check your environment variables.',
        'CONFIG_LOAD_FAILED'
      )
    }
  }

  /**
   * Load configuration from environment variables
   */
  private loadFromEnvironment(config: AIConfiguration): void {
    // Primary API Key (required)
    if (process.env.AI_API_KEY) {
      config.apiKey = process.env.AI_API_KEY
    }

    // Model name (optional, defaults to gemini-1.5-flash)
    if (process.env.AI_MODEL) {
      config.model = process.env.AI_MODEL
    }

    // Cloudflare AI Gateway configuration
    if (process.env.CLOUDFLARE_ACCOUNT_ID && process.env.CLOUDFLARE_GATEWAY_NAME) {
      config.cloudflare = {
        accountId: process.env.CLOUDFLARE_ACCOUNT_ID,
        gatewayName: process.env.CLOUDFLARE_GATEWAY_NAME,
        apiKey: process.env.CLOUDFLARE_API_KEY || ''
      }
    }

    // Backup providers (optional)
    const backupProviders: any = {}
    if (process.env.OPENAI_API_KEY) {
      backupProviders.openai = { apiKey: process.env.OPENAI_API_KEY }
    }
    if (process.env.ANTHROPIC_API_KEY) {
      backupProviders.anthropic = { apiKey: process.env.ANTHROPIC_API_KEY }
    }
    if (process.env.DEEPSEEK_API_KEY) {
      backupProviders.deepseek = { apiKey: process.env.DEEPSEEK_API_KEY }
    }
    if (Object.keys(backupProviders).length > 0) {
      config.backupProviders = backupProviders
    }

    // Gateway options
    if (!config.options) {
      config.options = {}
    }
    if (process.env.AI_CACHE_TTL) {
      const cacheTtl = parseInt(process.env.AI_CACHE_TTL, 10)
      if (!isNaN(cacheTtl) && cacheTtl > 0) {
        config.options.cacheTtl = cacheTtl
      }
    }
    if (process.env.AI_MAX_RETRIES) {
      const maxRetries = parseInt(process.env.AI_MAX_RETRIES, 10)
      if (!isNaN(maxRetries) && maxRetries > 0) {
        config.options.maxRetries = maxRetries
      }
    }
    if (process.env.AI_RETRY_DELAY) {
      const retryDelay = parseInt(process.env.AI_RETRY_DELAY, 10)
      if (!isNaN(retryDelay) && retryDelay > 0) {
        config.options.retryDelayMs = retryDelay
      }
    }

    // Legacy support for baseUrl and headers
    if (process.env.AI_BASE_URL) {
      config.baseUrl = process.env.AI_BASE_URL
    }

    // Custom headers (optional)
    // Format: AI_HEADER_<NAME>=<VALUE>
    Object.keys(process.env).forEach(key => {
      if (key.startsWith('AI_HEADER_')) {
        const headerName = key.replace('AI_HEADER_', '').toLowerCase().replace(/_/g, '-')
        const headerValue = process.env[key]
        if (headerValue) {
          if (!config.headers) {
            config.headers = {}
          }
          config.headers[headerName] = headerValue
        }
      }
    })

    // Prompt configuration (optional)
    if (process.env.AI_DEFAULT_PROMPT) {
      config.prompts.defaultDescriptionPrompt = process.env.AI_DEFAULT_PROMPT
    }

    // Limits configuration (optional)
    if (process.env.AI_MAX_DESCRIPTION_LENGTH) {
      const maxLength = parseInt(process.env.AI_MAX_DESCRIPTION_LENGTH, 10)
      if (!isNaN(maxLength) && maxLength > 0) {
        config.limits.maxDescriptionLength = maxLength
      }
    }

    if (process.env.AI_MAX_PROMPT_LENGTH) {
      const maxPromptLength = parseInt(process.env.AI_MAX_PROMPT_LENGTH, 10)
      if (!isNaN(maxPromptLength) && maxPromptLength > 0) {
        config.limits.maxPromptLength = maxPromptLength
      }
    }

    if (process.env.AI_REQUEST_TIMEOUT) {
      const timeout = parseInt(process.env.AI_REQUEST_TIMEOUT, 10)
      if (!isNaN(timeout) && timeout > 0) {
        config.limits.requestTimeout = timeout
      }
    }
  }

  /**
   * Save configuration (placeholder for future persistence)
   */
  async saveConfiguration(config: AIConfiguration): Promise<void> {
    // TODO: Implement configuration persistence if needed
    // For now, configuration is read-only from environment variables
    this.config = config
  }

  /**
   * Validate configuration
   */
  async validateConfiguration(config: AIConfiguration): Promise<boolean> {
    // Must have at least primary API key and model
    if (!config.apiKey || !config.model) {
      return false
    }

    // Check if it's a Google API key
    const isGoogleKey = config.apiKey.startsWith('AIza')
    
    if (isGoogleKey) {
      // For Google API keys, only apiKey and model are required
      return true
    } else {
      // For other providers, baseUrl or Cloudflare gateway is required
      return !!(config.baseUrl || (config.cloudflare?.accountId && config.cloudflare?.gatewayName))
    }
  }

  /**
   * Get the current configuration
   */
  getConfiguration(): AIConfiguration {
    if (!this.config) {
      throw new AIServiceError(
        'Configuration not loaded. Call loadConfiguration() first.',
        'CONFIG_NOT_LOADED'
      )
    }

    return this.config
  }

  /**
   * Reset configuration cache (useful for testing or reloading)
   */
  resetCache(): void {
    this.config = null
  }
}

// Export singleton instance
export const aiConfigurationManager = new AIConfigurationManagerImpl()