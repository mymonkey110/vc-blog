import Link from 'next/link'
import { notFound } from 'next/navigation'
import prisma from '@/lib/db'
import { serialize } from 'next-mdx-remote/serialize'
import MarkdownRenderer from '@/components/MarkdownRenderer'
import { toSlug } from '@/utils/slug'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'

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

  const serializedContent = await serialize(article.content, {
    mdxOptions: { format: 'md', remarkPlugins: [remarkGfm], rehypePlugins: [rehypeRaw] },
  })

  const formattedDate = article.createdAt
    ? new Date(article.createdAt).toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : ''

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <header className="flex items-center justify-between border-b border-background px-10 py-3 whitespace-nowrap">
        <div className="flex items-center gap-4 text-primary-text">
          <div className="size-4">
            <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path
                clipRule="evenodd"
                d="M39.475 21.6262C40.358 21.4363 40.6863 21.5589 40.7581 21.5934C40.7876 21.655 40.8547 21.857 40.8082 22.3336C40.7408 23.0255 40.4502 24.0046 39.8572 25.2301C38.6799 27.6631 36.5085 30.6631 33.5858 33.5858C30.6631 36.5085 27.6632 38.6799 25.2301 39.8572C24.0046 40.4502 23.0255 40.7407 22.3336 40.8082C21.8571 40.8547 21.6551 40.7875 21.5934 40.7581C21.5589 40.6863 21.4363 40.358 21.6262 39.475C21.8562 38.4054 22.4689 36.9657 23.5038 35.2817C24.7575 33.2417 26.5497 30.9744 28.7621 28.762C30.9744 26.5497 33.2417 24.7574 35.2817 23.5037C36.9657 22.4689 38.4054 21.8562 39.475 21.6262ZM4.41189 29.2403L18.7597 43.5881C19.8813 44.7097 21.4027 44.9179 22.7217 44.7893C24.0585 44.659 25.5148 44.1631 26.9723 43.4579C29.9052 42.0387 33.2618 39.5667 36.4142 36.4142C39.5667 33.2618 42.0387 29.9052 43.4579 26.9723C44.1631 25.5148 44.659 24.0585 44.7893 22.7217C44.9179 21.4027 44.7097 19.8813 43.5881 18.7597L29.2403 4.41187C27.8527 3.02428 25.8765 3.02573 24.2861 3.36776C22.6081 3.72863 20.7334 4.58419 18.8396 5.74801C16.4978 7.18716 13.9881 9.18353 11.5858 11.5858C9.18354 13.988 7.18717 16.4978 5.74802 18.8396C4.58421 20.7334 3.72865 22.6081 3.36778 24.2861C3.02574 25.8765 3.02429 27.8527 4.41189 29.2403Z"
                fill="currentColor"
                fillRule="evenodd"
              />
            </svg>
          </div>
          <h2 className="text-lg font-bold leading-tight tracking-[-0.015em]">Blog</h2>
        </div>

        <div className="flex flex-1 justify-end gap-8">
          <div className="flex items-center gap-9">
            <Link href="/" className="text-sm font-medium leading-normal">首页</Link>
            <Link href="/categories" className="text-sm font-medium leading-normal">分类</Link>
            <Link href="/about" className="text-sm font-medium leading-normal">关于</Link>
          </div>
          <button className="flex h-10 min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg px-4 bg-background font-bold text-sm leading-normal tracking-[0.015em]">
            <span className="truncate">登录</span>
          </button>
        </div>
      </header>

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
            <MarkdownRenderer content={serializedContent as any} />
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

