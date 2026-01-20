# VC Blog v1.0

一个现代化的博客系统，采用 Next.js 16 构建，集成 AI 驱动的内容创作功能，支持静态站点生成（SSG）以获得最佳性能和 SEO 效果。

## 项目简介

VC Blog 是一个全功能的博客平台，融合了传统内容管理与前沿 AI 技术。系统采用前后端分离架构，前端使用 Next.js App Router 实现高性能静态站点生成，后端提供基于 API 的内容管理和 AI 服务集成。

### 核心特性

- **静态站点生成 (SSG)**：所有博客页面在构建时预渲染，提供极致的加载速度
- **AI 内容助手**：集成多个 AI 提供商，智能生成文章摘要和封面图
- **现代化技术栈**：Next.js 16、React 19、TypeScript、Prisma ORM
- **响应式设计**：完美适配移动端、平板和桌面设备
- **内容管理**：完整的管理后台，支持文章的增删改查
- **多媒体支持**：集成 Vercel Blob 存储服务，支持图片上传和管理
- **评论系统**：集成 Disqus 评论功能
- **安全防护**：Cloudflare Turnstile 验证码，防止恶意请求

## 项目功能

### 1. AI 驱动的文本编辑

#### 文章摘要自动生成

在文章编辑器中，AI 能够根据文章内容自动生成精炼的摘要，用于 SEO 优化和文章列表展示。

**功能特点：**

- **流式输出**：实时显示 AI 生成过程，提供流畅的用户体验
- **自定义提示词**：支持修改系统提示词，调整生成内容的风格和重点
- **智能总结**：默认生成 50 字以内的简短摘要
- **多提供商支持**：通过 Cloudflare AI Gateway 统一接入 DeepSeek、OpenAI、Gemini、Anthropic 等多个 AI 服务

**使用方式：**

1. 在管理后台创建或编辑文章
2. 输入文章标题和正文内容
3. 点击文章摘要输入框旁的"AI 生成"按钮（魔法棒图标）
4. 等待 AI 生成摘要，或输入自定义提示词来定制生成结果

### 2. AI 驱动的新建页面功能

#### 封面图智能生成

系统支持根据文章标题或内容自动生成精美的封面图，大大减少创作者寻找图片素材的时间。

**功能特点：**

- **智能提示词**：自动从文章标题和内容中提取关键信息生成图片提示词
- **电影级画质**：使用 Pollinations AI 服务生成高质量、艺术感的封面图
- **实时预览**：生成过程中实时显示进度
- **风格多样**：支持多种艺术风格和构图方式

**使用方式：**

1. 在文章编辑页面，找到封面图片上传区域
2. 切换到"AI 生成"标签页
3. 系统自动读取文章标题作为生成提示词（可手动修改）
4. 点击"生成"按钮，等待 AI 完成图片生成
5. 满意后点击"使用此图片"即可应用到文章

### 3. AI 配置管理

管理后台提供完整的 AI 服务配置面板，允许管理员：

- **AI 提供商切换**：选择不同的 AI 服务（DeepSeek、OpenAI、Gemini、Anthropic）
- **模型参数调整**：配置温度、最大令牌数等参数
- **提示词管理**：自定义各类 AI 任务的系统提示词
- **服务状态监控**：实时查看 AI 服务可用性和配置状态

配置页面：`/admin/settings/ai`

## 部署指南

本系统支持在 Vercel、Railway、Render 等云平台部署，也可自建服务器部署。

### 1. 环境要求

- Node.js 18+ / 20+
- PostgreSQL 数据库
- （可选）Vercel Blob 存储账号
- （可选）Cloudflare 账号（用于 AI Gateway 和 Turnstile）

### 2. 数据库配置

使用 Prisma ORM 管理数据库，需配置 PostgreSQL 连接。

**环境变量：**

```bash
# PostgreSQL 数据库连接字符串
DATABASE_URL='postgresql://用户名:密码@主机:端口/数据库名?sslmode=require'
```

**示例（Neon 数据库）：**

```bash
DATABASE_URL='postgresql://neondb_owner:password@ep-xxx.aws.neon.tech/neondb?sslmode=require'
```

**初始化数据库：**

```bash
# 生成 Prisma Client
npm run prisma generate

# 运行数据库迁移
npx prisma migrate dev --name init

# 或在生产环境
npx prisma migrate deploy
```

### 3. 管理员认证配置

系统使用 JWT 进行管理员身份验证。

