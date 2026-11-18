# Input

单行文本输入组件，基于 antd `Input` 封装。`value` / `onChange` 由表单内核自动注入，字段校验中时后缀会自动展示加载图标；阅读态自动切换为 `TextInput`。

<demo react="../demos/input.tsx" title="Input 与 TextArea" description="前后缀、字数限制、禁用与多行文本，含 readPretty 阅读态" />

## 何时使用

- 需要录入单行文本，如姓名、标题、简短描述。
- 需要多行文本时使用同包导出的 `TextArea`。
- 需要密码录入或强度提示时使用 [Password](/components/password)。

## 属性

继承 antd `InputProps`，未列出的属性与 antd `Input` 一致并原样透传。

| 属性 | 类型 | 说明 |
| --- | --- | --- |
| `value` | `string` | 字段值，由内核注入，无需手动传入 |
| `onChange` | `(e: ChangeEvent) => void` | 值变化回调，由内核注入 |
| `prefix` / `suffix` | `ReactNode` | 输入框前、后缀；校验中时 `suffix` 会被加载图标替换 |
| `allowClear` | `boolean` | 是否展示清除按钮 |
| `maxLength` | `number` | 最大输入长度 |
| `showCount` | `boolean` | 是否展示字数统计 |
| `disabled` | `boolean` | 禁用输入 |

### TextArea

`TextArea` 为独立具名导出，基于 antd `Input.TextArea`，属性与 antd 保持一致，阅读态同样渲染为 `TextInput`：

```tsx
import { createSchema, createSchemaField } from '@formvk/react'
import { Input, TextArea } from '@formvk/antd'

const { SchemaField, fragment: f } = createSchemaField({
  components: { Input, TextArea },
})

const schema = createSchema({
  remark: f.TextArea({ title: '备注' }),
})
```

## 阅读态

表单或字段处于 `readPretty` 模式时，`Input` 与 `TextArea` 自动切换为 `TextInput`，以纯文本展示值；空值展示 `Form` 的 `previewTextPlaceholder`。
