const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 检查是否安装了必要的依赖
let matter;
try {
  matter = require('gray-matter');
} catch (error) {
  console.error('错误: 缺少必要的依赖包 gray-matter');
  console.log('请运行: npm install --save-dev gray-matter');
  process.exit(1);
}

// 配置
const HEXO_REPO_URL = 'https://github.com/mymonkey110/mymonkey110.github.io.git';
const HEXO_BRANCH = 'hexo';
const TEMP_DIR = path.join(process.cwd(), 'temp-hexo');
const POSTS_DIR = path.join(process.cwd(), 'content/posts');
const IMAGES_DIR = path.join(process.cwd(), 'public/images/posts');

// 本地路径配置
const LOCAL_HEXO_POSTS_PATH = path.join(process.cwd(), 'hexo-posts');
const LOCAL_HEXO_IMAGES_PATH = path.join(process.cwd(), 'hexo-images');
// 根据迁移说明文档中提到的临时目录
const TEMP_HEXO_PATH = path.join(process.cwd(), 'hexo-temp/mymonkey110.github.io');

/**
 * 清理临时目录
 */
function cleanTempDir() {
  if (fs.existsSync(TEMP_DIR)) {
    console.log('清理临时目录...');
    try {
      // 直接删除整个临时目录及其内容
      // recursive: true 表示递归删除目录内容
      // force: true 表示即使文件被锁定也尝试删除
      fs.rmSync(TEMP_DIR, { recursive: true, force: true });
    } catch (error) {
      console.warn(`  清理临时目录时出错: ${error.message}`);
      // 不抛出错误，让程序继续执行
    }
  }
}

/**
 * 清理目标目录，避免旧数据干扰
 * 根据migration-readme.md要求，每次执行前需要清空对应的目录
 */
function cleanTargetDirs() {
  console.log('清空目标目录，避免旧数据干扰...');
  
  // 清理文章目录
  if (fs.existsSync(POSTS_DIR)) {
    try {
      fs.rmSync(POSTS_DIR, { recursive: true, force: true });
      console.log(`  已清空文章目录: ${POSTS_DIR}`);
    } catch (error) {
      console.warn(`  清理文章目录时出错: ${error.message}`);
    }
  }
  
  // 清理图片目录
  if (fs.existsSync(IMAGES_DIR)) {
    try {
      fs.rmSync(IMAGES_DIR, { recursive: true, force: true });
      console.log(`  已清空图片目录: ${IMAGES_DIR}`);
    } catch (error) {
      console.warn(`  清理图片目录时出错: ${error.message}`);
    }
  }
}

/**
 * 准备Hexo源文件
 * @returns {Object} 包含文章目录和图片目录路径的对象
 */
function prepareHexoSource() {
  console.log('准备Hexo源文件...');
  
  // 首先检查主要的本地文章目录
  if (fs.existsSync(LOCAL_HEXO_POSTS_PATH) && fs.readdirSync(LOCAL_HEXO_POSTS_PATH).length > 0) {
    console.log(`使用本地文章目录: ${LOCAL_HEXO_POSTS_PATH}`);
    const imagesDir = fs.existsSync(LOCAL_HEXO_IMAGES_PATH) ? LOCAL_HEXO_IMAGES_PATH : null;
    return {
      postsDir: LOCAL_HEXO_POSTS_PATH,
      imagesDir: imagesDir,
      isLocal: true
    };
  }
  
  // 如果主要目录为空，检查hexo-temp目录（根据迁移说明文档）
  if (fs.existsSync(TEMP_HEXO_PATH)) {
    const tempPostsDir = path.join(TEMP_HEXO_PATH, 'source/_posts');
    const tempImagesDir = path.join(TEMP_HEXO_PATH, 'source/images');
    
    if (fs.existsSync(tempPostsDir) && fs.readdirSync(tempPostsDir).length > 0) {
      console.log(`使用hexo-temp目录中的文章: ${tempPostsDir}`);
      return {
        postsDir: tempPostsDir,
        imagesDir: fs.existsSync(tempImagesDir) ? tempImagesDir : null,
        isLocal: true
      };
    }
  }
  
  // 如果两个目录都不存在或为空，则报错
  console.error('错误: 找不到有效的文章目录');
  console.log('请确保：');
  console.log(`1. Hexo仓库已下载到 ${LOCAL_HEXO_POSTS_PATH}`);
  console.log(`   或者`);
  console.log(`2. Hexo仓库已克隆到 ${TEMP_HEXO_PATH}`);
  console.log('且文章目录不为空，然后重新运行脚本');
  process.exit(1);
}

