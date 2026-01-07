/**
 * AI Configuration Tests
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { getAIConfig, isAIConfigured, getAvailableTextModels, getAvailableImageModels } from '../ai-config'
import { AIServiceError } from '@/types/ai'

describe('AI Configuration', () => {
  const originalEnv = process.env

  beforeEach(() => {
    // Reset environment
    process.env = { ...originalEnv }
  })

  afterEach(() => {
    // Restore environment
    process.env = originalEnv
  })

  describe('getAIConfig', () => {
    it('should throw error when Google API key is missing', () => {
      delete process.env.GOOGLE_API_KEY

      expect(() => getAIConfig()).toThrow(AIServiceError)
      expect(() => getAIConfig()).toThrow('Google API key not configured')
    })

    it('should return valid configuration when Google API key is present', () => {
      process.env.GOOGLE_API_KEY = 'test-google-key'

      const config = getAIConfig()

      expect(config.textModel.apiKey).toBe('test-google-key')
      expect(config.imageModel.apiKey).toBe('test-google-key')
      expect(config.textModel.provider).toBe('google')
      expect(config.imageModel.provider).toBe('google')
      expect(config.textModel.modelId).toBe('gemini-1.5-flash')
      expect(config.imageModel.modelId).toBe('gemini-2.5-flash-image')
    })

    it('should include default prompts and limits', () => {
      process.env.GOOGLE_API_KEY = 'test-google-key'

      const config = getAIConfig()

      expect(config.prompts.defaultDescriptionPrompt).toContain('总结文章内容')
      expect(config.prompts.defaultImagePrompt).toContain('封面图片')
      expect(config.limits.maxDescriptionLength).toBe(50)
      expect(config.limits.maxPromptLength).toBe(1000)
      expect(config.limits.requestTimeout).toBe(30000)
    })
  })

  describe('isAIConfigured', () => {
    it('should return false when Google API key is missing', () => {
      delete process.env.GOOGLE_API_KEY

      expect(isAIConfigured()).toBe(false)
    })

    it('should return true when Google API key is present', () => {
      process.env.GOOGLE_API_KEY = 'test-google-key'

      expect(isAIConfigured()).toBe(true)
    })
  })

  describe('getAvailableTextModels', () => {
    it('should return list of available Gemini text models', () => {
      const models = getAvailableTextModels()

      expect(models).toHaveLength(3)
      expect(models[0]).toEqual({
        id: 'gemini-1.5-flash',
        name: 'Gemini 1.5 Flash',
        type: 'text',
        provider: 'google'
      })
    })
  })

  describe('getAvailableImageModels', () => {
    it('should return list of available image models', () => {
      const models = getAvailableImageModels()

      expect(models).toHaveLength(1)
      expect(models[0]).toEqual({
        id: 'gemini-2.5-flash-image',
        name: 'Nano Banana (Gemini 2.5 Flash Image)',
        type: 'image',
        provider: 'google'
      })
    })
  })
})