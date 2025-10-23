import dynamic from 'next/dynamic';
import { useEffect } from 'react';
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

// 正确导入MDXRemote组件
const MDXRemote = dynamic(() => import('next-mdx-remote').then(mod => ({ default: mod.MDXRemote })), {
  ssr: false,
});

interface MarkdownRendererProps {
  content: MDXRemoteSerializeResult;
  className?: string;
}

/**
 * Markdown渲染组件，支持代码高亮
 */
const MarkdownRenderer = ({ content, className = '' }: MarkdownRendererProps) => {
  // 在组件挂载后应用代码高亮
  useEffect(() => {
    Prism.highlightAll();
  }, [content]);

  return (
    <div className={`${styles['markdown-content']} ${className}`}>
      <MDXRemote {...content} />
    </div>
  );
};

export default MarkdownRenderer;