**环境变量：**

```bash
# 管理员密码（登录时使用）
VC_ADMIN_PASSWORD=your_secure_password

# JWT 签名密钥（请使用强随机字符串）
JWT_SECRET=your_jwt_secret_key_at_least_32_characters_long
```

**生成 JWT 密钥（可选）：**

```bash
# Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# OpenSSL
openssl rand -base64 32
```

### 4. AI 服务配置

通过 Cloudflare AI Gateway 统一管理多个 AI 提供商。

**环境变量：**

```bash
# Cloudflare 账号 ID（在 Cloudflare 控制台查看）
CLOUDFLARE_ACCOUNT_ID=your_account_id

# AI Gateway 名称（在 Cloudflare 创建的 Gateway 名称）
CLOUDFLARE_GATEWAY_NAME=proxy

# Cloudflare API Token（需要 AI Gateway 权限）
CLOUDFLARE_API_KEY=your_api_token

# AI 模型配置（支持的模型：deepseek/deepseek-chat, openai/gpt-4, google/gemini-pro 等）
AI_MODEL=deepseek/deepseek-chat
```

**Cloudflare AI Gateway 配置步骤：**

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 进入 AI > Gateway
3. 创建新的 Gateway
4. 记录 Account ID 和 Gateway 名称
5. 生成 API Token 并添加到环境变量

**支持的 AI 提供商：**

- DeepSeek（推荐：性价比高，中文友好）
- OpenAI（GPT-4/GPT-3.5）
- Google（Gemini Pro）
- Anthropic（Claude）

### 5. 文件存储配置

使用 Vercel Blob 存储图片和其他媒体文件。

**环境变量：**

```bash
# Vercel Blob 读写 Token（在 Vercel 控制台创建）
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_your_token_here
```

**Vercel Blob 配置步骤：**

