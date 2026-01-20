## [heliannuuthus.github.io](https://heliannuuthus.github.io) - 个人博客

[![deploy](https://github.com/heliannuuthus/heliannuuthus.github.io/actions/workflows/deploy.yml/badge.svg?branch=master)](https://github.com/heliannuuthus/heliannuuthus.github.io/actions/workflows/deploy.yml)

发音为 _/hɪˈlaɪənˌnuːθəsəs/_。拉丁语中的 "helianthus annuus"，也就是向日葵的学名。

### 关于我

从事 [IDaaS](https://auth0.com/blog/what-is-idaas/) 和 [KMS](https://aws.amazon.com/kms) 相关开发工作，对 AI 应用有较强的实践兴趣，使用 [Java](https://java.com) 和 [Rust](https://www.rust-lang.org/) 偏多，有良好的编码习惯，喜欢钻研技术，热衷于技术分享（只有被人看到才能修正自己的错误）。

### 博客内容

目前博客主要记录一些技术上的总结，以及一些技术上的思考（如果您觉得博客内容不正确，可以联系我，我会及时修正 heliannuuthus@gmail.com）。

- [开发效率工具](https://site.heliannuuthus.com/blog/development-tools): 一些工具，来自我对编程的习惯和偏好
- [SPIFFE](https://site.heliannuuthus.com/blog/spiffe): 一套开源标准，解决由于现代网络环境中资源动态变化（如弹性扩缩容、多运行时等）与环境复杂异构（如多云混合架构、跨平台支持等）所带来安全问题。
- [MCP 身份认证协议](https://site.heliannuuthus.com/blog/OAuth2.1-MCP): 解释 OAuth2.1 如何解决 Agent 通过 MCP 协议调用外部工具的身份和权限问题。

## 项目结构

本项目采用 **Monorepo** 架构，使用 [pnpm workspace](https://pnpm.io/workspaces) 进行依赖管理。

```
heliannuuthus.github.io/
├── packages/              # Remark/Rehype 插件包
│   ├── remark-admomition/      # 自定义 Admonition 插件
│   ├── remark-breaks/          # 换行处理插件
│   ├── remark-collapse/        # 折叠内容插件
│   ├── remark-collapse-heading/# 标题折叠插件
│   ├── remark-comment-tooltip/ # 注释提示插件
│   ├── remark-external-link/   # 外部链接处理插件
│   ├── remark-markmap/         # Markmap 思维导图插件
│   ├── remark-mermaid/         # Mermaid 图表插件
│   ├── remark-tables/          # 表格增强插件
│   ├── remark-tabs/            # 标签页插件
│   └── remark-terminology/     # 术语表插件
├── plugins/               # Docusaurus 插件
│   ├── docusaurus-alias/      # 路径别名插件
│   ├── docusaurus-authors/    # 作者管理插件
│   ├── docusaurus-terminology/# 术语表插件
│   ├── parse-md/              # Markdown 解析工具
│   └── terminology-store/     # 术语存储工具
├── blog/                  # 博客文章
│   └── YYYY-MM/               # 按年月组织
│       ├── _codes/            # 代码示例
│       ├── _contents/         # 内容片段
│       └── _partials/         # 可复用部分
├── essay/                 # 随笔文章
├── terminologies/         # 术语表定义
├── src/                   # 源代码
│   ├── components/        # React 组件
│   ├── pages/             # 页面组件
│   ├── theme/             # 主题定制
│   └── utils/             # 工具函数
└── static/                # 静态资源

```

### 内容组织说明

- `_codes/`: 存放代码示例文件，可通过 `remark-code-import` 插件在文章中引用
- `_contents/`: 存放内容片段，用于模块化组织长文章
- `_partials/`: 存放可复用的 Markdown 片段

## 开发指南

### 环境要求

- Node.js >= 22.0
- pnpm >= 10.0

### 安装依赖

```bash
pnpm install
```

### 开发命令

```bash
# 启动开发服务器
pnpm start

# 构建项目
pnpm build

# 类型检查
pnpm typecheck

# 代码检查
pnpm lint

# 代码格式化（自动修复）
pnpm lint:fix

# 构建所有 packages 和 plugins
pnpm rebuild:all
```

### 构建流程

1. **构建 packages**: 先运行测试，然后构建所有 remark/rehype 插件
2. **构建 plugins**: 先构建依赖项（parse-md, terminology-store），再构建其他插件
3. **构建网站**: 使用 Docusaurus 构建最终网站

### 添加新的插件

1. 在 `packages/` 或 `plugins/` 目录下创建新包
2. 确保包名以 `heliannuuthus-` 开头
3. 在根目录 `package.json` 中添加依赖引用（使用 `file:` 协议）
4. 运行 `pnpm install` 安装依赖

### 代码规范

- 使用 TypeScript 编写代码
- 遵循 Prettier 代码格式化规则
- 使用 ESLint 进行代码检查
- 避免使用 `any` 类型，优先使用具体类型定义
