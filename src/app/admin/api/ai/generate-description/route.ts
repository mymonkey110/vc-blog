/**
 * API Route: Generate Description with Server-Sent Events
 * Handles AI-powered description generation from article content with SSE streaming support
 */

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { streamText } from 'ai';
import { getTextModel, isAIConfigured } from '@/lib/ai-config';
import { verifySession } from '@/actions/auth';
import { validateTurnstile } from '@/lib/turnstile';

interface GenerateDescriptionRequest {
  content: string;
  customPrompt?: string;
  cfTurnstileResponse?: string;
}

export async function POST(request: NextRequest) {
  // Turnstile token validation for bot detection
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    console.error('TURNSTILE_SECRET_KEY environment variable is not set');
    return NextResponse.json({ success: false, message: '服务器配置错误' }, { status: 500 });
  }

  // Get Turnstile token from request body
  const body = await request.json();
  const { cfTurnstileResponse } = body as GenerateDescriptionRequest;

  if (!cfTurnstileResponse) {
    console.warn('Turnstile: No token provided');
    return NextResponse.json({ success: false, message: '请完成人机验证' }, { status: 400 });
  }

  const validation = await validateTurnstile(cfTurnstileResponse, secret);

  if (!validation.success) {
    console.warn('Turnstile validation failed:', validation.error);
    return NextResponse.json({ success: false, message: '人机验证失败' }, { status: 403 });
  }

  // Authentication check
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;

  if (!token || !(await verifySession(token))) {
    return NextResponse.json({ success: false, message: 'authenticate failed' }, { status: 403 });
  }

  try {
    // Check if AI services are configured
    if (!(await isAIConfigured())) {
      return new Response(
        JSON.stringify({
          error: 'AI服务未配置',
          message: 'AI服务未正确配置，请联系管理员',
        }),
        {
          status: 503,
          headers: { 'Content-Type': 'application/json' },
        },
      );
    }

    // Parse request body (already parsed above)
    const { content, customPrompt } = body as GenerateDescriptionRequest;

    // Validate request
    if (!content || typeof content !== 'string') {
      return new Response(
        JSON.stringify({
          error: '请求参数无效',
          message: '文章内容不能为空',
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        },
      );
    }

    if (content.trim().length === 0) {
      return new Response(
        JSON.stringify({
          error: '内容为空',
          message: '请提供文章内容以生成描述',
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        },
      );
    }

    if (customPrompt && typeof customPrompt !== 'string') {
      return new Response(
        JSON.stringify({
          error: '请求参数无效',
          message: '自定义提示词格式不正确',
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        },
      );
    }

    // Prepare the prompt
    const defaultPrompt =
      customPrompt || '请帮我总结文章内容，提取关键信息形成摘要，内容不要超过50个字。';
    const fullPrompt = `${defaultPrompt}\n\n文章内容：\n${content.substring(0, 2000)}`;

    // Get the text model from active provider
    const model = await getTextModel();

    // Stream the AI response using AI SDK 6's native SSE support
    const result = await streamText({
      model,
      prompt: fullPrompt,
      maxOutputTokens: 100, // Limit tokens for description
      temperature: 0.7,
    });

    // Return native Server-Sent Events response using AI SDK 6
    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error('Description generation API error:', error);

    // Handle JSON parsing errors
    if (error instanceof SyntaxError) {
      return new Response(
        JSON.stringify({
          error: '请求格式错误',
          message: '请求数据格式不正确',
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        },
      );
    }

    // Handle configuration errors
    if (error instanceof Error && error.message.includes('provider')) {
      return new Response(
        JSON.stringify({
          error: 'AI服务配置错误',
          message: 'AI服务提供商配置有误，请检查设置',
        }),
        {
          status: 503,
          headers: { 'Content-Type': 'application/json' },
        },
      );
    }

    // Handle other unexpected errors
    return new Response(
      JSON.stringify({
        error: '服务器错误',
        message: '服务器内部错误，请稍后重试',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  }
}

// Handle unsupported methods
export async function GET() {
  return new Response(
    JSON.stringify({
      error: '方法不支持',
      message: '此端点仅支持POST请求',
    }),
    {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    },
  );
}

export async function PUT() {
  return new Response(
    JSON.stringify({
      error: '方法不支持',
      message: '此端点仅支持POST请求',
    }),
    {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    },
  );
}

export async function DELETE() {
  return new Response(
    JSON.stringify({
      error: '方法不支持',
      message: '此端点仅支持POST请求',
    }),
    {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    },
  );
}
