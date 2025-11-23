import { PrismaClient } from '../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

// 为PrismaClient添加全局类型声明
// @ts-ignore - 忽略类型检查，因为我们是在扩展全局类型
declare global {
  var prisma: PrismaClient | undefined;
}

// 创建数据库连接池
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

// 创建PostgreSQL适配器
const adapter = new PrismaPg(pool);

// 创建或重用PrismaClient实例
// 在开发环境中，为了防止热重载时创建多个实例，我们使用全局变量缓存
// 在生产环境中，直接创建一个新实例
const prisma = global.prisma || new PrismaClient({
  log: ['query', 'info', 'warn', 'error'], // 可选：设置日志级别
  adapter, // 使用适配器进行数据库连接
});

// 开发环境下将实例存储在全局变量中
if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

export default prisma;