## 问题定位

* 代码块出现双层框的原因：MDX 默认渲染代码块为 `<pre><code/></pre>`，而我们将 `components.code` 映射为自定义组件并再次返回 `<pre>`，导致结构变为 `<pre><div>...<pre><code/></pre></div></pre>`。

* 关键文件与位置：

  * 自定义代码块组件与映射：`src/components/MarkdownRenderer.tsx:24–55, 71–84`

  * 外层 `<pre>` 来源：MDX 默认的 `<pre>`（未自定义），内层 `<pre>` 来自 `CodeBlock`：`src/components/MarkdownRenderer.tsx:50`

  * 样式：`src/styles/markdown.module.css:54–63`（`.markdown-content pre` 与 `.codeBlock` 同时作用于 `<pre>`，在双层时造成双重视觉效果）

## 解决思路（伪代码）

* 改为拦截并自定义 `pre`，而不是在 `code` 中再生成一个 `<pre>`。

* 组件映射：

  * `components.pre = (props) => <PreBlock className={props.className}>{props.children}</PreBlock>`

  * `components.code = (props) => <code className={props.className}>{props.children}</code>`（仅用于内联代码，无再包裹 `<pre>`）

* `PreBlock` 结构：

  * `div.relative`

    * `button`（复制按钮，绝对定位右上角）

    * `<pre className={styles.codeBlock}>`（仅保留一个 `<pre>`，内部为原始 `<code>`）

* 复制逻辑：

  * 使用 `useRef<HTMLPreElement>` 绑定到 `<pre>`，`navigator.clipboard.writeText(preRef.current?.innerText || '')`

  * 复制状态 2 秒恢复

* 语法高亮：保留现有 `Prism.highlightAll()`；语言类保留在 `<code>` 上即可（Prism 支持 `pre > code.language-xxx`）。

## 修改步骤

1. 在 `src/components/MarkdownRenderer.tsx`：

   * 新增 `PreBlock` 组件，包含复制按钮与单一 `<pre>`；移除/替换当前 `CodeBlock` 的内层 `<pre>` 生成逻辑。

   * 将 `components` 从 `code` 拦截改为 `pre` 拦截；`code` 仅用于内联。
2. 样式保持不变（`markdown.module.css` 无需改动）；`styles.codeBlock` 继续用于唯一的 `<pre>`。

## 验证

* 打开任意含代码块的文章详情页，检查 DOM 应为 `div.relative > button + pre.codeBlock > code`，且不存在外层 `<pre>`。

* 点击复制按钮，确认剪贴板内容与代码一致，按钮文本 2 秒恢复。

* 语法高亮正常（Prism 主题与语言组件已加载）。

## 影响面与风险

* 仅影响代码块渲染方式；对内联代码、图片、其它 Markdown 元素无影响。

* 风险低；若未来引入 `rehype-pretty-code` 等插件，此策略仍兼容，只需在 `pre` 层做容器即可。

