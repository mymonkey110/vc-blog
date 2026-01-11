/**
 * AI Configuration Management
 * Cloudflare AI Gateway with Unified Provider
 */

import { createAiGateway } from 'ai-gateway-provider'
import { createUnified } from 'ai-gateway-provider/providers/unified'
import { generateText } from 'ai'
import { AIServiceError } from '@/types/ai'

/**
 * Get text generation model using Cloudflare AI Gateway with Unified Provider
 */
export async function getTextModel() {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID
  const gateway = process.env.CLOUDFLARE_GATEWAY_NAME
  const cfToken = process.env.CLOUDFLARE_API_KEY
  const apiKey = process.env.AI_API_KEY
  const model = process.env.AI_MODEL || 'google/gemini-1.5-flash'

  if (!accountId) {
    throw new AIServiceError(
      'Cloudflare Account ID not configured. Please set CLOUDFLARE_ACCOUNT_ID environment variable.',
      'CLOUDFLARE_ACCOUNT_ID_MISSING'
    )
  }

  if (!gateway) {
    throw new AIServiceError(
      'Cloudflare Gateway name not configured. Please set CLOUDFLARE_GATEWAY_NAME environment variable.',
      'CLOUDFLARE_GATEWAY_NAME_MISSING'
    )
  }

  if (!cfToken) {
    throw new AIServiceError(
      'Cloudflare API token not configured. Please set CLOUDFLARE_API_KEY environment variable.',
      'CLOUDFLARE_API_KEY_MISSING'
    )
  }

  if (!apiKey) {
    throw new AIServiceError(
      'Provider API key not configured. Please set AI_API_KEY environment variable.',
      'AI_API_KEY_MISSING'
    )
  }

  try {
    // Create Cloudflare AI Gateway
    const aigateway = createAiGateway({
      accountId,
      gateway,
      apiKey: cfToken,
    })

    // Create Unified Provider
    const unified = createUnified({ 
      apiKey 
    })

    // Combine gateway with unified provider and model
    const textModel = aigateway(unified(model))
    
    console.log(`Using Cloudflare AI Gateway: ${model} via ${accountId}/${gateway}`)
    
    return textModel
  } catch (error) {
    console.error('Failed to create Cloudflare AI Gateway model:', error)
    throw new AIServiceError(
      'Failed to initialize Cloudflare AI Gateway',
      'AI_GATEWAY_INIT_FAILED'
    )
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
    console.warn('Cloudflare AI Gateway validation failed:', error)
    return false
  }
}

/**
 * Get available models (returns configured model info)
 */
export async function getAvailableTextModels() {
  try {
    const model = process.env.AI_MODEL
    
    return [{
      id: model,
      name: `${model} (Cloudflare AI Gateway)`,
      type: 'text' as const,
      provider: 'cloudflare-unified'
    }]
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
    return !!(
      process.env.CLOUDFLARE_ACCOUNT_ID && 
      process.env.CLOUDFLARE_GATEWAY_NAME && 
      process.env.CLOUDFLARE_API_KEY && 
      process.env.AI_API_KEY
    )
  } catch (error) {
    return false
  }
}

/**
 * Get provider information
 */
export async function getProviderInfo() {
  try {
    const model = process.env.AI_MODEL
    const accountId = process.env.CLOUDFLARE_ACCOUNT_ID
    const gateway = process.env.CLOUDFLARE_GATEWAY_NAME
    const isConfigured = await validateApiKeys()
    
    return {
      name: `${model} (Cloudflare Unified)`,
      baseUrl: `https://gateway.ai.cloudflare.com/v1/${accountId}/${gateway}`,
      model: model,
      isConfigured,
      hasBackup: false
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