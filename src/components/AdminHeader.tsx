'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Button } from './ui/button';
import { Plus, ArrowUpRight, LogOut, LayoutGrid } from 'lucide-react';
import { logout } from '@/actions/auth';

export default function AdminHeader() {
  const pathname = usePathname();

  return (
    <header className="bg-white border-b border-stone-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-8 h-20 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-12">
          <Link href="/admin/articles" className="group">
            <h1 className="text-2xl font-serif font-bold text-stone-900 tracking-tight flex items-center gap-2">
              <span className="w-8 h-8 bg-stone-900 text-white flex items-center justify-center text-lg font-serif italic rounded-none group-hover:bg-stone-700 transition-colors">
                V
              </span>
              VC BLOG
            </h1>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/admin/articles"
              className={`text-xs font-bold uppercase tracking-widest transition-colors py-1 border-b-2 ${
                pathname.startsWith('/admin/articles')
                  ? 'text-stone-900 border-stone-900'
                  : 'text-stone-400 border-transparent hover:text-stone-900'
              }`}
            >
              ARTICLES
            </Link>
          </nav>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-6">
          <Link href="/" target="_blank">
            <Button
              variant="ghost"
              className="text-stone-400 hover:text-stone-900 hover:bg-transparent px-0 font-normal uppercase tracking-wider text-xs flex items-center gap-1"
            >
              View Site <ArrowUpRight className="h-3 w-3" />
            </Button>
          </Link>

          <div className="h-4 w-px bg-stone-200"></div>

          <form action={logout}>
            <Button
              variant="ghost"
              type="submit"
              className="text-stone-400 hover:text-red-600 hover:bg-transparent px-0 text-xs font-medium uppercase tracking-wider"
            >
              Sign Out
            </Button>
          </form>
        </div>
      </div>
    </header>
  );
}
