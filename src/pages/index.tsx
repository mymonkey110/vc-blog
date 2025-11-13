import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { GetStaticProps } from 'next';
import { ArticleMeta } from '../types/article';
import prisma from '../lib/db';
import Pagination from '../components/pagination';

interface HomePageProps {
  articles: ArticleMeta[];
  currentPage: number;
  totalPages: number;
}

// 简化的URL格式化函数：按原始标题生成链接，不做任何转换
const formatUrlTitle = (text: string): string => {
  return text.toString();
};

const HomePage: React.FC<HomePageProps> = ({ articles, currentPage, totalPages }) => {

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* 头部导航 */}
      <header className="flex items-center justify-between border-b border-background px-10 py-3 whitespace-nowrap">
        <div className="flex items-center gap-4 text-primary-text">
          <div className="size-4">
            <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path
                clipRule="evenodd"
                d="M39.475 21.6262C40.358 21.4363 40.6863 21.5589 40.7581 21.5934C40.7876 21.655 40.8547 21.857 40.8082 22.3336C40.7408 23.0255 40.4502 24.0046 39.8572 25.2301C38.6799 27.6631 36.5085 30.6631 33.5858 33.5858C30.6631 36.5085 27.6632 38.6799 25.2301 39.8572C24.0046 40.4502 23.0255 40.7407 22.3336 40.8082C21.8571 40.8547 21.6551 40.7875 21.5934 40.7581C21.5589 40.6863 21.4363 40.358 21.6262 39.475C21.8562 38.4054 22.4689 36.9657 23.5038 35.2817C24.7575 33.2417 26.5497 30.9744 28.7621 28.762C30.9744 26.5497 33.2417 24.7574 35.2817 23.5037C36.9657 22.4689 38.4054 21.8562 39.475 21.6262ZM4.41189 29.2403L18.7597 43.5881C19.8813 44.7097 21.4027 44.9179 22.7217 44.7893C24.0585 44.659 25.5148 44.1631 26.9723 43.4579C29.9052 42.0387 33.2618 39.5667 36.4142 36.4142C39.5667 33.2618 42.0387 29.9052 43.4579 26.9723C44.1631 25.5148 44.659 24.0585 44.7893 22.7217C44.9179 21.4027 44.7097 19.8813 43.5881 18.7597L29.2403 4.41187C27.8527 3.02428 25.8765 3.02573 24.2861 3.36776C22.6081 3.72863 20.7334 4.58419 18.8396 5.74801C16.4978 7.18716 13.9881 9.18353 11.5858 11.5858C9.18354 13.988 7.18717 16.4978 5.74802 18.8396C4.58421 20.7334 3.72865 22.6081 3.36778 24.2861C3.02574 25.8765 3.02429 27.8527 4.41189 29.2403Z"
                fill="currentColor"
                fillRule="evenodd"
              />
            </svg>
          </div>
          <h2 className="text-lg font-bold leading-tight tracking-[-0.015em]">Blog</h2>
        </div>
        
        <div className="flex flex-1 justify-end gap-8">
          <div className="flex items-center gap-9">
            <Link href="/" className="text-sm font-medium leading-normal">首页</Link>
            <Link href="/categories" className="text-sm font-medium leading-normal">分类</Link>
            <Link href="/about" className="text-sm font-medium leading-normal">关于</Link>
          </div>
          <button className="flex h-10 min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg px-4 bg-background font-bold text-sm leading-normal tracking-[0.015em]">
            <span className="truncate">登录</span>
          </button>
        </div>
      </header>

      {/* 主要内容区域 */}
      <div className="flex flex-1 justify-center px-40 py-5">
        <div className="flex max-w-[960px] flex-1 flex-col">
          {/* 搜索框 */}
          <div className="px-4 py-3">
            <label className="flex min-w-40 h-12 w-full flex-col">
              <div className="flex h-full w-full flex-1 items-stretch rounded-lg">
                <div className="flex border-none bg-background items-center justify-center pl-4 text-secondary-text rounded-l-lg">
                  <span className="material-symbols-outlined">search</span>
                </div>
                <input 
                  type="text" 
                  placeholder="搜索文章..." 
                  className="flex h-full w-full min-w-0 flex-1 resize-none overflow-hidden rounded-r-lg border-none bg-background px-4 text-base font-normal leading-normal placeholder:text-secondary-text focus:border-none focus:outline-0 focus:ring-0"
                />
              </div>
            </label>
          </div>

          {/* 最新文章标题 */}
          <h2 className="px-4 py-3 pt-5 text-2xl font-bold leading-tight tracking-[-0.015em]">最新文章</h2>

          {/* 文章列表 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-4">
            {articles.map((article) => (
              <article key={article.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                <div className="relative h-48 bg-gray-200 dark:bg-gray-700">
                  {article.imageUrl && (
                    <Image
                      src={article.imageUrl}
                      alt={article.imageAlt || article.title}
                      fill
                      className="object-cover"
                      priority
                    />
                  )}
                </div>
                <div className="p-6">
                  <div className="flex flex-wrap gap-2 mb-2">
                    {article.categories?.map((category, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                  <h2 className="text-xl font-bold mb-2">
                    <Link href={`/article/${new Date(article.date).getUTCFullYear()}/${String(new Date(article.date).getUTCMonth() + 1).padStart(2, '0')}/${String(new Date(article.date).getUTCDate()).padStart(2, '0')}/${formatUrlTitle(article.title)}`} className="hover:text-blue-500 transition-colors">
                    {article.title}
                  </Link>
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">{article.excerpt || '阅读更多...'}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500 dark:text-gray-500">{article.date ? new Date(article.date).toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' }) : ''}</span>
                    <Link
                      href={`/article/${new Date(article.date).getUTCFullYear()}/${String(new Date(article.date).getUTCMonth() + 1).padStart(2, '0')}/${String(new Date(article.date).getUTCDate()).padStart(2, '0')}/${formatUrlTitle(article.title)}`}
                      className="text-sm font-medium text-blue-500 hover:text-blue-600 transition-colors"
                    >
                      阅读更多
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* 分页控件 */}
          <Pagination 
            currentPage={currentPage} 
            totalPages={totalPages} 
            basePath="/"
          />
        </div>
      </div>
    </div>
  );
};

