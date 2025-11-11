import React, { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/router';
import Sidebar from '../components/Sidebar';
import type { Article } from '../../../types/article';

// 引入Vditor的CSS样式
import 'vditor/dist/index.css';

// 导入Vditor编辑器组件
  import VditorEditor from '../../../../components/VditorEditor';

export default function ArticleEditor() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<Article>({
    id: id === 'new' ? `draft-${Date.now()}` : id || `draft-${Date.now()}`,
    title: '',
    excerpt: '',
    date: new Date().toISOString().split('T')[0],
    content: '',
    categories: [],
    status: 'draft',
    publishDate: undefined,
    // 添加slug和imageUrl等属性
    imageUrl: '',
    imageAlt: '',
  });
  
  const vditorRef = useRef<any>(null);
  const [isNewArticle, setIsNewArticle] = useState(id === 'new');
  const [categoryInput, setCategoryInput] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [slug, setSlug] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [editorMode, setEditorMode] = useState<'wysiwyg' | 'ir' | 'sv'>('ir'); // 默认即时渲染模式

  // 处理标题变更
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setArticle({ ...article, title: newTitle });
    
    // 如果没有手动设置slug，则根据标题自动生成
    if (!slug) {
      const autoSlug = newTitle
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      setSlug(autoSlug);
    }
  };
  
  // 处理slug变更
  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSlug(e.target.value);
  };
  
  // 处理封面图变更
  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setArticle({ ...article, imageUrl: e.target.value });
  };
  
  // 处理封面图alt文本变更
  const handleImageAltChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setArticle({ ...article, imageAlt: e.target.value });
  };
  
  // 添加标签
  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };
  
  // 移除标签
  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  // 处理摘要变更
  const handleExcerptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setArticle({ ...article, excerpt: e.target.value });
  };

  // 处理内容变更
  const handleContentChange = (content: string) => {
    setArticle(prevArticle => ({ ...prevArticle, content }));
  };
  
  // 初始化编辑器内容（如果不是新文章）
  useEffect(() => {
    if (!isNewArticle) {
      // 模拟从API获取文章数据
      // 在实际应用中，这里应该调用API获取文章内容
      // 这里简单地设置一些示例内容
      const mockArticleData = {
        id,
        title: '示例文章标题',
        excerpt: '这是文章摘要...',
        date: new Date().toISOString().split('T')[0],
        content: '# 示例文章\n\n这是一篇示例文章的内容。\n\n## 二级标题\n\n这是正文内容，可以包含各种Markdown格式。\n\n- 项目1\n- 项目2\n- 项目3',
        categories: ['技术', '教程'],
        status: 'draft',
        publishDate: undefined,
        imageUrl: '',
        imageAlt: '',
      };
      
      setArticle(mockArticleData);
      setSlug('example-article');
      setTags(['示例', '测试']);
    }
  }, [id, isNewArticle]);

  // 添加分类
  const handleAddCategory = () => {
    if (categoryInput.trim() && !article.categories.includes(categoryInput.trim())) {
      setArticle({
        ...article,
        categories: [...article.categories, categoryInput.trim()],
      });
      setCategoryInput('');
    }
  };

  // 移除分类
  const handleRemoveCategory = (category: string) => {
    setArticle({
      ...article,
      categories: article.categories.filter(cat => cat !== category),
    });
  };

  // 表单验证
  const validateForm = (): { isValid: boolean; errorMessage?: string } => {
    if (!article.title.trim()) {
      return { isValid: false, errorMessage: '请输入文章标题' };
    }
    if (!slug.trim()) {
      return { isValid: false, errorMessage: '请输入文章别名' };
    }
    if (!article.content.trim()) {
      return { isValid: false, errorMessage: '请输入文章内容' };
    }
    return { isValid: true };
  };

  // 处理保存
  const handleSave = async () => {
    // 表单验证
    const { isValid, errorMessage } = validateForm();
    if (!isValid) {
      alert(errorMessage);
      return;
    }

    try {
      setIsSaving(true);
      // 准备保存的数据
      const saveData = {
        ...article,
        tags,
        slug,
        lastModified: new Date().toISOString(),
      };

      // 在实际应用中，这里会调用API保存文章
      // await fetch('/api/admin/article/save', {      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(saveData),
      // });
      
      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 模拟保存成功
      console.log('保存文章:', saveData);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('保存失败:', error);
      alert('保存失败，请重试');
    } finally {
      setIsSaving(false);
    }
  };

  // 处理发布
  const handlePublish = async () => {
    // 表单验证
    const { isValid, errorMessage } = validateForm();
    if (!isValid) {
      alert(errorMessage);
      return;
    }

    // 确认发布
    if (!confirm('确认要发布这篇文章吗？')) {
      return;
    }

    try {
      setIsPublishing(true);
      // 准备发布的数据
      const publishData = {
        ...article,
        status: 'published',
        publishDate: new Date().toISOString(),
        tags,
        slug,
      };
      
      // 在实际应用中，这里会调用API发布文章
      // await fetch('/api/admin/article/publish', {      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(publishData),
      // });
      
      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 模拟发布成功
      console.log('发布文章:', publishData);
      setArticle(publishData);
      router.push('/admin/articles');
    } catch (error) {
      console.error('发布失败:', error);
      alert('发布失败，请重试');
    } finally {
      setIsPublishing(false);
    }
  };

  // 预览文章
  const handlePreview = () => {
    // 这里可以实现文章预览功能
    console.log('预览文章:', { ...article, tags, slug });
    alert('预览功能开发中...');
  };

  // 复制文章
  const handleDuplicate = () => {
    // 创建一个新的文章副本
    const newArticleId = `draft-${Date.now()}`;
    console.log('复制文章为:', newArticleId);
    router.push(`/admin/articles/new?duplicate=${id}`);
  };

  // 处理编辑器模式切换
  const handleModeChange = (mode: 'wysiwyg' | 'ir' | 'sv') => {
    setEditorMode(mode);
  };

  // 键盘快捷键处理
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+S 保存
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        handleSave();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [article]);

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-white overflow-x-hidden" style={{ fontFamily: '"Work Sans", "Noto Sans", sans-serif' }}>
      <div className="layout-container flex h-full grow flex-col">
        <div className="gap-1 px-6 flex flex-1 justify-center py-5">
          {/* 侧边栏 */}
          <Sidebar />
          
          {/* 主内容区 */}
          <div className="layout-content-container flex flex-col max-w-[1000px] flex-1">
            <div className="flex flex-wrap justify-between gap-3 p-4">
              <p className="text-[#181511] tracking-light text-[32px] font-bold leading-tight min-w-72">
                {isNewArticle ? '新建文章' : '编辑文章'}
              </p>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handlePreview}
                  className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-8 px-4 text-sm font-medium leading-normal transition-colors bg-gray-100 text-gray-700 hover:bg-gray-200"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                  </svg>
                  <span className="truncate">预览</span>
                </button>
                
                <button
                  onClick={handleDuplicate}
                  className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-8 px-4 text-sm font-medium leading-normal transition-colors bg-gray-100 text-gray-700 hover:bg-gray-200"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                  </svg>
                  <span className="truncate">复制</span>
                </button>
                
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className={`flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-8 px-4 text-sm font-medium leading-normal transition-colors ${saveSuccess ? 'bg-green-100 text-green-800' : 'bg-[#f4f3f0] text-[#181511] hover:bg-[#e8e6e1]'}`}
                >
                  {isSaving ? (
                    <>
                      <svg className="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span className="truncate">保存中...</span>
                    </>
                  ) : saveSuccess ? (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      <span className="truncate">保存成功!</span>
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                        <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                        <polyline points="17 21 17 13 7 13 7 21"></polyline>
                        <polyline points="7 3 7 8 15 8"></polyline>
                      </svg>
                      <span className="truncate">保存草稿</span>
                    </>
                  )}
                </button>
                
                {(article.status === 'draft' || article.status === 'published') && (
                  <button
                    onClick={handlePublish}
                    disabled={isPublishing || !article.title.trim()}
                    className={`flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-8 px-4 text-sm font-medium leading-normal transition-colors ${isPublishing ? 'bg-[#e6a219] bg-opacity-70' : (!article.title.trim() ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-[#e6a219] text-[#181511] hover:bg-opacity-90')}`}
                  >
                    {isPublishing ? (
                      <>
                        <svg className="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span className="truncate">处理中...</span>
                      </>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                          <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                          <line x1="12" y1="22.08" x2="12" y2="12"></line>
                        </svg>
                        <span className="truncate">{article.status === 'published' ? '更新' : '发布'}</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* 文章元数据编辑区域 */}
            <div className="px-4 py-3 space-y-4">
              {/* 标题输入 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">标题</label>
                <input
                  type="text"
                  value={article.title}
                  onChange={handleTitleChange}
                  placeholder="输入文章标题"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </div>

              {/* 摘要输入 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">摘要</label>
                <textarea
                  value={article.excerpt}
                  onChange={handleExcerptChange}
                  placeholder="输入文章摘要"
                  rows={3}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </div>

              {/* Slug编辑 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">别名 (Slug)</label>
                <input
                  type="text"
                  value={slug}
                  onChange={handleSlugChange}
                  placeholder="自动生成或手动输入"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </div>
              
              {/* 封面图设置 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">封面图 URL</label>
                <input
                  type="text"
                  value={article.imageUrl}
                  onChange={handleImageUrlChange}
                  placeholder="输入封面图URL"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">封面图描述</label>
                <input
                  type="text"
                  value={article.imageAlt}
                  onChange={handleImageAltChange}
                  placeholder="输入封面图描述文本"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </div>
              
              {/* 分类管理 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">分类</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={categoryInput}
                    onChange={(e) => setCategoryInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddCategory()}
                    placeholder="添加分类"
                    className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  />
                  <button
                    onClick={handleAddCategory}
                    className="px-4 py-2 bg-[#f4f3f0] text-[#181511] rounded-lg hover:bg-[#e8e6e1] transition-colors"
                  >
                    添加
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {article.categories.map((category, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-[#f4f3f0] text-[#181511]"
                    >
                      {category}
                      <button
                        onClick={() => handleRemoveCategory(category)}
                        className="ml-1 text-gray-500 hover:text-gray-700"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
              
              {/* 标签管理 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">标签</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                    placeholder="添加标签"
                    className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  />
                  <button
                    onClick={handleAddTag}
                    className="px-4 py-2 bg-[#f4f3f0] text-[#181511] rounded-lg hover:bg-[#e8e6e1] transition-colors"
                  >
                    添加
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-[#e6a219] bg-opacity-20 text-[#181511]"
                    >
                      {tag}
                      <button
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-1 text-gray-500 hover:text-gray-700"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* 编辑器模式切换 */}
            <div className="px-4 py-2 flex justify-center gap-4 border-b border-gray-200">
              <button
                onClick={() => handleModeChange('wysiwyg')}
                className={`px-4 py-2 rounded-md text-sm transition-colors ${editorMode === 'wysiwyg' ? 'bg-[#f4f3f0] text-[#181511] font-medium' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                所见即所得
              </button>
              <button
                onClick={() => handleModeChange('ir')}
                className={`px-4 py-2 rounded-md text-sm transition-colors ${editorMode === 'ir' ? 'bg-[#f4f3f0] text-[#181511] font-medium' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                即时渲染
              </button>
              <button
                onClick={() => handleModeChange('sv')}
                className={`px-4 py-2 rounded-md text-sm transition-colors ${editorMode === 'sv' ? 'bg-[#f4f3f0] text-[#181511] font-medium' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                分屏预览
              </button>
            </div>

            {/* 编辑器区域 */}
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
                    cache: {
                      enable: true,
                      id: `article-${article.id}`,
                    },
                    toolbarConfig: {
                      pin: true,
                    },
                    upload: {
                      accept: 'image/*',
                      url: '/api/upload',
                      filename: (name: string) => `${Date.now()}-${name}`,
                      linkToImgUrl: '/api/upload',
                      handler: (file: File) => {
                        // 模拟上传成功
                        console.log('上传文件:', file);
                        // 返回一个模拟的URL
                        return Promise.resolve({
                          errFiles: [],
                          succMap: { [file.name]: `/images/${file.name}` },
                        });
                      },
                    },
                    hint: {
                      emojiPath: 'https://cdn.jsdelivr.net/npm/vditor@3.10.0/dist/images/emoji/',
                      emoji: true,
                    },
                  }}
                />
            </div>

            {/* 底部状态栏 */}
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
  );
}