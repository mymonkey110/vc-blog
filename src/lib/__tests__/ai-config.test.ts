/**
 * AI Configuration Tests
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { isAIConfigured, getAvailableTextModels, validateApiKeys, getProviderInfo } from '../ai-config'

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

  describe('isAIConfigured', () => {
    it('should return false when Cloudflare configuration is missing', async () => {
      delete process.env.CLOUDFLARE_ACCOUNT_ID
      delete process.env.CLOUDFLARE_GATEWAY_NAME

      const result = await isAIConfigured()
      expect(result).toBe(false)
    })

    it('should return false when no provider API keys are configured', async () => {
      process.env.CLOUDFLARE_ACCOUNT_ID = 'test-account'
      process.env.CLOUDFLARE_GATEWAY_NAME = 'test-gateway'
      delete process.env.GOOGLE_API_KEY
      delete process.env.OPENAI_API_KEY
      delete process.env.ANTHROPIC_API_KEY
      delete process.env.DEEPSEEK_API_KEY

      const result = await isAIConfigured()
      expect(result).toBe(false)
    })

    it('should return true when properly configured', async () => {
      process.env.CLOUDFLARE_ACCOUNT_ID = 'test-account'
      process.env.CLOUDFLARE_GATEWAY_NAME = 'test-gateway'
      process.env.GOOGLE_API_KEY = 'test-google-key'

      const result = await isAIConfigured()
      expect(result).toBe(true)
    })
  })

  describe('getAvailableTextModels', () => {
    it('should return empty array when no providers configured', async () => {
      delete process.env.GOOGLE_API_KEY
      delete process.env.OPENAI_API_KEY
      delete process.env.ANTHROPIC_API_KEY
      delete process.env.DEEPSEEK_API_KEY

      const models = await getAvailableTextModels()
      expect(models).toHaveLength(0)
    })

    it('should return Google model when configured', async () => {
      process.env.CLOUDFLARE_ACCOUNT_ID = 'test-account'
      process.env.CLOUDFLARE_GATEWAY_NAME = 'test-gateway'
      process.env.GOOGLE_API_KEY = 'test-google-key'

      const models = await getAvailableTextModels()
      expect(models).toHaveLength(1)
      expect(models[0]).toEqual({
        id: 'gemini-1.5-flash',
        name: 'gemini-1.5-flash (google via Cloudflare Gateway)',
        type: 'text',
        provider: 'google'
      })
    })

    it('should return multiple models when multiple providers configured', async () => {
      process.env.CLOUDFLARE_ACCOUNT_ID = 'test-account'
      process.env.CLOUDFLARE_GATEWAY_NAME = 'test-gateway'
      process.env.GOOGLE_API_KEY = 'test-google-key'
      process.env.OPENAI_API_KEY = 'test-openai-key'

      const models = await getAvailableTextModels()
      expect(models).toHaveLength(2)
      expect(models[0].provider).toBe('google')
      expect(models[1].provider).toBe('openai')
    })
  })

  describe('getProviderInfo', () => {
    it('should return not configured when missing configuration', async () => {
      delete process.env.CLOUDFLARE_ACCOUNT_ID
      delete process.env.GOOGLE_API_KEY

      const info = await getProviderInfo()
      expect(info.name).toBe('Not Configured')
      expect(info.isConfigured).toBe(false)
    })

    it('should return provider info when configured', async () => {
      process.env.CLOUDFLARE_ACCOUNT_ID = 'test-account'
      process.env.CLOUDFLARE_GATEWAY_NAME = 'test-gateway'
      process.env.GOOGLE_API_KEY = 'test-google-key'

      const info = await getProviderInfo()
      expect(info.name).toContain('google via Cloudflare Gateway')
      expect(info.baseUrl).toContain('gateway.ai.cloudflare.com')
      expect(info.model).toBe('gemini-1.5-flash')
    })
  })
})