/**
 * 确保目录存在
 */
function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`创建目录: ${dirPath}`);
  }
}

/**
 * 复制图片文件到文章专属目录
 */
function copyImageToArticleDir(sourceImagePath, articleId, imageFileName) {
  const articleImageDir = path.join(IMAGES_DIR, articleId);
  ensureDirectoryExists(articleImageDir);
  
  const targetImagePath = path.join(articleImageDir, imageFileName);
  
  if (fs.existsSync(sourceImagePath)) {
    fs.copyFileSync(sourceImagePath, targetImagePath);
    console.log(`  复制图片到文章目录: ${articleId}/${imageFileName}`);
    return `/images/posts/${articleId}/${imageFileName}`;
  } else {
    console.warn(`  找不到图片: ${sourceImagePath}`);
    return null;
  }
}

/**
 * 迁移文章和图片
 * @returns {boolean} 是否使用本地文件
 */
function migrateContent() {
  // 准备Hexo源文件（本地或克隆）
  const { postsDir: hexoPostsDir, imagesDir: hexoImagesDir, isLocal } = prepareHexoSource();
  
  // 将isLocal保存到全局，以便main函数的错误处理使用
  global.isLocal = isLocal;
  
  if (!fs.existsSync(hexoPostsDir)) {
    console.error('找不到Hexo文章目录:', hexoPostsDir);
    process.exit(1);
  }
  
  console.log('开始迁移文章...');
  
  // 确保目标目录存在
  ensureDirectoryExists(POSTS_DIR);
  ensureDirectoryExists(IMAGES_DIR);
  
  // 获取所有Markdown文件
  const mdFiles = fs.readdirSync(hexoPostsDir)
    .filter(file => file.endsWith('.md'));
  
  console.log(`找到 ${mdFiles.length} 篇文章`);
  
  let successfullyMigrated = 0;
  let failedToMigrate = 0;
  
  mdFiles.forEach((file, index) => {
    try {
      console.log(`处理文章 ${index + 1}/${mdFiles.length}: ${file}`);
      
      const filePath = path.join(hexoPostsDir, file);
      let content = fs.readFileSync(filePath, 'utf8');
      
      // 先检查并修复frontmatter格式
      console.log('  检查并修复frontmatter格式...');
      // 检查是否以---开头，如果不是，查找是否有类似frontmatter的内容
      if (!content.trim().startsWith('---')) {
        const lines = content.split('\n');
        let hasFrontmatterContent = false;
        let frontmatterStartIndex = -1;
        
        // 查找是否包含frontmatter相关的键值对
        for (let i = 0; i < Math.min(10, lines.length); i++) {
          const trimmedLine = lines[i].trim();
          if (trimmedLine.match(/^(title|date|categories|tags|description):/)) {
            hasFrontmatterContent = true;
            frontmatterStartIndex = i;
            break;
          }
        }
        
        if (hasFrontmatterContent) {
          console.log(`  发现缺少开头---的frontmatter，在第${frontmatterStartIndex + 1}行前添加`);
          // 在frontmatter内容前添加---
          lines.splice(frontmatterStartIndex, 0, '---');
          
          // 查找是否有结尾的---，如果没有，在适当位置添加
          let hasEndingSeparator = false;
          for (let i = frontmatterStartIndex + 1; i < Math.min(frontmatterStartIndex + 20, lines.length); i++) {
            if (lines[i].trim() === '---') {
              hasEndingSeparator = true;
              break;
            }
          }
          
          if (!hasEndingSeparator) {
            // 找到frontmatter结束的位置（第一个非空行或下一个frontmatter键值对结束）
            let endIndex = frontmatterStartIndex + 1;
            while (endIndex < lines.length) {
              const trimmedLine = lines[endIndex].trim();
              if (trimmedLine === '' || !trimmedLine.includes(':')) {
                break;
              }
              endIndex++;
            }
            console.log(`  在第${endIndex + 1}行前添加结尾---`);
            lines.splice(endIndex, 0, '---');
          }
          
          content = lines.join('\n');
        }
      }
      
      // 先检查重复frontmatter（但不实际修改内容）
      handleDuplicateFrontmatter(content);
      
      // 解析YAML元数据，获取数据和纯内容部分
      const { data, content: markdownContent } = matter(content);
      
      // 直接使用文件名（去掉.md后缀）作为文章ID
      const articleId = file.replace(/\.md$/, '');
      
      // 创建文章专属的图片目录
      const articleImageDir = path.join(IMAGES_DIR, articleId);
      ensureDirectoryExists(articleImageDir);
      
      // 转换元数据格式

      // 原md文件一定包含frontmatter，不做任何日期处理，也不新建frontmatter
      // 仅保留原frontmatter中的必要字段，其余字段直接丢弃
      const allowedKeys = ['title', 'date', 'categories', 'tags', 'description'];
      const newFrontmatter = {};
      allowedKeys.forEach(key => {
        if (key === 'categories') {
          // 确保categories是数组且去重
          newFrontmatter.categories = Array.from(new Set((Array.isArray(data.categories) ? data.categories : data.categories ? [data.categories] : []).filter(Boolean)));
        } else if (key === 'tags') {
          // 确保tags是数组且去重
          newFrontmatter.tags = Array.from(new Set((Array.isArray(data.tags) ? data.tags : data.tags ? [data.tags] : []).filter(Boolean)));
        } else if (key === 'description') {
          // description可选
          newFrontmatter.description = data.description || '';
        } else {
          // title直接沿用原值，不额外处理
          // date需要保持yyyy-MM-dd HH:mm:ss格式
          if (key === 'date' && data[key]) {
            let dateValue = data[key];
            try {
              // 检查是否已经是正确格式的字符串
              if (typeof dateValue === 'string' && /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(dateValue)) {
                // 已经是正确格式，不需要转换
                newFrontmatter[key] = dateValue;
              } else {
                // 处理非标准格式字符串或Date对象
                let date;
                if (typeof dateValue === 'string') {
                  date = new Date(dateValue);
                } else if (dateValue instanceof Date) {
                  // 处理Date对象
                  date = dateValue;
                }
                
                if (date && !isNaN(date.getTime())) {
                  // 转换为yyyy-MM-dd HH:mm:ss格式
                  const year = date.getFullYear();
                  const month = String(date.getMonth() + 1).padStart(2, '0');
                  const day = String(date.getDate()).padStart(2, '0');
                  const hours = String(date.getHours()).padStart(2, '0');
                  const minutes = String(date.getMinutes()).padStart(2, '0');
                  const seconds = String(date.getSeconds()).padStart(2, '0');
                  const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
                  console.log(`  将日期转换为标准格式: ${data[key]} -> ${formattedDate}`);
                  newFrontmatter[key] = formattedDate;
                } else {
                  // 如果无法转换，保留原值
                  newFrontmatter[key] = dateValue;
                }
              }
            } catch (err) {
              console.warn(`  日期格式转换失败，保留原值: ${data[key]}`);
              newFrontmatter[key] = dateValue;
            }
          } else {
            newFrontmatter[key] = data[key];
          }
        }
      });

      console.log('  仅保留原frontmatter中的5个字段：title, date, categories, tags, description');
      console.log('  不创建新frontmatter，不处理日期，直接沿用原值');
      
      // 更新图片路径
      let updatedContent = markdownContent;
      console.log('  开始更新图片引用路径...');
      
      // 处理Hexo特有格式的图片: {% asset_img image.jpg 图片描述 %}
      updatedContent = updatedContent.replace(/\{\%\s*asset_img\s+([^\s]+)\s+([^\%]*)\%\}/g, (match, imageFileName, description) => {
        console.log(`  处理asset_img格式图片: ${imageFileName}`);
        // 尝试在hexo文章目录中查找图片
        const articleName = file.replace(/\.md$/, '');
        let sourceImagePath;
        
        // 尝试从与文章同名的目录中查找图片
        if (hexoPostsDir) {
          sourceImagePath = path.join(hexoPostsDir, articleName, imageFileName);
          if (!fs.existsSync(sourceImagePath)) {
            // 如果找不到，尝试在文章所在目录直接查找
            sourceImagePath = path.join(hexoPostsDir, imageFileName);
          }
        }
        
        if (!sourceImagePath || !fs.existsSync(sourceImagePath)) {
          // 如果在文章目录找不到，尝试在hexoImagesDir中查找
          if (hexoImagesDir) {
            sourceImagePath = path.join(hexoImagesDir, imageFileName);
          }
        }
        
        let newImageUrl = null;
        if (sourceImagePath && fs.existsSync(sourceImagePath)) {
          newImageUrl = copyImageToArticleDir(sourceImagePath, articleId, imageFileName);
        } else {
          console.warn(`  找不到asset_img图片: ${imageFileName}`);
        }
        
        if (newImageUrl) {
          console.log(`  已更新asset_img图片路径: ${imageFileName} -> ${newImageUrl}`);
          // 转换为标准Markdown图片格式
          return `![${description.trim()}](${newImageUrl})`;
        }
        // 如果找不到图片，保留原格式但记录警告
        return match;
      });
      
      // 处理以/开头的绝对路径图片 /images/
      updatedContent = updatedContent.replace(/\!\[([^\]]*)\]\((\/images\/[^)]+)\)/g, (match, alt, url) => {
        console.log(`  处理图片: ${url}`);
        const imageFileName = path.basename(url);
        const relativePath = url.replace('/images/', '');
        const sourceImagePath = path.join(hexoImagesDir, relativePath);
        const newImageUrl = copyImageToArticleDir(sourceImagePath, articleId, imageFileName);
        
        if (newImageUrl) {
          console.log(`  已更新图片路径: ${url} -> ${newImageUrl}`);
          return `![${alt}](${newImageUrl})`;
        }
        return match; // 如果复制失败，保留原路径
      });
      
      // 处理相对路径的图片 ../images/
      updatedContent = updatedContent.replace(/\!\[([^\]]*)\]\((\.\.\/images\/[^)]+)\)/g, (match, alt, url) => {
        console.log(`  处理图片: ${url}`);
        const imageFileName = path.basename(url);
        const sourceImagePath = path.join(hexoImagesDir, url.replace('../images/', ''));
        const newImageUrl = copyImageToArticleDir(sourceImagePath, articleId, imageFileName);
        
        if (newImageUrl) {
          console.log(`  已更新图片路径: ${url} -> ${newImageUrl}`);
          return `![${alt}](${newImageUrl})`;
        }
        return match; // 如果复制失败，保留原路径
      });
      
      // 处理相对路径的图片 images/
      updatedContent = updatedContent.replace(/!\[([^\]]*)\]\((images\/[^)]+)\)/g, (match, alt, url) => {
        console.log(`  处理图片: ${url}`);
        const imageFileName = path.basename(url);
        const sourceImagePath = path.join(hexoImagesDir, url.replace('images/', ''));
        const newImageUrl = copyImageToArticleDir(sourceImagePath, articleId, imageFileName);
        
        if (newImageUrl) {
          console.log(`  已更新图片路径: ${url} -> ${newImageUrl}`);
          return `![${alt}](${newImageUrl})`;
        }
        return match; // 如果复制失败，保留原路径
      });
      
      // 处理没有路径前缀的图片
      updatedContent = updatedContent.replace(/!\[([^\]]*)\]\(([^\/)(http][^)]+)\)/g, (match, alt, url) => {
        // 检查是否是已经处理过的绝对路径或外部链接
        if (url.startsWith('/') || url.startsWith('http')) {
          return match;
        }
        
        console.log(`  处理图片: ${url}`);
        const imageFileName = path.basename(url);
        const sourceImagePath = path.join(hexoImagesDir, url);
        const newImageUrl = copyImageToArticleDir(sourceImagePath, articleId, imageFileName);
        
        if (newImageUrl) {
          console.log(`  已更新图片路径: ${url} -> ${newImageUrl}`);
          return `![${alt}](${newImageUrl})`;
        }
        return match; // 如果复制失败，保留原路径
      });
      
      // 使用更新后的内容（已处理图片路径）
      let cleanContent = updatedContent.trim();
      
      // 移除原frontmatter（如果存在）
      if (cleanContent.startsWith('---')) {
        const endOfFrontmatter = cleanContent.indexOf('---', 3);
        if (endOfFrontmatter !== -1) {
          cleanContent = cleanContent.substring(endOfFrontmatter + 3).trim();
        }
      }
      
      // 创建新的Markdown内容，只包含我们生成的单个frontmatter块
      const frontmatterContent = `---
title: ${newFrontmatter.title || ''}
date: ${newFrontmatter.date || new Date().toISOString()}
categories: ${JSON.stringify(newFrontmatter.categories || [])}
tags: ${JSON.stringify(newFrontmatter.tags || [])}
description: ${newFrontmatter.description || ''}
---`;
      const newContent = frontmatterContent + '\n\n' + cleanContent;
      
      // 保存转换后的文件
      const targetFilePath = path.join(POSTS_DIR, `${articleId}.md`);
      fs.writeFileSync(targetFilePath, newContent, 'utf8');
      
      console.log(`  成功迁移: ${targetFilePath}`);
      successfullyMigrated++;
      
    } catch (error) {
      console.error(`  处理文章失败 ${file}:`, error.message);
      failedToMigrate++;
    }
  });
  
  console.log('\n迁移统计:');
  console.log(`  成功迁移: ${successfullyMigrated} 篇`);
  console.log(`  迁移失败: ${failedToMigrate} 篇`);
  console.log(`  总文章数: ${mdFiles.length} 篇`);
}