1. 登录 [Vercel Dashboard](https://vercel.com/dashboard)
2. 进入项目的 Settings > Storage
3. 创建 Blob Store
4. 生成读写 Token 并添加到环境变量

### 6. 评论系统配置

集成 Disqus 提供评论功能。

**环境变量：**

```bash
# Disqus 站点 Shortname（在 Disqus 设置中获取）
NEXT_PUBLIC_DISQUS_SHORTNAME=your_disqus_shortname

# 网站域名（用于 Disqus 集成）
NEXT_PUBLIC_DOMAIN=https://your-domain.com
```

**Disqus 配置步骤：**

1. 登录 [Disqus](https://disqus.com/)
2. 创建新站点
3. 记录 Shortname（例如：yourblog）
4. 将 Shortname 添加到环境变量

### 7. 验证码配置

使用 Cloudflare Turnstile 防止恶意请求。

**环境变量：**

```bash
# Turnstile 站点密钥（公开，用于前端）
NEXT_PUBLIC_TURNSTILE_SITE_KEY=your_turnstile_site_key_here

# Turnstile 密钥（保密，用于后端验证）
TURNSTILE_SECRET_KEY=your_turnstile_secret_key_here
```

**Cloudflare Turnstile 配置步骤：**

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 进入 Turnstile
3. 创建新站点
4. 记录 Site Key 和 Secret Key
5. 添加到环境变量

### 8. 完整 .env 示例

```bash
# === 数据库配置 ===
DATABASE_URL='postgresql://username:password@host:port/dbname?sslmode=require'

# === 认证配置 ===
VC_ADMIN_PASSWORD=your_secure_password
JWT_SECRET=your_jwt_secret_key_min_32_chars

# === AI 服务配置 ===
CLOUDFLARE_ACCOUNT_ID=your_account_id
CLOUDFLARE_GATEWAY_NAME=proxy
CLOUDFLARE_API_KEY=your_api_token
AI_MODEL=deepseek/deepseek-chat

# === 文件存储配置 ===
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_your_token

# === 评论系统配置 ===
NEXT_PUBLIC_DISQUS_SHORTNAME=your_shortname
NEXT_PUBLIC_DOMAIN=https://your-domain.com

# === 验证码配置 ===
NEXT_PUBLIC_TURNSTILE_SITE_KEY=your_turnstile_site_key_here
TURNSTILE_SECRET_KEY=your_turnstile_secret_key_here
```

### 9. 部署步骤

#### Vercel 部署（推荐）

1. **连接代码仓库**

   ```bash
   # 将代码推送到 GitHub/GitLab
   git push origin v1.0
   ```

2. **导入项目到 Vercel**

   - 访问 [Vercel Dashboard](https://vercel.com/dashboard)
   - 点击 "New Project"
   - 选择代码仓库和分支
   - 配置环境变量（复制上面的 .env 示例）

3. **部署设置**

   ```bash
   # Vercel 会自动检测以下命令
   Build Command: prisma generate && next build
   Output Directory: .next
   Install Command: npm install
   ```

4. **配置数据库**

   - 确保 `DATABASE_URL` 指向可访问的 PostgreSQL 实例
   - 部署后会自动运行 `prisma migrate deploy`

5. **访问应用**
   - 部署完成后，Vercel 会提供 `.vercel.app` 域名
   - 可在 Settings > Domains 添加自定义域名

#### Docker 部署

1. **创建 Dockerfile**（项目根目录）

   ```dockerfile
   FROM node:20-alpine

   WORKDIR /app

   COPY package*.json ./
   RUN npm ci --only=production

   COPY . .
   RUN npx prisma generate

   ENV NODE_ENV=production
   CMD ["npm", "start"]
   ```

2. **构建镜像**

   ```bash
   docker build -t vc-blog:v1.0 .
   ```

3. **运行容器**
   ```bash
   docker run -d \
     --name vc-blog \
     -p 3000:3000 \
     --env-file .env \
     vc-blog:v1.0
   ```

#### 传统服务器部署

1. **克隆代码**

   ```bash
   git clone https://github.com/your-repo/vc-blog.git
   cd vc-blog
   git checkout v1.0
   ```

2. **安装依赖**

   ```bash
   npm install
   ```

3. **配置环境变量**

   ```bash
   cp .env.example .env
   # 编辑 .env 文件，填入实际配置
   ```

4. **数据库迁移**

   ```bash
   npx prisma migrate deploy
   npx prisma generate
   ```

5. **构建应用**

   ```bash
   npm run build
   ```

6. **启动服务**

   ```bash
   # 开发环境
   npm run dev

   # 生产环境
   npm run start
   ```

7. **使用 PM2 管理进程（推荐）**
   ```bash
   npm install -g pm2
   pm2 start npm --name "vc-blog" -- start
   pm2 save
   pm2 startup
   ```

### 10. 验证部署

部署完成后，访问以下 URL 验证系统功能：

- 首页：`https://your-domain.com/`
- 管理后台：`https://your-domain.com/admin`（使用 `VC_ADMIN_PASSWORD` 登录）
- AI 设置：`https://your-domain.com/admin/settings/ai`

**检查清单：**

- [ ] 首页正常加载
- [ ] 文章列表可正常浏览
- [ ] 管理后台登录成功
- [ ] AI 服务状态正常（在 AI 设置页面查看）
- [ ] 图片上传功能可用
- [ ] AI 摘要生成功能可用
- [ ] AI 封面图生成功能可用

## 技术栈

- **框架**：Next.js 16 (App Router)
- **前端**：React 19, TypeScript
- **样式**：Tailwind CSS, Radix UI
- **数据库**：PostgreSQL + Prisma ORM
- **AI 服务**：Cloudflare AI Gateway, DeepSeek, OpenAI, Gemini, Anthropic
- **文件存储**：Vercel Blob
- **评论系统**：Disqus
- **安全防护**：Cloudflare Turnstile
- **测试**：Vitest, Testing Library
- **代码质量**：ESLint, Prettier

## 项目结构

```
vc-blog/
├── prisma/                  # 数据库 Schema 和迁移
├── public/                  # 静态资源
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── (pages)/         # 公共页面（首页、文章详情等）
│   │   └── admin/           # 管理后台
│   ├── components/          # React 组件
│   ├── lib/                 # 核心库和服务
│   │   ├── ai-*.ts          # AI 相关服务
│   │   └── db.ts            # Prisma Client
│   ├── types/               # TypeScript 类型定义
│   └── utils/               # 工具函数
├── .env                     # 环境变量（需自行创建）
├── package.json
└── README.md
```

## 开发指南

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 运行生产服务器
npm run start

# 运行测试
npm test

# 代码检查
npm run lint
```

## 许可证

本项目采用 [MIT License](LICENSE) 开源协议。

Copyright (c) 2025 VC Blog Contributors

您可以自由地使用、修改、分发本软件，包括用于商业目的。只需保留原作者的版权声明和许可声明即可。

## 联系方式

如有问题或建议，欢迎提交 Issue 或 Pull Request。
