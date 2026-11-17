# 安装

## 环境要求

| 依赖        | 版本       |
| ----------- | ---------- |
| React       | >= 18      |
| React DOM   | >= 18      |
| antd        | ^ 6.0.0    |
| @formvk/\*  | ~ 1.1.1    |
| TypeScript  | >= 5.0（可选） |

## 安装依赖

```bash
# pnpm
pnpm add @formvk/antd @formvk/core @formvk/react @formvk/schema antd react react-dom

# npm
npm install @formvk/antd @formvk/core @formvk/react @formvk/schema antd react react-dom

# yarn
yarn add @formvk/antd @formvk/core @formvk/react @formvk/schema antd react react-dom
```

`@formvk/antd` 只提供组件桥接层，表单实例、SchemaField 工厂等内核能力需要从 `@formvk/react` 导入，因此建议显式安装 `@formvk/core`、`@formvk/react`、`@formvk/schema`。

## 与 formily-antd 的差异

- 包名替换为 `@formvk/*` 体系，`createForm`、`createSchemaField`、`createSchema` 等从 `@formvk/react` 导入。
- Schema 字段不再带 `x-` 前缀，使用 `component`、`decorator`、`componentProps`、`reactions` 等字段。
- 不提供 `FormDialog` 与 `FormDrawer`。
- 样式通过 `@ant-design/cssinjs` 注入，不需要额外引入 CSS 文件。
- `schema.component` / `schema.decorator` 既可以是注册名字符串，也可以直接传组件引用。

## 开始使用

继续阅读 [快速开始](/guide/quick-start)。
