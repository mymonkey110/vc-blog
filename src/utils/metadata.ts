import { Metadata } from 'next'

// 管理后台页面metadata生成函数
export function createAdminMetadata(
  title: string,
  description?: string
): Metadata {
  return {
    title: `${title} - 修行码农`,
    description: description || `${title}页面`,
  }
}

// 普通页面metadata生成函数
export function createPageMetadata(
  title: string,
  description?: string,
  keywords?: string[]
): Metadata {
  return {
    title: `${title} - 修行码农`,
    description: description || `${title}页面`,
    keywords: keywords || [title, '修行码农', '博客'],
  }
}