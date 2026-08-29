import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import Image from 'next/image';
import type { ComponentProps } from 'react';
import styles from '@/styles/markdown.module.css';

// 自定义Image组件，使用 Next.js Image 优化图片加载
const CustomImage = ({
  src,
  alt,
  className,
}: {
  src?: string | Blob;
  alt?: string;
  className?: string;
}) => {
  // 如果没有 src，返回 null
  if (!src) {
    return null;
  }

  // 确保图片 URL 是字符串类型
  const imageUrl = typeof src === 'string' ? src : '';

  if (!imageUrl) {
    return null;
  }

  // 判断是否为本地图片
  const isLocalImage = imageUrl.startsWith('/') && !imageUrl.startsWith('//');

  // 判断是否为开发环境
  const isDevelopment = process.env.NODE_ENV === 'development';

  // 开发环境的远程图片使用原生 img 标签，避免 DNS 解析到私有 IP 的问题
  if (!isLocalImage && isDevelopment) {
    return (
      <div className={`my-8 ${className}`}>
        <img
          src={imageUrl}
          alt={alt || ''}
          className="max-w-full h-auto rounded shadow-sm"
          loading="lazy"
          decoding="async"
        />
      </div>
    );
  }

  // 生产环境或本地图片使用 Next.js Image
  return (
    <span className={`relative w-full my-8 ${className}`}>
      <Image
        src={imageUrl}
        alt={alt || ''}
        width={0}
        height={0}
        sizes="100vw"
        style={{ width: '100%', height: 'auto' }}
        className="rounded shadow-sm"
      />
    </span>
  );
};

// 服务器端安全的 pre 组件，带有数据属性用于客户端增强
const ServerPre = ({ children, className, ...props }: ComponentProps<'pre'>) => {
  // Extract language from the code element's className, not the pre element
  let language = '';
  let codeContent = '';
  
  if (children && typeof children === 'object' && 'props' in children) {
    const codeElement = children as any;
    const codeClassName = codeElement.props?.className || '';
    const match = /language-(\w+)/.exec(codeClassName);
    language = match ? match[1] : '';
    codeContent = String(codeElement.props?.children || '').replace(/\n$/, '');
  } else if (typeof children === 'string') {
    // Direct string content - check if pre has language class
    const match = /language-(\w+)/.exec(className || '');
    language = match ? match[1] : '';
    codeContent = children.replace(/\n$/, '');
  }

  // Use SyntaxHighlighter if we have a language and code content
  if (language && codeContent) {
    return (
      <div className="relative group" data-enhance-code-block="true">
        <SyntaxHighlighter
          language={language}
          style={vscDarkPlus}
          customStyle={{
            margin: 0,
            padding: 0,
            background: 'transparent',
            fontSize: 'inherit',
            fontFamily: 'inherit',
            lineHeight: 'inherit',
          }}
          codeTagProps={{
            style: {
              fontFamily: 'inherit',
              fontSize: 'inherit',
              lineHeight: 'inherit',
            },
          }}
        >
          {codeContent}
        </SyntaxHighlighter>
      </div>
    );
  }

  // Fallback to regular pre element
  return (
    <pre className={`${className || ''} relative group`} data-enhance-code-block="true" {...props}>
      {children}
    </pre>
  );
};

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

/**
 * Markdown渲染组件 - 纯服务器端渲染版本
 * 使用 react-markdown 替代 next-mdx-remote
 * SEO优化，代码高亮和复制功能通过客户端脚本增强实现
 */
const MarkdownRenderer = ({ content, className = '' }: MarkdownRendererProps) => {
  return (
    <div className={`${styles['markdown-content']} ${className} font-article`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          pre: ServerPre,
          code: ({ className, children, ...props }: ComponentProps<'code'>) => {
            const match = /language-(\w+)/.exec(className || '');
            return match ? (
              <code className={className} {...props}>
                {children}
              </code>
            ) : (
              <code className={styles['inline-code']} {...props}>
                {children}
              </code>
            );
          },
          img: CustomImage,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;
