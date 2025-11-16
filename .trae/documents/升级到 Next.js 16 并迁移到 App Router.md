# 升级到 Next.js 16 并迁移到 App Router

## 目标
- 将 `next` 升级到 `16.0.3`，同步升级相关依赖，满足 Node 与 TypeScript 要求。
- 从 Pages Router 迁移到 App Router，保留现有功能与样式，路由一致。

## 环境与依赖检查
- Node 要求：`>= 20.9.0`（Next.js 16 要求，参考官方升级指南）(https://nextjs.org/docs/app/guides/upgrading/version-16)
- TypeScript：已是 `5.5.3`，满足要求。
- React：升级到最新（Next.js 16 稳定支持的版本）。

## 依赖升级
- 更新 `package.json`：
  - `next` → `16.0.3`
  - `react` / `react-dom` → 最新兼容版本
  - `eslint-config-next` → `16.x`
  - `@types/react` / `@types/react-dom` → 与 React 版本匹配
- 脚本：`dev/build/start` 保持不变；如需遵循官方建议，可将 `lint` 从 `next lint` 改为 `eslint .`（可选）。
- 兼容性注意：Next.js 16 默认使用 Turbopack；存在自定义 `webpack` 配置会导致构建失败。

## 构建配置调整
- 当前 `next.config.js` 使用了 `webpack` 别名：`src/next.config.js:16-22`
- 迁移方案：移除自定义 `webpack` 段并依赖 `tsconfig.json` 的 `paths`（已存在 `@/*` → `./src/*`，见 `tsconfig.json:22-25`）。
  - 这是 Turbopack 下更稳妥的方式，避免构建报错。
  - 保留现有 `images.remotePatterns` 与 `reactStrictMode`。

## App Router 目录结构与页面迁移
- 新建 `src/app` 目录并按以下文件布局迁移：
  - `src/app/layout.tsx`：全局布局，导入 `../styles/globals.css`，设置 `lang="zh-CN"`，将原 `Document` 的 `<Head>` 内容迁移到 `metadata` 或在 `layout` 中通过 `<link>` 引入。
    - 来源：`src/pages/_document.tsx:10-23`
  - `src/app/page.tsx`：首页（Server Component），从 `GetStaticProps` 改为在组件内服务器侧取数，支持查询参数 `searchParams.page`。
    - 来源：`src/pages/index.tsx:135-197`（逻辑）与渲染 `1-133`
    - 在 App Router 中：
      ```tsx
      export const revalidate = 60
      export default async function Page({ searchParams }: { searchParams: { page?: string } }) {
        const page = Number(searchParams?.page ?? 1)
        // 使用 prisma 取数（仅服务器）
        // 渲染与原页面一致
      }
      ```
  - 文章详情：`src/app/article/[yyyy]/[mm]/[dd]/[title]/page.tsx`
    - 将 `getStaticPaths` → `generateStaticParams`；`getStaticProps` → 服务器数据读取。
    - MDX 序列化仍在服务端执行；将 `MarkdownRenderer` 作为 Client Component 使用。
    - 来源：`src/pages/article/[yyyy]/[mm]/[dd]/[title].tsx`
  - 关于页：`src/app/about/page.tsx`
    - 直接迁移 JSX 结构与样式。
    - 来源：`src/pages/about.tsx`
  - 后台页（使用状态与事件，需标记为 Client）：
    - `src/app/admin/page.tsx`（仪表盘） → 在文件顶部添加 `'use client'`
      - 来源：`src/pages/admin/index.tsx`
    - `src/app/admin/articles/page.tsx`（文章列表） → `'use client'`
      - 来源：`src/pages/admin/articles.tsx`
    - `src/app/admin/articles/[id]/page.tsx`（文章编辑） → `'use client'`，保留编辑器逻辑
      - 来源：`src/pages/admin/articles/[id].tsx`
    - 如有 `src/pages/admin/login.tsx`，迁移至 `src/app/admin/login/page.tsx`（Client）。

## API 路由迁移
- `src/pages/api/auth/login.ts` → `src/app/api/auth/login/route.ts`
  - 导出 `POST` 处理器，使用 `NextResponse`：
    ```ts
    export async function POST(req: Request) {
      const { password } = await req.json()
      // 校验后：return NextResponse.redirect(new URL('/admin', req.url), { status: 302 })
    }
    ```
  - 来源：`src/pages/api/auth/login.ts:3-31`

## RSC 与 Client 组件边界
- 将 `src/components/MarkdownRenderer.tsx` 顶部添加 `'use client'`（使用了 `useEffect` 与 `MDXRemote`）。
  - 文件来源：`src/components/MarkdownRenderer.tsx:1-4,90-100`
- 纯展示与 `next/link` 组件可作为 Server Component 使用；包含 `useState/useEffect` 的页面与组件放在 Client 边界下。

## 删除与收尾（在新路由验证通过后）
- 删除已迁移的 Pages Router 文件：
  - `src/pages/_app.tsx`（由 `layout.tsx` 取代，来源 `src/pages/_app.tsx:1-13`）
  - `src/pages/_document.tsx`（由 `layout.tsx`/`metadata` 取代）
  - 已迁移的页面与 API 文件（`index.tsx`, `about.tsx`, `article/...`, `admin/...`, `api/...`）。
- 保留 `src/styles/globals.css` 与现有样式文件；在 `layout.tsx` 中全局引入。

## 验证方案
- 开发模式运行并逐页验证：
  - 首页分页与 `?page=` 查询参数
  - 文章详情（路径生成与 MDX 渲染）
  - 关于页
  - 后台页（列表与编辑器交互）
  - 登录接口（POST 重定向）
- 关注 Next.js 16 变更：
  - 默认 Turbopack，移除自定义 webpack 配置避免构建失败 (https://nextjs.org/docs/app/guides/upgrading/version-16)
  - 异步请求 API（`cookies/headers/draftMode` 等需异步访问，当前代码未使用）(https://nextjs.org/blog/next-16)

## 文件映射一览
- `src/pages/_app.tsx` → `src/app/layout.tsx`
- `src/pages/index.tsx` → `src/app/page.tsx`
- `src/pages/about.tsx` → `src/app/about/page.tsx`
- `src/pages/article/[yyyy]/[mm]/[dd]/[title].tsx` → `src/app/article/[yyyy]/[mm]/[dd]/[title]/page.tsx`
- `src/pages/admin/index.tsx` → `src/app/admin/page.tsx`
- `src/pages/admin/articles.tsx` → `src/app/admin/articles/page.tsx`
- `src/pages/admin/articles/[id].tsx` → `src/app/admin/articles/[id]/page.tsx`
- `src/pages/api/auth/login.ts` → `src/app/api/auth/login/route.ts`
- 组件保留原目录：`src/components/*`

## 交付说明
- 我将按上述步骤执行：先升级依赖与配置、搭建 `app` 目录结构并逐个迁移页面与 API、处理 Client/RSC 边界、最后删除旧的 `pages` 文件并验证功能。请确认后开始实施。