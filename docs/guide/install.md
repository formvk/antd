# 安装

本页帮助你从零搭建 `@formvk/antd` 的运行环境，并完成第一个表单的前置准备。

## 环境要求

| 依赖 | 版本要求 | 仓库实际使用 |
| --- | --- | --- |
| React / React DOM | `>=18`（peerDependencies） | `19.3.1` |
| antd | `^6.0.0`（peerDependencies） | `6.6.8` |
| `@formvk/*` 内核包 | `~1.2.0-beta.0` | `~1.2.0-beta.0` |
| `@formvk/antd` | — | `1.0.1-beta.0` |
| TypeScript | 可选，建议 `>=5.0` | `~6.0.3` |
| Node.js（工程环境） | `>=22.18.0` | `>=22.18.0` |

## 安装依赖

```bash
# pnpm
pnpm add @formvk/antd @formvk/core @formvk/react @formvk/schema antd react react-dom

# npm
npm install @formvk/antd @formvk/core @formvk/react @formvk/schema antd react react-dom

# yarn
yarn add @formvk/antd @formvk/core @formvk/react @formvk/schema antd react react-dom
```

`@formvk/antd` 只提供组件桥接层：表单实例、`SchemaField` 工厂等内核能力需要从 `@formvk/react` 导入，因此建议显式安装 `@formvk/core`、`@formvk/react` 与 `@formvk/schema`。

样式通过 `@ant-design/cssinjs` 在运行时注入，不需要额外引入 CSS 文件，也不需要配置 less。

## 下一步

继续阅读[快速开始](/guide/quick-start)，用十分钟完成第一个 Schema 驱动表单。

想了解本包与 formily-antd 的完整差异，见[与 formily-antd 的差异](/guide/explanation/formily-diff)。
