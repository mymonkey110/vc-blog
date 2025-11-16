'use client'
import React, { useState, useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Sidebar from '@/pages/admin/components/Sidebar'
import type { Article } from '@/types/article'
import 'vditor/dist/index.css'
import VditorEditor from '@/components/VditorEditor'

export default function ArticleEditor({ params }: { params: { id: string } }) {
  const router = useRouter()
  const id = params.id
  const [article, setArticle] = useState<Article>({
    id: id === 'new' ? `draft-${Date.now()}` : id || `draft-${Date.now()}`,
    title: '',
    excerpt: '',
    date: new Date().toISOString().split('T')[0],
    content: '',
    categories: [],
    status: 'draft',
    publishDate: undefined,
    imageUrl: '',
    imageAlt: '',
  })

  const vditorRef = useRef<any>(null)
  const isNewArticle = id === 'new'
  const [categoryInput, setCategoryInput] = useState('')
  const [tagInput, setTagInput] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [slug, setSlug] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [isPublishing, setIsPublishing] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [editorMode, setEditorMode] = useState<'wysiwyg' | 'ir' | 'sv'>('ir')

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value
    setArticle({ ...article, title: newTitle })
    if (!slug) {
      const autoSlug = newTitle
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()
      setSlug(autoSlug)
    }
  }

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSlug(e.target.value)
  }

  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setArticle({ ...article, imageUrl: e.target.value })
  }

  const handleImageAltChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setArticle({ ...article, imageAlt: e.target.value })
  }

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()])
      setTagInput('')
    }
  }

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag))
  }

  const handleExcerptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setArticle({ ...article, excerpt: e.target.value })
  }

  const handleContentChange = (content: string) => {
    setArticle((prevArticle) => ({ ...prevArticle, content }))
  }

  useEffect(() => {
    if (!id) return
    if (!isNewArticle) {
      const mockArticleData: Article = {
        id,
        title: '示例文章标题',
        excerpt: '这是文章摘要...',
        date: new Date().toISOString().split('T')[0],
        content:
          '# 示例文章\n\n这是一篇示例文章的内容。\n\n## 二级标题\n\n这是正文内容，可以包含各种Markdown格式。\n\n- 项目1\n- 项目2\n- 项目3',
        categories: ['技术', '教程'],
        status: 'draft',
        publishDate: undefined,
        imageUrl: '',
        imageAlt: '',
      }

      setArticle(mockArticleData)
      setSlug('example-article')
      setTags(['示例', '测试'])
    }
  }, [id])

  const handleAddCategory = () => {
    if (categoryInput.trim() && !article.categories.includes(categoryInput.trim())) {
      setArticle({ ...article, categories: [...article.categories, categoryInput.trim()] })
      setCategoryInput('')
    }
  }

  const handleRemoveCategory = (category: string) => {
    setArticle({ ...article, categories: article.categories.filter((cat) => cat !== category) })
  }

  const validateForm = (): { isValid: boolean; errorMessage?: string } => {
    if (!article.title.trim()) {
      return { isValid: false, errorMessage: '请输入文章标题' }
    }
    if (!slug.trim()) {
      return { isValid: false, errorMessage: '请输入文章别名' }
    }
    if (!article.content.trim()) {
      return { isValid: false, errorMessage: '请输入文章内容' }
    }
    return { isValid: true }
  }

  const handleSave = async () => {
    const { isValid, errorMessage } = validateForm()
    if (!isValid) {
      alert(errorMessage)
      return
    }
    try {
      setIsSaving(true)
      const saveData = { ...article, tags, slug, lastModified: new Date().toISOString() }
      await new Promise((resolve) => setTimeout(resolve, 1000))
      console.log('保存文章:', saveData)
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (error) {
      console.error('保存失败:', error)
      alert('保存失败，请重试')
    } finally {
      setIsSaving(false)
    }
  }

  const handlePublish = async () => {
    const { isValid, errorMessage } = validateForm()
    if (!isValid) {
      alert(errorMessage)
      return
    }
    if (!confirm('确认要发布这篇文章吗？')) {
      return
    }
    try {
      setIsPublishing(true)
      const publishData: Article = { ...article, status: 'published', publishDate: new Date().toISOString() }
      await new Promise((resolve) => setTimeout(resolve, 1000))
      console.log('发布文章:', publishData)
      setArticle(publishData)
      router.push('/admin/articles')
    } catch (error) {
      console.error('发布失败:', error)
      alert('发布失败，请重试')
    } finally {
      setIsPublishing(false)
    }
  }

  const handlePreview = () => {
    console.log('预览文章:', { ...article, tags, slug })
    alert('预览功能开发中...')
  }

  const handleDuplicate = () => {
    if (!id) return
    const newArticleId = `draft-${Date.now()}`
    console.log('复制文章为:', newArticleId)
    router.push(`/admin/articles/new?duplicate=${id}`)
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault()
        handleSave()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [article])

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg白 overflow-x-hidden" style={{ fontFamily: '"Work Sans", "Noto Sans", sans-serif' }}>
      <div className="layout-container flex h-full grow flex-col">
        <div className="gap-1 px-6 flex flex-1 justify-center py-5">
          <Sidebar />
          <div className="layout-content-container flex flex-col max-w-[1000px] flex-1">
            <div className="flex flex-wrap justify之间 gap-3 p-4">
              <p className="text-[#181511] tracking-light text-[32px] font-bold leading-tight min-w-72">{isNewArticle ? '新建文章' : '编辑文章'}</p>
              <div className="flex flex-wrap gap-3">
                <button onClick={handlePreview} className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-8 px-4 text-sm font-medium leading-normal transition-colors bg-gray-100 text-gray-700 hover:bg-gray-200">
                  <span className="truncate">预览</span>
                </button>
                <button onClick={handleDuplicate} className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-8 px-4 text-sm font-medium leading-normal transition-colors bg-gray-100 text-gray-700 hover:bg-gray-200">
                  <span className="truncate">复制</span>
                </button>
                <button onClick={handleSave} disabled={isSaving} className={`flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-8 px-4 text-sm font-medium leading-normal transition-colors ${saveSuccess ? 'bg-green-100 text-green-800' : 'bg-[#f4f3f0] text-[#181511] hover:bg-[#e8e6e1]'}`}>
                  <span className="truncate">{isSaving ? '保存中...' : saveSuccess ? '保存成功!' : '保存草稿'}</span>
                </button>
                {(article.status === 'draft' || article.status === 'published') && (
                  <button onClick={handlePublish} disabled={isPublishing || !article.title.trim()} className={`flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-8 px-4 text-sm font-medium leading-normal transition-colors ${isPublishing ? 'bg-[#e6a219] bg-opacity-70' : !article.title.trim() ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-[#e6a219] text-[#181511] hover:bg-opacity-90'}`}>
                    <span className="truncate">{isPublishing ? '处理中...' : article.status === 'published' ? '更新' : '发布'}</span>
                  </button>
                )}
              </div>
            </div>

            <div className="px-4 py-3 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">标题</label>
                <input type="text" value={article.title} onChange={handleTitleChange} placeholder="输入文章标题" className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">摘要</label>
                <textarea value={article.excerpt} onChange={handleExcerptChange} placeholder="输入文章摘要" rows={3} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">别名 (Slug)</label>
                <input type="text" value={slug} onChange={handleSlugChange} placeholder="自动生成或手动输入" className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">封面图 URL</label>
                <input type="text" value={article.imageUrl} onChange={handleImageUrlChange} placeholder="输入封面图URL" className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">封面图描述</label>
                <input type="text" value={article.imageAlt} onChange={handleImageAltChange} placeholder="输入封面图描述文本" className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">分类</label>
                <div className="flex gap-2 mb-2">
                  <input type="text" value={categoryInput} onChange={(e) => setCategoryInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleAddCategory()} placeholder="添加分类" className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400" />
                  <button onClick={handleAddCategory} className="px-4 py-2 bg-[#f4f3f0] text-[#181511] rounded-lg hover:bg-[#e8e6e1] transition-colors">添加</button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {article.categories.map((category, index) => (
                    <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-[#f4f3f0] text-[#181511]">
                      {category}
                      <button onClick={() => handleRemoveCategory(category)} className="ml-1 text-gray-500 hover:text-gray-700">×</button>
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">标签</label>
                <div className="flex gap-2 mb-2">
                  <input type="text" value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleAddTag()} placeholder="添加标签" className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400" />
                  <button onClick={handleAddTag} className="px-4 py-2 bg-[#f4f3f0] text-[#181511] rounded-lg hover:bg-[#e8e6e1] transition-colors">添加</button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag, index) => (
                    <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-[#e6a219] bg-opacity-20 text-[#181511]">
                      {tag}
                      <button onClick={() => handleRemoveTag(tag)} className="ml-1 text-gray-500 hover:text-gray-700">×</button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="px-4 py-2 flex justify-center gap-4 border-b border-gray-200">
              <button onClick={() => setEditorMode('wysiwyg')} className={`px-4 py-2 rounded-md text-sm transition-colors ${editorMode === 'wysiwyg' ? 'bg-[#f4f3f0] text-[#181511] font-medium' : 'text-gray-600 hover:bg-gray-100'}`}>所见即所得</button>
              <button onClick={() => setEditorMode('ir')} className={`px-4 py-2 rounded-md text-sm transition-colors ${editorMode === 'ir' ? 'bg-[#f4f3f0] text-[#181511] font-medium' : 'text-gray-600 hover:bg-gray-100'}`}>即时渲染</button>
              <button onClick={() => setEditorMode('sv')} className={`px-4 py-2 rounded-md text-sm transition-colors ${editorMode === 'sv' ? 'bg-[#f4f3f0] text-[#181511] font-medium' : 'text-gray-600 hover:bg-gray-100'}`}>分屏预览</button>
            </div>

            <div className="h-[70vh] border border-gray-200 rounded-lg overflow-hidden">
              <VditorEditor
                ref={vditorRef}
                value={article.content}
                onChange={handleContentChange}
                mode={editorMode}
                onChangeMode={setEditorMode}
                placeholder="开始编写文章内容..."
                options={{
                  height: '100%',
                  outline: [
                    { level: 1, enable: true },
                    { level: 2, enable: true },
                    { level: 3, enable: true },
                  ],
                  cache: { enable: true, id: `article-${article.id}` },
                  toolbarConfig: { pin: true },
                  upload: {
                    accept: 'image/*',
                    url: '/api/upload',
                    filename: (name: string) => `${Date.now()}-${name}`,
                    linkToImgUrl: '/api/upload',
                    handler: (file: File) => {
                      console.log('上传文件:', file)
                      return Promise.resolve({ errFiles: [], succMap: { [file.name]: `/images/${file.name}` } })
                    },
                  },
                  hint: { emojiPath: 'https://cdn.jsdelivr.net/npm/vditor@3.10.0/dist/images/emoji/', emoji: true },
                }}
              />
            </div>

            <div className="px-4 py-3 bg-[#f4f3f0] rounded-b-lg mt-4">
              <div className="flex justify-between items-center text-sm text-gray-600">
                <span>状态: {article.status === 'published' ? '已发布' : '草稿'}</span>
                <span>字数统计: {article.content.length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

