import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { PrismaClient } from '../src/generated/prisma/client';

// 加载环境变量
dotenv.config();

// 初始化Prisma客户端
const prisma = new PrismaClient();

// 文章目录路径
const POSTS_DIRECTORY = path.join(process.cwd(), 'content', 'posts');

/**
 * 扫描并解析所有markdown文件
 */
async function parseArticles() {
  try {
    // 检查目录是否存在
    if (!fs.existsSync(POSTS_DIRECTORY)) {
      console.error(`错误: 文章目录不存在 - ${POSTS_DIRECTORY}`);
      return;
    }

    // 获取目录下所有markdown文件
    const files = fs.readdirSync(POSTS_DIRECTORY).filter(
      (file) => path.extname(file) === '.md'
    );

    console.log(`找到 ${files.length} 篇文章文件`);

    // 清空数据库中的文章数据
    console.log('清空现有文章数据...');
    await prisma.article.deleteMany();
    console.log('文章数据已清空');

    // 解析并保存每篇文章
    let successCount = 0;
    let errorCount = 0;

    for (const file of files) {
      try {
        const filePath = path.join(POSTS_DIRECTORY, file);
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        
        // 使用gray-matter解析文章元数据
        const { data, content } = matter(fileContent);
        
        // 提取元数据
        const title = data.title || file.replace('.md', '');
        const description = data.description || '';
        if(!data.date) {
          console.warn(`警告: ${file} 缺少日期元数据`);
          continue;
        }
        const createdAt = new Date(data.date);
        if(isNaN(createdAt.getTime())) {
          console.warn(`警告: ${file} 日期格式无效`);
          continue;
        }
        
        // 创建文章记录
        await prisma.article.create({
          data: {
            title,
            description,
            content,
            createdAt,
          },
        });
        
        successCount++;
        console.log(`保存成功: ${title}`);
        
      } catch (error) {
        errorCount++;
        console.error(`保存失败: ${file}`, error);
      }
    }

    console.log(`\n处理完成:`);
    console.log(`- 成功: ${successCount} 篇`);
    console.log(`- 失败: ${errorCount} 篇`);
    
  } catch (error) {
    console.error('解析文章时发生错误:', error);
  } finally {
    // 断开数据库连接
    await prisma.$disconnect();
  }
}

// 运行脚本
parseArticles().catch((error) => {
  console.error('脚本执行失败:', error);
  process.exit(1);
});