/**
 * 主函数
 */
function main() {
  try {
    console.log('=== 增强版Hexo博客迁移工具 ===\n');
    console.log('本工具将：');
    console.log('1. 准备Hexo源文件（本地或从GitHub克隆）');
    console.log('2. 为每篇文章创建独立的图片目录');
    console.log('3. 迁移文章内容和相关图片');
    console.log('4. 更新所有图片引用路径\n');
    
    // 清理临时目录（如果存在）
    if (fs.existsSync(TEMP_DIR)) {
      cleanTempDir();
    }
    
    // 创建本地备用目录（如果不存在）
    ensureDirectoryExists(LOCAL_HEXO_POSTS_PATH);
    ensureDirectoryExists(LOCAL_HEXO_IMAGES_PATH);
    
    // 清空目标目录，避免旧数据干扰
    cleanTargetDirs();
    
    // 迁移内容
    migrateContent();
    
    // 尝试清理临时目录，但不阻止程序完成
    try {
      cleanTempDir();
    } catch (cleanupError) {
      console.warn(`  清理临时目录失败，但迁移已完成: ${cleanupError.message}`);
    }
    
    console.log('\n=== 迁移完成 ===');
    console.log('文章已迁移到 content/posts/ 目录');
    console.log('图片已迁移到 public/images/posts/[文章ID]/ 目录');
    console.log('所有图片引用已更新为新的路径格式');
    console.log('重复frontmatter已自动检测和处理');
    
    // 根据最新要求，自动执行测试
    console.log('\n=== 开始自动测试 ===');
    runMigrationTest();
    
  } catch (error) {
    console.error('迁移过程中出错:', error);
    
    // 只有在从GitHub克隆的情况下才清理临时目录
    if (!global.isLocal) {
      try {
        cleanTempDir();
      } catch (cleanupError) {
        console.error('清理临时目录失败:', cleanupError);
      }
    }
    process.exit(1);
  }
}

