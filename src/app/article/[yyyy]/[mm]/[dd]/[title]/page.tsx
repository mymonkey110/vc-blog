import { notFound } from 'next/navigation'
import prisma from '@/lib/db'
import MarkdownRenderer from '@/components/MarkdownRenderer'
import { toSlug } from '@/utils/slug'

export async function generateStaticParams() {
  const articles = await prisma.article.findMany({
    select: { title: true, createdAt: true },
  })

  return articles.flatMap((article) => {
    if (!article.createdAt || !article.title) return []
    const d = new Date(article.createdAt)
    const yyyy = d.getUTCFullYear().toString()
    const mm = String(d.getUTCMonth() + 1).padStart(2, '0')
    const dd = String(d.getUTCDate()).padStart(2, '0')
    return [{ yyyy, mm, dd, title: toSlug(article.title) }]
  })
}

// 动态生成metadata
export async function generateMetadata({
  params,
}: {
  params: Promise<{ yyyy: string; mm: string; dd: string; title: string }>
}): Promise<import('next').Metadata> {
  const p = await params
  const yearNum = Number(p.yyyy)
  const monthNum = Number(p.mm)
  const dayNum = Number(p.dd)
  const decodedTitle = decodeURIComponent(p.title)

  if (!Number.isInteger(yearNum) || !Number.isInteger(monthNum) || !Number.isInteger(dayNum)) {
    return {
      title: '文章未找到 - 博客',
    }
  }

  const dayStart = new Date(Date.UTC(yearNum, monthNum - 1, dayNum, 0, 0, 0))
  const dayEnd = new Date(Date.UTC(yearNum, monthNum - 1, dayNum + 1, 0, 0, 0))

  const titleMatched = await prisma.article.findMany({
    where: { createdAt: { gte: dayStart, lt: dayEnd } },
  })

  const article = titleMatched.find((article) => {
    if (!article.title || !article.createdAt) return false
    const d = new Date(article.createdAt)
    return (
      toSlug(article.title) === decodedTitle &&
      d.getUTCFullYear() === yearNum &&
      d.getUTCMonth() + 1 === monthNum &&
      d.getUTCDate() === dayNum
    )
  })

  if (!article) {
    return {
      title: '文章未找到 - 博客',
    }
  }

  return {
    title: `${article.title} - 修行码农`,
    description: article.description || `阅读文章：${article.title}`,
    openGraph: {
      title: article.title,
      description: article.description || `阅读文章：${article.title}`,
      type: 'article',
      publishedTime: article.createdAt?.toISOString(),
    },
  }
}

export default async function Page({
  params,
}: {
  params: Promise<{ yyyy: string; mm: string; dd: string; title: string }>
}) {
  const p = await params
  const yearNum = Number(p.yyyy)
  const monthNum = Number(p.mm)
  const dayNum = Number(p.dd)
  const decodedTitle = decodeURIComponent(p.title)

  if (!Number.isInteger(yearNum) || !Number.isInteger(monthNum) || !Number.isInteger(dayNum)) {
    return notFound()
  }
  if (yearNum < 1970 || monthNum < 1 || monthNum > 12 || dayNum < 1 || dayNum > 31) {
    return notFound()
  }

  const dayStart = new Date(Date.UTC(yearNum, monthNum - 1, dayNum, 0, 0, 0))
  const dayEnd = new Date(Date.UTC(yearNum, monthNum - 1, dayNum + 1, 0, 0, 0))

  const titleMatched = await prisma.article.findMany({
    where: { createdAt: { gte: dayStart, lt: dayEnd } },
  })

  const article = titleMatched.find((article) => {
    if (!article.title || !article.createdAt) return false
    const d = new Date(article.createdAt)
    return (
      toSlug(article.title) === decodedTitle &&
      d.getUTCFullYear() === yearNum &&
      d.getUTCMonth() + 1 === monthNum &&
      d.getUTCDate() === dayNum
    )
  })

  if (!article) {
    return notFound()
  }

  if (!article.content || !article.content.trim()) {
    throw new Error(`文章内容为空，无法渲染: id=${article.id}`)
  }

  // 直接使用原始内容，不需要序列化
  const formattedDate = article.createdAt
    ? new Date(article.createdAt).toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : ''

  return (
    <main className="flex flex-1 justify-center px-4 py-12">
      <div className="max-w-3xl w-full">
          <div className="mb-8">
            <h1 className="title-1 mb-4 leading-tight">{article.title}</h1>
            <div className="text-sm font-ui text-secondary-text">{formattedDate}</div>
          </div>

          {article.description && (
            <div className="mb-8 text-lg font-body text-secondary-text border-l-4 border-accent/20 pl-4 italic reading-optimized">
              {article.description}
            </div>
          )}

          <div className="mb-12">
            <MarkdownRenderer content={article.content} />
          </div>

          <div className="mt-16 pt-8 border-t border-border">
            <h3 className="title-3 mb-6">评论</h3>
            <div className="text-sm font-ui text-secondary-text italic">评论功能正在开发中...</div>
          </div>
        </div>
      </main>
    )
  }

