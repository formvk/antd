# Radio

单选组件，包含 `Radio` 与 `RadioGroup` 两个具名导出。`Radio` 将字段值映射到 `checked`，用于布尔值绑定；`RadioGroup` 绑定枚举值，阅读态自动切换为 `TextSelect`。

<demo react="../demos/radio.tsx" title="RadioGroup / 按钮样式 / 单个 Radio" description="分组、按钮样式与布尔值单选，含 readPretty 阅读态" />

## 何时使用

- 在少量互斥选项中做选择时使用 `RadioGroup`。
- 仅需要一个布尔开关且希望展示为单选框样式时，使用单独的 `Radio`（纯开关交互更推荐 [Switch](/components/switch)）。

## 属性

### Radio

继承 antd `RadioProps`，本包将 `value` 映射为 `checked`、`onInput` 映射为 `onChange`。

| 属性 | 类型 | 说明 |
| --- | --- | --- |
| `value` | `boolean` | 是否选中，由内核注入并映射到 `checked` |
| `onChange` | `(e: ChangeEvent) => void` | 值变化回调，由内核注入 |
| `children` | `ReactNode` | 选项文案 |

### RadioGroup

继承 antd `RadioGroupProps`，未列出的属性与 antd `Radio.Group` 一致并原样透传。

| 属性 | 类型 | 说明 |
| --- | --- | --- |
| `options` | `{ label, value }[]` | 选项数据 |
| `dataSource` | `{ label, value }[]` | 本包映射属性，等价于 `options`；Schema 的 `enum` 会自动注入 |
| `optionType` | `'default' \| 'button'` | 展示形态，`button` 为按钮样式 |
| `buttonStyle` | `'outline' \| 'solid'` | 按钮形态下的样式 |

## 阅读态

`RadioGroup` 在 `readPretty` 模式下自动切换为 `TextSelect`，将值回显为选项标签。单独的 `Radio` 不内置阅读态切换，详情场景请使用 `RadioGroup` 或自行配合 [Text](/components/preview-text) 渲染。
