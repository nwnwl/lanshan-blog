// 🚨 ESLint Flat Config — 蓝山工作室 Node 编码规范
//
// 规则层级:
//   1. @eslint/js          — ESLint 官方推荐 (JS)
//   2. typescript-eslint   — TypeScript 类型安全规则
//   3. eslint-plugin-n     — Node.js 最佳实践规范
//   4. eslint-plugin-import— 导入顺序与模块管理
//   5. eslint-config-prettier — 关闭与 Prettier 冲突的规则
//
// Node.js 22 LTS 特性已完整支持: ESM, Top-level await, etc.

import js from "@eslint/js";
import tseslint from "typescript-eslint";
import nodePlugin from "eslint-plugin-n";
import importPlugin from "eslint-plugin-import";
import prettierConfig from "eslint-config-prettier";

export default tseslint.config(
  // --------------- 全局忽略 ---------------
  {
    ignores: [
      "**/node_modules/**",
      "**/dist/**",
      "**/.next/**",
      "**/out/**",
      "**/build/**",
      "**/coverage/**",
      "apps/**",
      "*.config.*",
    ],
  },

  // --------------- 基础规则 ---------------
  js.configs.recommended,

  // --------------- TypeScript 规则 ---------------
  ...tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      // 允许使用 any (实践中不可能完全避免)
      "@typescript-eslint/no-explicit-any": "warn",
      // 未使用的变量以 _ 开头时才忽略
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      // 非空断言: 允许但有警告
      "@typescript-eslint/no-non-null-assertion": "warn",
      // 要求使用 import type 导入类型
      "@typescript-eslint/consistent-type-imports": [
        "error",
        { prefer: "type-imports", fixStyle: "separate-type-imports" },
      ],
    },
  },

  // --------------- Node.js 最佳实践 ---------------
  {
    plugins: { n: nodePlugin },
    rules: {
      // 禁止使用已弃用的 Node API
      "n/no-deprecated-api": "error",
      // 推荐使用 Node 22 的 fs/promises 而非 fs 回调
      "n/prefer-promises/dns": "warn",
      "n/prefer-promises/fs": "warn",
    },
  },

  // --------------- Import 规范 ---------------
  {
    plugins: { import: importPlugin },
    rules: {
      // 禁止重复导入
      "import/no-duplicates": "error",
      // 导入顺序: node 内置 → 第三方 → 内部模块
      "import/order": [
        "warn",
        {
          groups: ["builtin", "external", "internal", "parent", "sibling", "index"],
          "newlines-between": "always",
          alphabetize: { order: "asc", caseInsensitive: true },
        },
      ],
      // 禁止循环引用
      "import/no-cycle": "warn",
      // 不使用默认导出 (方便 tree-shaking)
      "import/no-default-export": "off",
    },
  },

  // --------------- Prettier 兼容（必须放最后）---------------
  prettierConfig,
);
