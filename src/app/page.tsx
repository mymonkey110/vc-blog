import Link from 'next/link'
import Image from 'next/image'
import prisma from '@/lib/db'
import { toSlug } from '@/utils/slug'
import Pagination from '@/components/pagination'
import NavigationBarWrapper from '@/components/NavigationBarWrapper'
import type { ArticleMeta } from '@/types/article'

export const metadata = {
  title: '修行码农的博客',
  description: '欢迎来到我的技术博客，主要分享我对代码、技术、团队和生活的理解',
}

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

          <div className="grid gap-8 p-4">
            {articles.map((article) => (
              <div key={article.id} className="flex flex-col sm:flex-row items-start gap-4 py-4">
                <div className="flex flex-col gap-2 flex-1">
                  <h2 className="text-gray-900 text-2xl font-bold leading-tight">
                    <Link 
                      href={`/article/${new Date(article.date).getUTCFullYear()}/${String(new Date(article.date).getUTCMonth() + 1).padStart(2, '0')}/${String(new Date(article.date).getUTCDate()).padStart(2, '0')}/${formatUrlTitle(article.title)}`} 
                      className="hover:text-blue-600 transition-colors"
                    >
                      {article.title}
                    </Link>
                  </h2>
                  
                  <p className="text-gray-900 text-base font-normal leading-normal">
                    {article.excerpt || '阅读更多...'}
                  </p>
                  
                  <div className="flex flex-wrap items-center gap-2 pt-2">
                    <span className="text-gray-500 text-xs font-light">
                      {article.date ? new Date(article.date).toLocaleDateString('zh-CN', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      }) : ''}
                    </span>
                    <span className="text-gray-500 text-xs font-light">•</span>
                    {/* 分类标签位置 - 暂时隐藏但保留位置 */}
                    <a className="text-gray-500 text-xs font-light" href="#">分类</a>
                    <a className="text-gray-500 text-xs font-light" href="#">标签</a>
                  </div>
                </div>
                
                <div className="flex-shrink-0 w-full sm:w-[200px] h-auto aspect-[3/2]">
                  <div className="w-full h-full bg-gray-200 rounded">
                    {article.imageUrl && (
                      <Image
                        src={article.imageUrl}
                        alt={article.imageAlt || article.title}
                        fill
                        className="object-cover rounded"
                        priority
                      />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Pagination currentPage={currentPage} totalPages={totalPages} basePath="/" />
        </div>
      </div>
    </div>
  )
}
