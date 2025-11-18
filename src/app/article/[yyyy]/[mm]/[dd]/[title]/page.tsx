import Link from 'next/link'
import { notFound } from 'next/navigation'
import prisma from '@/lib/db'
import MarkdownRenderer from '@/components/MarkdownRenderer'
import NavigationBarWrapper from '@/components/NavigationBarWrapper'
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
    <div className="min-h-screen flex flex-col bg-white">
      <NavigationBarWrapper />

      <main className="flex flex-1 justify-center px-4 py-12">
        <div className="max-w-3xl w-full">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">{article.title}</h1>
            <div className="text-sm text-gray-600">{formattedDate}</div>
          </div>

          {article.description && (
            <div className="mb-8 text-lg text-gray-700 border-l-4 border-background pl-4 italic">
              {article.description}
            </div>
          )}

          <div className="mb-12">
            <MarkdownRenderer content={article.content} />
          </div>

          <div className="mt-16 pt-8 border-t border-background">
            <h3 className="text-xl font-bold mb-6">评论</h3>
            <div className="text-gray-500 italic">评论功能正在开发中...</div>
          </div>
        </div>
      </main>

      <footer className="border-t border-background py-8 px-10 text-center text-sm text-gray-600">
        <p>© {new Date().getFullYear()} 博客. 保留所有权利.</p>
      </footer>
    </div>
  )
}

