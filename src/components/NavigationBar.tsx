import Link from 'next/link'
import ActiveLink from '@/components/ActiveLink'

export default function NavigationBar() {
  return (
    <header className="flex items-center justify-between border-b border-border px-10 py-3 whitespace-nowrap">
      <div className="flex items-center gap-3 text-primary-text">
        <div className="size-8 text-accent">
          <svg fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
            <path d="M24 4L4 14v20l20 10 20-10V14L24 4zm0 6.5l15 8.5-15 8.5-15-8.5 15-8.5z"/>
            <path d="M24 22.5l10 5.75-10 5.75-10-5.75 10-5.75z"/>
            <path d="M24 15.5l7 4-7 4-7-4 7-4z"/>
            <path d="M24 29.5l4 2.25-4 2.25-4-2.25 4-2.25z"/>
          </svg>
        </div>
        <Link href="/" className="text-2xl font-bold leading-tight tracking-wide text-primary-text">修行码农</Link>
      </div>

      <div className="flex flex-1 justify-end gap-8">
        <div className="flex items-center gap-9">
          <ActiveLink href="/" className="flex items-center gap-2">
            <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            首页
          </ActiveLink>
          <ActiveLink href="/categories" className="flex items-center gap-2">
            <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            分类
          </ActiveLink>
          <ActiveLink href="/about" className="flex items-center gap-2">
            <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            关于
          </ActiveLink>
        </div>
      </div>
    </header>
  )
}