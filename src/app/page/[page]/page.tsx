import prisma from '@/lib/db'
import { toSlug } from '@/utils/slug'
import BlogList from '@/components/BlogList'
import { notFound } from 'next/navigation';

export const metadata = {
  title: '修行路上的码农——Michael.J',
  description: '欢迎来到我的技术博客，主要分享我对代码、技术、团队和生活的理解',
}

export const dynamic = 'force-static'

const pageSize = 10;

// 生成静态参数 - 为所有可能的分页页面生成静态路径
export async function generateStaticParams() {
  const totalCount = await prisma.article.count()
  const totalPages = Math.ceil(totalCount / pageSize)

  // 为每一页生成静态参数
  const params = []
  for (let page = 2; page <= totalPages; page++) {
    params.push({
      page: page.toString(),
    })
  }

  return params
}

export default async function Page({ params }: { params: Promise<{ page: string }> }) {
  const currentPage = parseInt((await params).page, 10)
  // 简单校验：如果不是数字，或者小于 2（因为第1页是首页）
  if (!currentPage || currentPage < 2) {
    notFound();
  }

   const total = await prisma.article.count()
  const totalPages = Math.ceil(total / pageSize)
  // 简单校验：如果当前页大于总页数，返回404
  if (currentPage > totalPages) {
    notFound();
  }

  return <BlogList currentPage={currentPage} />
}
