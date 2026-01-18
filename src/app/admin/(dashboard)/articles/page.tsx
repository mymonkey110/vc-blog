'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Search, Plus, MoreHorizontal, Edit2, Trash2, Settings } from 'lucide-react';
import { getArticles, deleteArticle } from './actions';
import { ArticleModel } from '@/generated/prisma/models';

export default function ArticlesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [articles, setArticles] = useState<ArticleModel[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchArticles();
  }, [currentPage, pageSize]);

  const fetchArticles = async () => {
    try {
      setIsLoading(true);
      const data = await getArticles(currentPage, pageSize);
      setArticles(data.articles);
      setTotalPages(data.totalPages);
      setTotalCount(data.totalCount);
    } catch (error) {
      console.error('Failed to fetch articles:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this article?')) {
      try {
        await deleteArticle(id);
        fetchArticles();
      } catch (error) {
        console.error('Failed to delete article:', error);
      }
    }
  };

  const filteredArticles = articles.filter((article) =>
    article.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handlePageChange = (page: number) => setCurrentPage(page);

  return (
    <div className="min-h-screen bg-white text-stone-900 font-sans selection:bg-stone-200">
      {/* Header Area */}
      <header className="px-8 py-12 max-w-7xl mx-auto border-b border-stone-100">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-6xl font-serif tracking-tight mb-2 text-stone-900">Articles.</h1>
            <p className="text-stone-500 font-light text-lg tracking-wide uppercase">
              Management & Editorial • {totalCount} Entries
            </p>
          </div>
          <Link href="/admin/articles/new">
            <Button className="rounded-none bg-stone-900 text-white hover:bg-stone-800 px-8 py-6 text-lg font-light tracking-wide transition-all hover:px-10 shadow-none border border-stone-900 hover:shadow-xl">
              <Plus className="h-5 w-5 mr-2" />
              WRITE SOMETHING
            </Button>
          </Link>
        </div>
      </header>

      {/* Toolbar */}
      <div className="px-8 py-8 max-w-7xl mx-auto flex justify-between items-center sticky top-20 bg-white/95 backdrop-blur-sm z-40 border-b border-stone-100 transition-all">
        <div className="relative w-96 group">
          <Search className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-400 group-focus-within:text-stone-900 transition-colors" />
          <input
            className="w-full bg-transparent border-b border-stone-200 py-2 pl-8 pr-4 text-stone-900 placeholder:text-stone-300 focus:outline-none focus:border-stone-900 transition-colors font-light text-lg"
            placeholder="Search stories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex gap-6 text-sm font-medium text-stone-400 uppercase tracking-widest">
          <span className="text-stone-900 border-b-2 border-stone-900 pb-1 cursor-pointer">
            All
          </span>
          <span className="hover:text-stone-900 cursor-pointer transition-colors pb-1 border-b-2 border-transparent hover:border-stone-200">
            Published
          </span>
          <span className="hover:text-stone-900 cursor-pointer transition-colors pb-1 border-b-2 border-transparent hover:border-stone-200">
            Drafts
          </span>
        </div>
      </div>

      {/* Editorial Table */}
      <div className="px-8 max-w-7xl mx-auto pb-20">
        {/* Table Header - Minimal */}
        <div className="grid grid-cols-12 gap-4 py-4 border-b-2 border-stone-900 text-xs font-bold uppercase tracking-widest text-stone-400">
          <div className="col-span-5">Title</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-2">Category</div>
          <div className="col-span-2">Date</div>
          <div className="col-span-1 text-right">Actions</div>
        </div>

        {/* Table Body */}
        {isLoading ? (
          <div className="py-20 text-center text-stone-300 font-light text-xl animate-pulse">
            Loading content...
          </div>
        ) : filteredArticles.length > 0 ? (
          <div>
            {filteredArticles.map((article) => (
              <div
                key={article.id}
                className="group relative border-b border-stone-100 transition-all duration-300 hover:bg-stone-50"
              >
                <div className="grid grid-cols-12 gap-4 py-8 items-center">
                  {/* Title Column */}
                  <div
                    className="col-span-5 pr-8 cursor-pointer"
                    onClick={() => (window.location.href = `/admin/articles/edit/${article.id}`)}
                  >
                    <h3 className="text-2xl font-serif font-medium text-stone-900 mb-1 group-hover:underline decoration-1 underline-offset-4 decoration-stone-400 transition-all">
                      {article.title}
                    </h3>
                    <p className="text-stone-400 text-sm font-light truncate max-w-md group-hover:text-stone-500 transition-colors">
                      {article.description || 'No description provided...'}
                    </p>
                  </div>

                  {/* Status Column */}
                  <div className="col-span-2">
                    <span
                      className={`inline-block px-3 py-1 text-xs tracking-widest uppercase border ${
                        article.status === 'publish'
                          ? 'border-stone-900 text-stone-900 bg-stone-50'
                          : 'border-stone-300 text-stone-400 dashed'
                      }`}
                    >
                      {article.status === 'publish' ? 'Published' : 'Draft'}
                    </span>
                  </div>

                  {/* Category Column */}
                  <div className="col-span-2">
                    <span className="text-sm font-medium text-stone-500 uppercase tracking-wide border-b border-transparent hover:border-stone-300 cursor-pointer inline-block transition-colors">
                      {article.category || 'Uncategorized'}
                    </span>
                  </div>

                  {/* Date Column */}
                  <div className="col-span-2">
                    <span className="text-stone-400 font-mono text-sm">
                      {new Date(article.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                      })}
                    </span>
                  </div>

                  {/* Actions Column (Operate Icon) */}
                  <div className="col-span-1 flex justify-end items-center relative">
                    <div className="group/actions relative inline-flex">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-stone-300 hover:text-stone-900 hover:bg-stone-100 rounded-none transition-colors"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>

                      {/* Popup Actions */}
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center bg-white border border-stone-200 shadow-lg opacity-0 invisible group-hover/actions:opacity-100 group-hover/actions:visible transition-all duration-200 pr-1 pl-1 py-1 gap-1 z-10 translate-x-4 group-hover/actions:translate-x-[calc(-100%+2rem)] pointer-events-none group-hover/actions:pointer-events-auto">
                        <Link href={`/admin/articles/edit/${article.id}`}>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 w-7 p-0 text-stone-500 hover:text-stone-900 hover:bg-stone-50 rounded-sm"
                            title="Edit"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </Button>
                        </Link>
                        <div className="w-px h-4 bg-stone-200"></div>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 w-7 p-0 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-sm"
                          onClick={() => handleDelete(article.id)}
                          title="Delete"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center">
            <p className="text-stone-300 font-light text-2xl font-serif italic">
              "Silence is golden."
            </p>
            <p className="text-stone-400 text-sm mt-2 uppercase tracking-widest">
              No stories found
            </p>
          </div>
        )}

        {/* Pagination */}
        {!isLoading && filteredArticles.length > 0 && (
          <div className="mt-12 flex justify-between items-center border-t border-stone-100 pt-8">
            <div className="text-xs uppercase tracking-widest text-stone-400">
              Page {currentPage} of {totalPages}
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="rounded-none border-stone-200 text-stone-600 hover:bg-stone-900 hover:text-white transition-colors"
              >
                PREVIOUS
              </Button>
              <Button
                variant="outline"
                onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="rounded-none border-stone-200 text-stone-600 hover:bg-stone-900 hover:text-white transition-colors"
              >
                NEXT
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
