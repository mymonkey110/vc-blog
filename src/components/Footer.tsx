import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getUTCFullYear();

  return (
    <footer className="mt-12 w-full border-t border-border bg-background text-sm font-ui text-secondary-text">
      <div className="mx-auto flex max-w-[960px] flex-col gap-4 px-4 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <div className="space-y-1">
          <p className="font-mono text-xs sm:text-sm tabular-nums text-primary-text/85">
            © 2014 – {currentYear} Michael Jiang
          </p>
          <p className="text-xs text-secondary-text">
            本站文章除特别声明外，均采用{' '}
            <a
              href="https://creativecommons.org/licenses/by-nc-sa/4.0/deed.zh-hans"
              target="_blank"
              rel="noopener noreferrer"
              className="text-link transition-colors hover:text-link-hover hover:underline"
            >
              CC BY-NC-SA 4.0
            </a>{' '}
            许可协议。
          </p>
        </div>

        <nav aria-label="页脚链接" className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
          <Link href="/categories" className="transition-colors hover:text-link hover:underline">
            分类
          </Link>
          <Link href="/about" className="transition-colors hover:text-link hover:underline">
            关于
          </Link>
          <a
            href="https://github.com/mymonkey110"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-link hover:underline"
          >
            GitHub
          </a>
          <a
            href="/rss.xml"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-link hover:underline"
          >
            RSS
          </a>
        </nav>
      </div>
    </footer>
  );
}
