/**
 * API Route: Generate Description
 * Handles AI-powered description generation from article content with streaming support
 */

import { NextRequest } from 'next/server'
import { streamText } from 'ai'
import { getTextModel, isAIConfigured } from '@/lib/ai-config'

interface GenerateDescriptionRequest {
  content: string
  customPrompt?: string
}

export async function POST(request: NextRequest) {
  try {
    // Check if AI services are configured
    if (!(await isAIConfigured())) {
      return new Response(
        JSON.stringify({ 
          error: 'AI服务未配置',
          message: 'AI服务未正确配置，请联系管理员'
        }),
        { 
          status: 503,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }

    // Parse request body
    const body: GenerateDescriptionRequest = await request.json()
    const { content, customPrompt } = body

    // Validate request
    if (!content || typeof content !== 'string') {
      return new Response(
        JSON.stringify({ 
          error: '请求参数无效',
          message: '文章内容不能为空'
        }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }

    if (content.trim().length === 0) {
      return new Response(
        JSON.stringify({ 
          error: '内容为空',
          message: '请提供文章内容以生成描述'
        }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }

    if (customPrompt && typeof customPrompt !== 'string') {
      return new Response(
        JSON.stringify({ 
          error: '请求参数无效',
          message: '自定义提示词格式不正确'
        }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }

    // Prepare the prompt
    const defaultPrompt = customPrompt || '请帮我总结文章内容，提取关键信息形成摘要，内容不要超过50个字。'
    const fullPrompt = `${defaultPrompt}\n\n文章内容：\n${content.substring(0, 2000)}`

    // Get the text model from active provider
    const model = await getTextModel()

    // Stream the response
    const result = await streamText({
      model,
      prompt: fullPrompt,
      maxOutputTokens: 100, // Limit tokens for description
      temperature: 0.7,
    })

    // Return streaming response
    return result.toTextStreamResponse()

  } catch (error) {
    console.error('Description generation API error:', error)
    
    // Handle JSON parsing errors
    if (error instanceof SyntaxError) {
      return new Response(
        JSON.stringify({ 
          error: '请求格式错误',
          message: '请求数据格式不正确'
        }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }

    // Handle configuration errors
    if (error instanceof Error && error.message.includes('provider')) {
      return new Response(
        JSON.stringify({ 
          error: 'AI服务配置错误',
          message: 'AI服务提供商配置有误，请检查设置'
        }),
        { 
          status: 503,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }

    // Handle other unexpected errors
    return new Response(
      JSON.stringify({ 
        error: '服务器错误',
        message: '服务器内部错误，请稍后重试'
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
}

// Handle unsupported methods
export async function GET() {
  return new Response(
    JSON.stringify({ 
      error: '方法不支持',
      message: '此端点仅支持POST请求'
    }),
    { 
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    }
  )
}

export async function PUT() {
  return new Response(
    JSON.stringify({ 
      error: '方法不支持',
      message: '此端点仅支持POST请求'
    }),
    { 
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    }
  )
}

export async function DELETE() {
  return new Response(
    JSON.stringify({ 
      error: '方法不支持',
      message: '此端点仅支持POST请求'
    }),
    { 
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    }
  )
}