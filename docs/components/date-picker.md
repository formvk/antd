# DatePicker

日期选择组件，基于 antd `DatePicker` 封装。与 antd 直接使用 `dayjs` 对象不同，本组件的字段值为格式化后的**字符串**，内核会在 `dayjs` 与字符串之间自动转换。阅读态自动切换为 `TextDatePicker`。

<demo react="../demos/date-picker.tsx" title="picker / showTime / format / DateRangePicker" description="日期、月、年、日期时间与范围选择，含 readPretty 阅读态" />

## 何时使用

- 需要录入日期、月份、年份或日期时间。
- 需要选择一个时间区间时使用同包导出的 `DateRangePicker`。
- 字段值需要直接提交给后端、不希望在业务层处理 `dayjs` 对象时。

## 属性

继承 antd `DatePickerProps`，未列出的属性与 antd `DatePicker` 一致并原样透传。

| 属性 | 类型 | 说明 |
| --- | --- | --- |
| `value` | `string` | 字段值（字符串），由内核注入并自动转换为 `dayjs` |
| `onChange` | `(value: string \| string[]) => void` | 值变化回调，输出格式化后的字符串 |
| `picker` | `'date' \| 'week' \| 'month' \| 'quarter' \| 'year'` | 选择器类型 |
| `showTime` | `boolean` | 是否附加时间选择 |
| `format` | `string` | 展示与输出格式，不传时按 `picker` 推导默认值 |
| `disabled` | `boolean` | 禁用选择 |

### DateRangePicker

`DateRangePicker` 为独立具名导出，基于 antd `DatePicker.RangePicker`，字段值为 `[string, string]`，属性与 antd 范围选择器一致。

默认格式推导规则：

| picker | 默认 format |
| --- | --- |
| `date` | `YYYY-MM-DD` |
| `month` | `YYYY-MM` |
| `quarter` | `YYYY-\QQ` |
| `year` | `YYYY` |
| `week` | `gggg-wo` |
| 开启 `showTime` | `YYYY-MM-DD HH:mm:ss` |

## 阅读态

`readPretty` 模式下，`DatePicker` 与 `DateRangePicker` 分别切换为 `TextDatePicker` / `TextDateRangePicker`，按 `format` 格式化展示；范围值以 `~` 连接，空值展示 `previewTextPlaceholder`。