export default HomePage;

// 导出getStaticProps函数以在构建时生成静态页面
export const getStaticProps: GetStaticProps<HomePageProps> = async (context) => {
  try {
    // 从查询参数中获取页码，默认为第1页
    const page = context.params?.page ? Number(context.params.page) : 1;
    const currentPage = Math.max(1, isNaN(page) ? 1 : page);
    
    // 每页显示的文章数量
    const pageSize = 10;
    
    // 计算偏移量
    const offset = (currentPage - 1) * pageSize;
    
    // 获取文章总数
    const totalCount = await prisma.article.count();
    
    // 计算总页数
    const totalPages = Math.ceil(totalCount / pageSize);
    
    // 从数据库查询当前页的文章
    const dbArticles = await prisma.article.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        createdAt: true
      },
      orderBy: {
        createdAt: 'desc' // 按创建时间倒序排列，最新的文章排在前面
      },
      skip: offset,
      take: pageSize
    });
    
    // 转换数据库模型为前端需要的ArticleMeta格式
    const articles: ArticleMeta[] = dbArticles.map((article) => ({
      id: article.id,
      title: article.title,
      excerpt: article.description || '',
      date: article.createdAt.toISOString(),
      categories: [], // 目前数据库模型中没有categories字段
      imageUrl: '', // 设置默认空字符串以避免undefined
      imageAlt: '', // 设置默认空字符串以避免undefined
    }));
    
    return {
      props: {
        articles,
        currentPage,
        totalPages
      },
      // 设置revalidate以支持增量静态再生
      revalidate: 60 // 每60秒重新生成
    };
  } catch (error) {
    console.error('从数据库获取文章数据失败:', error);
    return {
      props: {
        articles: [],
        currentPage: 1,
        totalPages: 1
      }
    };
  }
};

// 首页使用getStaticProps获取数据，不需要getStaticPaths
export const revalidate = 60; // 每分钟重新生成静态页面
