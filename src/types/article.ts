// 文章数据模型
import type { MDXRemoteSerializeResult } from 'next-mdx-remote';

export interface ArticleMeta {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  categories: string[];
  imageUrl?: string;
  imageAlt?: string;
}

export interface Article extends ArticleMeta {
  content: string;
  author?: string;
  status?: 'draft' | 'published';
  publishDate?: string;
  sections?: string[];
}

export interface ArticleWithContent extends ArticleMeta {
  content: MDXRemoteSerializeResult;
  author?: string;
  status?: 'draft' | 'published';
  publishDate?: string;
  sections?: string[];
}