/**
 * API Route: AI Service Status
 * Provides information about AI service availability and configuration
 */

import { NextResponse } from 'next/server'
import { aiServiceManager } from '@/lib/ai-service-manager'
import { isAIConfigured, getAvailableTextModels } from '@/lib/ai-config'

export async function GET() {
  try {
    // Check basic configuration
    const isConfigured = await isAIConfigured()
    
    if (!isConfigured) {
      return NextResponse.json({
        success: false,
        configured: false,
        available: false,
        message: 'AI服务未配置，请设置 AI_API_KEY、AI_BASE_URL 和 AI_MODEL 环境变量',
        provider: null,
        models: [],
        checkedAt: new Date().toISOString()
      })
    }

    // Check service availability
    const available = await aiServiceManager.isServiceAvailable()
    
    // Get provider info and models
    let providerInfo: any = null
    let models: any[] = []
    let detailedStatus: any = null

    if (available) {
      try {
        providerInfo = await aiServiceManager.getProviderInfo()
        models = await getAvailableTextModels()
        detailedStatus = await aiServiceManager.getServiceStatus()
      } catch (error) {
        console.warn('Failed to get detailed service status:', error)
      }
    }

    return NextResponse.json({
      success: true,
      configured: true,
      available,
      message: available ? 'AI服务正常' : 'AI服务配置错误或无法连接',
      provider: providerInfo,
      models,
      limits: {
        description: {
          maxLength: 50,
          maxPromptLength: 1000
        }
      },
      detailedStatus,
      checkedAt: new Date().toISOString()
    })

  } catch (error) {
    console.error('AI status check failed:', error)
    
    return NextResponse.json({
      success: false,
      configured: false,
      available: false,
      message: '无法检查AI服务状态',
      error: error instanceof Error ? error.message : '未知错误',
      checkedAt: new Date().toISOString()
    }, { status: 500 })
  }
}

// Handle unsupported methods
export async function POST() {
  return NextResponse.json(
    { 
      error: '方法不支持',
      message: '此端点仅支持GET请求'
    },
    { status: 405 }
  )
}

export async function PUT() {
  return NextResponse.json(
    { 
      error: '方法不支持',
      message: '此端点仅支持GET请求'
    },
    { status: 405 }
  )
}

export async function DELETE() {
  return NextResponse.json(
    { 
      error: '方法不支持',
      message: '此端点仅支持GET请求'
    },
    { status: 405 }
  )
}