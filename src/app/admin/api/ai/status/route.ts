/**
 * API Route: AI Service Status
 * Provides information about AI service availability and configuration
 */

import { NextResponse } from 'next/server'
import { aiServiceManager } from '@/lib/ai-service-manager'
import { AIErrorHandler } from '@/lib/ai-error-handler'
import { isAIConfigured, getAvailableTextModels, getAvailableImageModels } from '@/lib/ai-config'

export async function GET() {
  try {
    // Check basic configuration
    const isConfigured = isAIConfigured()
    
    if (!isConfigured) {
      return NextResponse.json({
        success: false,
        configured: false,
        available: false,
        message: 'AI服务未配置',
        models: {
          text: [],
          image: []
        },
        checkedAt: new Date().toISOString()
      })
    }

    // Check service availability
    const serviceStatus = await AIErrorHandler.checkServiceAvailability()
    
    // Get available models
    const textModels = getAvailableTextModels()
    const imageModels = getAvailableImageModels()

    // Get detailed service status if available
    let detailedStatus = null
    if (serviceStatus.available) {
      try {
        detailedStatus = await aiServiceManager.getServiceStatus()
      } catch (error) {
        console.warn('Failed to get detailed service status:', error)
      }
    }

    return NextResponse.json({
      success: true,
      configured: true,
      available: serviceStatus.available,
      message: serviceStatus.message,
      models: {
        text: textModels,
        image: imageModels
      },
      limits: {
        description: {
          maxLength: 50,
          maxPromptLength: 1000
        },
        image: {
          maxPromptLength: 1000,
          supportedAspectRatios: ['1:1', '3:4', '4:3', '9:16', '16:9']
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