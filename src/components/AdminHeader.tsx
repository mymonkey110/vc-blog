'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Button } from './ui/button';
import { Plus, Home } from 'lucide-react';
import { logout } from '@/actions/auth';

export default function AdminHeader() {
  const pathname = usePathname();

  return (
    <header className="bg-white border-b border-stone-200 sticky top-0 z-10">
      <div className="flex items-center justify-between px-6 py-4">
        <h1 className="text-2xl font-bold text-stone-900">文章管理</h1>
        <div className="flex items-center gap-3">
          {pathname.startsWith('/admin/articles') && (
            <Link href="/admin/articles/new">
              <Button className="bg-stone-900 hover:bg-stone-900/90">
                <Plus className="h-4 w-4 mr-2" />
                新建文章
              </Button>
            </Link>
          )}
          <Link href="/">
            <Button
              variant="ghost"
              className="text-stone-600 hover:text-stone-900 hover:bg-stone-100"
            >
              <Home className="h-4 w-4 mr-2" />
              查看首页
            </Button>
          </Link>
          <form action={logout}>
            <Button
              variant="ghost"
              size="icon"
              type="submit"
              className="text-stone-600 hover:text-stone-900 hover:bg-stone-100"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                height="24"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                width="24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
            </Button>
          </form>
        </div>
      </div>
    </header>
  );
}
