# SelectTable

表格选择组件，以表格形式展示候选数据并勾选值，字段值为勾选行的主键（或整行数据），支持单选、多选与搜索。

<demo react="../demos/select-table.tsx" title="SelectTable 示例" description="多选搜索、自定义过滤排序与单选取值，下方实时展示字段值" />

## 何时使用

- 候选项本身是结构化数据，需要展示多列信息后再选择，如选择商品、订单、成员。
- 需要在选择前进行搜索、过滤或排序时。
- 只需要简单枚举选择时，[Select](/components/select) 更轻量。

## 属性

继承 antd `TableProps`，并扩展：

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `mode` | `'multiple' \| 'single'` | `'multiple'` | 单选 / 多选 |
| `dataSource` | `any[]` | — | 表格候选数据 |
| `optionAsValue` | `boolean` | `false` | 为 `true` 时以整行数据作为字段值，否则只取主键 |
| `valueType` | `'all' \| 'parent' \| 'child' \| 'path'` | `'all'` | 树形数据的取值方式 |
| `showSearch` | `boolean` | `false` | 是否显示搜索框 |
| `searchProps` | `SearchProps` | — | 搜索框属性 |
| `primaryKey` | `string \| ((record) => string)` | `'key'` | 主键字段名或取值函数 |
| `filterOption` | `(option, keyword) => boolean` | — | 自定义搜索过滤 |
| `filterSort` | `(a, b) => number` | — | 搜索结果排序 |
| `onSearch` | `(keyword) => void` | — | 搜索回调，用于受控远程搜索 |
| `onChange` | `(value, options) => void` | — | 选择变化回调 |

## 列组件

`SelectTableColumn` 的 `componentProps` 支持 antd `Table` 的列属性（`ColumnType`），并通过 `dataIndex` 与字段名绑定，`key` 为必填。

## 用法

```tsx
import { FormItem, SelectTable, SelectTableColumn } from '@formvk/antd'

const { SchemaField, fragment: f } = createSchemaField({
  voidComponents: { FormItem, Column: SelectTableColumn },
  arrayComponents: { SelectTable },
  defaultDecorator: 'FormItem',
})

const schema = createSchema({
  users: f.SelectTable(
    f.Object({
      name: f.Column({
        componentProps: { key: 'name', dataIndex: 'name', title: '姓名' },
      }),
    }),
    {
      componentProps: {
        dataSource: [
          { key: 1, name: 'Alice' },
          { key: 2, name: 'Bob' },
        ],
        showSearch: true,
      },
    }
  ),
})
```

单选时设置 `componentProps.mode: 'single'`，值为主键；设置 `optionAsValue: true` 时值为整行数据。
