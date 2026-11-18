# 接入自定义组件

本指南介绍如何把任意 React 控件接入 Schema 体系：从最简单的受控组件，到支持数据源映射与阅读态的完整桥接组件。

## 方式一：useField 受控组件

适合一次性使用、逻辑简单的场景。用 `useField` 拿到字段实例，手动绑定 `value` 与 `setValue`，外层包 `observer` 以响应字段状态变化：

```tsx
import type { Field } from '@formvk/core'
import { useField } from '@formvk/react'
import { observer } from '@formvk/reactive-react'
import { Select } from 'antd'

interface Option {
  label: string
  value: string
}

export const SelectField = observer(function SelectField(props: { options?: Option[] }) {
  const field = useField<Field>()
  return (
    <Select
      {...props}
      value={field?.value as string | undefined}
      disabled={field?.disabled || field?.readOnly}
      onChange={value => field?.setValue(value)}
    />
  )
})
```

注册到工厂后即可在 Schema 中使用：

```tsx
const { SchemaField, fragment: f } = createSchemaField({
  components: { SelectField },
  voidComponents: { FormItem },
  defaultDecorator: 'FormItem',
})
```

## 方式二：connect + mapProps（推荐）

可复用的桥接组件推荐使用 `connect`，内核会自动注入 `value` / `onChange`，并用 `mapProps` 描述字段到组件的 props 映射。映射对象的键值含义为 `字段侧属性: 组件侧属性`：

```tsx
import { isVoidField } from '@formvk/core'
import { connect, mapProps, mapReadPretty } from '@formvk/react'
import { Select as AntSelect } from 'antd'

import { TextSelect } from '@formvk/antd'

export const Select = connect(
  AntSelect,
  // dataSource 映射为 options；函数 mapper 处理值变更
  mapProps({ dataSource: 'options' }, (props, field) => {
    if (isVoidField(field)) return props
    return {
      ...props,
      onChange: (value: string) => field.setValue(value),
    }
  }),
  // 阅读态自动切换为 TextSelect
  mapReadPretty(TextSelect)
)
```

常见映射写法：

| 映射 | 含义 | 典型组件 |
| --- | --- | --- |
| `mapProps({ value: 'checked' })` | 字段值映射到 `checked` | Switch / Checkbox / Radio |
| `mapProps({ dataSource: 'options' })` | Schema `enum` 映射到 `options` | Select / RadioGroup / Cascader |
| `mapProps({ dataSource: 'treeData' })` | 映射到树数据 | TreeSelect |
| `mapProps({ value: 'targetKeys' })` | 值映射到穿梭框选中项 | Transfer |
| `mapProps({ value: 'fileList' })` | 值映射到文件列表 | Upload |

## 处理值格式转换

控件值类型与表单存储类型不一致时（如日期控件内部用 `dayjs`、表单存字符串），在函数 mapper 中做双向转换：

```tsx
mapProps(props => ({
  ...props,
  value: dayjsable(props.value, props.format),
  onChange: (value: Dayjs) => {
    props.onChange?.(formatDayjsValue(value, props.format))
  },
}))
```

## 支持阅读态

`mapReadPretty(Component)` 会在字段 `pattern === 'readPretty'` 时自动替换渲染组件。可以复用本包导出的 `Text` / `TextSelect` 等，也可以传自研的只读组件：

```tsx
connect(MyPicker, mapReadPretty(MyPickerText))
```

阅读态组件从 props 中读取 `value`，空值占位由 `Placeholder` 上下文统一处理。

## 自定义装饰器

装饰器（如 `FormItem`）负责 label、校验反馈与布局。自定义装饰器同样用 `useField` 读取字段状态，纯展示版本可以基于本包导出的 `BaseItem` 封装：

```tsx
import { BaseItem } from '@formvk/antd'

const MyDecorator = observer(props => {
  const field = useField<Field>()
  return <BaseItem {...props} feedbackText={field?.selfErrors?.join(', ')} />
})
```

## 注意事项

- `mapProps` 与 `mapReadPretty` 自带 `observer` 包裹；裸用 `connect(target)` 或 `useField` 时需要自己包 `observer`，否则字段状态变化不会触发重渲染。
- 字段组件约定通过 `value` / `onChange` 通信；控件的事件签名不同（如 Upload 的 `UploadChangeParam`）时，在 mapper 里转换为表单需要的值。
- 数组类自定义组件可参考 `ArrayBase` 的上下文能力（`useArray` / `useIndex` / `useRecord`），见 [ArrayBase 参考](/components/array-base)。
