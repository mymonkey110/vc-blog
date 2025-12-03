'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Search, Plus } from 'lucide-react'
import { getArticles } from './actions'

interface Article {
  id: string
  title: string
  status: 'draft' | 'publish'
  createdAt: string
  category?: string
}

export default function ArticlesPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [articles, setArticles] = useState<Article[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const data = await getArticles()
        setArticles(data)
      } catch (error) {
        console.error('Failed to fetch articles:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchArticles()
  }, [])

  const filteredArticles = articles.filter((article) => 
    article.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="flex min-h-screen w-full flex-col bg-stone-50 text-stone-900">
      <div className="flex flex-1">
        <aside className="hidden w-64 flex-col border-r border-stone-200 bg-white p-4 sm:flex">
          <nav className="flex flex-col gap-1">
            <a className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-stone-600 hover:bg-stone-100 hover:text-stone-900" href="#">
              <svg className="h-5 w-5" fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                <rect height="9" rx="1" width="7" x="3" y="3"></rect>
                <rect height="5" rx="1" width="7" x="14" y="3"></rect>
                <rect height="9" rx="1" width="7" x="3" y="15"></rect>
                <rect height="5" rx="1" width="7" x="14" y="11"></rect>
              </svg>
              <span>仪表盘</span>
            </a>
            <a className="flex items-center gap-3 rounded-md bg-stone-100 px-3 py-2 text-sm font-bold text-stone-900" href="#">
              <svg className="h-5 w-5" fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
              </svg>
              <span>文章管理</span>
            </a>
          </nav>
        </aside>
        <main className="flex flex-1 flex-col p-6">
          <div className="flex items-center justify-between pb-4">
            <h2 className="text-3xl font-bold tracking-tight">文章管理</h2>
            <Link href="/admin/articles/new">
              <Button className="bg-stone-900 hover:bg-stone-900/90">
                <Plus className="h-4 w-4 mr-2" />
                新建文章
              </Button>
            </Link>
          </div>
          <div className="flex items-center py-4">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-stone-500" />
              <Input 
                placeholder="搜索文章..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Card>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-left">标题</TableHead>
                    <TableHead className="w-40 text-left">状态</TableHead>
                    <TableHead className="w-48 text-left">创建日期</TableHead>
                    <TableHead className="w-40 text-left">分类</TableHead>
                    <TableHead className="w-32 text-right">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center">
                        加载中...
                      </TableCell>
                    </TableRow>
                  ) : filteredArticles.length > 0 ? (
                    filteredArticles.map((article) => (
                      <TableRow key={article.id}>
                        <TableCell className="font-medium">{article.title}</TableCell>
                        <TableCell>
                          <Badge className={
                            article.status === 'publish' 
                              ? 'bg-green-100 text-green-800 hover:bg-green-100' 
                              : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100'
                          }>
                            {article.status === 'publish' ? '已发布' : '草稿'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-stone-600">
                          {new Date(article.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-stone-600">
                          {article.category || '未分类'}
                        </TableCell>
                        <TableCell className="text-right">
                          <Link href={`/admin/articles/edit/${article.id}`} className="font-medium text-stone-900 hover:underline">
                            编辑
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center">
                        没有找到匹配的文章
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </main>
      </div>
      <footer className="mt-auto border-t border-stone-200 bg-white py-4 px-6">
        <div className="container mx-auto flex items-center justify-between text-sm text-stone-500">
          <p>© 2024 博客系统. 保留所有权利.</p>
          <div className="flex gap-4">
            <a className="hover:text-stone-900" href="#">关于</a>
            <a className="hover:text-stone-900" href="#">隐私政策</a>
            <a className="hover:text-stone-900" href="#">联系我们</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

