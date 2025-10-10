import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

// 文章数据接口
export interface Article {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  categories: string[];
  imageUrl: string;
  imageAlt: string;
}

const HomePage: React.FC = () => {
  // 模拟文章数据
  const articles: Article[] = [
    {
      id: 1,
      title: '探索人工智能的未来趋势',
      excerpt: '深入了解人工智能领域的最新发展，包括机器学习、自然语言处理等技术。',
      date: '2023年10月26日',
      categories: ['人工智能', '技术趋势'],
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBHHAYNN0OfUPzzPXlz_JMmyw7WlS_7JgOGa8ABl0HPE7LDBUhqzqvKRa04UjrUPxL03w-wvZqMNUBNkjS5nCnocFIz14Eipd7NAw0Wgg44VvnK7bsBX5LbK9wwlxPLz453mREaJipB6oqUeNwPdalsEcDFJLjM7P2C55RqYPE74GdyWg_z6xUbKsHPH7aGpeKXBqT4CmV3GFxdxu03vhuf_2omnjG8TyoSSEJRs8Pm-8XlV7UGY0W3NGmyAsqmePqUT1QIIasBezs',
      imageAlt: '探索人工智能的未来趋势',
    },
    {
      id: 2,
      title: '如何提升你的写作技巧',
      excerpt: '学习有效的写作技巧，提升你的表达能力和文章质量。',
      date: '2023年9月15日',
      categories: ['写作', '技巧'],
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBTYQb7bhy2nKqTscp9GMtOqnAilB7fFfYCJRvCsb86BrxMuwsYMTptwOiVhbFZOzD8Q4TPMODWE1iHpptCyHUAUTvz1ZiWaQfDCD4Bgh-rxnaGUmq3-vWgmxFE9wMgy4sI38y3DU1BZQFdjdSd3OKKogKMUTzTs7lNE_Ttz2J1wj_ABphhClUgSnaTZ9K5r9Z08tFT8MlimonrIbpGkkkVm4CjV60GL8FPaF0nZagsPrW7nsmzXp_Nl9dWuIfSTa8Szdx0xfJ-ZEU',
      imageAlt: '如何提升你的写作技巧',
    },
    {
      id: 3,
      title: '健康生活方式的建议',
      excerpt: '了解如何通过健康饮食、适量运动和良好的作息习惯来改善你的生活质量。',
      date: '2023年8月01日',
      categories: ['健康', '生活方式'],
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD1xSk1521Ng3ew26hundI2JcE7mFL1gKZbZOKb2szAo_KmTHHGzRO6p6dhL15M6cji8ERjMnwoNG4P7c-cYWv_ZXn0j0Lu1MiJ9kbDpAFdMYq5Snit_5oJvNqHodS2-f-7xdWBWpfFUFsMHejiggP6ac101z6bfq-cnJBQw0AsIe3ANixi41LHOGtYncquBOCDcbX_Yq9f1I306xTnqprg3W50uXZ2-ipy1axhNTm9hDzyupbthA6SPwyAODyitWSmX8Z5foB8Ngc',
      imageAlt: '健康生活方式的建议',
    },
    {
      id: 4,
      title: '旅行见闻：探索未知之地',
      excerpt: '分享旅行中的见闻和体验，带你领略不同文化的魅力。',
      date: '2023年7月10日',
      categories: ['旅行', '文化'],
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD4C_EXdkhuKxQgDxFPxvBVGNOCYRnDoSwV9mKnsDsOYR5Ea9xDFaQbZtSLBRU9CI6oaS2ga6BRgFW7_AikgjDCXkxbAoeHfYhJcNf7ziQka7V0PD9xZjCV5I0bIfE04h1Hvvz-G2hdgJaKkaCToWI2xKfkQwPTWQMb2q_uHXeBfxguaBEqaDH69yeUkQ6wSDI99WVt5VTHNmc6IXRPaPorg5s6KA_zJkAUET5DNr9McLOXo-_WhsztjOQxJbljCyiYa1_8gOcOsgQ',
      imageAlt: '旅行见闻：探索未知之地',
    },
  ];

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
          <div className="grid gap-8 p-4">
            {articles.map((article) => (
              <div key={article.id} className="flex flex-col items-start gap-4 py-4 sm:flex-row">
                <div className="flex flex-1 flex-col gap-2">
                  <p className="text-2xl font-bold leading-tight font-playfair">{article.title}</p>
                  <p className="text-base font-normal leading-normal">{article.excerpt}</p>
                  <div className="flex flex-wrap items-center gap-2 pt-2">
                    <span className="text-xs font-light text-secondary-text">{article.date}</span>
                    <span className="text-xs font-light text-secondary-text">•</span>
                    {article.categories.map((category, index) => (
                      <React.Fragment key={index}>
                        <Link href={`/categories/${category}`} className="text-xs font-light text-secondary-text">
                          {category}
                        </Link>
                        {index < article.categories.length - 1 && (
                          <span className="text-xs font-light text-secondary-text">•</span>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
                <div className="flex-shrink-0 h-auto w-full sm:w-[200px] aspect-[3/2]">
                  <Image 
                    src={article.imageUrl} 
                    alt={article.imageAlt} 
                    width={200} 
                    height={133} 
                    className="h-full w-full object-cover"
                    layout="responsive"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* 分页控件 */}
          <div className="flex items-center justify-center p-4">
            <Link href="#" className="flex size-10 items-center justify-center">
              <span className="material-symbols-outlined">arrow_back_ios</span>
            </Link>
            <Link href="#" className="flex h-10 w-10 items-center justify-center rounded-full bg-background font-bold text-sm leading-normal tracking-[0.015em]">
              1
            </Link>
            <Link href="#" className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-normal leading-normal">
              2
            </Link>
            <Link href="#" className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-normal leading-normal">
              3
            </Link>
            <span className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-normal leading-normal">...</span>
            <Link href="#" className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-normal leading-normal">
              10
            </Link>
            <Link href="#" className="flex size-10 items-center justify-center">
              <span className="material-symbols-outlined">arrow_forward_ios</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;