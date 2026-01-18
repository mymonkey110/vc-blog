'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { createArticle } from '../actions';
import VditorEditor from '@/components/VditorEditor';
import CoverImageInput from '@/components/CoverImageInput';
import InlineAIDescriptionInput from '@/components/InlineAIDescriptionInput';
import 'vditor/dist/index.css';
import { ArrowLeft, Save, Loader2, Sparkles, LayoutTemplate } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

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
    status: 'draft',
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      setError('Title cannot be empty');
      return;
    }

    if (!formData.content.trim()) {
      setError('Content cannot be empty');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await createArticle({
        ...formData,
        content: formData.content.trim(),
      });
      // Redirect handled by router.push
      router.push('/admin/articles');
    } catch (err) {
      console.error('Failed to create article:', err);
      setError('Failed to create article, please try again');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusChange = (status: 'draft' | 'publish') => {
    setFormData((prev) => ({ ...prev, status }));
  };

  return (
    <div className="min-h-screen bg-white font-sans text-stone-900">
      {/* Top Navigation Bar - Minimal */}
      <nav className="fixed top-0 left-0 right-0 z-50 h-16 bg-white/90 backdrop-blur-sm border-b border-stone-100 px-6 flex items-center justify-between transition-all">
        <div className="flex items-center gap-4">
          <Link href="/admin/articles">
            <Button
              variant="ghost"
              size="icon"
              className="text-stone-400 hover:text-stone-900 rounded-none h-10 w-10"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex items-center gap-2 text-sm text-stone-400 font-medium uppercase tracking-wider">
            <span>New Story</span>
            <span className="text-stone-300">•</span>
            <span className={formData.status === 'publish' ? 'text-green-600' : 'text-amber-500'}>
              {formData.status === 'publish' ? 'Publishing' : 'Draft'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="h-9 border-stone-200 text-stone-600 font-medium uppercase tracking-wider text-xs rounded-none hover:bg-stone-50"
              >
                {formData.status === 'publish' ? 'Status: Publish' : 'Status: Draft'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="rounded-none border-stone-100 shadow-xl">
              <DropdownMenuItem
                onClick={() => handleStatusChange('publish')}
                className="cursor-pointer text-xs uppercase tracking-wider font-medium text-stone-600 focus:bg-stone-50"
              >
                Publish
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleStatusChange('draft')}
                className="cursor-pointer text-xs uppercase tracking-wider font-medium text-stone-600 focus:bg-stone-50"
              >
                Draft
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="h-9 bg-stone-900 text-white hover:bg-stone-800 font-medium px-6 rounded-none uppercase tracking-wider text-xs flex items-center gap-2 shadow-sm transition-all active:scale-[0.98]"
          >
            {isSubmitting ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <Save className="h-3 w-3" />
            )}
            {isSubmitting ? 'Creating...' : 'Create Story'}
          </Button>
        </div>
      </nav>

      {/* Main Content Area - Centered Writing Experience */}
      <main className="pt-32 pb-32 px-6 max-w-7xl mx-auto">
        {error && (
          <div className="mb-8 p-4 bg-red-50 text-red-600 text-sm border border-red-100 flex items-center gap-2 rounded-none">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
            {error}
          </div>
        )}

        {/* Cover Image - Wide & Cinematic */}
        <div className="mb-16 group relative">
          <div className="absolute -left-16 top-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-2 hidden xl:block">
            <div className="text-xs font-bold uppercase tracking-widest text-stone-300 rotate-90 origin-left translate-y-8">
              Cover Image
            </div>
          </div>
          <CoverImageInput
            value={formData.coverPic || ''}
            onChange={(url) => setFormData((prev) => ({ ...prev, coverPic: url }))}
            disabled={isSubmitting}
            enableAIGeneration={true}
            articleContent={formData.content}
            articleTitle={formData.title}
          />
        </div>

        {/* Title - Huge Serif */}
        <div className="mb-10 relative">
          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Title..."
            className="w-full text-5xl md:text-7xl font-serif font-bold text-stone-900 placeholder:text-stone-200 focus:outline-none bg-transparent leading-[1.1] tracking-tight"
            autoComplete="off"
            autoFocus
          />
        </div>

        {/* Metadata Row - Subtle */}
        <div className="mb-16 flex items-center gap-6 border-b border-stone-100 pb-6">
          <div className="flex-1">
            <input
              name="category"
              value={formData.category}
              onChange={handleChange}
              placeholder="ADD A CATEGORY..."
              className="w-full text-sm font-bold uppercase tracking-widest text-stone-600 placeholder:text-stone-300 focus:outline-none bg-transparent"
            />
          </div>
        </div>

        {/* AI Description Block */}
        <div className="mb-16 bg-stone-50/50 p-8 border border-stone-100 rounded-none relative group transition-colors hover:bg-stone-50">
          <div className="absolute -left-3 top-8 w-1 h-8 bg-stone-200 group-hover:bg-stone-400 transition-colors"></div>
          <div className="flex items-center gap-2 mb-4 text-xs font-bold uppercase tracking-widest text-stone-400 group-hover:text-stone-600 transition-colors">
            <Sparkles className="h-3 w-3" />
            Summary
          </div>
          <InlineAIDescriptionInput
            id="description"
            name="description"
            value={formData.description || ''}
            onChange={(description) => setFormData((prev) => ({ ...prev, description }))}
            articleContent={formData.content}
            placeholder="Write a brief summary or excerpt for your story..."
            disabled={isSubmitting}
            originalValue=""
            rows={3}
          />
        </div>

        {/* Editor - Clean & Distraction Free */}
        <div className="prose prose-stone prose-lg max-w-none prose-headings:font-serif prose-headings:font-bold prose-p:font-light prose-p:leading-relaxed prose-blockquote:border-l-2 prose-blockquote:border-stone-900 prose-blockquote:pl-6 prose-blockquote:italic">
          <VditorEditor
            value={formData.content}
            onChange={(value) => setFormData((prev) => ({ ...prev, content: value }))}
            mode="sv"
            placeholder="Tell your story..."
            options={{
              cache: { enable: false },
              toolbar: [
                'emoji',
                'headings',
                'bold',
                'italic',
                'strike',
                '|',
                'line',
                'quote',
                'list',
                'ordered-list',
                'check',
                '|',
                'code',
                'inline-code',
                'insert-after',
                'insert-before',
                '|',
                'upload',
                'link',
                'table',
                '|',
                'undo',
                'redo',
                '|',
                'edit-mode',
                'fullscreen',
                'preview',
              ],
            }}
            className="min-h-[600px] border-none shadow-none"
            height={800}
          />
        </div>
      </main>
    </div>
  );
}
