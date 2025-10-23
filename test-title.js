// 测试标题处理逻辑
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

// 模拟markdown.ts中的标题处理逻辑
function processTitle(fileName) {
  const id = fileName.replace(/\.(md|mdx)$/, '');
  const fullPath = path.join(process.cwd(), 'content/posts', fileName);
  
  try {
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const matterResult = matter(fileContents);
    
    console.log(`文件: ${fileName}`);
    console.log(`原始Frontmatter标题: "${matterResult.data.title}"`);
    
    // 应用我们的修复逻辑
    let title = matterResult.data.title;
    if (!title || title.trim() === '' || title.trim().toLowerCase() === 'untitled') {
      title = id.replace(/-/g, ' ');
      title = title.charAt(0).toUpperCase() + title.slice(1);
    }
    
    console.log(`处理后的标题: "${title}"`);
    console.log('------------------------');
    
    return title;
  } catch (error) {
    console.error(`处理文件 ${fileName} 时出错:`, error);
    return 'Error';
  }
}

// 测试几个文件
console.log('开始测试标题处理逻辑...\n');
processTitle('博客域名更新.md');
processTitle('sample-post.md');
processTitle('welcome-to-my-blog.md');

console.log('测试完成！');