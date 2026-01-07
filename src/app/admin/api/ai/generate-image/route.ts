/**
 * API Route: Generate Image
 * Handles AI-powered cover image generation
 */

import { NextRequest, NextResponse } from 'next/server'
import { imageGeneratorService } from '@/lib/image-generator-service'
import { AIErrorHandler, withErrorHandling } from '@/lib/ai-error-handler'
import { isAIConfigured } from '@/lib/ai-config'

interface GenerateImageRequest {
  prompt: string
  articleTitle?: string
  articleContent?: string
  options?: {
    aspectRatio?: string
    seed?: number
  }
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
    const body: GenerateImageRequest = await request.json()
    const { prompt, articleTitle, articleContent, options } = body

    // Validate request
    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { 
          error: '请求参数无效',
          message: '图片描述不能为空'
        },
        { status: 400 }
      )
    }

    if (prompt.trim().length === 0) {
      return NextResponse.json(
        { 
          error: '描述为空',
          message: '请提供图片描述以生成封面图'
        },
        { status: 400 }
      )
    }

    // Validate options if provided
    if (options) {
      if (options.aspectRatio && typeof options.aspectRatio !== 'string') {
        return NextResponse.json(
          { 
            error: '请求参数无效',
            message: '宽高比格式不正确'
          },
          { status: 400 }
        )
      }

      if (options.seed && typeof options.seed !== 'number') {
        return NextResponse.json(
          { 
            error: '请求参数无效',
            message: '随机种子必须为数字'
          },
          { status: 400 }
        )
      }

      // Validate aspect ratio
      if (options.aspectRatio) {
        const supportedRatios = imageGeneratorService.getSupportedAspectRatios()
        if (!supportedRatios.includes(options.aspectRatio)) {
          return NextResponse.json(
            { 
              error: '不支持的宽高比',
              message: `支持的宽高比：${supportedRatios.join(', ')}`
            },
            { status: 400 }
          )
        }
      }
    }

    // Since Google Gemini doesn't support image generation, return an appropriate error
    return NextResponse.json(
      { 
        error: 'Image generation not supported',
        message: 'Google Gemini API does not support image generation. Gemini models are text-only. To enable image generation, please configure a different AI provider that supports image generation (such as OpenAI DALL-E, Stability AI, etc.).'
      },
      { status: 501 } // 501 Not Implemented
    )

  } catch (error) {
    console.error('Image generation API error:', error)
    
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