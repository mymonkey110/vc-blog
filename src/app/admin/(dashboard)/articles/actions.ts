'use server'

import prisma from '@/lib/db'

// 获取文章列表
export async function getArticles(pageNumber: number = 1, pageSize: number = 10) {
  try {
    const skip = (pageNumber - 1) * pageSize
    
    const [articles, totalCount] = await Promise.all([
      prisma.article.findMany({
        orderBy: {
          createdAt: 'desc'
        },
        skip,
        take: pageSize
      }),
      prisma.article.count()
    ])
    
    return {
      articles,
      totalCount,
      pageNumber,
      pageSize,
      totalPages: Math.ceil(totalCount / pageSize)
    }
  } catch (error) {
    console.error('Failed to get articles:', error)
    throw new Error('获取文章列表失败')
  }
}

// 根据ID获取文章
export async function getArticleById(id: string) {
  try {
    const article = await prisma.article.findUnique({
      where: {
        id
      }
    })
    return article
  } catch (error) {
    console.error(`Failed to get article ${id}:`, error)
    throw new Error('获取文章失败')
  }
}

// 更新文章
export async function updateArticle(id: string, data: {
  title: string
  category?: string
  description?: string
  content: string
  status?: 'draft' | 'publish'
  coverPic?: string
}) {
  try {
    const updatedArticle = await prisma.article.update({
      where: {
        id
      },
      data: {
        title: data.title.trim(),
        category: data.category?.trim() || null,
        description: data.description?.trim() || null,
        content: data.content.trim(),
        status: data.status || 'publish',
        coverPic: data.coverPic?.trim() || null
      }
    })
    return updatedArticle
  } catch (error) {
    console.error(`Failed to update article ${id}:`, error)
    throw new Error('更新文章失败')
  }
}

// 创建文章
export async function createArticle(data: {
  title: string
  category?: string
  description?: string
  content: string
  status?: 'draft' | 'publish'
  coverPic?: string
}) {
  try {
    const newArticle = await prisma.article.create({
      data: {
        title: data.title.trim(),
        category: data.category?.trim() || null,
        description: data.description?.trim() || null,
        content: data.content.trim(),
        status: data.status || 'publish',
        coverPic: data.coverPic?.trim() || null
      }
    })
    return newArticle
  } catch (error) {
    console.error('Failed to create article:', error)
    throw new Error('创建文章失败')
  }
}
