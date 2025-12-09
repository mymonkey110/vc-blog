'use client'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Button } from './ui/button'
import { logout } from '@/actions/auth'

export default function Menu() {
  const pathname = usePathname()

  return (
    <aside className="hidden w-64 flex-col border-r border-stone-200 bg-white p-4 sm:flex">
      <nav className="flex flex-col gap-1">
        <Link 
          href="/admin" 
          className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
            pathname === '/admin' 
              ? 'bg-stone-100 font-bold text-stone-900' 
              : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
          }`}
        >
          <svg className="h-5 w-5" fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
            <rect height="9" rx="1" width="7" x="3" y="3"></rect>
            <rect height="5" rx="1" width="7" x="14" y="3"></rect>
            <rect height="9" rx="1" width="7" x="3" y="15"></rect>
            <rect height="5" rx="1" width="7" x="14" y="11"></rect>
          </svg>
          <span>仪表盘</span>
        </Link>
        <Link 
          href="/admin/articles" 
          className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
            pathname.startsWith('/admin/articles') 
              ? 'bg-stone-100 font-bold text-stone-900' 
              : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
          }`}
        >
          <svg className="h-5 w-5" fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
          </svg>
          <span>文章管理</span>
        </Link>
        <form action={logout} className="w-full">
          <Button 
            type="submit"
            className="flex items-center gap-3 w-full rounded-md px-3 py-2 text-sm font-medium text-stone-600 hover:bg-stone-100 hover:text-stone-900 transition-colors mt-4"
          >
            <svg className="h-5 w-5" fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            <span>退出</span>
          </Button>
        </form>
      </nav>
    </aside>
  )
}