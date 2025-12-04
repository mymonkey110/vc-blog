import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

interface ArticleData {
  title: string
  category?: string
  description?: string
  content: string
}

export async function POST(req: Request) {
  try {
    const data: ArticleData = await req.json()
    
    if (!data.title.trim() || !data.content.trim()) {
      return NextResponse.json({ error: '标题和内容不能为空' }, { status: 400 })
    }
    
    const article = await prisma.article.create({
      data: {
        title: data.title.trim(),
        category: data.category?.trim() || null,
        description: data.description?.trim() || null,
        content: data.content.trim()
      }
    })
    
    return NextResponse.json({ success: true, article }, { status: 201 })
  } catch (error) {
    console.error('Failed to create article:', error)
    return NextResponse.json({ error: '创建文章失败，请重试' }, { status: 500 })
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: articleId } = await params
    const data: ArticleData = await req.json()
    
    if (!data.title.trim() || !data.content.trim()) {
      return NextResponse.json({ error: '标题和内容不能为空' }, { status: 400 })
    }
    
    const article = await prisma.article.update({
      where: {
        id: articleId
      },
      data: {
        title: data.title.trim(),
        category: data.category?.trim() || null,
        description: data.description?.trim() || null,
        content: data.content.trim()
      }
    })
    
    return NextResponse.json({ success: true, article }, { status: 200 })
  } catch (error) {
    console.error('Failed to update article:', error)
    return NextResponse.json({ error: '更新文章失败，请重试' }, { status: 500 })
  }
}

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: articleId } = await params
    
    const article = await prisma.article.findUnique({
      where: {
        id: articleId
      }
    })
    
    if (!article) {
      return NextResponse.json({ error: '文章不存在' }, { status: 404 })
    }
    
    return NextResponse.json({ article }, { status: 200 })
  } catch (error) {
    console.error('Failed to fetch article:', error)
    return NextResponse.json({ error: '获取文章失败，请重试' }, { status: 500 })
  }
}