'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Search, Plus } from 'lucide-react'
import { getArticles } from './actions'
import { ArticleModel } from '@/generated/prisma/models'


export default function ArticlesPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [articles, setArticles] = useState<ArticleModel[]>([])
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
    <>
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
    </>
  )
}

