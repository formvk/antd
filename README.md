# @formvk/antd

[Formily Antd](https://github.com/alibaba/formily) 的 1:1 移植版本，基于 Formvk 内核与 Ant Design v6，用 Schema 驱动表单开发。

- **Schema 驱动**：一份 Schema 描述字段、布局与联动，状态、校验与生命周期由 Formvk 内核统一管理
- **完整组件桥接**：覆盖表单、布局、基础字段、数组组件、表格选择与可编辑组件
- **cssinjs 样式**：基于 `@ant-design/cssinjs`，与 antd v6 主题保持一致，无需引入额外样式文件
- **TypeScript**：完整类型声明，`createSchema` + `fragment` 自动推导组件与布局属性

📖 文档站点：**https://formvk.github.io/antd/**

## 安装

环境要求：React >= 18、antd ^6.0.0、Node >= 22（仅开发本仓库时需要）。

```bash
# pnpm
pnpm add @formvk/antd @formvk/core @formvk/react @formvk/schema antd react react-dom

# npm
npm install @formvk/antd @formvk/core @formvk/react @formvk/schema antd react react-dom
```

表单实例、`SchemaField` 工厂等内核能力由 `@formvk/react` 提供，因此需要与 `@formvk/antd` 一起安装。

## 快速开始

```tsx
import { Form, FormItem, Input, Submit } from '@formvk/antd'
import { createForm, createSchema, createSchemaField } from '@formvk/react'

const form = createForm()

const { SchemaField, fragment: f } = createSchemaField({
  components: { Input },
  voidComponents: { FormItem },
  defaultDecorator: 'FormItem',
})

const schema = createSchema({
  username: f.Input({ title: '用户名' }),
})

export default () => (
  <Form form={form}>
    <SchemaField schema={schema} />
    <Submit onSubmit={values => console.log(values)}>提交</Submit>
  </Form>
)
```

数组字段需要注册到 `arrayComponents`：

```tsx
import { ArrayItems, FormItem, Input } from '@formvk/antd'

const { SchemaField, fragment: f } = createSchemaField({
  components: { Input },
  voidComponents: { FormItem },
  arrayComponents: { ArrayItems },
  defaultDecorator: 'FormItem',
})

const schema = createSchema({
  users: f.ArrayItems(f.Object({ name: f.Input({ title: '姓名' }) })),
})
```

更多用法见文档：[快速开始](https://formvk.github.io/antd/guide/quick-start)、[Schema 写法](https://formvk.github.io/antd/guide/schema)、[组件总览](https://formvk.github.io/antd/components/)。

## 与 formily-antd 的差异

- 包名替换为 `@formvk/*` 体系，`createForm`、`createSchemaField`、`createSchema` 等从 `@formvk/react` 导入
- Schema 字段不再带 `x-` 前缀，使用 `component`、`decorator`、`componentProps`、`reactions` 等字段
- 不提供 `FormDialog` 与 `FormDrawer`
- 样式通过 `@ant-design/cssinjs` 注入，无需额外引入 CSS 文件
- `schema.component` / `schema.decorator` 既可以是注册名字符串，也可以直接传组件引用

## 本地开发

要求 Node >= 22.18、pnpm 12（版本已在 `package.json` 的 `engines` / `packageManager` 中声明）。

```bash
# 安装依赖
pnpm install

# 构建组件包（输出到 packages/components/dist）
pnpm build

# 监听构建
pnpm dev

# 启动文档站（含在线沙箱 demo）
pnpm docs:dev

# 单元测试
pnpm test
pnpm test:watch
pnpm test:coverage

# 类型检查 / 代码检查 / 格式化
pnpm typecheck
pnpm lint
pnpm lint:fix
pnpm format
pnpm format:check
```

### 目录结构

```
packages/components   # @formvk/antd 源码与构建配置
docs                  # VitePress 文档站与 demo
.husky                # Git hooks
.github/workflows     # 文档部署与发包流水线
```

### 提交规范

仓库已接入 husky + lint-staged，提交时自动对暂存文件执行 `oxlint --fix` 与 `oxfmt`。提交信息遵循 Conventional Commits（`feat:`、`fix:`、`chore:` 等），用于自动生成 CHANGELOG 与版本号。

### 发布

推送 `main` 后，若提交标题以 `chore(release)` 开头，GitHub Actions 会自动发布到 npm；文档变更则自动部署到 GitHub Pages。

```bash
# 交互式选择版本号，自动生成 CHANGELOG 并提交、打 tag、推送
pnpm version:release

# 预发布版本
pnpm version:alpha
pnpm version:beta
pnpm version:rc

# 退出预发布
pnpm version:exit-pre
```

## License

MIT
