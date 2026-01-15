import BlogList from '@/components/BlogList'

export const metadata = {
  title: '修行路上的码农——Michael.J',
  description: '欢迎来到我的技术博客，主要分享我对代码、技术、团队和生活的理解',
}

export const dynamic = 'force-static'



export default async function Page() {
  return (
    <>
      <BlogList currentPage={1} />
    </>
  )
}
