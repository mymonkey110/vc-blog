import NavigationBar from '@/components/NavigationBar';
import Footer from '@/components/Footer';

export default function FrontendLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <NavigationBar />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
