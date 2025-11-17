import Link from 'next/link'
import Image from 'next/image'
import prisma from '@/lib/db'
import { toSlug } from '@/utils/slug'
import Pagination from '@/components/pagination'
import NavigationBarWrapper from '@/components/NavigationBarWrapper'
import type { ArticleMeta } from '@/types/article'

const formatUrlTitle = (text: string): string => {
  return toSlug(text.toString())
}

// 强制静态生成
export const dynamic = 'force-static'
// 设置重新生成时间（秒）
export const revalidate = 3600 // 每小时重新生成一次

// 生成静态参数 - 为所有可能的分页页面生成静态路径
export async function generateStaticParams() {
  const pageSize = 10
  const totalCount = await prisma.article.count()
  const totalPages = Math.ceil(totalCount / pageSize)
  
  // 为每一页生成静态参数
  const params = []
  for (let page = 1; page <= totalPages; page++) {
    params.push({
      page: page.toString()
    })
  }
  
  return params
}

export default async function Page({ searchParams }: { searchParams?: Promise<{ page?: string }> }) {
  const sp = (await searchParams) ?? {}
  const page = sp.page ? Number(sp.page) : 1
  const currentPage = Math.max(1, isNaN(page) ? 1 : page)
  const pageSize = 10
  const offset = (currentPage - 1) * pageSize

  const totalCount = await prisma.article.count()
  const totalPages = Math.ceil(totalCount / pageSize)

  const dbArticles = await prisma.article.findMany({
    select: {
      id: true,
      title: true,
      description: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'desc' },
    skip: offset,
    take: pageSize,
  })

  const articles: ArticleMeta[] = dbArticles.map((article) => ({
    id: article.id,
    title: article.title,
    excerpt: article.description || '',
    date: article.createdAt?.toISOString() || new Date().toISOString(),
    categories: [],
    imageUrl: '',
    imageAlt: '',
  }))

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <NavigationBarWrapper />

      <div className="flex flex-1 justify-center px-40 py-5">
        <div className="flex max-w-[960px] flex-1 flex-col">
          <h2 className="px-4 py-3 pt-5 text-2xl font-bold leading-tight tracking-[-0.015em]">最新文章</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-4">
            {articles.map((article) => (
              <article key={article.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                <div className="relative h-48 bg-gray-200 dark:bg-gray-700">
                  {article.imageUrl && (
                    <Image
                      src={article.imageUrl}
                      alt={article.imageAlt || article.title}
                      fill
                      className="object-cover"
                      priority
                    />
                  )}
                </div>
                <div className="p-6">
                  <div className="flex flex-wrap gap-2 mb-2">
                    {article.categories?.map((category, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                  <h2 className="text-xl font-bold mb-2">
                    <Link href={`/article/${new Date(article.date).getUTCFullYear()}/${String(new Date(article.date).getUTCMonth() + 1).padStart(2, '0')}/${String(new Date(article.date).getUTCDate()).padStart(2, '0')}/${formatUrlTitle(article.title)}`} className="hover:text-blue-500 transition-colors">
                      {article.title}
                    </Link>
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">{article.excerpt || '阅读更多...'}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500 dark:text-gray-500">{article.date ? new Date(article.date).toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' }) : ''}</span>
                    <Link
                      href={`/article/${new Date(article.date).getUTCFullYear()}/${String(new Date(article.date).getUTCMonth() + 1).padStart(2, '0')}/${String(new Date(article.date).getUTCDate()).padStart(2, '0')}/${formatUrlTitle(article.title)}`}
                      className="text-sm font-medium text-blue-500 hover:text-blue-600 transition-colors"
                    >
                      阅读更多
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <Pagination currentPage={currentPage} totalPages={totalPages} basePath="/" />
        </div>
      </div>
    </div>
  )
}