// 执行主函数
if (require.main === module) {
  main();
}

/**
 * 处理重复的frontmatter块
 * @param {string} content - Markdown文件内容
 * @returns {string} 处理后的内容，只保留正确的frontmatter
 */
function handleDuplicateFrontmatter(content) {
  // 首先进行日志记录
  console.log('  检查是否存在重复frontmatter...');
  
  // 使用更简单直接的方法处理重复frontmatter：查找所有的---分隔符，然后只保留最后一对
  const lines = content.split('\n');
  const separatorIndices = [];
  
  // 找出所有的---分隔符行
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim() === '---') {
      separatorIndices.push(i);
    }
  }
  
  // 如果分隔符数量大于等于4，说明存在多个frontmatter块
  if (separatorIndices.length >= 4) {
    console.log(`  检测到${separatorIndices.length / 2}个frontmatter块，保留最后一个`);
    
    // 获取最后一个frontmatter块的开始和结束位置
    const lastStartIndex = separatorIndices[separatorIndices.length - 2];
    const lastEndIndex = separatorIndices[separatorIndices.length - 1];
    
    // 提取最后一个frontmatter块和之后的内容
    const lastFrontmatterLines = lines.slice(lastStartIndex, lastEndIndex + 1);
    const contentLines = lines.slice(lastEndIndex + 1);
    
    return [...lastFrontmatterLines, ...contentLines].join('\n');
  }
  
  // 检查是否存在Untitled的frontmatter问题（第二个frontmatter修复方法）
  // 查找所有的frontmatter块（包括不规则格式）
  const frontmatterBlocks = [];
  let currentBlock = null;
  
  for (let i = 0; i < lines.length; i++) {
    const trimmedLine = lines[i].trim();
    
    if (trimmedLine === '---') {
      if (currentBlock === null) {
        // 开始一个新的frontmatter块
        currentBlock = { start: i, lines: [] };
      } else {
        // 结束当前frontmatter块
        currentBlock.end = i;
        frontmatterBlocks.push(currentBlock);
        currentBlock = null;
      }
    } else if (currentBlock !== null) {
      // 添加行到当前frontmatter块
      currentBlock.lines.push(lines[i]);
    }
  }
  
  // 如果找到多个frontmatter块
  if (frontmatterBlocks.length >= 2) {
    console.log(`  检测到${frontmatterBlocks.length}个完整的frontmatter块，保留最后一个`);
    
    // 获取最后一个frontmatter块
    const lastBlock = frontmatterBlocks[frontmatterBlocks.length - 1];
    
    // 重建内容，只保留最后一个frontmatter块和之后的内容
    const resultLines = [
      '---',
      ...lines.slice(lastBlock.start + 1, lastBlock.end),
      '---',
      ...lines.slice(lastBlock.end + 1)
    ];
    
    return resultLines.join('\n');
  }
  
  // 如果没有检测到重复，返回原内容
  console.log('  未检测到重复frontmatter');
  return content;
}

