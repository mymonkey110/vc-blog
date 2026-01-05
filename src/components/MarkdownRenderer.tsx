import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import type { ComponentProps } from 'react';
import styles from '@/styles/markdown.module.css';

// 自定义Image组件，优化图片加载
const CustomImage = ({
  src,
  alt,
  ...props
}: { src?: string | Blob; alt?: string } & ComponentProps<'img'>) => {
  // 如果没有 src，返回 null
  if (!src) {
    return null;
  }

  // 判断是否为本地图片
  const isLocalImage = typeof src === 'string' && src.startsWith('/') && !src.startsWith('//');

  return (
    <img src={src} alt={alt || ''} className="max-w-full h-auto rounded shadow-sm" {...props} />
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
            }
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
