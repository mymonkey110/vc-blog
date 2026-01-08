/**
 * AI Configuration Management
 * Uses Cloudflare AI Gateway Provider with unified API
 */

import { createAiGateway } from 'ai-gateway-provider'
import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { createOpenAI } from '@ai-sdk/openai'
import { createAnthropic } from '@ai-sdk/anthropic'
import { generateText } from 'ai'
import { AIServiceError } from '@/types/ai'

/**
 * Cloudflare AI Gateway Configuration
 */
interface CloudflareAIConfig {
  accountId: string
  gatewayName: string
  apiKey: string
  cacheTtl?: number
  maxRetries?: number
  retryDelayMs?: number
}

/**
 * Provider Configuration
 */
interface ProviderConfig {
  name: string
  apiKey: string
  model: string
}

/**
 * Get Cloudflare AI Gateway configuration from environment variables
 */
function getCloudflareConfig(): CloudflareAIConfig {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID
  const gatewayName = process.env.CLOUDFLARE_GATEWAY_NAME
  const apiKey = process.env.CLOUDFLARE_API_KEY

  if (!accountId || !gatewayName) {
    throw new AIServiceError(
      'Cloudflare AI Gateway not configured. Please set CLOUDFLARE_ACCOUNT_ID and CLOUDFLARE_GATEWAY_NAME environment variables.',
      'CLOUDFLARE_CONFIG_MISSING'
    )
  }

  return {
    accountId,
    gatewayName,
    apiKey: apiKey || '',
    cacheTtl: process.env.AI_CACHE_TTL ? parseInt(process.env.AI_CACHE_TTL, 10) : 3600,
    maxRetries: process.env.AI_MAX_RETRIES ? parseInt(process.env.AI_MAX_RETRIES, 10) : 3,
    retryDelayMs: process.env.AI_RETRY_DELAY ? parseInt(process.env.AI_RETRY_DELAY, 10) : 1000
  }
}

/**
 * Get provider configurations from environment variables
 */
function getProviderConfigs(): ProviderConfig[] {
  const providers: ProviderConfig[] = []

  // Google Gemini
  if (process.env.GOOGLE_API_KEY) {
    providers.push({
      name: 'google',
      apiKey: process.env.GOOGLE_API_KEY,
      model: process.env.GOOGLE_MODEL || 'gemini-1.5-flash'
    })
  }

  // OpenAI
  if (process.env.OPENAI_API_KEY) {
    providers.push({
      name: 'openai',
      apiKey: process.env.OPENAI_API_KEY,
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini'
    })
  }

  // Anthropic
  if (process.env.ANTHROPIC_API_KEY) {
    providers.push({
      name: 'anthropic',
      apiKey: process.env.ANTHROPIC_API_KEY,
      model: process.env.ANTHROPIC_MODEL || 'claude-3-haiku-20240307'
    })
  }

  // DeepSeek
  if (process.env.DEEPSEEK_API_KEY) {
    providers.push({
      name: 'deepseek',
      apiKey: process.env.DEEPSEEK_API_KEY,
      model: process.env.DEEPSEEK_MODEL || 'deepseek-chat'
    })
  }

  if (providers.length === 0) {
    throw new AIServiceError(
      'No AI providers configured. Please set at least one provider API key (GOOGLE_API_KEY, OPENAI_API_KEY, ANTHROPIC_API_KEY, or DEEPSEEK_API_KEY).',
      'NO_PROVIDERS_CONFIGURED'
    )
  }

  return providers
}

/**
 * Create provider instances for Cloudflare AI Gateway
 */
