import NavigationBar from '@/components/NavigationBar';
import Footer from '@/components/Footer';

export default function FrontendLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-md focus:bg-primary-text focus:px-4 focus:py-2 focus:text-sm focus:font-ui focus:text-background focus:shadow-card"
      >
        跳到正文
      </a>
      <NavigationBar />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <Footer />
    </>
  );
}
