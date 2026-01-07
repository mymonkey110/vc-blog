'use client'

import Link from 'next/link'
import ActiveLink from '@/components/ActiveLink'
import { useState } from 'react'

export default function NavigationBar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <header className="border-b border-border">
      <div className="flex items-center justify-between px-4 sm:px-6 lg:px-10 py-3">
        {/* Logo */}
        <div className="flex items-center gap-3 text-primary-text">
          <div className="size-8 text-accent text-blue-600">
            <svg fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path d="M24 4L4 14v20l20 10 20-10V14L24 4zm0 6.5l15 8.5-15 8.5-15-8.5 15-8.5z"/>
              <path d="M24 22.5l10 5.75-10 5.75-10-5.75 10-5.75z"/>
              <path d="M24 15.5l7 4-7 4-7-4 7-4z"/>
              <path d="M24 29.5l4 2.25-4 2.25-4-2.25 4-2.25z"/>
            </svg>
          </div>
          <Link href="/" className="text-xl sm:text-2xl font-bold leading-tight tracking-wide text-primary-text">
            修行码农
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-9">
          <ActiveLink href="/" className="flex items-center gap-2 text-sm lg:text-base">
            <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            首页
          </ActiveLink>
          <ActiveLink href="/categories" className="flex items-center gap-2 text-sm lg:text-base">
            <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            分类
          </ActiveLink>
          <ActiveLink href="/about" className="flex items-center gap-2 text-sm lg:text-base">
            <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            关于
          </ActiveLink>
          <a href="/rss.xml" className="flex items-center gap-2 text-secondary-text hover:text-accent transition-colors text-sm lg:text-base" target="_blank" rel="noopener noreferrer">
            <svg className="size-4" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M6.18 15.64a2.18 2.18 0 0 1 2.18 2.18C8.36 19 7.38 20 6.18 20C5 20 4 19 4 17.82a2.18 2.18 0 0 1 2.18-2.18M4 4.44A15.56 15.56 0 0 1 19.56 20h-2.83A12.73 12.73 0 0 0 4 7.27V4.44m0 5.66a9.9 9.9 0 0 1 9.9 9.9h-2.83A7.07 7.07 0 0 0 4 12.93V10.1z" />
            </svg>
            RSS
          </a>
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMobileMenu}
          className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg hover:bg-surface transition-colors"
          aria-label="切换菜单"
        >
          <svg
            className="size-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            {isMobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <nav className="md:hidden border-t border-border bg-white">
          <div className="px-4 py-2 space-y-1">
            <ActiveLink 
              href="/" 
              className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-surface transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              首页
            </ActiveLink>
            <ActiveLink 
              href="/categories" 
              className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-surface transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              分类
            </ActiveLink>
            <ActiveLink 
              href="/about" 
              className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-surface transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              关于
            </ActiveLink>
            <a 
              href="/rss.xml" 
              className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-surface transition-colors text-secondary-text"
              target="_blank" 
              rel="noopener noreferrer"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <svg className="size-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M6.18 15.64a2.18 2.18 0 0 1 2.18 2.18C8.36 19 7.38 20 6.18 20C5 20 4 19 4 17.82a2.18 2.18 0 0 1 2.18-2.18M4 4.44A15.56 15.56 0 0 1 19.56 20h-2.83A12.73 12.73 0 0 0 4 7.27V4.44m0 5.66a9.9 9.9 0 0 1 9.9 9.9h-2.83A7.07 7.07 0 0 0 4 12.93V10.1z" />
              </svg>
              RSS
            </a>
          </div>
        </nav>
      )}
    </header>
  )
}