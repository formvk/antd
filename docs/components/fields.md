# 基础字段

所有基础字段都是对 antd 组件的 `connect` 包装，支持 Formvk 的 `value` / `onChange` 注入、校验状态与阅读态渲染。组件 props 与对应 antd 组件一致。

## Input

```tsx
import { Input } from '@formvk/antd'

createSchema({ username: f.Input({ title: '用户名' }) })
```

- 字段处于 `loading` / `validating` 状态时，会在 `suffix` 展示加载图标。
- `Input.TextArea` 可用于多行输入。

## Password

```tsx
createSchema({
  password: f.Password({
    title: '密码',
    componentProps: { checkStrength: true },
  }),
})
```

`checkStrength` 为 `true` 时展示密码强度提示。

## Select

```tsx
createSchema({
  role: f.Select({
    title: '角色',
    enum: [
      { label: '管理员', value: 'admin' },
      { label: '访客', value: 'guest' },
    ],
  }),
})
```

## TreeSelect

props 与 antd `TreeSelect` 一致，例如 `treeData`、`fieldNames`。

## Cascader

props 与 antd `Cascader` 一致，例如 `options`、`changeOnSelect`。

## NumberPicker

基于 antd `InputNumber`，阅读态通过 `PreviewText.NumberPicker` 渲染。

## DatePicker

```tsx
createSchema({
  date: f.DatePicker({
    title: '日期',
    componentProps: { format: 'YYYY-MM-DD' },
  }),
})
```

- `DatePicker.RangePicker` 用于日期区间。
- 阅读态分别使用 `PreviewText.DatePicker` / `PreviewText.DateRangePicker`。

## TimePicker

- `TimePicker.RangePicker` 用于时间区间。
- 阅读态分别使用 `PreviewText.TimePicker` / `PreviewText.TimeRangePicker`。

## Checkbox

- `Checkbox.Group` 用于复选框组，`options` 写法与 antd 一致。
- 单个 `Checkbox` 通常配合 `type: 'boolean'` 使用。

## Radio

- `Radio.Group` 用于单选框组。
- 可配合 `Radio.Button` 使用（由 antd 提供）。

## Switch

props 与 antd `Switch` 一致，字段值为 `boolean`。

## Transfer

props 与 antd `Transfer` 一致，字段值为 `string[]` / `number[]`。

## Upload

props 与 antd `Upload` 一致；未选择文件时展示内置占位内容，可通过 `componentProps.placeholder` 覆盖。

## PreviewText

阅读态文本渲染器，内置以下成员：

| 成员                | 说明             |
| ------------------- | ---------------- |
| `PreviewText.Input` | 文本             |
| `PreviewText.Select` | 选项 label      |
| `PreviewText.TreeSelect` | 树节点 label |
| `PreviewText.Cascader` | 级联路径      |
| `PreviewText.DatePicker` | 日期        |
| `PreviewText.DateRangePicker` | 日期区间 |
| `PreviewText.TimePicker` | 时间        |
| `PreviewText.TimeRangePicker` | 时间区间 |
| `PreviewText.NumberPicker` | 数字      |
| `PreviewText.Placeholder` | 空值占位上下文 |
| `PreviewText.usePlaceholder` | 读取占位符 Hook |

字段在 `readPretty` 模式下会自动使用对应渲染器，通常无需手动引入。
