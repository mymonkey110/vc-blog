# 解析脚本功能

解析本地markdown文章，将解析出来的文章细节保存到database中

## 解析流程

1. 扫描`content/post`目录下所有markdown文件
2. 解析每个markdown文件，提取文章标题(title)、发布日期(date)、文章描述(description)、文章内容(content)
3. 将提取的信息保存到database中

## 数据库表结构

article表prisma模型映射关系
```prisma
model Article {
  id          Int      @id @default(autoincrement())
  title       String
  createdAt   DateTime @default(now())
  description String
  content     String
}
```
注意：
- `createdAt`字段默认值为当前时间，用于记录文章发布时间，数据库字段命名为`created_at`


## 技术细节

- 解析脚本使用typescript编写
- 脚本命名为`parse-articles.ts`，保存到/scripts目录下
- 解析markdown文件时，使用`gray-matter`库提取文章元数据(title, date, description)
- 数据库ORM使用`prisma`库，定义`article`模型，对应数据库`article`表
- neon数据库连接字符串从环境变量`DATABASE_URL`中获取

## 测试脚本

- 直接运行`parse-articles.js`脚本，即可解析`content/post`目录下所有markdown文件，将解析出来的文章细节保存到neon数据库中
- 检查neon数据库`article`表，确认是否对应的文章细节保存成功
- 不论测试结果是否成功，均清楚数据库