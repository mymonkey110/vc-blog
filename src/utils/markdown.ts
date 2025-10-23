import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { serialize } from 'next-mdx-remote/serialize';
import { Article, ArticleMeta, ArticleWithContent } from '../types/article';

// 文章目录路径
const POSTS_DIR = path.join(process.cwd(), 'content/posts');

/**
 * 获取所有文章的元数据
 */
export const getAllArticlesMeta = (): ArticleMeta[] => {
  const fileNames = fs.readdirSync(POSTS_DIR);
  
  const allArticlesMeta = fileNames
    .filter((fileName) => fileName.endsWith('.md') || fileName.endsWith('.mdx'))
    .map((fileName) => {
      const id = fileName.replace(/\.(md|mdx)$/, '');
      const fullPath = path.join(POSTS_DIR, fileName);
      
      try {
        // 确保使用正确的编码读取文件
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        
        // 使用gray-matter解析Markdown元数据
        const matterResult = matter(fileContents);
        
        // 确保title字段正确提取，如果没有title或title为Untitled，则尝试从文件名提取
        let title = matterResult.data.title;
        if (!title || title.trim() === '' || title.trim().toLowerCase() === 'untitled') {
          // 如果frontmatter中没有title、title为空或title为Untitled，尝试从文件名提取
          title = id.replace(/-/g, ' ');
          // 首字母大写处理
          title = title.charAt(0).toUpperCase() + title.slice(1);
        }
        
        return {
          id,
          title: title || 'Untitled',
          excerpt: matterResult.data.excerpt || '',
          date: typeof matterResult.data.date === 'object' ? matterResult.data.date.toISOString() : matterResult.data.date || '',
          categories: matterResult.data.categories || [],
          imageUrl: matterResult.data.imageUrl,
          imageAlt: matterResult.data.imageAlt,
        };
      } catch (error) {
        console.error(`Error processing file ${fileName}:`, error);
        // 返回带有基本信息的对象，确保程序不会崩溃
        return {
          id,
          title: id || 'Untitled',
          excerpt: '',
          date: '',
          categories: [],
          imageUrl: null,
          imageAlt: null,
        };
      }
    })
    .sort((a, b) => (a.date > b.date ? -1 : 1)); // 按日期降序排序

  return allArticlesMeta;
};

/**
 * 根据ID获取文章内容
 */
export const getArticleById = async (id: string): Promise<ArticleWithContent> => {
  const fileNames = fs.readdirSync(POSTS_DIR);
  const fileName = fileNames.find(
    (name) => name === `${id}.md` || name === `${id}.mdx`
  );

  if (!fileName) {
    throw new Error(`Article with ID "${id}" not found`);
  }

  const fullPath = path.join(POSTS_DIR, fileName);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  
  // 使用gray-matter解析Markdown元数据
  const matterResult = matter(fileContents);
  
  // 序列化MDX内容
  const mdxSource = await serialize(matterResult.content, {
    // 可以在这里添加自定义组件和插件
  });
  
  // 确保title字段正确提取，如果没有title或title为Untitled，则尝试从文件名提取
  let title = matterResult.data.title;
  if (!title || title.trim() === '' || title.trim().toLowerCase() === 'untitled') {
    // 如果frontmatter中没有title、title为空或title为Untitled，尝试从文件名提取
    title = id.replace(/-/g, ' ');
    // 首字母大写处理
    title = title.charAt(0).toUpperCase() + title.slice(1);
  }

  return {
    id,
    title: title || 'Untitled',
    excerpt: matterResult.data.excerpt || '',
    date: typeof matterResult.data.date === 'object' ? matterResult.data.date.toISOString() : matterResult.data.date || '',
    categories: matterResult.data.categories || [],
    imageUrl: matterResult.data.imageUrl || null,
    imageAlt: matterResult.data.imageAlt || null,
    content: mdxSource, // 返回序列化后的MDX内容
    author: matterResult.data.author || null,
    status: (matterResult.data.status as 'draft' | 'published') || 'published',
    publishDate: typeof (matterResult.data.publishDate || matterResult.data.date) === 'object' 
      ? (matterResult.data.publishDate || matterResult.data.date).toISOString() 
      : (matterResult.data.publishDate || matterResult.data.date || ''),
    sections: matterResult.data.sections || [],
  };
};

/**
 * 提取文章中的图片引用
 */
export const extractImagesFromMarkdown = (markdownContent: string): string[] => {
  // 匹配Markdown中的图片引用 ![alt](url)
  const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
  const images: string[] = [];
  let match;
  
  while ((match = imageRegex.exec(markdownContent)) !== null) {
    images.push(match[2]); // match[2] 是图片URL
  }
  
  return images;
};

/**
 * 更新Markdown内容中的图片路径
 */
export const updateImagePaths = (markdownContent: string, oldPathPrefix: string, newPathPrefix: string): string => {
  // 将指定前缀的图片路径替换为新前缀
  return markdownContent.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (match, alt, url) => {
    if (url.startsWith(oldPathPrefix)) {
      const newUrl = url.replace(oldPathPrefix, newPathPrefix);
      return `![${alt}](${newUrl})`;
    }
    return match;
  });
};