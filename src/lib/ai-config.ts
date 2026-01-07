/**
 * AI Configuration Management
 * Handles environment variables, API keys, and model configuration
 * Uses Google Gemini API for both text and image generation
 */

import { google } from '@ai-sdk/google'
import { generateText } from 'ai'
import { AIConfiguration, DEFAULT_AI_CONFIG, AIServiceError } from '@/types/ai'

/**
 * Get AI configuration from environment variables
 */
export function getAIConfig(): AIConfiguration {
  const googleApiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY

  if (!googleApiKey) {
    throw new AIServiceError(
      'Google API key not configured. Please set GOOGLE_GENERATIVE_AI_API_KEY environment variable.',
      'MISSING_GOOGLE_KEY'
    )
  }

  return {
    textModel: {
      provider: 'google',
      modelId: 'gemini-1.5-flash', // Use Gemini for text generation
      apiKey: googleApiKey,
    },
    imageModel: {
      provider: 'google',
      modelId: 'gemini-1.5-flash', // Gemini doesn't support image generation, use text model as fallback
      apiKey: googleApiKey,
    },
    prompts: DEFAULT_AI_CONFIG.prompts!,
    limits: DEFAULT_AI_CONFIG.limits!,
  }
}

/**
 * Get text generation model (using Gemini)
 */
export function getTextModel(modelId?: string) {
  const config = getAIConfig()
  // The google provider automatically uses GOOGLE_API_KEY from environment
  return google(modelId || config.textModel.modelId)
}

/**
 * Get image generation model (using Gemini)
 */
export function getImageModel() {
  const config = getAIConfig()
  // The google provider automatically uses GOOGLE_API_KEY from environment
  return google(config.imageModel.modelId)
}

/**
 * Validate API keys by making test requests
 */
export async function validateApiKeys(): Promise<{ google: boolean }> {
  const results = { google: false }

  try {
    const textModel = getTextModel('gemini-1.5-flash')
    // Test with a minimal text generation request
    await generateText({
      model: textModel,
      prompt: 'test',
      maxOutputTokens: 1,
    })
    results.google = true
  } catch (error) {
    console.warn('Google API key validation failed:', error)
  }

  return results
}

/**
 * Get available models for text generation (Gemini models)
 */
export function getAvailableTextModels() {
  return [
    { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash', type: 'text' as const, provider: 'google' },
    { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro', type: 'text' as const, provider: 'google' },
    { id: 'gemini-2.0-flash-exp', name: 'Gemini 2.0 Flash (Experimental)', type: 'text' as const, provider: 'google' },
  ]
}

/**
 * Get available models for image generation
 */
export function getAvailableImageModels() {
  return [
    { 
      id: 'disabled', 
      name: 'Image Generation Disabled (Google Gemini does not support image generation)', 
      type: 'image' as const, 
      provider: 'google' 
    },
  ]
}

/**
 * Check if AI services are properly configured
 */
export function isAIConfigured(): boolean {
  try {
    getAIConfig()
    return true
  } catch (error) {
    return false
  }
}