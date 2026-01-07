/**
 * API Route: Generate Description
 * Handles AI-powered description generation from article content
 */

import { NextRequest, NextResponse } from 'next/server'
import { descriptionGeneratorService } from '@/lib/description-generator-service'
import { AIErrorHandler, withErrorHandling } from '@/lib/ai-error-handler'
import { isAIConfigured } from '@/lib/ai-config'

interface GenerateDescriptionRequest {
  content: string
  customPrompt?: string
}

export async function POST(request: NextRequest) {
  try {
    // Check if AI services are configured
    if (!isAIConfigured()) {
      return NextResponse.json(
        { 
          error: 'AI服务未配置',
          message: 'AI服务未正确配置，请联系管理员'
        },
        { status: 503 }
      )
    }

    // Parse request body
    const body: GenerateDescriptionRequest = await request.json()
    const { content, customPrompt } = body

    // Validate request
    if (!content || typeof content !== 'string') {
      return NextResponse.json(
        { 
          error: '请求参数无效',
          message: '文章内容不能为空'
        },
        { status: 400 }
      )
    }

    if (content.trim().length === 0) {
      return NextResponse.json(
        { 
          error: '内容为空',
          message: '请提供文章内容以生成描述'
        },
        { status: 400 }
      )
    }

    if (customPrompt && typeof customPrompt !== 'string') {
      return NextResponse.json(
        { 
          error: '请求参数无效',
          message: '自定义提示词格式不正确'
        },
        { status: 400 }
      )
    }

    // Generate description with error handling
    const result = await withErrorHandling(
      () => descriptionGeneratorService.generateDescriptionWithPreprocessing(content, customPrompt),
      'generate-description'
    )

    if (!result) {
      // Error handling already logged the error
      return NextResponse.json(
        { 
          error: '生成失败',
          message: AIErrorHandler.createFallbackMessage('description')
        },
        { status: 500 }
      )
    }

    // Return successful result
    return NextResponse.json({
      success: true,
      data: {
        description: result.description,
        wordCount: result.wordCount,
        truncated: result.truncated,
        generatedAt: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('Description generation API error:', error)
    
    // Handle JSON parsing errors
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { 
          error: '请求格式错误',
          message: '请求数据格式不正确'
        },
        { status: 400 }
      )
    }

    // Handle other unexpected errors
    return NextResponse.json(
      { 
        error: '服务器错误',
        message: '服务器内部错误，请稍后重试'
      },
      { status: 500 }
    )
  }
}

// Handle unsupported methods
export async function GET() {
  return NextResponse.json(
    { 
      error: '方法不支持',
      message: '此端点仅支持POST请求'
    },
    { status: 405 }
  )
}

export async function PUT() {
  return NextResponse.json(
    { 
      error: '方法不支持',
      message: '此端点仅支持POST请求'
    },
    { status: 405 }
  )
}

export async function DELETE() {
  return NextResponse.json(
    { 
      error: '方法不支持',
      message: '此端点仅支持POST请求'
    },
    { status: 405 }
  )
}