'use client';
import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { createArticle } from '../actions';
import VditorEditor from '@/components/VditorEditor';
import CoverImageInput from '@/components/CoverImageInput';
import InlineAIDescriptionInput from '@/components/InlineAIDescriptionInput';
import 'vditor/dist/index.css';

interface NewArticleForm {
  title: string;
  category?: string;
  description?: string;
  content: string;
  status: 'draft' | 'publish';
  coverPic?: string;
}

export default function NewArticlePage() {
  const router = useRouter();
  const [formData, setFormData] = useState<NewArticleForm>({
    title: '',
    category: '',
    description: '',
    content: '',
    status: 'publish',
    coverPic: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      status: e.target.value as 'draft' | 'publish',
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      setError('标题不能为空');
      return;
    }

    if (!formData.content.trim()) {
      setError('内容不能为空');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await createArticle({
        ...formData,
        content: formData.content.trim(),
      });

      router.push('/admin/articles');
    } catch (err) {
      console.error('Failed to create article:', err);
      setError('创建文章失败，请重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between pb-4">
        <h2 className="text-3xl font-bold tracking-tight">新建文章</h2>
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
              <InlineAIDescriptionInput
                id="description"
                name="description"
                value={formData.description || ''}
                onChange={(description) => setFormData(prev => ({ ...prev, description }))}
                articleContent={formData.content}
                placeholder="请输入文章描述"
                disabled={isSubmitting}
                originalValue=""
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="coverPic">封面图片</Label>
              <CoverImageInput
                value={formData.coverPic || ''}
                onChange={(url) => setFormData(prev => ({ ...prev, coverPic: url }))}
                disabled={isSubmitting}
                enableAIGeneration={true}
                articleContent={formData.content}
                articleTitle={formData.title}
                onAIGenerationStart={() => console.log('AI generation started')}
                onAIGenerationComplete={(result) => console.log('AI generation completed:', result)}
                onAIGenerationError={(error) => console.error('AI generation error:', error)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">内容 *</Label>
              <VditorEditor
                value={formData.content}
                onChange={(value) => setFormData((prev) => ({ ...prev, content: value }))}
                mode="sv"
                placeholder="请输入文章内容"
                options={{ cache: { enable: false } }}
              />
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
                {isSubmitting ? '发布中...' : '发布文章'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </>
  );
}
