---
layout: home

hero:
  name: '@formvk/antd'
  text: 'Schema 驱动的 Ant Design 表单'
  tagline: Formily Antd 的 1:1 移植版本，基于 Formvk 内核与 Ant Design v6
  actions:
    - theme: brand
      text: 快速开始
      link: /guide/quick-start
    - theme: alt
      text: 组件总览
      link: /components/

features:
  - title: Schema 驱动
    details: 用一份 Schema 描述字段、布局与联动，字段状态、校验与生命周期由 Formvk 内核统一管理。
  - title: 完整的组件桥接
    details: 覆盖表单、布局、基础字段、数组组件、表格选择与可编辑组件，行为与 formily-antd 对齐。
  - title: cssinjs 样式
    details: 组件样式基于 @ant-design/cssinjs，与 antd v6 主题保持一致，无需额外引入样式文件。
  - title: TypeScript
    details: 完整类型声明；Schema 支持 createSchema + fragment 构建，并自动推导组件与布局属性。
---

## 最小示例

开始前请先完成[安装](/guide/install)。

```tsx
import { Form, FormItem, Input, Submit } from '@formvk/antd'
import { createForm, createSchema, createSchemaField } from '@formvk/react'

const form = createForm()

const { SchemaField, fragment: f } = createSchemaField({
  components: { Input },
  voidComponents: { FormItem },
  defaultDecorator: 'FormItem',
})

export default () => (
  <Form form={form}>
    <SchemaField
      schema={createSchema({
        username: f.Input({ title: '用户名' }),
      })}
    />
    <Submit onSubmit={values => console.log(values)}>提交</Submit>
  </Form>
)
```
