import '../styles/globals.css'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/react'

export const metadata = {
  title: 'Blog',
  description: '技术博客',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
      <Analytics />
      <SpeedInsights />
    </html>
  )
}

