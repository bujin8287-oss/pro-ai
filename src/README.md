# src 目录结构建议

建议把“业务页面”和“可复用能力”拆开，后续扩展会更清晰：

## 目录说明

- `router/`：路由配置（入口 `AppRouter.tsx`）
- `pages/`：页面级组件（按页面/模块分文件夹）
- `layouts/`：布局组件（如侧边栏、顶部栏等）
- `components/`：可复用 UI/业务组件（更偏“组件库”）
- `hooks/`：自定义 Hooks（与框架/业务解耦的可复用逻辑）
- `utils/`：工具函数（logger、storage、classnames 等）

## 新增页面的流程

1. 在 `src/pages/xxx/` 新增 `XxxPage.tsx`
2. 在 `src/router/AppRouter.tsx` 里新增对应的 `Route`

## 路径别名

本项目已配置 `@/` 指向 `src/`，例如：

- `import { AppRouter } from '@/router'`
- `import { useBoolean } from '@/hooks'`


