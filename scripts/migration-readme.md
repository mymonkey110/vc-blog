# Hexo博客迁移工具使用说明

## 工具概述

这个增强版迁移工具可以帮助你将Hexo博客的文章和图片迁移到新的Next.js博客系统中。工具具有以下特点：

- 支持从本地hexo仓库读取文章
- 为每篇文章创建独立的图片目录，避免命名冲突
- 自动转换元数据格式，更新所有图片引用路径
- 完善的错误处理和状态提示

## 准备工作

1. 确保已安装Node.js环境
2. 安装必要的依赖包：
   ```bash
   npm install --save-dev gray-matter
   ```

## 使用方法

### 从GitHub克隆Hexo仓库

1. 确保`hexo-temp`目录中包含hexo博客仓库的clone版本
2. 运行迁移脚本：
   ```bash
   node scripts/enhanced-migrate.js
   ```

## 输出位置

- 迁移后的文章将保存在：`content/posts/` 目录
- 迁移后的图片将保存在：`public/images/posts/[文章title]/` 目录

## 迁移过程说明

1. 脚本会自动检测本地是否有文章目录，如果有则使用本地文件，没有则从GitHub仓库克隆。
2. 对于每篇文章，脚本会：
   - 解析YAML元数据，提取title信息，下面会使用
   - 创建文章专属的图片目录，使用文章title作为目录名
   - 迁移文章中引用的所有图片，如果是外部链接则保持原样，如果是类似以下格式
     ```markdown
     {% asset_img image.jpg 图片描述 %}
     ```
     需要尝试从和文章名相同的目录中找到对应的图片并迁移到新目录中
   - 更新本地图片引用路径为新格式
   - 如果原文件包含frontmatter，删除原始的frontmatter，只保留title,date,tags,categories,description这5个元素。

## 注意事项

- 确保图片文件名在迁移前后保持一致
- 对于外部图片链接，脚本会保持原样
- 迁移完成后，执行`测试目标`的内容，如果有不一样的地方则输出异常点

## 优化技巧

- 执行git clone命令时只克隆必要的分支并设置深度为1，以减少克隆时间和空间占用：
  ```bash
  git clone --depth 1 -b <branch-name> <repo-url>
  ```

## 故障排除

如果遇到问题，请检查：

1. Node.js环境是否正常
2. gray-matter依赖是否已安装
3. 文章和图片路径是否正确
4. 文件权限是否足够

## 测试目标

1. 检查下载文章的完整性
2. 检查每篇文件frontmatter是否被准确处理，预期只包含`title`,`date`,`tags`,`categories`和`description` 5个元素，不多不少。
同时不能有重复的frontmatter元素。
3. 检查图片是否被正确迁移，如果是外部链接则保持原样，否则检查图片路径是否正确。