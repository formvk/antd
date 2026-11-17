# 数组组件

数组组件用于编辑 `type: 'array'` 的字段，需要注册到 `createSchemaField` 的 `arrayComponents` 中。

## 基本结构

```tsx
import { ArrayItems, FormItem, Input } from '@formvk/antd'
import { createSchema, createSchemaField } from '@formvk/react'

const { SchemaField, fragment: f } = createSchemaField({
  components: { Input },
  voidComponents: { FormItem },
  arrayComponents: { ArrayItems },
  defaultDecorator: 'FormItem',
})

const schema = createSchema({
  // 对象数组
  users: f.ArrayItems(f.Object({ name: f.Input({ title: '姓名' }) })),
  // 原始值数组
  tags: f.ArrayItems(f.Input()),
})
```

`f.ArrayItems(items, options)` 的第一个参数是元素 Schema Creator，第二个参数用于描述数组字段本身，例如 `componentProps`、`properties`（追加操作区）。

<demo react="../demos/array-items.tsx" title="ArrayItems 示例" description="支持新增、删除成员，字段校验由内核接管" />

## 对象数组的路径

对象数组的每个元素都是按索引嵌套的子字段，`users.0.name`、`users.1.name` 依次对应每一项。数组组件内部已处理好 `index` 与 basePath 的映射，直接按上面的写法声明即可。

## 内置操作组件

`ArrayBase`（`ArrayItems` / `ArrayCards` / `ArrayCollapse` / `ArrayTable` 的 mixin 基座）提供以下操作组件，通常注册为 `voidComponents` 后在 Schema 中使用：

| 组件                    | 说明             |
| ----------------------- | ---------------- |
| `ArrayItems.Addition`   | 新增一行         |
| `ArrayItems.Remove`     | 删除当前行       |
| `ArrayItems.Copy`       | 复制当前行       |
| `ArrayItems.MoveUp`     | 上移当前行       |
| `ArrayItems.MoveDown`   | 下移当前行       |
| `ArrayItems.SortHandle` | 拖拽排序手柄     |
| `ArrayItems.Index`      | 当前行索引       |

```tsx
const { SchemaField, fragment: f } = createSchemaField({
  components: { Input },
  voidComponents: {
    FormItem,
    Addition: ArrayItems.Addition,
    Remove: ArrayItems.Remove,
  },
  arrayComponents: { ArrayItems },
  defaultDecorator: 'FormItem',
})

const schema = createSchema({
  users: f.ArrayItems(
    f.Object({
      name: f.Input({ title: '姓名' }),
      remove: f.Remove({ title: '删除' }),
    }),
    {
      properties: {
        add: f.Addition({ title: '新增' }),
      },
    }
  ),
})
```

## 可用的数组组件

| 组件            | 形态                     |
| --------------- | ------------------------ |
| `ArrayItems`    | 列表，可开启拖拽排序     |
| `ArrayCards`    | 卡片列表                 |
| `ArrayCollapse` | 折叠面板                 |
| `ArrayTabs`     | 标签页                   |
| `ArrayTable`    | 可编辑表格               |
| `SelectTable`   | 从表格中勾选数据         |

## SelectTable

`SelectTable` 的数据来自 `componentProps.dataSource`，列通过 `SelectTable.Column` 声明：

```tsx
import { SelectTable } from '@formvk/antd'

const { SchemaField, fragment: f } = createSchemaField({
  voidComponents: { FormItem, Column: SelectTable.Column },
  arrayComponents: { SelectTable },
  defaultDecorator: 'FormItem',
})

const schema = createSchema({
  users: f.SelectTable(
    f.Object({
      name: f.Column({
        componentProps: { key: 'name', dataIndex: 'name', title: '名称' },
      }),
    }),
    {
      componentProps: {
        dataSource: [
          { key: 1, name: 'A' },
          { key: 2, name: 'B' },
        ],
      },
    }
  ),
})
```
