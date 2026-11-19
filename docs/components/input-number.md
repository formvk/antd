# InputNumber

数字输入组件，基于 antd `InputNumber` 封装。阅读态自动切换为 `TextInputNumber`，并保留 `formatter` 的格式化效果。

<demo react="../demos/input-number.tsx" title="min / max / step / precision / formatter / parser" description="常见数字输入配置，含 readPretty 阅读态" />

## 何时使用

- 需要录入数字，如数量、年龄、金额。
- 需要限制取值范围、小数精度或按指定格式展示数字。

## 属性

继承 antd [`InputNumberProps`](https://ant.design/components/input-number-cn#api)，未列出的属性与 antd `InputNumber` 一致并原样透传。

| 属性 | 类型 | 说明 |
| --- | --- | --- |
| `value` | `number \| null` | 字段值，由内核注入 |
| `min` / `max` | `number` | 最小值 / 最大值 |
| `step` | `number` | 步长 |
| `precision` | `number` | 小数精度 |
| `formatter` | `(value: number) => string` | 展示格式化，阅读态同样生效 |
| `parser` | `(displayValue: string) => number` | 将格式化后的展示值解析回数字 |
| `disabled` | `boolean` | 禁用输入 |

## 阅读态

`readPretty` 模式下自动切换为 `TextInputNumber`：配置了 `formatter` 时展示格式化后的文本，否则直接展示数字；空值展示 `previewTextPlaceholder`。
