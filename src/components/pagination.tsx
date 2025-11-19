import React from 'react';
import Link from 'next/link';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath?: string;
}

const Pagination: React.FC<PaginationProps> = ({ 
  currentPage, 
  totalPages, 
  basePath = '/' 
}) => {
  // 生成页码数组，最多显示当前页周围的几个页码
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    // 简单的分页逻辑，显示当前页及其周围的页码
    if (totalPages <= maxVisiblePages) {
      // 如果总页数较少，直接显示所有页码
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // 显示第一页
      pages.push(1);
      
      // 显示当前页附近的页码
      const startPage = Math.max(2, currentPage - 1);
      const endPage = Math.min(totalPages - 1, currentPage + 1);
      
      // 如果起始页大于2，添加省略号
      if (startPage > 2) {
        pages.push('...');
      }
      
      // 添加当前页附近的页码
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      
      // 如果结束页小于总页数减1，添加省略号
      if (endPage < totalPages - 1) {
        pages.push('...');
      }
      
      // 显示最后一页
      pages.push(totalPages);
    }
    
    return pages;
  };

  const pageNumbers = getPageNumbers();

  // 根据basePath生成正确的链接
  const getPageLink = (page: number) => {
    if (page === 1) {
      return '/'
    }
    return `/?page=${page}`
  }

  return (
    <div className="flex items-center justify-center p-4">
      {/* 上一页按钮 */}
      <Link
        href={getPageLink(Math.max(1, currentPage - 1))}
        className={`flex size-10 items-center justify-center rounded-full transition-colors font-ui ${currentPage === 1 ? 'opacity-50 cursor-not-allowed text-secondary-text' : 'hover:bg-surface text-primary-text'}`}
        aria-disabled={currentPage === 1}
      >
        <span className="text-lg">←</span>
      </Link>

      {/* 页码按钮 */}
      {pageNumbers.map((page, index) => (
        <React.Fragment key={index}>
          {typeof page === 'number' ? (
            <Link
              href={getPageLink(page)}
              className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-ui leading-normal transition-colors ${currentPage === page ? 'bg-surface font-bold text-primary-text' : 'hover:bg-surface text-secondary-text'}`}
            >
              {page}
            </Link>
          ) : (
            <span className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-ui leading-normal text-secondary-text">
              {page}
            </span>
          )}
        </React.Fragment>
      ))}

      {/* 下一页按钮 */}
      <Link
        href={getPageLink(Math.min(totalPages, currentPage + 1))}
        className={`flex size-10 items-center justify-center rounded-full transition-colors font-ui ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed text-secondary-text' : 'hover:bg-surface text-primary-text'}`}
        aria-disabled={currentPage === totalPages}
      >
        <span className="text-lg">→</span>
      </Link>
    </div>
  );
};

export default Pagination;