import Link from 'next/link'
import prisma from '@/lib/db'
import { toSlug } from '@/utils/slug'
import { notFound } from 'next/navigation'

export const metadata = {
  title: '分类详情 - 修行码农',
  description: '查看该分类下的所有文章',
}

export const dynamic = 'force-static'

export async function generateStaticParams() {
  // 生成所有分类的静态参数
  const categories = await prisma.article.groupBy({
    by: ['category'],
    where: {
      AND: [
        { category: { not: null } },
        { category: { not: '' } },
      ],
    },
  })

  return categories.map((category) => ({
    name: category.category as string,
  }))
}

export default async function CategoryPage({ params }: { params: Promise<{ name: string }> }) {
  // 确保 params.name 存在
  const categoryName = (await params).name ? decodeURIComponent((await params).name) : ''
  if (categoryName == null || categoryName === '') {
    return notFound()
  }

  const articles = await prisma.article.findMany({
    select: {
      id: true,
      title: true,
      createdAt: true,
    },
    where: {
      category: categoryName,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })


  // 按年份分组
  const articlesByYear: Record<string, typeof articles> = {}

  articles.forEach((article) => {
    // 确保 article.createdAt 存在
    if (article.createdAt) {
      const year = article.createdAt.getFullYear().toString()
      if (!articlesByYear[year]) {
        articlesByYear[year] = []
      }
      articlesByYear[year].push(article)
    }
  })

  // 按年份降序排序
  const sortedYears = Object.keys(articlesByYear).sort((a, b) => parseInt(b) - parseInt(a))

  return (
    <div className="flex flex-1 justify-center px-40 py-5">
      <div className="flex max-w-[960px] flex-1 flex-col">
        <div className="flex flex-wrap justify-between gap-3 mb-8">
          <div className="flex flex-col gap-2">
            <h1 className="title-1">{categoryName}</h1>
            <p className="text-secondary-text font-body">此分类下共有 {articles.length} 篇文章</p>
          </div>
        </div>

        <div className="space-y-10">
          {sortedYears.map((year) => (
            <div key={year} className="relative space-y-4">
              <h2 className="sticky top-0 text-xl font-bold bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm py-2 z-10 font-heading">
                {year}
              </h2>
              <div className="space-y-3 pl-5 border-l-2 border-border">
                {articlesByYear[year].map((article) => (
                  <Link
                    key={article.id}
                    href={`/article/${article.createdAt.getUTCFullYear()}/${String(article.createdAt.getUTCMonth() + 1).padStart(2, '0')}/${String(article.createdAt.getUTCDate()).padStart(2, '0')}/${toSlug(article.title)}`}
                    className="flex flex-wrap items-baseline gap-x-4 py-2 transition-colors hover:text-primary dark:hover:text-primary"
                  >
                    <p className="text-base font-medium leading-normal grow font-heading">{article.title}</p>
                    <p className="text-sm font-normal text-secondary-text font-body">
                      {String(article.createdAt.getUTCMonth() + 1).padStart(2, '0')}-{String(article.createdAt.getUTCDate()).padStart(2, '0')}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
