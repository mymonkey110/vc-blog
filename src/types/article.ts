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
  coverPic?: string | null;
}

export interface Article extends ArticleMeta {
  content: string;
  author?: string;
  status?: 'draft' | 'published';
  publishDate?: string;
  sections?: string[];
  coverPic?: string | null;
}

export interface ArticleWithContent extends ArticleMeta {
  content: MDXRemoteSerializeResult;
  author?: string;
  status?: 'draft' | 'published';
  publishDate?: string;
  sections?: string[];
  coverPic?: string | null;
}

// Database article type matching Prisma schema
export interface DatabaseArticle {
  id: string;
  title: string;
  description: string | null;
  content: string;
  createdAt: Date;
  category: string | null;
  status: string;
  slug: string | null;
  coverPic: string | null;
}