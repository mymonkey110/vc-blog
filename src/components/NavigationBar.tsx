'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Folder, Home, Menu, Rss, User, X } from 'lucide-react';
import ActiveLink from '@/components/ActiveLink';

const NAV_ITEMS = [
  { href: '/', label: '首页', icon: Home },
  { href: '/categories', label: '分类', icon: Folder },
  { href: '/about', label: '关于', icon: User },
] as const;

export default function NavigationBar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!isMobileMenuOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMobileMenuOpen]);

  return (
    <header className="border-b border-border bg-background/95">
      <div className="mx-auto flex h-16 max-w-[960px] items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="group inline-flex items-center gap-2.5 text-primary-text transition-colors hover:text-link"
        >
          <span
            aria-hidden="true"
            className="flex size-7 items-center justify-center rounded border border-primary-text/20 bg-surface font-heading text-sm font-bold text-primary-text transition-colors group-hover:border-link/40 group-hover:text-link"
          >
            修
          </span>
          <span className="font-heading text-lg sm:text-xl font-bold tracking-wide">修行码农</span>
        </Link>

        {/* Desktop Navigation */}
        <nav aria-label="主导航" className="hidden md:flex items-center gap-7">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
            <ActiveLink key={href} href={href} className="inline-flex items-center gap-1.5 py-1">
              <Icon className="size-4" strokeWidth={1.75} aria-hidden="true" />
              <span>{label}</span>
            </ActiveLink>
          ))}
          <a
            href="/rss.xml"
            className="inline-flex items-center gap-1.5 py-1 text-sm font-ui text-secondary-text transition-colors hover:text-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Rss className="size-4" strokeWidth={1.75} aria-hidden="true" />
            <span>RSS</span>
          </a>
        </nav>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setIsMobileMenuOpen((prev) => !prev)}
          className="md:hidden inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-md text-primary-text transition-colors hover:bg-surface hover:text-link"
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-nav"
          aria-label={isMobileMenuOpen ? '关闭导航菜单' : '打开导航菜单'}
        >
          {isMobileMenuOpen ? (
            <X className="size-5" strokeWidth={1.75} aria-hidden="true" />
          ) : (
            <Menu className="size-5" strokeWidth={1.75} aria-hidden="true" />
          )}
        </button>
      </div>

      {/* Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <nav
          id="mobile-nav"
          aria-label="移动端主导航"
          className="md:hidden border-t border-border bg-background"
        >
          <div className="mx-auto max-w-[960px] space-y-1 px-4 py-3">
            {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
              <ActiveLink
                key={href}
                href={href}
                activeClassName="bg-surface text-link font-semibold"
                inactiveClassName="text-primary-text hover:bg-surface/70 hover:text-link"
                className="flex min-h-[44px] items-center gap-3 rounded-md px-3 py-2.5 text-base"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Icon className="size-[18px]" strokeWidth={1.75} aria-hidden="true" />
                <span>{label}</span>
              </ActiveLink>
            ))}
            <a
              href="/rss.xml"
              className="flex min-h-[44px] items-center gap-3 rounded-md px-3 py-2.5 text-base font-ui text-secondary-text transition-colors hover:bg-surface/70 hover:text-link"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Rss className="size-[18px]" strokeWidth={1.75} aria-hidden="true" />
              <span>RSS 订阅</span>
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}
