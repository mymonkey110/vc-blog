import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifySession } from '@/actions/auth';
import { handleUpload } from '@vercel/blob/client';

export async function POST(req: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;

  if (!token || !(await verifySession(token))) {
    return NextResponse.json({ success: false, message: 'authenticate failed' }, { status: 403 });
  }

  try {
    const body = await req.json();

    const jsonResponse = await handleUpload({
      body,
      request: req,
      onBeforeGenerateToken: async (pathname, clientPayload, multipart) => {
        return {
          allowedContentTypes: [
            'image/jpeg',
            'image/jpg',
            'image/png',
            'image/gif',
            'image/webp',
            'image/svg+xml',
          ],
          maximumSizeInBytes: 5 * 1024 * 1024,
        };
      },
      onUploadCompleted: async ({ blob }) => {
        console.log(`Blob upload completed: ${blob.url}`);
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    console.error('Failed to upload image:', error);
    return NextResponse.json({ error: '图片上传失败，请重试' }, { status: 500 });
  }
}
