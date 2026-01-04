import Link from 'next/link';
import prisma from '@/lib/db';
import Pagination from '@/components/pagination';
import { CoverImage } from '@/components/ui/CoverImage';
import type { ArticleMeta } from '@/types/article';

const formatUrlTitle = (slug: string): string => {
  return slug || '';
};

const pageSize = 10;

export default async function BlogList({ currentPage }: { currentPage: number }) {
  const offset = (currentPage - 1) * pageSize;

  const totalCount = await prisma.article.count();
  const totalPages = Math.ceil(totalCount / pageSize);

  const dbArticles = await prisma.article.findMany({
    select: {
      id: true,
      title: true,
      description: true,
      createdAt: true,
      slug: true,
      coverPic: true,
    },
    orderBy: { createdAt: 'desc' },
    skip: offset,
    take: pageSize,
  });

  const articles: (ArticleMeta & { slug: string })[] = dbArticles.map((article) => ({
    id: article.id,
    title: article.title,
    excerpt: article.description || '',
    date: article.createdAt?.toISOString() || new Date().toISOString(),
    categories: [],
    imageUrl: article.coverPic || '',
    imageAlt: '',
    slug: article.slug || '',
    coverPic: article.coverPic,
  }));

  return (
    <div className="flex flex-1 justify-center px-40 py-5">
      <div className="flex max-w-[960px] flex-1 flex-col">
        <h2 className="px-4 py-3 pt-5 title-1 leading-tight tracking-[-0.015em]">最新文章</h2>

        <div className="grid gap-8 p-4">
          {articles.map((article, index) => (
            <div key={article.id} className="flex flex-col sm:flex-row items-start gap-4 py-4 border-b border-gray-100 last:border-b-0">
              <div className="flex flex-col gap-2 flex-1 min-w-0">
                <h2 className="title-3 leading-tight">
                  <Link
                    href={`/article/${new Date(article.date).getUTCFullYear()}/${String(new Date(article.date).getUTCMonth() + 1).padStart(2, '0')}/${String(new Date(article.date).getUTCDate()).padStart(2, '0')}/${formatUrlTitle(article.slug)}`}
                    className="hover:text-blue-600 transition-colors duration-200"
                  >
                    {article.title}
                  </Link>
                </h2>

                <p className="text-base font-body text-secondary-text leading-normal line-clamp-3">
                  {article.excerpt || '阅读更多...'}
                </p>

                <div className="flex flex-wrap items-center gap-2 pt-2">
                  <span className="text-sm font-ui text-secondary-text">
                    {article.date
                      ? new Date(article.date).toLocaleDateString('zh-CN', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })
                      : ''}
                  </span>
                  <span className="text-gray-500 text-xs font-light">•</span>
                  {/* 分类标签位置 - 暂时隐藏但保留位置 */}
                  <a className="text-sm font-ui text-secondary-text" href="#">
                    分类
                  </a>
                  <a className="text-sm font-ui text-secondary-text" href="#">
                    标签
                  </a>
                </div>
              </div>

              <div className="flex-shrink-0 w-full sm:w-[200px] h-auto aspect-[3/2] order-first sm:order-last">
                <CoverImage
                  src={article.coverPic}
                  alt={article.title}
                  className="w-full h-full shadow-sm hover:shadow-md transition-shadow duration-200"
                  priority={index < 3} // Priority loading for first 3 images
                />
              </div>
            </div>
          ))}
        </div>

        <Pagination currentPage={currentPage} totalPages={totalPages} basePath="/" />
      </div>
    </div>
  );
}
