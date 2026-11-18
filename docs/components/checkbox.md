# Checkbox

复选组件，包含 `Checkbox` 与 `CheckboxGroup` 两个具名导出。`Checkbox` 将字段值映射到 `checked`，用于布尔值绑定；`CheckboxGroup` 绑定数组值，阅读态自动切换为标签形态的 `TextSelect`。

<demo react="../demos/checkbox.tsx" title="CheckboxGroup / 纵向排列 / 单个 Checkbox" description="分组、自定义布局与布尔值复选，含 readPretty 阅读态" />

## 何时使用

- 需要在一组选项中多选时使用 `CheckboxGroup`，字段值为选中项 `value` 的数组。
- 仅需要表达单个布尔状态（如“已阅读并同意协议”）时使用单独的 `Checkbox`。

## 属性

### Checkbox

继承 antd `CheckboxProps`，本包将 `value` 映射为 `checked`、`onInput` 映射为 `onChange`。

| 属性 | 类型 | 说明 |
| --- | --- | --- |
| `value` | `boolean` | 是否选中，由内核注入并映射到 `checked` |
| `onChange` | `(e: ChangeEvent) => void` | 值变化回调，由内核注入 |
| `children` | `ReactNode` | 选项文案 |

### CheckboxGroup

继承 antd `CheckboxGroupProps`，未列出的属性与 antd `Checkbox.Group` 一致并原样透传。

| 属性 | 类型 | 说明 |
| --- | --- | --- |
| `options` | `{ label, value }[]` | 选项数据 |
| `dataSource` | `{ label, value }[]` | 本包映射属性，等价于 `options`；Schema 的 `enum` 会自动注入 |

## 阅读态

`CheckboxGroup` 在 `readPretty` 模式下自动切换为 `TextSelect`（以 `tags` 模式渲染），每个选中项展示为一个 Tag。单独的 `Checkbox` 不内置阅读态切换，详情场景请使用 `CheckboxGroup` 或自行配合 [Text](/components/preview-text) 渲染。
