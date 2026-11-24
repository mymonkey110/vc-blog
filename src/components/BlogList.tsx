import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import prisma from '@/lib/db';
import Pagination from '@/components/pagination';
import { CoverImage } from '@/components/ui/CoverImage';

const PAGE_SIZE = 10;
const FEATURED_CATEGORY_LIMIT = 6;

const buildArticleHref = (createdAt: Date | null, slug: string): string => {
  const date = createdAt ? new Date(createdAt) : new Date();
  const yyyy = date.getUTCFullYear();
  const mm = String(date.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(date.getUTCDate()).padStart(2, '0');
  return `/article/${yyyy}/${mm}/${dd}/${slug}`;
};

const formatUtcDate = (createdAt: Date | null): string => {
  if (!createdAt) return '';
  const date = new Date(createdAt);
  const yyyy = date.getUTCFullYear();
  const mm = String(date.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(date.getUTCDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

export default async function BlogList({ currentPage }: { currentPage: number }) {
  const offset = (currentPage - 1) * PAGE_SIZE;

  const [totalCount, dbArticles, categoryGroups] = await Promise.all([
    prisma.article.count({
      where: { status: 'publish' },
    }),
    prisma.article.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        createdAt: true,
        slug: true,
        coverPic: true,
        category: true,
      },
      where: { status: 'publish' },
      orderBy: { createdAt: 'desc' },
      skip: offset,
      take: PAGE_SIZE,
    }),
    currentPage === 1
      ? prisma.article.groupBy({
          by: ['category'],
          _count: { id: true },
          where: {
            status: 'publish',
            AND: [{ category: { not: null } }, { category: { not: '' } }],
          },
          orderBy: { _count: { id: 'desc' } },
          take: FEATURED_CATEGORY_LIMIT,
        })
      : Promise.resolve([]),
  ]);

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);
  const topCategories = categoryGroups.flatMap((group) => {
    const name = typeof group.category === 'string' ? group.category.trim() : '';
    const count = group._count?.id ?? 0;
    return name ? [{ name, count }] : [];
  });

  return (
    <div className="mx-auto w-full max-w-[960px] px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {currentPage === 1 ? (
        <header className="pb-8 sm:pb-10 border-b border-border">
          <h1 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-primary-text text-balance">
            修行码农
          </h1>
          <p className="mt-3 max-w-2xl text-base sm:text-[17px] font-body text-secondary-text leading-relaxed">
            Michael Jiang 的个人技术博客，自 2014 年起记录软件架构、DDD、分布式系统与工程实践。
          </p>

          {topCategories.length > 0 && (
            <nav aria-label="热门分类" className="mt-5 flex flex-wrap items-center gap-2">
              {topCategories.map((cat) => (
                <Link
                  key={cat.name}
                  href={`/categories/${encodeURIComponent(cat.name)}`}
                  className="inline-flex min-h-[36px] items-center gap-1.5 rounded-full border border-border bg-surface/65 px-3.5 py-1.5 text-sm font-ui text-secondary-text transition-colors hover:border-link/40 hover:bg-surface hover:text-link"
                >
                  <span>{cat.name}</span>
                  <span className="font-mono text-xs tabular-nums opacity-75">{cat.count}</span>
                </Link>
              ))}
              <Link
                href="/categories"
                className="inline-flex min-h-[36px] items-center gap-1 px-2.5 py-1.5 text-sm font-ui text-link transition-colors hover:text-link-hover hover:underline"
              >
                <span>全部分类</span>
                <ArrowRight className="size-3.5" strokeWidth={1.75} aria-hidden="true" />
              </Link>
            </nav>
          )}
        </header>
      ) : (
        <header className="pb-6 border-b border-border flex flex-wrap items-baseline justify-between gap-3">
          <h1 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-primary-text text-balance">
            全部文章 · 第 {currentPage} 页
          </h1>
          <span className="font-mono text-xs sm:text-sm text-secondary-text tabular-nums">
            共 {totalCount} 篇
          </span>
        </header>
      )}

      <section aria-labelledby={currentPage === 1 ? 'latest-articles-heading' : undefined}>
        {currentPage === 1 && (
          <div className="mt-8 sm:mt-10 mb-2 flex items-baseline justify-between gap-4">
            <h2
              id="latest-articles-heading"
              className="font-heading text-lg sm:text-xl font-semibold text-primary-text"
            >
              最新文章
            </h2>
            <span className="font-mono text-xs sm:text-sm text-secondary-text tabular-nums">
              共 {totalCount} 篇
            </span>
          </div>
        )}

        {dbArticles.length === 0 ? (
          <div className="my-12 rounded-lg border border-border bg-surface/50 px-6 py-12 text-center">
            <p className="font-heading text-lg font-semibold text-primary-text">暂无已发布文章</p>
            <p className="mt-2 text-sm font-body text-secondary-text">
              目前还没有可展示的文章内容，你可以先浏览{' '}
              <Link href="/about" className="text-link hover:text-link-hover hover:underline">
                关于页面
              </Link>{' '}
              了解作者。
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {dbArticles.map((article, index) => {
              const slug = article.slug || '';
              const articleHref = buildArticleHref(article.createdAt, slug);
              const utcDate = formatUtcDate(article.createdAt);
              const trimmedCategory = article.category?.trim() || '';
              const trimmedDescription = article.description?.trim() || '';
              const hasCover = Boolean(article.coverPic?.trim());

              return (
                <article key={article.id} className="py-6 sm:py-7 first:pt-4">
                  <div className="flex flex-col-reverse sm:flex-row sm:items-start gap-4 sm:gap-6">
                    <div className="flex flex-1 min-w-0 flex-col">
                      <h3 className="font-heading text-xl sm:text-[1.375rem] font-semibold leading-snug tracking-[-0.01em] text-primary-text text-balance">
                        <Link
                          href={articleHref}
                          className="block transition-colors duration-150 hover:text-link"
                        >
                          {article.title}
                        </Link>
                      </h3>

                      {trimmedDescription && (
                        <p className="mt-2.5 max-w-[68ch] text-[15px] sm:text-base font-body text-secondary-text leading-relaxed line-clamp-2">
                          {trimmedDescription}
                        </p>
                      )}

                      <div className="mt-3 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs sm:text-sm text-secondary-text">
                        {utcDate && (
                          <time
                            dateTime={article.createdAt?.toISOString()}
                            className="font-mono tabular-nums"
                          >
                            {utcDate}
                          </time>
                        )}
                        {utcDate && trimmedCategory && (
                          <span aria-hidden="true" className="text-border">
                            ·
                          </span>
                        )}
                        {trimmedCategory && (
                          <Link
                            href={`/categories/${encodeURIComponent(trimmedCategory)}`}
                            className="font-ui text-secondary-text transition-colors hover:text-link hover:underline"
                          >
                            {trimmedCategory}
                          </Link>
                        )}
                      </div>
                    </div>

                    {hasCover && (
                      <Link
                        href={articleHref}
                        aria-label={`阅读《${article.title}》`}
                        tabIndex={-1}
                        className="group/cover block w-full sm:w-[196px] sm:flex-shrink-0 aspect-[3/2] rounded-md overflow-hidden border border-border/80 bg-surface transition-shadow duration-200 hover:shadow-reading"
                      >
                        <CoverImage
                          src={article.coverPic}
                          alt={article.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover/cover:scale-[1.02]"
                          priority={index < 2}
                        />
                      </Link>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <Pagination currentPage={currentPage} totalPages={totalPages} basePath="/" />
    </div>
  );
}
