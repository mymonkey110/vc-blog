import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { cookies } from 'next/headers';
import { verifySession } from '@/actions/auth';

interface ArticleData {
  title: string;
  category?: string;
  description?: string;
  content: string;
}

export async function POST(req: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;

  if (!token || !(await verifySession(token))) {
    return NextResponse.json({ success: false, message: 'authenticate failed' }, { status: 403 });
  }

  try {
    const data: ArticleData = await req.json();

    if (!data.title.trim() || !data.content.trim()) {
      return NextResponse.json({ error: '标题和内容不能为空' }, { status: 400 });
    }

    const article = await prisma.article.create({
      data: {
        title: data.title.trim(),
        category: data.category?.trim() || null,
        description: data.description?.trim() || null,
        content: data.content.trim(),
      },
    });

    return NextResponse.json({ success: true, article }, { status: 201 });
  } catch (error) {
    console.error('Failed to create article:', error);
    return NextResponse.json({ error: '创建文章失败，请重试' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;

  if (!token || !(await verifySession(token))) {
    return NextResponse.json({ success: false, message: 'authenticate failed' }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const pageSize = parseInt(searchParams.get('pageSize') || '10');
    const pageNumber = parseInt(searchParams.get('pageNumber') || '1');

    const validPageSizes = [10, 20, 50];
    const finalPageSize = validPageSizes.includes(pageSize) ? pageSize : 10;

    const whereClause = category ? { category } : {};
    const skip = (pageNumber - 1) * finalPageSize;

    const [articles, total] = await Promise.all([
      prisma.article.findMany({
        where: whereClause,
        orderBy: { createdAt: 'desc' },
        take: finalPageSize,
        skip: skip,
      }),
      prisma.article.count({ where: whereClause }),
    ]);

    return NextResponse.json(
      {
        articles,
        total,
        pageNumber,
        pageSize: finalPageSize,
        totalPages: Math.ceil(total / finalPageSize),
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('Failed to fetch articles:', error);
    return NextResponse.json({ error: '获取文章列表失败，请重试' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;

  if (!token || !(await verifySession(token))) {
    return NextResponse.json({ success: false, message: 'authenticate failed' }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: '文章ID不能为空' }, { status: 400 });
    }

    await prisma.article.delete({
      where: { id },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Failed to delete article:', error);
    return NextResponse.json({ error: '删除文章失败，请重试' }, { status: 500 });
  }
}
