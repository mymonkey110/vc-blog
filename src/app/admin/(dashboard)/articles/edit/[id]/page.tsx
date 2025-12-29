'use client';
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { getArticleById, updateArticle } from '../../actions';
import Vditor from 'vditor';
import { upload } from '@vercel/blob/client';
import { showToast } from '@/components/Toast';
import 'vditor/dist/index.css';

interface EditArticleForm {
  title: string;
  category?: string;
  description?: string;
  content: string;
  status: 'draft' | 'publish';
}

interface EditorProps {
  content: string;
  onReady: (vditor: Vditor) => void;
}

function Editor({ content, onReady }: EditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const vditorRef = useRef<Vditor | null>(null);
  const isInitializedRef = useRef(false);

  useEffect(() => {
    if (editorRef.current) {
      vditorRef.current = new Vditor(editorRef.current, {
        mode: 'sv',
        value: content,
        preview: {
          mode: 'both',
          theme: {
            current: 'light',
          },
        },
        cache: {
          enable: false,
        },
        upload: {
          handler: async (files: File[]) => {
            if (files.length === 0) {
              return { errFiles: [], succMap: {} };
            }

            const file = files[0];
            showToast('图片上传中...', 'info', 0);

            try {
              const ext = file.name.split('.').pop() || 'png';
              const filename = `images/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

              const blob = await upload(filename, file, {
                access: 'public',
                handleUploadUrl: '/admin/api/upload/auth',
              });

              showToast('图片上传成功', 'success', 2000);

              return {
                errFiles: [],
                succMap: {
                  [file.name]: blob.url,
                },
              };
            } catch (error) {
              console.error('Upload error:', error);
              showToast('图片上传失败', 'error', 3000);
              return {
                errFiles: [file.name],
                succMap: {},
              };
            }
          },
          filename: (name: string) => {
            const ext = name.split('.').pop() || 'png';
            return `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
          },
          max: 5 * 1024 * 1024,
        },
        after: () => {
          isInitializedRef.current = true;
          if (vditorRef.current) {
            onReady(vditorRef.current);
          }
        },
      });
    }

    return () => {
      if (vditorRef.current && isInitializedRef.current) {
        try {
          vditorRef.current.destroy();
          vditorRef.current = null;
        } catch (error) {
          console.error('Failed to destroy Vditor:', error);
        }
      }
    };
  }, [content, onReady]);

  return <div ref={editorRef} className="min-h-[400px] border rounded-md"></div>;
}

export default function EditArticlePage() {
  const router = useRouter();
  const params = useParams();
  const articleId = params.id as string;
  const vditorRef = useRef<Vditor | null>(null);
  const [formData, setFormData] = useState<EditArticleForm>({
    title: '',
    category: '',
    description: '',
    content: '',
    status: 'publish',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticle = async () => {
      if (!articleId) {
        setError('文章ID无效');
        setIsLoading(false);
        return;
      }

      try {
        const article = await getArticleById(articleId);
        console.log('article', article);
        if (article) {
          setFormData({
            title: article.title,
            category: article.category || '',
            description: article.description || '',
            content: article.content,
            status: article.status as 'draft' | 'publish',
          });
        } else {
          setError('文章不存在');
        }
      } catch (err) {
        console.error('Failed to fetch article:', err);
        setError('获取文章失败');
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticle();
  }, [articleId]);

  const handleEditorReady = (vditor: Vditor) => {
    vditorRef.current = vditor;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      setError('标题不能为空');
      return;
    }

    if (!vditorRef.current) {
      setError('编辑器初始化失败');
      return;
    }

    const content = vditorRef.current.getValue();
    if (!content.trim()) {
      setError('内容不能为空');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await updateArticle(articleId, {
        ...formData,
        content: content.trim(),
      });

      router.push('/admin/articles');
    } catch (err) {
      console.error('Failed to update article:', err);
      setError('更新文章失败，请重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      status: e.target.value as 'draft' | 'publish',
    }));
  };

  if (isLoading) {
    return (
      <>
        <div className="flex items-center justify-between pb-4">
          <h2 className="text-3xl font-bold tracking-tight">编辑文章</h2>
          <Link href="/admin/articles">
            <Button variant="outline">返回列表</Button>
          </Link>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="text-stone-500">加载中...</div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between pb-4">
        <h2 className="text-3xl font-bold tracking-tight">编辑文章</h2>
        <Link href="/admin/articles">
          <Button variant="outline">返回列表</Button>
        </Link>
      </div>

      {error && <div className="mb-4 rounded-md bg-red-50 p-4 text-sm text-red-700">{error}</div>}

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">标题 *</Label>
              <Input
                id="title"
                name="title"
                placeholder="请输入文章标题"
                value={formData.title}
                onChange={handleChange}
                maxLength={255}
                required
              />
              <p className="text-xs text-stone-500">最多255个字符</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="category">分类</Label>
                <Input
                  id="category"
                  name="category"
                  placeholder="请输入文章分类"
                  value={formData.category}
                  onChange={handleChange}
                  maxLength={128}
                />
                <p className="text-xs text-stone-500">最多128个字符</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">状态</Label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleStatusChange}
                  className="flex h-10 w-full rounded-md border border-stone-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-stone-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="publish">已发布</option>
                  <option value="draft">草稿</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">描述</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="请输入文章描述"
                value={formData.description}
                onChange={handleChange}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">内容 *</Label>
              {!isLoading && formData.content && (
                <Editor key={articleId} content={formData.content} onReady={handleEditorReady} />
              )}
            </div>

            <div className="flex justify-end gap-3">
              <Link href="/admin/articles">
                <Button variant="outline">取消</Button>
              </Link>
              <Button
                type="submit"
                className="bg-stone-900 hover:bg-stone-900/90"
                disabled={isSubmitting}
              >
                {isSubmitting ? '更新中...' : '更新文章'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </>
  );
}
