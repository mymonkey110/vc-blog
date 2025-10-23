const fs = require('fs');
const path = require('path');

// 配置项
const POSTS_DIR = 'c:/works/vc-blog/hexo-temp/mymonkey110.github.io/source/_posts';
const LOG_FILE = 'c:/works/vc-blog/scripts/frontmatter-fix-log.txt';

// 统计信息
let totalFiles = 0;
let fixedFiles = 0;
let logMessages = [];

// 日志函数
function log(message) {
  console.log(message);
  logMessages.push(message);
}

// 检查并修复单个文件的frontmatter
function fixFileFrontmatter(filePath) {
  totalFiles++;
  log(`正在处理文件: ${filePath}`);
  
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const trimmedContent = content.trim();
    
    // 检查是否已经有---开头
    if (trimmedContent.startsWith('---')) {
      log(`  文件已经以---开头，无需修复`);
      return false;
    }
    
    // 检查是否包含frontmatter内容
    const lines = content.split('\n');
    let hasFrontmatterContent = false;
    let frontmatterEndIndex = -1;
    
    // 查找frontmatter内容和结束位置
    for (let i = 0; i < Math.min(20, lines.length); i++) {
      const trimmedLine = lines[i].trim();
      
      // 检查是否是frontmatter键值对格式
      if (trimmedLine.match(/^[\w-]+:/)) {
        hasFrontmatterContent = true;
      }
      
      // 查找结尾的---
      if (trimmedLine === '---') {
        frontmatterEndIndex = i;
        break;
      }
    }
    
    if (hasFrontmatterContent) {
      log(`  发现缺少开头---的frontmatter`);
      
      // 在开头添加---
      let newContent;
      if (frontmatterEndIndex >= 0) {
        // 已经有结尾的---，只需要在开头添加---
        newContent = '---\n' + content;
      } else {
        // 没有结尾的---，需要找到frontmatter结束位置
        let endIndex = 0;
        while (endIndex < lines.length) {
          const trimmedLine = lines[endIndex].trim();
          // 如果是空行或者不是键值对格式，认为frontmatter结束
          if (trimmedLine === '' && endIndex > 0) {
            break;
          }
          if (!trimmedLine.match(/^[\w-]+:/) && endIndex > 0) {
            break;
          }
          endIndex++;
        }
        
        // 在frontmatter内容后添加---
        const frontmatterPart = lines.slice(0, endIndex).join('\n');
        const contentPart = lines.slice(endIndex).join('\n');
        newContent = `---\n${frontmatterPart}\n---\n${contentPart}`;
        log(`  在第${endIndex + 1}行后添加结尾---`);
      }
      
      // 写入修复后的内容
      fs.writeFileSync(filePath, newContent, 'utf8');
      log(`  文件修复成功`);
      fixedFiles++;
      return true;
    } else {
      log(`  未发现frontmatter内容，无需修复`);
      return false;
    }
  } catch (error) {
    const errorMsg = `  处理文件时出错: ${error.message}`;
    log(errorMsg);
    return false;
  }
}

// 递归处理目录中的所有md文件
function processDirectory(directory) {
  const files = fs.readdirSync(directory);
  
  for (const file of files) {
    const filePath = path.join(directory, file);
    const stats = fs.statSync(filePath);
    
    if (stats.isDirectory()) {
      // 跳过非文章文件目录（如图片目录）
      if (!file.endsWith('.md') && !filePath.includes('编程心智-二-——二八定律对软件开发的影响') && !filePath.includes('编程心智-一-——代码架构与系统架构')) {
        log(`跳过目录: ${filePath}`);
        continue;
      }
      processDirectory(filePath);
    } else if (file.endsWith('.md')) {
      fixFileFrontmatter(filePath);
    }
  }
}

// 主函数
function main() {
  log(`开始检查并修复frontmatter格式...`);
  log(`检查目录: ${POSTS_DIR}`);
  
  try {
    processDirectory(POSTS_DIR);
    
    // 生成统计报告
    const report = `\n=== 修复完成 ===\n` +
                   `总共检查文件数: ${totalFiles}\n` +
                   `修复文件数: ${fixedFiles}\n` +
                   `修复率: ${totalFiles > 0 ? ((fixedFiles / totalFiles) * 100).toFixed(2) : 0}%`;
    
    log(report);
    
    // 保存日志到文件
    fs.writeFileSync(LOG_FILE, logMessages.join('\n'), 'utf8');
    log(`日志已保存到: ${LOG_FILE}`);
    
  } catch (error) {
    log(`执行过程中出错: ${error.message}`);
  }
}

// 开始执行
main();