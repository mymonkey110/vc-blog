## 问题定位
- 详情页动态路由文件：`src/pages/article/[yyyy]/[mm]/[dd]/[title].tsx`
- 列表页链接生成使用 UTC 日期组件：`getUTCFullYear/getUTCMonth/getUTCDate`，见 `src/pages/index.tsx:101` 与 `src/pages/index.tsx:109`
- 详情页静态路径生成使用本地时区日期组件：`getFullYear/getMonth/getDate`，见 `src/pages/article/[yyyy]/[mm]/[dd]/[title].tsx:118-121`
- 详情页数据查找按 UTC 日期匹配，见 `src/pages/article/[yyyy]/[mm]/[dd]/[title].tsx:173-177`
- 时区不一致导致路由参数不匹配，出现 404；同时 `fallback: false` 会让新增文章在构建后访问即 404。

## 修复方案
1. 统一路径参数的时区
   - 将 `getStaticPaths` 的年月日改为 UTC 组件：`getUTCFullYear/getUTCMonth/getUTCDate`。
   - 保持列表页与详情页的参数一致，避免跨时区日期偏移导致的 404。
2. 启用阻塞式回退与增量静态再生（ISR）
   - 在 `getStaticPaths` 返回中将 `fallback` 设为 `'blocking'`，以便新增文章在首次访问时也能生成页面而不是 404。
   - 在 `getStaticProps` 返回中添加 `revalidate: 60`（或根据需要调整），让页面定期再生，避免数据陈旧。
3. 标题参数一致性
   - 当前列表页使用原始标题（`formatUrlTitle` 返回原文），详情页用 `decodeURIComponent` 后与数据库标题严格相等比较（`===`），两者逻辑一致，可保留。
   - 如标题可能包含 `/` 等路径分隔符，后续可引入 slug（可选增强，不纳入本次最小修复）。

## 代码修改点（伪代码）
- 文件：`src/pages/article/[yyyy]/[mm]/[dd]/[title].tsx`
  - 在 `getStaticPaths` 中：
    ```pseudo
    const year = date.getUTCFullYear().toString()
    const month = String(date.getUTCMonth() + 1).padStart(2, '0')
    const day = String(date.getUTCDate()).padStart(2, '0')
    return { paths, fallback: 'blocking' }
    ```
  - 在 `getStaticProps` 返回：
    ```pseudo
    return { props: { ... }, revalidate: 60 }
    ```

## 验证步骤
- 本地启动后访问任意文章链接，确认不再 404。
- 测试跨时区边界（例如 UTC+8 的凌晨文章）链接能正确命中详情页。
- 新增一篇文章后不重建，直接访问对应链接，首次请求阻塞生成，后续命中静态缓存。

## 预期影响
- 修复因时区不一致导致的 404。
- 新增文章在构建后也可被访问（阻塞式回退 + ISR）。
- 不改变现有标题展示与匹配行为；如后续需要更稳健的 URL，可增量引入 slug。