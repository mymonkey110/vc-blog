import Link from 'next/link'
import prisma from '@/lib/db'

export const metadata = {
  title: '分类 - 修行码农',
  description: '查看所有博客分类',
}

export const dynamic = 'force-static'

export default async function CategoriesPage() {
  // 查询所有分类及其文章数量，排除空分类
  const categories = await prisma.article.groupBy({
    by: ['category'],
    _count: {
      id: true,
    },
    where: {
      AND: [
        { category: { not: null } },
        { category: { not: '' } },
      ],
    },
    orderBy: {
      category: 'asc',
    },
  })

  return (
    <div className="flex flex-1 justify-center px-40 py-5">
      <div className="flex max-w-[960px] flex-1 flex-col">
        <div className="flex flex-wrap justify-between gap-3 mb-8">
          <div className="flex flex-col gap-2">
            <h1 className="title-1">分类</h1>
            <p className="text-secondary-text font-body">目前共计 {categories.length} 个分类</p>
          </div>
        </div>

        <div className="flex flex-col space-y-2">
          {categories.map((category) => {
            // 确保 category.category 存在且为字符串
            const catName = category.category as string
            if (!catName) return null
            
            return (
              <Link
                key={catName}
                href={`/categories/${encodeURIComponent(catName)}`}
                className="flex items-center gap-4 bg-surface-light dark:bg-surface-dark px-4 min-h-14 rounded-lg transition-all hover:bg-surface-subtle-light dark:hover:bg-surface-subtle-dark hover:shadow-sm"
              >
                <p className="text-lg font-medium leading-normal font-heading">
                  {catName}
                  <span className="ml-2 text-sm font-normal text-secondary-text font-body">
                    ({category._count?.id || 0})
                  </span>
                </p>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