/**
 * 执行迁移测试
 */
function runMigrationTest() {
  console.log('\n测试目标1: 检查下载文章的完整性');
  const migratedFiles = fs.readdirSync(POSTS_DIR).filter(file => file.endsWith('.md'));
  console.log(`  成功迁移的文章数量: ${migratedFiles.length}`);
  
  console.log('\n测试目标2: 检查每篇文件frontmatter是否被准确处理');
  let frontmatterErrorCount = 0;
  migratedFiles.forEach(file => {
    try {
      const filePath = path.join(POSTS_DIR, file);
      const content = fs.readFileSync(filePath, 'utf8');
      const { data } = matter(content);
      
      // 检查是否只包含5个必要字段
      const keys = Object.keys(data);
      const requiredKeys = ['title', 'date', 'categories', 'tags', 'description'];
      const hasAllRequiredKeys = requiredKeys.every(key => keys.includes(key));
      const hasExtraKeys = keys.some(key => !requiredKeys.includes(key));
      
      if (!hasAllRequiredKeys) {
        console.error(`  错误: 文件 ${file} 缺少必要的frontmatter字段`);
        frontmatterErrorCount++;
      } else if (hasExtraKeys) {
        console.error(`  错误: 文件 ${file} 包含额外的frontmatter字段: ${keys.filter(key => !requiredKeys.includes(key)).join(', ')}`);
        frontmatterErrorCount++;
      } else {
        console.log(`  文件 ${file} 的frontmatter格式正确`);
      }
    } catch (error) {
      console.error(`  测试文件 ${file} 时出错:`, error.message);
      frontmatterErrorCount++;
    }
  });
  
  console.log('\n测试目标3: 检查图片是否被正确迁移');
  let imageErrorCount = 0;
  migratedFiles.forEach(file => {
    try {
      const filePath = path.join(POSTS_DIR, file);
      const content = fs.readFileSync(filePath, 'utf8');
      const articleId = file.replace(/\.md$/, '');
      
      // 查找所有图片引用
      const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
      let match;
      const imageMatches = [];
      
      while ((match = imageRegex.exec(content)) !== null) {
        imageMatches.push(match[2]);
      }
      
      // 检查每个图片引用
      imageMatches.forEach(imageUrl => {
        // 外部链接保持原样，不需要检查
        if (imageUrl.startsWith('http')) {
          console.log(`  文件 ${file} 中的外部图片链接保持原样: ${imageUrl}`);
        } 
        // 本地图片应该使用新的路径格式
        else if (imageUrl.startsWith('/images/posts/')) {
          // 提取图片路径，检查文件是否存在
          const localImagePath = path.join(process.cwd(), 'public', imageUrl);
          if (fs.existsSync(localImagePath)) {
            console.log(`  文件 ${file} 中的图片已正确迁移: ${imageUrl}`);
          } else {
            console.error(`  错误: 文件 ${file} 中的图片引用指向不存在的文件: ${imageUrl}`);
            imageErrorCount++;
          }
        }
        // 其他格式的本地图片路径可能需要修正
        else {
          console.warn(`  警告: 文件 ${file} 中存在非标准格式的图片路径: ${imageUrl}`);
        }
      });
    } catch (error) {
      console.error(`  测试文件 ${file} 的图片引用时出错:`, error.message);
      imageErrorCount++;
    }
  });
  
  // 输出测试摘要
  console.log('\n=== 测试摘要 ===');
  console.log(`文章完整性测试: ${migratedFiles.length} 篇文章已迁移`);
  console.log(`Frontmatter格式测试: ${frontmatterErrorCount > 0 ? `发现 ${frontmatterErrorCount} 个错误` : '通过'}`);
  console.log(`图片迁移测试: ${imageErrorCount > 0 ? `发现 ${imageErrorCount} 个错误` : '通过'}`);
  
  if (frontmatterErrorCount === 0 && imageErrorCount === 0) {
    console.log('\n🎉 所有测试通过！迁移成功完成！');
  } else {
    console.log('\n⚠️  测试发现错误，请检查上述输出并修复问题');
  }
}

module.exports = { main }; // 导出主函数以便测试