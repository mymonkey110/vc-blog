'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface ActiveLinkProps {
  href: string
  children: React.ReactNode
  className?: string
}

export default function ActiveLink({ href, children, className = '' }: ActiveLinkProps) {
  const pathname = usePathname()
  
  const isActive = (href: string) => {
    if (href === '/' && pathname === '/') return true
    if (href !== '/' && pathname.startsWith(href)) return true
    return false
  }

  return (
    <Link 
      href={href} 
      className={`text-sm font-ui leading-normal transition-colors ${
        isActive(href) ? 'text-accent' : 'hover:text-accent text-secondary-text'
      } ${className}`}
    >
      {children}
    </Link>
  )
}