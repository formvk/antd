# Transfer

穿梭框组件，基于 antd `Transfer` 封装。字段值自动映射为 `targetKeys`，Schema 的 `enum` 会转换为内部数据源。

<demo react="../demos/transfer.tsx" title="Transfer 示例" description="数据源、标题与搜索" />

## 何时使用

- 需要在两个列表之间直观地移动选项，突出“已选 / 待选”的对应关系。
- 选项数量较多、需要搜索辅助选择。
- 仅需要简单多选时，[Select](/components/select) 的 `multiple` 模式更轻量。

## 属性

继承 antd [`TransferProps`](https://ant.design/components/transfer-cn#api)，未列出的属性与 antd `Transfer` 一致并原样透传。

| 属性 | 类型 | 说明 |
| --- | --- | --- |
| `value` | `string[] \| number[]` | 字段值，由内核注入并映射到 `targetKeys` |
| `dataSource` | `TransferItem[]` | 数据源；Schema 的 `enum` 会自动转换，兼容 `label` / `value` 字段 |
| `titles` | `[ReactNode, ReactNode]` | 左右两列的标题 |
| `showSearch` | `boolean` | 是否展示搜索框 |
| `oneWay` | `boolean` | 是否为单向穿梭 |
| `render` | `(item) => ReactNode` | 自定义列表项渲染，默认展示 `item.title` |
| `onChange` | `(keys) => void` | 穿梭时触发，由内核注入 |

## 注意事项

- `Transfer` 未内置阅读态渲染，`readPretty` 模式下仍渲染穿梭框本身。详情页可结合字段的 `dataSource` 与 [Text](/components/preview-text) 自行回显选中项文案。
