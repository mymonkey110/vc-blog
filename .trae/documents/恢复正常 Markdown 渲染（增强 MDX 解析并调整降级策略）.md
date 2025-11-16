## 问题

* 目前在 MDX 编译失败时，我们将全文包裹为代码块（`pre`），导致正常 Markdown 也以代码形式显示，影响阅读。

## 方案

1. 增强 MDX 解析能力：在序列化阶段启用 `remark-gfm`（支持 GFM 表格、任务列表等）与 `rehype-raw`（允许原始 HTML），降低编译失败概率。
2. 调整降级策略：

   * 仅当增强解析后仍失败时，返回简洁的文本提示，不再把全文放入代码块。

   * 保留页面可访问性，避免 404。
3. 不改动现有 `pre` 代码块组件；它只作用于代码块，不会影响正常 Markdown。

## 修改点（伪代码）

* `package.json`：添加依赖 `remark-gfm`、`rehype-raw`

* `src/pages/article/[yyyy]/[mm]/[dd]/[title].tsx`：

  ```pseudo
  import remarkGfm from 'remark-gfm'
  import rehypeRaw from 'rehype-raw'
  const serialized = await serialize(content, { mdxOptions: { remarkPlugins: [remarkGfm], rehypePlugins: [rehypeRaw] } })
  // fallback:
  const safeText = '内容暂时无法渲染为富文本。请稍后重试。'
  const serialized = await serialize(safeText, { mdxOptions: { remarkPlugins: [remarkGfm], rehypePlugins: [rehypeRaw] } })
  ```

## 验证

* 安装依赖后构建并启动本地，访问之前变成 `pre` 的文章，确认正常 Markdown 渲染恢复；存在复杂 HTML 的文章也尽量正常渲染，极端失败时显示简洁提示。

