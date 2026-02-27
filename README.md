# 养老系统项目

基于 React + TypeScript + Vite 的多角色管理系统

## 技术栈

- React 19
- TypeScript
- React Router v7
- Axios
- Vite

## 项目结构

```
src/
├── components/      # 公共组件
├── contexts/        # React Context (认证等)
├── layouts/         # 三个角色的布局组件
├── pages/           # 页面组件
│   ├── Login/       # 登录页面
│   ├── Operations/  # 运营端页面
│   ├── Sales/       # 销售端页面
│   └── SalesCenter/ # 销售中心端页面
├── request/         # HTTP 请求封装
├── router/          # 路由配置
├── types/           # TypeScript 类型定义
└── utils/           # 工具函数
```

## 三个角色系统

- **运营端** (`/operations`) - 平台管理、用户管理、订单管理等
- **销售端** (`/sales`) - 客户管理、任务管理、业绩统计等
- **销售中心端** (`/sales-center`) - 团队管理、报表分析、目标管理等

## 开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 代码检查
npm run lint

# 代码格式化
npm run format
```

## 测试账号

登录时根据用户名自动判断角色：
- 包含 "operations" 或 "运营" → 运营端
- 包含 "center" 或 "中心" → 销售中心端
- 其他 → 销售端

## 开发指南

1. 在对应的 `pages/` 文件夹下开发页面功能
2. 使用 `@/request/http` 进行 API 调用
3. 使用 `useAuth()` 获取当前用户信息
4. 新增路由需在 `router/AppRouter.tsx` 中配置
