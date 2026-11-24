'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ActiveLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  activeClassName?: string;
  inactiveClassName?: string;
  onClick?: () => void;
}

export default function ActiveLink({
  href,
  children,
  className = '',
  activeClassName = 'text-link font-semibold underline decoration-link/60 decoration-2 underline-offset-[6px]',
  inactiveClassName = 'text-secondary-text hover:text-link',
  onClick,
}: ActiveLinkProps) {
  const pathname = usePathname();

  const active =
    href === '/'
      ? pathname === '/' || pathname.startsWith('/page/')
      : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'text-sm font-ui leading-normal transition-colors',
        active ? activeClassName : inactiveClassName,
        className,
      )}
      onClick={onClick}
    >
      {children}
    </Link>
  );
}
