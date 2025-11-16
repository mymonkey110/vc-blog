# 修复 Next.js 16 升级后样式失效问题

## 根因定位
- Tailwind 未扫描到 App Router 下的文件，导致所有类名被“摇树优化”排除，样式几乎全部失效。
  - 证据：`tailwind.config.js:3-6` 仅包含 `./src/pages/**/*` 与 `./src/components/**/*`，缺少 `./src/app/**/*`。
- Turbopack 对 CSS `@import` 顺序更严格；需保证所有 `@import` 在文件最顶部（已核查并可再次确认 `src/styles/globals.css`）。

## 修复步骤
1. 更新 Tailwind 扫描范围：
   - 修改 `tailwind.config.js` 的 `content` 字段，加入 App Router 目录与 MDX：
     - `./src/app/**/*.{js,ts,jsx,tsx,mdx}`
     - 保留 `./src/components/**/*.{js,ts,jsx,tsx}`
     - 可选：统一为 `./src/**/*.{js,ts,jsx,tsx,mdx}` 以减少漏扫风险。
2. 校验全局样式引入：
   - 确认 `src/app/layout.tsx` 已引入 `../styles/globals.css`（当前存在）。
   - 确认 `globals.css` 顶部 `@import` 顺序正确（将再次检查并保持在文件最开头）。
3. 重启开发服务，观察首页、关于页、文章详情与后台页样式恢复情况。
4. 若仍存在个别样式未生效：
   - 检查是否使用了未被 Tailwind 捕获的动态类名（例如字符串拼接）并改为显式类名。
   - 检查自定义 `@layer utilities` 是否正确（`src/styles/globals.css` 已使用），确保未被 Purge。

## 变更文件
- `tailwind.config.js`：更新 `content` 配置以包含 `src/app/**/*`。
- （只读确认）`src/app/layout.tsx` 与 `src/styles/globals.css`：验证引入与 `@import` 顺序。

## 验证
- 运行 `npm run dev` 后，访问 `http://localhost:3000/`，验证：
  - 首页卡片、按钮与网格布局恢复
  - 关于页排版与配色恢复
  - 文章详情 Markdown 渲染样式恢复
  - 后台页面（仪表盘、文章列表、编辑器）样式恢复

确认后我将按上述步骤修改配置并重启服务，确保样式全面恢复。