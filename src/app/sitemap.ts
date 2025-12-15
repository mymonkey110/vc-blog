import prisma from '@/lib/db';
import { toSlug } from '@/utils/slug';
import { MetadataRoute } from 'next';

const baseUrl = 'https://vc.michael-j.net';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 获取所有发布的文章
  const articles = await prisma.article.findMany({
    where: { status: 'publish' },
    select: { id: true, title: true, createdAt: true },
  });

  // 为每篇文章生成sitemap条目
  const articleEntries = articles
    .filter(article => article.title && article.createdAt)
    .map(article => {
      const d = new Date(article.createdAt);
      const yyyy = d.getUTCFullYear().toString();
      const mm = String(d.getUTCMonth() + 1).padStart(2, '0');
      const dd = String(d.getUTCDate()).padStart(2, '0');
      const slug = toSlug(article.title);

      return {
        url: `${baseUrl}/article/${yyyy}/${mm}/${dd}/${slug}`,
        lastModified: article.createdAt,
        changeFrequency: 'yearly' as const,
        priority: 0.8,
      };
    });

  // 固定页面链接
  const currentDate = new Date();
  const fixedEntries: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/categories`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: currentDate,
      changeFrequency: 'yearly' as const,
      priority: 0.5,
    },
  ];

  // 合并所有条目并返回
  return [...fixedEntries, ...articleEntries];
}