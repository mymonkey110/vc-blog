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

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const category = searchParams.get('category')
    const limit = parseInt(searchParams.get('limit') || '10')
    const page = parseInt(searchParams.get('page') || '1')
    
    const whereClause = category ? { category } : {}
    const skip = (page - 1) * limit
    
    const [articles, total] = await Promise.all([
      prisma.article.findMany({
        where: whereClause,
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: skip
      }),
      prisma.article.count({ where: whereClause })
    ])
    
    return NextResponse.json({ articles, total }, { status: 200 })
  } catch (error) {
    console.error('Failed to fetch articles:', error)
    return NextResponse.json({ error: '获取文章列表失败，请重试' }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({ error: '文章ID不能为空' }, { status: 400 })
    }
    
    await prisma.article.delete({
      where: { id }
    })
    
    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error('Failed to delete article:', error)
    return NextResponse.json({ error: '删除文章失败，请重试' }, { status: 500 })
  }
}