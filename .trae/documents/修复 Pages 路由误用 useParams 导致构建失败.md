## 问题原因

* `src/pages/admin/articles/[id].tsx:2` 误从 `next/router` 导入 `useParams`，Pages Router 并不提供该导出。

* 在 Pages Router 中应使用 `useRouter().query` 读取动态路由参数；`useParams` 仅在 App Router 且从 `next/navigation` 导出。

## 修复方案

* 更新导入：将 `import { useRouter, useParams } from 'next/router';` 改为仅导入 `useRouter`（文件 `c:\Projects\vc-blog\src\pages\admin\articles\[id].tsx:2`）。

* 替换参数获取：把 `const { id } = useParams<{ id: string }>();` 改为基于 `router.query.id` 的安全读取（文件 `c:\Projects\vc-blog\src\pages\admin\articles\[id].tsx:14`）：

  * `const router = useRouter()`

  * `const id = typeof router.query.id === 'string' ? router.query.id : Array.isArray(router.query.id) ? router.query.id[0] : undefined`

* 派生 `isNewArticle`，避免初始渲染时 `id` 未就绪导致误判：

  * 用 `const isNewArticle = id === 'new'` 替换原来的 `useState(id === 'new')`

  * 将依赖 `useEffect(() => { ... }, [id])`，并在副作用内首行加防护：`if (!id) return`

* 防护使用 `id` 的跳转逻辑（如复制按钮）：在使用前确保 `id` 存在，或为未就绪状态给出提示。

## 代码变更要点

* 仅修改该文件的导入与参数读取逻辑；不变更现有 UI、类型定义与数据结构。

* 类型保持为 `string | undefined`，在初始状态已包含草稿 `draft-<timestamp>` 兜底，行为一致。

## 验证

* 运行 `npm run build`，确认不再出现 `useParams` 的编译错误。

* 打开 `/admin/articles/new` 与 `/admin/articles/123`，确认新建与编辑模式判断正确，副作用不在 `id` 未就绪时误触发。

* 可选：为 `id` 未就绪时显示轻量加载态，以提升首渲染体验。

