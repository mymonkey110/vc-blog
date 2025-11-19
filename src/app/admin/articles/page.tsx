'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import Sidebar from '@/pages/admin/components/Sidebar'

interface Article {
  id: string
  title: string
  status: 'published' | 'draft'
  publishDate: string
}

export default function ArticlesPage() {
  const [searchTerm, setSearchTerm] = useState('')

  const articles: Article[] = [
    { id: '1', title: '如何写出引人入胜的博客文章', status: 'published', publishDate: '2023-11-15' },
    { id: '2', title: '提升博客流量的实用技巧', status: 'draft', publishDate: '2023-11-10' },
    { id: '3', title: '博客写作工具推荐', status: 'published', publishDate: '2023-11-05' },
    { id: '4', title: '如何选择合适的博客主题', status: 'published', publishDate: '2023-10-30' },
    { id: '5', title: '博客文章排版技巧', status: 'published', publishDate: '2023-10-25' },
    { id: '6', title: '博客推广策略', status: 'published', publishDate: '2023-10-20' },
    { id: '7', title: '博客内容规划', status: 'published', publishDate: '2023-10-15' },
    { id: '8', title: '博客写作灵感来源', status: 'published', publishDate: '2023-10-10' },
    { id: '9', title: '博客SEO优化指南', status: 'published', publishDate: '2023-10-05' },
    { id: '10', title: '博客写作常见问题解答', status: 'published', publishDate: '2023-09-30' },
  ]

  const filteredArticles = articles.filter((article) => article.title.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-white overflow-x-hidden font-ui">
      <div className="layout-container flex h-full grow flex-col">
        <div className="gap-1 px-6 flex flex-1 justify-center py-5">
          <Sidebar />
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            <div className="flex flex-wrap justify-between gap-3 p-4">
              <p className="text-primary-text tracking-light title-1 leading-tight min-w-72">文章</p>
              <Link href="/admin/articles/new">
                <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-8 px-4 bg-surface text-primary-text text-sm font-medium leading-normal hover:bg-surface/80 transition-colors font-ui">
                  <span className="truncate">新建文章</span>
                </button>
              </Link>
            </div>
            <div className="px-4 py-3">
              <label className="flex flex-col min-w-40 h-12 w-full">
                <div className="flex w-full flex-1 items-stretch rounded-lg h-full">
                  <div className="text-secondary-text flex border-none bg-surface items-center justify-center pl-4 rounded-l-lg border-r-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                      <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"></path>
                    </svg>
                  </div>
                  <input
                    placeholder="搜索文章..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-primary-text focus:outline-0 focus:ring-0 border-none bg-surface focus:border-none h-full placeholder:text-secondary-text px-4 rounded-l-none border-l-0 pl-2 text-base font-normal leading-normal font-ui"
                  />
                </div>
              </label>
            </div>
            <div className="px-4 py-3 @container">
              <div className="flex overflow-hidden rounded-lg border border-border bg-white">
                <table className="flex-1">
                  <thead>
                    <tr className="bg-white">
                      <th className="px-4 py-3 text-left text-primary-text w-[400px] text-sm font-medium leading-normal font-ui">标题</th>
                      <th className="px-4 py-3 text-left text-primary-text w-60 text-sm font-medium leading-normal font-ui">状态</th>
                      <th className="px-4 py-3 text-left text-primary-text w-[400px] text-sm font-medium leading-normal font-ui">发布时间</th>
                      <th className="px-4 py-3 text-left text-secondary-text w-60 text-sm font-medium leading-normal font-ui">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredArticles.length > 0 ? (
                      filteredArticles.map((article) => (
                        <tr key={article.id} className="border-t border-border">
                          <td className="h-[72px] px-4 py-2 w-[400px] text-primary-text text-sm font-normal leading-normal font-ui">{article.title}</td>
                          <td className="h-[72px] px-4 py-2 w-60 text-sm font-normal leading-normal font-ui">
                            <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-8 px-4 bg-surface text-primary-text text-sm font-medium leading-normal w-full font-ui">
                              <span className="truncate">{article.status === 'published' ? '已发布' : '草稿'}</span>
                            </button>
                          </td>
                          <td className="h-[72px] px-4 py-2 w-[400px] text-secondary-text text-sm font-normal leading-normal font-ui">{article.publishDate}</td>
                          <td className="h-[72px] px-4 py-2 w-60 text-sm font-bold leading-normal tracking-[0.015em] font-ui">
                            <Link href={`/admin/articles/edit/${article.id}`}>
                              <button className="text-secondary-text hover:text-accent transition-colors">编辑</button>
                            </Link>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr className="border-t border-border">
                        <td colSpan={4} className="h-[72px] px-4 py-2 text-center text-secondary-text text-sm font-ui">没有找到匹配的文章</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

