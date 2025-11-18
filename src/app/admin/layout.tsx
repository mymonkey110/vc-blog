import { createAdminMetadata } from "@/utils/metadata"


export const metadata = createAdminMetadata('管理后台', '博客管理后台仪表盘')

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}