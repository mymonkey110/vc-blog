import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { generateImageFromPollinationsServer } from '@/lib/image-generator-service';
import { verifySession } from '@/actions/auth';

export const runtime = 'nodejs';
export const maxDuration = 30; // 30 seconds timeout for AI generation

const MAX_RETRIES = 3;
const RETRY_DELAY = 2000; // 2 seconds between retries

export async function POST(request: NextRequest) {
  // Authentication check
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;

  if (!token || !(await verifySession(token))) {
    return NextResponse.json({ success: false, message: 'authenticate failed' }, { status: 403 });
  }

  const startTime = Date.now();
  let attempt = 0;
  let lastError: Error | null = null;

  try {
    const body = await request.json();
    const { prompt, options } = body;

    // Validate request
    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json({ success: false, error: '提示词不能为空' }, { status: 400 });
    }

    if (prompt.length > 1000) {
      return NextResponse.json(
        { success: false, error: `提示词过长（${prompt.length}字符），最多1000字符` },
        { status: 400 },
      );
    }

    console.log('[AI Image Generate] Request received:', {
      promptLength: prompt.length,
      options: options || {},
      timestamp: new Date().toISOString(),
    });

    // Retry logic
    while (attempt < MAX_RETRIES) {
      attempt++;

      try {
        console.log(`[AI Image Generate] Attempt ${attempt}/${MAX_RETRIES}`, {
          prompt: prompt.slice(0, 50) + '...',
        });

        const result = await generateImageFromPollinationsServer(prompt, options);

        if (!result.base64Data) {
          throw new Error('Generated image data is empty');
        }

        const duration = Date.now() - startTime;
        console.log('[AI Image Generate] Success:', {
          attempt,
          duration,
          imageSize: result.base64Data.length,
        });

        return NextResponse.json({
          success: true,
          data: result,
          metadata: {
            attempt,
            duration,
            timestamp: new Date().toISOString(),
          },
        });
      } catch (error) {
        lastError = error as Error;

        console.error(`[AI Image Generate] Attempt ${attempt} failed:`, {
          error: lastError.message,
          stack: lastError.stack,
          willRetry: attempt < MAX_RETRIES,
        });

        // Don't retry on client errors (4xx)
        if (lastError.message.includes('400') || lastError.message.includes('403')) {
          console.log('[AI Image Generate] Client error, not retrying');
          break;
        }

        // Wait before retry (except on last attempt)
        if (attempt < MAX_RETRIES) {
          console.log(`[AI Image Generate] Waiting ${RETRY_DELAY}ms before retry...`);
          await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
        }
      }
    }

    // All retries failed
    const duration = Date.now() - startTime;

    console.error('[AI Image Generate] All retries failed:', {
      attempts: attempt,
      duration,
      error: lastError?.message,
    });

    // Return user-friendly error message
    let errorMessage = '图片生成失败，请稍后重试';

    if (lastError?.message.includes('timeout')) {
      errorMessage = '图片生成超时，请稍后重试或检查网络连接';
    } else if (lastError?.message.includes('403')) {
      errorMessage = 'API 访问受限，请稍后重试';
    } else if (lastError?.message.includes('network')) {
      errorMessage = '网络连接失败，请检查网络设置';
    }

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        metadata: {
          attempts: attempt,
          attemptsExhausted: attempt >= MAX_RETRIES,
          duration,
          timestamp: new Date().toISOString(),
          lastError: lastError?.message,
        },
      },
      { status: 500 },
    );
  } catch (error) {
    const duration = Date.now() - startTime;

    console.error('[AI Image Generate] Unhandled error:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      duration,
    });

    if (error instanceof Error && error.name === 'AbortError') {
      console.error('[AI Image Generate] Request aborted:', { duration });
      return NextResponse.json(
        {
          success: false,
          error: '请求超时，请稍后重试',
          metadata: {
            duration,
            timestamp: new Date().toISOString(),
          },
        },
        { status: 504 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: '服务器内部错误，请稍后重试',
        metadata: {
          duration,
          timestamp: new Date().toISOString(),
        },
      },
      { status: 500 },
    );
  }
}
