import '../styles/globals.css'
import { Analytics } from '@vercel/analytics/react'

export const metadata = {
  title: 'Blog',
  description: '技术博客',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
      <Analytics />
    </html>
  )
}

