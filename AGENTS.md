# heliannuuthus.github.io

个人博客与作品站点，基于 Next.js 构建，包含 MDX 内容、交互组件、可视化与博客文章。

## 技术栈

- Next.js
- React
- TypeScript
- HeroUI
- MDX/remark/rehype 相关内容管线
- Three.js / React Three Fiber
- Mermaid / Markmap
- ESLint

## 常用命令

```bash
pnpm install
pnpm dev
pnpm build
pnpm start
pnpm lint
pnpm covers
```

## 项目关注点

- `app/`：Next.js App Router 页面与布局。
- `components/`：站点组件与交互模块。
- `content/` 或文章目录：博客内容，保持 frontmatter 与路由一致。
- `scripts/generate-covers.mjs`：构建前生成封面资源，`pnpm build` 会先运行 `pnpm covers`。

## 内容与 UI 规则

- 博客文章优先保证技术准确性、可读性和链接可用。
- MDX/remark 指令变更要兼容历史文章。
- UI 改动保持站点个人品牌一致，不要把博客改成通用模板风。
- 引入重型可视化/3D 依赖时注意首屏性能和构建体积。

## 验证 Checklist

1. 内容或组件改动后运行 `pnpm lint`。
2. 构建链路或 MDX 管线改动后运行 `pnpm build`。
3. 视觉改动至少检查首页、文章页、移动端窄屏。