function createProviders(configs: ProviderConfig[]) {
  const providers = []

  for (const config of configs) {
    try {
      switch (config.name) {
        case 'google':
          const google = createGoogleGenerativeAI({
            apiKey: config.apiKey
          })
          providers.push(google(config.model))
          break

        case 'openai':
          const openai = createOpenAI({
            apiKey: config.apiKey
          })
          providers.push(openai(config.model))
          break

        case 'anthropic':
          const anthropic = createAnthropic({
            apiKey: config.apiKey
          })
          providers.push(anthropic(config.model))
          break

        case 'deepseek':
          const deepseek = createOpenAI({
            baseURL: 'https://api.deepseek.com/v1',
            apiKey: config.apiKey
          })
          providers.push(deepseek(config.model))
          break

        default:
          console.warn(`Unknown provider: ${config.name}`)
      }
    } catch (error) {
      console.warn(`Failed to create provider ${config.name}:`, error)
    }
  }

  return providers
}

/**
 * Get text generation model using Cloudflare AI Gateway
 * Automatically falls back to next available model if one fails
 */
export async function getTextModel() {
  try {
    const cloudflareConfig = getCloudflareConfig()
    const providerConfigs = getProviderConfigs()

    // Create Cloudflare AI Gateway instance
    const aigateway = createAiGateway({
      accountId: cloudflareConfig.accountId,
      gateway: cloudflareConfig.gatewayName,
      apiKey: cloudflareConfig.apiKey,
      options: {
        cacheTtl: cloudflareConfig.cacheTtl || 3600,
        retries: {
          maxAttempts: Math.min(cloudflareConfig.maxRetries || 3, 5) as 1 | 2 | 3 | 4 | 5,
          retryDelayMs: cloudflareConfig.retryDelayMs || 1000,
          backoff: 'exponential' as const
        }
      }
    })

    // Create provider instances
    const providers = createProviders(providerConfigs)
    
    if (providers.length === 0) {
      throw new AIServiceError(
        'No valid providers could be created',
        'NO_VALID_PROVIDERS'
      )
    }

    // Return AI Gateway with provider array for automatic fallback
    return aigateway(providers)
  } catch (error) {
    console.error('Failed to create AI model:', error)
    throw error
  }
}

/**
 * Validate API configuration by making a test request
 */
export async function validateApiKeys(): Promise<boolean> {
  try {
    const textModel = await getTextModel()
    
    // Test with a minimal text generation request
    await generateText({
      model: textModel,
      prompt: 'test',
      maxOutputTokens: 1,
    })
    
    return true
  } catch (error) {
    console.warn('API key validation failed:', error)
    return false
  }
}

/**
 * Get available models (returns configured model info)
 */
export async function getAvailableTextModels() {
  try {
    const providerConfigs = getProviderConfigs()
    const cloudflareConfig = getCloudflareConfig()
    
    return providerConfigs.map(config => ({
      id: config.model,
      name: `${config.model} (${config.name} via Cloudflare Gateway)`,
      type: 'text' as const,
      provider: config.name
    }))
  } catch (error) {
    console.warn('Failed to get available models:', error)
    return []
  }
}

/**
 * Check if AI services are properly configured
 */
export async function isAIConfigured(): Promise<boolean> {
  try {
    getCloudflareConfig()
    getProviderConfigs()
    return true
  } catch (error) {
    return false
  }
}

/**
 * Get provider information
 */
export async function getProviderInfo() {
  try {
    const cloudflareConfig = getCloudflareConfig()
    const providerConfigs = getProviderConfigs()
    const isConfigured = await validateApiKeys()
    
    const primaryProvider = providerConfigs[0]
    const baseUrl = `https://gateway.ai.cloudflare.com/v1/${cloudflareConfig.accountId}/${cloudflareConfig.gatewayName}`
    
    return {
      name: `${primaryProvider.model} (${primaryProvider.name} via Cloudflare Gateway)`,
      baseUrl,
      model: primaryProvider.model,
      isConfigured,
      hasBackup: providerConfigs.length > 1
    }
  } catch (error) {
    return {
      name: 'Not Configured',
      baseUrl: undefined,
      model: 'unknown',
      isConfigured: false,
      hasBackup: false
    }
  }
}