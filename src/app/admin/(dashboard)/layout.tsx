import { createAdminMetadata } from "@/utils/metadata"
import Menu from '@/components/Menu'

export const metadata = createAdminMetadata('管理后台', '博客管理后台仪表盘')

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen w-full flex-col bg-stone-50 text-stone-900">
      <div className="flex flex-1">
        <Menu />
        <main className="flex flex-1 flex-col p-6">
          {children}
        </main>
      </div>
    </div>
  )
}