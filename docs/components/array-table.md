# ArrayTable

可编辑表格形态的数组组件，列通过 `Column` 声明，适合字段规整、数据量较大的对象数组。

<demo react="../demos/array-table.tsx" title="ArrayTable 示例" description="列声明、操作列、分页与排序" />

## 何时使用

- 每条记录结构完全一致、字段以列的形式对比查看更清晰时。
- 需要分页、固定操作列、拖拽排序行等表格能力时。
- 记录内字段差异大或需要复杂布局时，[ArrayCards](/components/array-cards) 等形态更合适。

## 属性

继承 antd [`TableProps`](https://ant.design/components/table-cn#api)，常用属性：

| 属性 | 类型 | 说明 |
| --- | --- | --- |
| `pagination` | `PaginationProps \| false` | 分页配置，传 `false` 关闭分页 |
| `bordered` | `boolean` | 是否带边框 |
| `scroll` | `object` | 滚动配置，如 `{ x: '100%' }` |
| `size` | `'small' \| 'middle' \| 'large'` | 表格尺寸 |
| `rowKey` | `string` | 行 key，缺省使用索引 |

通用数组属性（`disabled` / `onAdd` / `onCopy` / `onRemove` / `onMoveUp` / `onMoveDown`）见 [ArrayBase](/components/array-base#数组属性)。

## 列组件与操作组件

| 组件 | 说明 |
| --- | --- |
| `Column` | 列容器，`componentProps` 同 antd `ColumnType` |
| `ArrayTableAddition` | 表格底部的新增按钮 |
| `Index` | 序号列内容 |
| `SortHandle` | 拖拽排序手柄 |
| `Remove` | 删除按钮 |
| `MoveUp` / `MoveDown` | 上移 / 下移按钮 |
| `Copy` | 复制按钮 |

## 用法

```tsx
const schema = createSchema({
  users: f.ArrayTable(
    f.Object({
      name: f.Column({
        componentProps: { title: '姓名', dataIndex: 'name', width: 180 },
        properties: { name: f.Input({ required: true }) },
      }),
      actions: f.Column({
        componentProps: { title: '操作', dataIndex: 'actions', width: 160, fixed: 'right' },
        properties: {
          action: f.FormItem({
            properties: {
              remove: f.Remove({ title: '删除' }),
              up: f.MoveUp(),
              down: f.MoveDown(),
            },
          }),
        },
      }),
    }),
    {
      componentProps: { pagination: { pageSize: 2 } },
      properties: {
        add: f.Addition({ title: '新增一行' }),
      },
    }
  ),
})
```

## 注意事项

- `SortHandle` 配合 `Index` 可实现拖拽排序；操作列建议设置 `fixed: 'right'`，横向滚动时保持可见。
- 列的 `dataIndex` 需要与列内字段名对应，否则表格无法收集到列定义。
