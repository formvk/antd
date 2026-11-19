# Text

阅读态文本渲染家族。字段处于 `readPretty` 模式时，各字段组件会自动切换到对应的 `Text*` 组件，通常无需手动引入；只有需要自定义详情展示或局部占位符时才直接使用它们。

<demo react="../demos/preview-text.tsx" title="Text 示例" description="切换 readPretty 查看占位与枚举回显" />

## 何时使用

- 构建表单详情页 / 只读页，统一展示字段值与空值占位。
- 在内置阅读态组件无法满足展示需求时，基于 `Text` 封装自定义阅读态组件。
- 需要为局部区域覆盖空值占位文案时，使用 `Placeholder`。

## 组件家族

| 组件 | 适用字段 | 展示行为 |
| --- | --- | --- |
| `Text` | 通用 | 直接渲染值 |
| `TextInput` | Input / TextArea / Password | 纯文本，保留前后缀 |
| `TextInputNumber` | InputNumber | 纯数字，保留 `formatter` 格式化 |
| `TextSelect` | Select / RadioGroup / CheckboxGroup | 回显选项 `label`，多值以 Tag 展示 |
| `TextTreeSelect` | TreeSelect | 递归查找节点并展示 `title` |
| `TextCascader` | Cascader | 级联路径以 `/` 连接 |
| `TextDatePicker` | DatePicker | 按 `format` 格式化日期 |
| `TextDateRangePicker` | DateRangePicker | 日期区间，以 `~` 连接 |
| `TextTimePicker` | TimePicker | 按 `format` 格式化时间 |
| `TextTimeRangePicker` | TimeRangePicker | 时间区间，以 `~` 连接 |

## 属性

antd 参考：[Typography.Text](https://ant.design/components/typography-cn#api)。

### Text

继承原生 `HTMLAttributes<HTMLDivElement>`，常用属性：

| 属性 | 类型 | 说明 |
| --- | --- | --- |
| `value` | `any` | 需要渲染的值，空值时展示占位符 |
| `prefixCls` | `string` | 自定义类名前缀 |
| `className` / `style` | `string` / `CSSProperties` | 类名与行内样式 |

### Placeholder 与 usePlaceholder

| 成员 | 类型 | 说明 |
| --- | --- | --- |
| `Placeholder` | Context Provider | 通过 `value` 属性为子树设置空值占位文案 |
| `usePlaceholder` | `(value?) => ReactNode` | Hook，读取当前占位符上下文；传入值为空时返回占位符 |

## 空值占位

通过 `Form` 的 `previewTextPlaceholder` 统一设置整个表单的空值文案：

```tsx
<Form form={form} previewTextPlaceholder="—">
  <SchemaField schema={schema} />
</Form>
```

需要为局部区域覆盖时，使用 `Placeholder` 包裹，未提供任何上下文时默认占位符为 `N/A`：

```tsx
<Placeholder value="N/A">
  <Text value={undefined} />
</Placeholder>
```
