import { NextResponse } from 'next/server'
import RSS from 'rss'
import prisma from '@/lib/db'

export async function GET() {
  const feed = new RSS({
    title: '修行路上的码农——Michael.J',
    description: '欢迎来到我的技术博客，主要分享我对代码、技术、团队和生活的理解',
    feed_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/rss.xml`,
    site_url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    language: 'zh-CN',
    pubDate: new Date(),
  })

  const articles = await prisma.article.findMany({
    select: {
      id: true,
      title: true,
      description: true,
      content: true,
      createdAt: true,
      slug: true,
    },
    orderBy: { createdAt: 'desc' },
    take: 20,
  })

  articles.forEach((article) => {
    const date = article.createdAt || new Date()
    const year = date.getUTCFullYear()
    const month = String(date.getUTCMonth() + 1).padStart(2, '0')
    const day = String(date.getUTCDate()).padStart(2, '0')
    const slug = article.slug || ''

    feed.item({
      title: article.title,
      description: article.description || article.content.substring(0, 200) + '...',
      url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/article/${year}/${month}/${day}/${slug}`,
      date: date,
    })
  })

  const xml = feed.xml({ indent: true })

  return new NextResponse(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  })
}
