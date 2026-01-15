import { createAdminMetadata } from '@/utils/metadata';
import AdminHeader from '@/components/AdminHeader';
import Footer from '@/components/Footer';

export const metadata = createAdminMetadata('管理后台', '博客管理后台');

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-stone-50">
      <AdminHeader />
      <main className="flex-1 p-6">{children}</main>
      <Footer />
    </div>
  );
}
