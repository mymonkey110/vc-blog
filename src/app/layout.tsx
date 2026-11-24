import '../styles/globals.css';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { GoogleTagManager } from '@next/third-parties/google';

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_DOMAIN || 'https://michael-j.net'),
  title: '修行码农',
  description: '代码❤技术❤生活',
  icons: {
    icon: '/favicon.png',
  },
  manifest: '/site.webmanifest',
  alternates: {
    canonical: './',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen flex flex-col">
        <GoogleTagManager gtmId="GTM-NHDX7Q36" />
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
