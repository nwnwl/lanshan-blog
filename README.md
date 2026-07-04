# 蓝山工作室官方网站

基于 pnpm Monorepo 架构的蓝山工作室官方站点。

## 技术栈

| 类别     | 技术                              |
| -------- | --------------------------------- |
| 包管理   | pnpm@11                           |
| 语言     | TypeScript 6                      |
| 代码规范 | ESLint + Prettier                 |
| 提交规范 | Commitlint (Conventional Commits) |
| Git 钩子 | Husky + lint-staged               |

## 快速开始

```bash
# 确保环境满足要求
node -v  # >= 22.0.0 < 23.0.0（仅限 22 大版本）
pnpm -v  # >= 11

# 安装依赖
pnpm install

# 启动开发服务器（待实现）
# pnpm dev

# 构建生产版本（待实现）
# pnpm build
```

## 脚本

| 命令                | 说明                  |
| ------------------- | --------------------- |
| `pnpm lint`         | ESLint 检查并自动修复 |
| `pnpm format`       | Prettier 格式化       |
| `pnpm format:check` | 检查格式是否合规      |

## 工程化规范

### 代码风格

- 缩进：2 空格
- 引号：单引号
- 分号：必须
- 换行符：CRLF
- 尾逗号：always
- 行宽：100 字符

### 提交规范

遵循 [Conventional Commits](https://www.conventionalcommits.org/zh-hans/)，格式：

```
<type>(<scope>): <subject>
```

常用 type：

| type       | 说明         |
| ---------- | ------------ |
| `feat`     | 新功能       |
| `fix`      | 修复 bug     |
| `docs`     | 文档变更     |
| `style`    | 代码格式调整 |
| `refactor` | 重构         |
| `perf`     | 性能优化     |
| `test`     | 测试相关     |
| `chore`    | 构建/工具链  |
| `ci`       | CI 配置      |

### Git 钩子

- `pre-commit`：lint-staged 自动对暂存文件执行 ESLint + Prettier
- `commit-msg`：Commitlint 校验提交信息格式

## 项目结构

```
lanshan-blog/
├── .husky/          # Git 钩子
├── .editorconfig    # 编辑器配置
├── .gitattributes   # Git 换行符策略
├── .prettierrc      # Prettier 配置
├── eslint.config.js # ESLint 配置
├── package.json     # 根包配置
└── pnpm-workspace.yaml
```

## 贡献指南

1. Fork 本仓库
2. 创建功能分支：`git checkout -b feat/xxx`
3. 提交代码（遵循 Conventional Commits）
4. 推送分支并发起 PR

---

蓝山工作室 © 2025
