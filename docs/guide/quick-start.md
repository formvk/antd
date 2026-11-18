# 快速开始

一个完整的表单由三部分组成：表单实例（`createForm`）、SchemaField 工厂（`createSchemaField`）与 Schema（`createSchema`）。

## 1. 创建表单实例

```tsx
import { createForm } from '@formvk/react'

const form = createForm({
  values: {
    username: 'alice',
  },
})
```

## 2. 注册组件并创建 SchemaField

`createSchemaField` 的注册表决定了 Schema 中可以使用哪些组件：

```tsx
import { createSchemaField } from '@formvk/react'
import { FormItem, Input, Select } from '@formvk/antd'

export const { SchemaField, fragment: f } = createSchemaField({
  // 字段组件
  components: { Input, Select },
  // 布局 / 装饰器组件（type: 'void'）
  voidComponents: { FormItem },
  // 声明了 title 且未显式指定 decorator 时，自动补 FormItem
  defaultDecorator: 'FormItem',
})
```

## 3. 使用 fragment 描述表单

`fragment`（通常简写为 `f`）由注册表推导而来：注册了 `Input`，就有 `f.Input`；注册了 `FormItem`，就有 `f.FormItem`。

```tsx
import { createSchema } from '@formvk/react'

const schema = createSchema({
  username: f.Input({ title: '用户名' }),
  role: f.Select({
    title: '角色',
    enum: [
      { label: '管理员', value: 'admin' },
      { label: '访客', value: 'guest' },
    ],
  }),
})
```

## 4. 渲染表单

```tsx
import { Form, Submit, Reset } from '@formvk/antd'
import { createForm } from '@formvk/react'

const form = createForm()

export default () => (
  <Form form={form}>
    <SchemaField schema={schema} />
    <Submit onSubmit={values => console.log(values)}>提交</Submit>
    <Reset>重置</Reset>
  </Form>
)
```

<demo react="../demos/basic-form.tsx" title="完整示例" description="修改字段后点击提交，可以看到表单收集到的值" />

`Form` 会自动提供 `FormProvider` 与 `FormLayout`，因此 Schema 内的所有字段都能获取到表单实例与布局配置。

## 5. 数组字段

数组组件需要注册到 `arrayComponents`：

```tsx
import { ArrayItems, FormItem, Input } from '@formvk/antd'

export const { SchemaField, fragment: f } = createSchemaField({
  components: { Input },
  voidComponents: { FormItem },
  arrayComponents: { ArrayItems },
  defaultDecorator: 'FormItem',
})

const schema = createSchema({
  users: f.ArrayItems(f.Object({ name: f.Input({ title: '姓名' }) })),
})
```

## 下一步

教程到此结束。带着具体问题继续阅读操作指南：

- [字段联动](/guide/how-to/linkage)：根据其他字段的值控制显隐、选项与组件属性
- [表单校验](/guide/how-to/validation)：必填、内置格式与自定义校验器
- [数组字段操作](/guide/how-to/array)：增删、复制、排序与五种数组形态
- [响应式布局](/guide/how-to/layout)：FormLayout 断点与 FormGrid 栅格
- [阅读态与详情页](/guide/how-to/read-pretty)：一键切换只读展示
- [接入自定义组件](/guide/how-to/custom-component)：把业务组件桥接到 Schema 体系
