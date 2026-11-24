import React from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath?: string;
}

const buildDesktopPages = (currentPage: number, totalPages: number): (number | 'ellipsis')[] => {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const pages: (number | 'ellipsis')[] = [1];
  const startPage = Math.max(2, currentPage - 1);
  const endPage = Math.min(totalPages - 1, currentPage + 1);

  if (startPage > 2) {
    pages.push('ellipsis');
  }

  for (let page = startPage; page <= endPage; page++) {
    pages.push(page);
  }

  if (endPage < totalPages - 1) {
    pages.push('ellipsis');
  }

  pages.push(totalPages);
  return pages;
};

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, basePath = '/' }) => {
  if (totalPages <= 1) {
    return null;
  }

  const normalizedBase = basePath === '/' ? '' : basePath.replace(/\/$/, '');
  const getPageLink = (page: number) => {
    if (page <= 1) {
      return normalizedBase || '/';
    }
    return `${normalizedBase}/page/${page}`;
  };

  const pageItems = buildDesktopPages(currentPage, totalPages);
  const hasPrev = currentPage > 1;
  const hasNext = currentPage < totalPages;

  return (
    <nav
      aria-label="文章分页"
      className="mt-10 pt-6 border-t border-border flex items-center justify-between sm:justify-center gap-2"
    >
      {/* 上一页 */}
      {hasPrev ? (
        <Link
          href={getPageLink(currentPage - 1)}
          aria-label="上一页"
          className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center gap-1 rounded-md px-3 text-sm font-ui text-primary-text transition-colors hover:bg-surface hover:text-link"
        >
          <ChevronLeft className="size-4" strokeWidth={1.75} aria-hidden="true" />
          <span className="sm:hidden">上一页</span>
        </Link>
      ) : (
        <span
          aria-disabled="true"
          aria-label="上一页"
          className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center gap-1 rounded-md px-3 text-sm font-ui text-secondary-text/45 cursor-not-allowed select-none"
        >
          <ChevronLeft className="size-4" strokeWidth={1.75} aria-hidden="true" />
          <span className="sm:hidden">上一页</span>
        </span>
      )}

      {/* 移动端紧凑页码指示（纯 CSS 响应式，SSG 友好） */}
      <span className="sm:hidden font-mono text-sm text-secondary-text tabular-nums">
        第 {currentPage} / {totalPages} 页
      </span>

      {/* 桌面端页码列表 */}
      <div className="hidden sm:flex items-center gap-1">
        {pageItems.map((item, index) => {
          if (item === 'ellipsis') {
            return (
              <span
                key={`ellipsis-${index}`}
                aria-hidden="true"
                className="inline-flex min-h-[44px] min-w-[36px] items-center justify-center font-mono text-sm text-secondary-text"
              >
                …
              </span>
            );
          }

          if (item === currentPage) {
            return (
              <span
                key={item}
                aria-current="page"
                className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-md bg-primary-text font-mono text-sm font-semibold text-background tabular-nums"
              >
                {item}
              </span>
            );
          }

          return (
            <Link
              key={item}
              href={getPageLink(item)}
              aria-label={`第 ${item} 页`}
              className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-md font-mono text-sm text-secondary-text tabular-nums transition-colors hover:bg-surface hover:text-link"
            >
              {item}
            </Link>
          );
        })}
      </div>

      {/* 下一页 */}
      {hasNext ? (
        <Link
          href={getPageLink(currentPage + 1)}
          aria-label="下一页"
          className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center gap-1 rounded-md px-3 text-sm font-ui text-primary-text transition-colors hover:bg-surface hover:text-link"
        >
          <span className="sm:hidden">下一页</span>
          <ChevronRight className="size-4" strokeWidth={1.75} aria-hidden="true" />
        </Link>
      ) : (
        <span
          aria-disabled="true"
          aria-label="下一页"
          className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center gap-1 rounded-md px-3 text-sm font-ui text-secondary-text/45 cursor-not-allowed select-none"
        >
          <span className="sm:hidden">下一页</span>
          <ChevronRight className="size-4" strokeWidth={1.75} aria-hidden="true" />
        </span>
      )}
    </nav>
  );
};

export default Pagination;
