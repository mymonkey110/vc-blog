import React from 'react';
import Link from 'next/link';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath?: string;
}

const Pagination: React.FC<PaginationProps> = ({ 
  currentPage, 
  totalPages}) => {
  // 生成页码数组，移动端显示更少页码
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    const maxMobilePages = 3; // 移动端最多显示3个页码
    
    // 检测是否为移动设备（这里使用简单的逻辑，实际项目中可能需要更复杂的检测）
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
    const maxPages = isMobile ? maxMobilePages : maxVisiblePages;
    
    if (totalPages <= maxPages) {
      // 如果总页数较少，直接显示所有页码
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (isMobile) {
        // 移动端简化显示逻辑
        if (currentPage <= 2) {
          pages.push(1, 2, 3);
        } else if (currentPage >= totalPages - 1) {
          pages.push(totalPages - 2, totalPages - 1, totalPages);
        } else {
          pages.push(currentPage - 1, currentPage, currentPage + 1);
        }
      } else {
        // 桌面端完整显示逻辑
        pages.push(1);
        
        const startPage = Math.max(2, currentPage - 1);
        const endPage = Math.min(totalPages - 1, currentPage + 1);
        
        if (startPage > 2) {
          pages.push('...');
        }
        
        for (let i = startPage; i <= endPage; i++) {
          pages.push(i);
        }
        
        if (endPage < totalPages - 1) {
          pages.push('...');
        }
        
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  const pageNumbers = getPageNumbers();

  // 根据basePath生成正确的链接
  const getPageLink = (page: number) => {
    if (page === 1) {
      return '/'
    }
    return `/page/${page}`
  }

  return (
    <div className="flex items-center justify-center p-4 gap-1 sm:gap-2">
      {/* 上一页按钮 */}
      <Link
        href={getPageLink(Math.max(1, currentPage - 1))}
        className={`flex size-10 sm:size-12 items-center justify-center rounded-full transition-colors font-ui ${currentPage === 1 ? 'opacity-50 cursor-not-allowed text-secondary-text' : 'hover:bg-surface text-primary-text'}`}
        aria-disabled={currentPage === 1}
        aria-label="上一页"
      >
        <span className="text-lg">←</span>
      </Link>

      {/* 页码按钮 */}
      {pageNumbers.map((page, index) => (
        <React.Fragment key={index}>
          {typeof page === 'number' ? (
            <Link
              href={getPageLink(page)}
              className={`flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full text-sm sm:text-base font-ui leading-normal transition-colors ${currentPage === page ? 'bg-surface font-bold text-primary-text' : 'hover:bg-surface text-secondary-text'}`}
              aria-label={`第${page}页`}
            >
              {page}
            </Link>
          ) : (
            <span className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full text-sm sm:text-base font-ui leading-normal text-secondary-text">
              {page}
            </span>
          )}
        </React.Fragment>
      ))}

      {/* 下一页按钮 */}
      <Link
        href={getPageLink(Math.min(totalPages, currentPage + 1))}
        className={`flex size-10 sm:size-12 items-center justify-center rounded-full transition-colors font-ui ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed text-secondary-text' : 'hover:bg-surface text-primary-text'}`}
        aria-disabled={currentPage === totalPages}
        aria-label="下一页"
      >
        <span className="text-lg">→</span>
      </Link>
    </div>
  );
};

export default Pagination;