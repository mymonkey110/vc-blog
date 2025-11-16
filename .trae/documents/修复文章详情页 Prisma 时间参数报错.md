# 修复文章详情页 Prisma 时间参数报错

## 问题分析
- 报错：`PrismaClientValidationError`，`gte: new Date("Invalid Date")`。
- 根因：App Router 在 Next.js 16 中 `params` 可能是异步（Promise）。当前 `page.tsx` 直接同步读取 `params.yyyy/mm/dd`，导致 `NaN` 构造出 `Invalid Date`，进而 Prisma where 条件失效。
- 其次需要对 URL 参数进行边界与有效性校验，避免非数字或越界值进入日期计算。

## 修复方案
1. 将详情页 `Page` 的 props 改为异步 `params`，并 `await` 解包：
   ```ts
   export default async function Page({ params }: { params: Promise<{ yyyy: string; mm: string; dd: string; title: string }> }) {
     const p = await params
     // ...
   }
   ```
2. 添加参数校验与兜底：
   - 将 `yyyy/mm/dd` 转为数字后，校验范围与整数性：
     - `yearNum > 1970 && monthNum in [1..12] && dayNum in [1..31]`
   - 通过 `isNaN(dayStart.getTime())` 再次校验日期有效性，若无效：`return notFound()`。
3. 构造日期范围：
   - 使用 `Date.UTC(yearNum, monthNum - 1, dayNum, 0, 0, 0)` 生成 `dayStart/dayEnd`（`dayEnd` 设为次日 00:00）
   - 保留现有 Prisma 通过 `createdAt` 范围查询与 `title` slug 匹配的逻辑。
4. 错误处理与返回：
   - 若找不到匹配文章，`return notFound()`；
   - 将 `decodeURIComponent(title)` 保留；
   - 在最外层包裹 `try/catch`，记录日志但不抛出 `Invalid Date`，保持页面稳定。
5. 引入必要方法：
   - 从 `next/navigation` 引入 `notFound()` 用于 404；

## 变更文件
- `src/app/article/[yyyy]/[mm]/[dd]/[title]/page.tsx`
  - 等待并解包 `params`
  - 参数有效性校验
  - 日期有效性校验与 404 兜底
  - 保留 MDX 序列化与渲染逻辑

## 验证
- 打开合法路径（示例）：`/article/2024/06/01/sample-title`，应正常渲染。
- 打开非法路径（如缺失或非数字）：返回 404，而非服务端错误。
- 检查终端无 `Invalid Date` 报错，Prisma 查询日志正常。

确认后我将按上述步骤实施修改并验证页面恢复。