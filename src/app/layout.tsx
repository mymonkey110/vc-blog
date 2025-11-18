import '../styles/globals.css'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/react'
import Footer from '@/components/Footer'

export const metadata = {
  title: '修行码农',
  description: '代码❤技术❤生活',
  icons: {
    icon: '/favicon.png'
  },
  manifest: '/site.webmanifest',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen flex flex-col">
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
      <Analytics />
      <SpeedInsights />
    </html>
  )
}

