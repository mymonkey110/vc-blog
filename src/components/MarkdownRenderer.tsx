import ReactMarkdown from 'react-markdown';
import type { ComponentProps } from 'react';
import styles from '@/styles/markdown.module.css';

// 自定义Image组件，优化图片加载
const CustomImage = ({ src, alt, ...props }: { src?: string; alt?: string } & ComponentProps<'img'>) => {
  // 如果没有 src，返回 null
  if (!src) {
    return null;
  }
  
  // 判断是否为本地图片
  const isLocalImage = src.startsWith('/') && !src.startsWith('//');
  
  return (
    <img 
      src={src} 
      alt={alt || ''} 
      className="max-w-full h-auto rounded shadow-sm" 
      {...props}
    />
  );
};

// 服务器端安全的 pre 组件，带有数据属性用于客户端增强
const ServerPre = ({ children, className, ...props }: ComponentProps<'pre'>) => {
  return (
    <pre 
      className={`${className || ''} relative group`}
      data-enhance-code-block="true"
      {...props}
    >
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
    <div className={`${styles['markdown-content']} ${className}`}>
      <ReactMarkdown
        components={{
          pre: ServerPre,
          img: CustomImage,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;
