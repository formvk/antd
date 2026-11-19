# TimePicker

时间选择组件，基于 antd `TimePicker` 封装。字段值为格式化后的**字符串**（默认 `HH:mm:ss`），内核会在 `dayjs` 与字符串之间自动转换。阅读态自动切换为 `TextTimePicker`。

<demo react="../demos/time-picker.tsx" title="format / minuteStep / TimeRangePicker" description="时间、自定义格式、步长与范围选择，含 readPretty 阅读态" />

## 何时使用

- 需要录入一天中的某个时间点，且不关心日期。
- 需要选择时间区间时使用同包导出的 `TimeRangePicker`。
- 日期与时间需要一起录入时，使用 [DatePicker](/components/date-picker) 的 `showTime`。

## 属性

继承 antd [`TimePickerProps`](https://ant.design/components/time-picker-cn#api)，未列出的属性与 antd `TimePicker` 一致并原样透传。

| 属性 | 类型 | 说明 |
| --- | --- | --- |
| `value` | `string` | 字段值（字符串），由内核注入并自动转换为 `dayjs` |
| `onChange` | `(value: string \| string[]) => void` | 值变化回调，输出格式化后的字符串 |
| `format` | `string` | 展示与输出格式，默认 `HH:mm:ss` |
| `minuteStep` | `number` | 分钟步长 |
| `disabled` | `boolean` | 禁用选择 |

### TimeRangePicker

`TimeRangePicker` 为独立具名导出，基于 antd `TimePicker.RangePicker`，字段值为 `[string, string]`，属性与 antd 范围选择器一致。

## 阅读态

`readPretty` 模式下，`TimePicker` 与 `TimeRangePicker` 分别切换为 `TextTimePicker` / `TextTimeRangePicker`，按 `format` 格式化展示；范围值以 `~` 连接，空值展示 `previewTextPlaceholder`。
