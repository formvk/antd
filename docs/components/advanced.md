# 高级组件

## Editable

可编辑组件，依赖父级（字段或表单）的 `pattern` 为 `editable`。

```tsx
import { Editable, Form, FormItem, Input } from '@formvk/antd'
import { createForm, createSchema, createSchemaField } from '@formvk/react'

const form = createForm({ pattern: 'editable', values: { name: 'alice' } })

const { SchemaField, fragment: f } = createSchemaField({
  components: { Input },
  voidComponents: { FormItem },
  defaultDecorator: 'FormItem',
})

const schema = createSchema({
  name: f.Input({ title: '名称' }),
})

<Form form={form}>
  <Editable.Popover title="编辑名称">
    <SchemaField schema={schema} />
  </Editable.Popover>
</Form>
```

- `Editable`：内联编辑，点击占位文本后切换为可编辑状态。
- `Editable.Popover`：编辑内容在 Popover 中展示。

## FormTab

标签页布局。子面板通过 `FormTab.TabPane` 声明，也可以用 `FormTab.createFormTab` 创建受控的 tab 实例。

| 属性         | 说明                                   |
| ------------ | -------------------------------------- |
| `formTab`    | `createFormTab` 创建的 tab 实例        |
| `activeKey`  | 当前激活的 tab                         |
| `onChange`   | 切换 tab 时触发                        |

```tsx
const { SchemaField, fragment: f } = createSchemaField({
  components: { Input },
  voidComponents: { FormItem, FormTab, TabPane: FormTab.TabPane },
  defaultDecorator: 'FormItem',
})

const schema = createSchema({
  tabs: f.FormTab({
    properties: {
      user: f.TabPane({
        properties: {
          name: f.Input({ title: '姓名' }),
        },
      }),
      setting: f.TabPane({
        properties: {
          email: f.Input({ title: '邮箱' }),
        },
      }),
    },
  }),
})
```

<demo react="../demos/form-tab.tsx" title="FormTab 示例" description="切换标签页，校验失败时标签上会显示错误数量" />

## FormCollapse

折叠面板布局，子面板通过 `FormCollapse.CollapsePanel` 声明。

| 属性             | 说明                                          |
| ---------------- | --------------------------------------------- |
| `formCollapse`   | `createFormCollapse` 创建的实例               |
| `activeKey`      | 当前展开的面板                                |
| `accordion`      | 是否手风琴模式                                |
| `onChange`       | 展开项变化时触发                              |

```tsx
const { SchemaField, fragment: f } = createSchemaField({
  components: { Input },
  voidComponents: {
    FormItem,
    FormCollapse,
    CollapsePanel: FormCollapse.CollapsePanel,
  },
  defaultDecorator: 'FormItem',
})

const schema = createSchema({
  panels: f.FormCollapse({
    properties: {
      base: f.CollapsePanel({
        properties: {
          name: f.Input({ title: '姓名' }),
        },
      }),
      contact: f.CollapsePanel({
        properties: {
          email: f.Input({ title: '邮箱' }),
        },
      }),
    },
  }),
})
```

## FormStep

分步表单，每个步骤通过 `FormStep.StepPane` 声明，步骤的 `title` / `description` 等属性与 antd `Steps` 一致。

| 属性        | 说明                                     |
| ----------- | ---------------------------------------- |
| `formStep`  | `createFormStep` 创建的实例              |
| `current`   | 当前步骤索引                             |
| `onChange`  | 步骤切换回调                             |

`createFormStep()` 返回的实例包含：

| 方法 / 属性   | 说明                     |
| ------------- | ------------------------ |
| `next()`      | 进入下一步               |
| `back()`      | 返回上一步               |
| `submit()`    | 提交表单                 |
| `setCurrent(index)` | 跳转到指定步骤     |
| `current`     | 当前步骤                 |
| `allowNext`   | 是否允许进入下一步       |
| `allowBack`   | 是否允许返回上一步       |

```tsx
const { SchemaField, fragment: f } = createSchemaField({
  components: { Input },
  voidComponents: { FormItem, FormStep, StepPane: FormStep.StepPane },
  defaultDecorator: 'FormItem',
})

const schema = createSchema({
  steps: f.FormStep({
    properties: {
      first: f.StepPane({
        componentProps: { title: '基本信息' },
        properties: {
          name: f.Input({ title: '姓名' }),
        },
      }),
      second: f.StepPane({
        componentProps: { title: '联系方式' },
        properties: {
          email: f.Input({ title: '邮箱' }),
        },
      }),
    },
  }),
})
```
