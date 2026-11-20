# @formvk/antd

Formvk 的 Ant Design v6 组件桥接层，用 Schema 驱动表单与 CRUD 页面开发。

📖 组件文档：**https://formvk.github.io/antd/** · 内核文档：**https://formvk.github.io/core/**

## 特性

- **Schema 驱动**：一份 Schema 描述字段、布局与联动，状态、校验与生命周期由 Formvk 内核统一管理
- **完整组件桥接**：覆盖表单、布局、基础字段、数组组件、表格选择与可编辑组件
- **容器与自由组合**：提供 `SchemaForm`、`PopupForm`、`CrudTable`，以及可单独组装的 `DataTable` / `SearchForm` / `AddPopup` / `EditPopup`
- **表格渲染器**：内置 `renders`，列上直接声明文本、枚举、标签、时间、图片等渲染方式
- **cssinjs 样式**：基于 `@ant-design/cssinjs`，跟随 antd v6 主题，无需额外引入样式文件
- **TypeScript**：完整类型声明，`createSchema` + `fragment` 自动推导组件与布局属性

## 安装

环境要求：React >= 18、antd ^6.0.0。

```bash
# pnpm
pnpm add @formvk/antd @formvk/core @formvk/react @formvk/schema antd react react-dom

# npm
npm install @formvk/antd @formvk/core @formvk/react @formvk/schema antd react react-dom

# yarn
yarn add @formvk/antd @formvk/core @formvk/react @formvk/schema antd react react-dom
```

表单实例、`SchemaField` 工厂等内核能力由 `@formvk/react` 提供，因此需要与 `@formvk/antd` 一起安装。

## 快速开始

```tsx
import { Form, Submit, arrayComponents, fieldComponents, voidComponents } from '@formvk/antd'
import { SchemaField, createForm, createSchema, createSchemaOptions } from '@formvk/react'

const form = createForm()

const { OptionsProvider, fragment: f } = createSchemaOptions({
  components: fieldComponents,
  voidComponents,
  arrayComponents,
  defaultDecorator: 'FormItem',
})

const schema = createSchema({
  username: f.Input({ title: '用户名' }),
})

// OptionsProvider 只需在应用最外层注入一次，内部所有表单自动继承
export default () => (
  <OptionsProvider>
    <Form form={form}>
      <SchemaField schema={schema} />
      <Submit onSubmit={values => console.log(values)}>提交</Submit>
    </Form>
  </OptionsProvider>
)
```

## 组件概览

| 类别            | 导出                                                                                                  |
| --------------- | ----------------------------------------------------------------------------------------------------- |
| 字段组件        | `fieldComponents`（`Input`、`Select`、`DatePicker`、`Upload` 等）                                     |
| 布局 / 装饰组件 | `voidComponents`（`FormItem`、`FormGrid`、`FormTab`、`FormCollapse` 等）                              |
| 数组组件        | `arrayComponents`（`ArrayItems`、`ArrayTable`、`ArrayCards`、`ArrayCollapse` 等）                     |
| 表单容器        | `Form`、`SchemaForm`、`Submit`、`Reset`                                                               |
| 弹窗表单        | `PopupForm`、`ModalForm`、`DrawerForm`                                                                |
| CRUD 表格       | `CrudTable`，或 `TableModelProvider` + `DataTable` / `SearchForm` / `AddPopup` / `EditPopup` 自由组装 |
| 表格渲染器      | `renders`（`text`、`option`、`tag`、`time`、`image`、`link`、`serial` 等）                            |

`OptionsProvider` 是应用级上下文，只需在应用最外层注入一次；字段组件、数组组件与容器都会自动继承。

## 与 formily-antd 的差异

- 包名替换为 `@formvk/*` 体系，`createForm`、`createSchemaOptions`、`createSchema` 等从 `@formvk/react` 导入
- Schema 字段不再带 `x-` 前缀，使用 `component`、`decorator`、`componentProps`、`reactions` 等字段
- 不提供 `FormDialog` 与 `FormDrawer`，改用基于 `PopupModel` 的 `PopupForm`
- 样式通过 `@ant-design/cssinjs` 注入，无需额外引入 CSS 文件
- `schema.component` / `schema.decorator` 既可以是注册名字符串，也可以直接传组件引用

## 相关链接

- [快速开始](https://formvk.github.io/antd/guide/quick-start)
- [Schema 写法](https://formvk.github.io/antd/guide/schema)
- [组件总览](https://formvk.github.io/antd/components/)
- [CrudTable](https://formvk.github.io/antd/containers/crud-table)
- [内核文档](https://formvk.github.io/core/)

## License

MIT
