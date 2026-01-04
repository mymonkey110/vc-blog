import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { cookies } from 'next/headers';
import { verifySession } from '@/actions/auth';
import { validateAndSanitizeCoverImageUrl } from '@/utils/validation';

interface ArticleData {
  title: string;
  category?: string;
  description?: string;
  content: string;
  coverPic?: string;
}

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;

  if (!token || !(await verifySession(token))) {
    return NextResponse.json({ success: false, message: 'authenticate failed' }, { status: 403 });
  }

  try {
    const { id: articleId } = await params;

    const article = await prisma.article.findUnique({
      where: {
        id: articleId,
      },
    });

    if (!article) {
      return NextResponse.json({ error: '文章不存在' }, { status: 404 });
    }

    return NextResponse.json({ article }, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch article:', error);
    return NextResponse.json({ error: '获取文章失败，请重试' }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;

  if (!token || !(await verifySession(token))) {
    return NextResponse.json({ success: false, message: 'authenticate failed' }, { status: 403 });
  }

  try {
    const { id: articleId } = await params;
    const data: ArticleData = await req.json();

    if (!data.title.trim() || !data.content.trim()) {
      return NextResponse.json({ error: '标题和内容不能为空' }, { status: 400 });
    }

    // Validate and sanitize cover image URL
    const sanitizedCoverPic = validateAndSanitizeCoverImageUrl(data.coverPic);
    
    // If coverPic was provided but is invalid, return error
    if (data.coverPic && !sanitizedCoverPic) {
      return NextResponse.json({ error: '封面图片URL格式无效' }, { status: 400 });
    }

    const article = await prisma.article.update({
      where: {
        id: articleId,
      },
      data: {
        title: data.title.trim(),
        category: data.category?.trim() || null,
        description: data.description?.trim() || null,
        content: data.content.trim(),
        coverPic: sanitizedCoverPic,
      },
    });

    return NextResponse.json({ success: true, article }, { status: 200 });
  } catch (error) {
    console.error('Failed to update article:', error);
    return NextResponse.json({ error: '更新文章失败，请重试' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;

  if (!token || !(await verifySession(token))) {
    return NextResponse.json({ success: false, message: 'authenticate failed' }, { status: 403 });
  }

  try {
    const { id: articleId } = await params;

    await prisma.article.delete({
      where: {
        id: articleId,
      },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Failed to delete article:', error);
    return NextResponse.json({ error: '删除文章失败，请重试' }, { status: 500 });
  }
}
