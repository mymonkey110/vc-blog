import dynamic from 'next/dynamic';
import { useEffect, useState, useRef } from 'react';
import Prism from 'prismjs';
import type { MDXRemoteSerializeResult } from 'next-mdx-remote';

// 导入Markdown样式模块
import styles from '../styles/markdown.module.css';

// 导入常用的语法高亮支持
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-markdown';
import 'prismjs/themes/prism-tomorrow.css';

// 自定义代码块组件（拦截 <pre>），添加复制功能，仅保留单一 <pre>
const PreBlock = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  const [copied, setCopied] = useState(false);
  const preRef = useRef<HTMLPreElement | null>(null);

  // 复制代码到剪贴板（从 DOM 提取纯文本）
  const copyToClipboard = () => {
    const text = preRef.current?.innerText || '';
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative">
      <div className="absolute top-2 right-2 z-10">
        <button
          onClick={copyToClipboard}
          className="bg-gray-700 text-white rounded p-1 text-xs hover:bg-gray-600 transition-colors"
          aria-label="复制代码"
        >
          {copied ? '已复制!' : '复制'}
        </button>
      </div>
      <pre ref={preRef} className={`${styles.codeBlock} ${className || ''}`}>
        {children}
      </pre>
    </div>
  );
};

// 自定义Image组件，优化图片加载
const CustomImage = ({ src, alt }: { src: string; alt?: string }) => {
  // 判断是否为本地图片
  const isLocalImage = src.startsWith('/') && !src.startsWith('//');
  
  if (isLocalImage) {
    // 对于本地图片，使用优化后的路径
    return <img src={src} alt={alt || ''} className="max-w-full h-auto rounded shadow-sm" />;
  }
  
  // 对于网络图片，直接使用
  return <img src={src} alt={alt || ''} className="max-w-full h-auto rounded shadow-sm" />;
};

// 自定义组件映射
const components = {
  pre: ({ className, children }: { className?: string; children: React.ReactNode }) => {
    return <PreBlock className={className}>{children}</PreBlock>;
  },
  code: ({ className, children }: { className?: string; children: React.ReactNode }) => {
    return <code className={className as string}>{children as any}</code>;
  },
  img: ({ src, alt }: { src: string; alt?: string }) => {
    return <CustomImage src={src} alt={alt} />;
  }
};

// 正确导入MDXRemote组件
const MDXRemote = dynamic(() => import('next-mdx-remote').then(mod => ({ default: mod.MDXRemote })), {
  ssr: false,
});

interface MarkdownRendererProps {
  content: MDXRemoteSerializeResult;
  className?: string;
}

/**
 * Markdown渲染组件，支持代码高亮和复制功能
 */
const MarkdownRenderer = ({ content, className = '' }: MarkdownRendererProps) => {
  // 在组件挂载后应用代码高亮
  useEffect(() => {
    Prism.highlightAll();
  }, [content]);

  return (
    <div className={`${styles['markdown-content']} ${className}`}>
      <MDXRemote {...content} components={components as any} />
    </div>
  );
};

export default MarkdownRenderer;
