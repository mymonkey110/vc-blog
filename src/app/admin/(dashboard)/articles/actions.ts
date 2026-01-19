'use server';

import prisma from '@/lib/db';
import { cookies } from 'next/headers';
import { verifySession } from '@/actions/auth';

// Helper function to verify authentication for Server Actions
async function requireAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;

  if (!token || !(await verifySession(token))) {
    throw new Error('未授权访问');
  }
}

// 获取文章列表
export async function getArticles(pageNumber: number = 1, pageSize: number = 10) {
  await requireAuth();
  try {
    const skip = (pageNumber - 1) * pageSize;

    const [articles, totalCount] = await Promise.all([
      prisma.article.findMany({
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: pageSize,
      }),
      prisma.article.count(),
    ]);

    return {
      articles,
      totalCount,
      pageNumber,
      pageSize,
      totalPages: Math.ceil(totalCount / pageSize),
    };
  } catch (error) {
    console.error('Failed to get articles:', error);
    throw new Error('获取文章列表失败');
  }
}

// 根据ID获取文章
export async function getArticleById(id: string) {
  await requireAuth();
  try {
    const article = await prisma.article.findUnique({
      where: {
        id,
      },
    });
    return article;
  } catch (error) {
    console.error(`Failed to get article ${id}:`, error);
    throw new Error('获取文章失败');
  }
}

// 更新文章
export async function updateArticle(
  id: string,
  data: {
    title: string;
    category?: string;
    description?: string;
    content: string;
    status?: 'draft' | 'publish';
    coverPic?: string;
  },
) {
  await requireAuth();
  try {
    const updatedArticle = await prisma.article.update({
      where: {
        id,
      },
      data: {
        title: data.title.trim(),
        category: data.category?.trim() || null,
        description: data.description?.trim() || null,
        content: data.content.trim(),
        status: data.status || 'publish',
        coverPic: data.coverPic?.trim() || null,
      },
    });
    return updatedArticle;
  } catch (error) {
    console.error(`Failed to update article ${id}:`, error);
    throw new Error('更新文章失败');
  }
}

// 创建文章
export async function createArticle(data: {
  title: string;
  category?: string;
  description?: string;
  content: string;
  status?: 'draft' | 'publish';
  coverPic?: string;
}) {
  await requireAuth();
  try {
    const newArticle = await prisma.article.create({
      data: {
        title: data.title.trim(),
        category: data.category?.trim() || null,
        description: data.description?.trim() || null,
        content: data.content.trim(),
        status: data.status || 'publish',
        coverPic: data.coverPic?.trim() || null,
      },
    });
    return newArticle;
  } catch (error) {
    console.error('Failed to create article:', error);
    throw new Error('创建文章失败');
  }
}

// 删除文章
export async function deleteArticle(id: string) {
  await requireAuth();
  try {
    await prisma.article.delete({
      where: {
        id,
      },
    });
    return true;
  } catch (error) {
    console.error(`Failed to delete article ${id}:`, error);
    throw new Error('删除文章失败');
  }
}
