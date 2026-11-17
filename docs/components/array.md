# 数组组件

数组组件注册到 `createSchemaField` 的 `arrayComponents` 中，元素 Schema 通过 `f.ArrayItems(items, options)` 这类构造器的第一个参数传入。操作组件（`Addition` / `Remove` / `MoveUp` / `MoveDown` / `Copy` / `SortHandle` / `Index`）的注册与用法见 [数组组件指南](/guide/array#内置操作组件)。

## ArrayBase

数组组件的底层基座，提供 `ArrayBase.mixin` 与 `Addition` / `Remove` / `MoveUp` / `MoveDown` / `Copy` / `SortHandle` / `Index` / `Item` 等成员。自定义数组组件时可以从这里组合。

## ArrayItems

列表形态，每个元素渲染在独立的行容器中。

```tsx
const schema = createSchema({
  users: f.ArrayItems(f.Object({
    name: f.Input({ title: '姓名' }),
  })),
})
```

配合 `ArrayItems.SortHandle` 可实现拖拽排序。

## ArrayCards

卡片形态，每个元素渲染为一张 `Card`。

```tsx
const schema = createSchema({
  users: f.ArrayCards(f.Object({
    name: f.Input({ title: '姓名' }),
  })),
})
```

`componentProps` 支持 antd `Card` 的全部属性，其中 `title` / `extra` 会与 Schema 中的 `Index` / 操作组件组合渲染。

## ArrayCollapse

折叠面板形态，每个元素渲染为一个 `Collapse.Panel`。

```tsx
const schema = createSchema({
  users: f.ArrayCollapse(f.Object({
    name: f.Input({ title: '姓名' }),
  })),
})
```

`componentProps` 支持 antd `Collapse` 的属性，例如 `accordion`、`defaultActiveKey`。

## ArrayTabs

标签页形态，每个元素渲染为一个 tab。

```tsx
const schema = createSchema({
  users: f.ArrayTabs(f.Object({
    name: f.Input({ title: '姓名' }),
  })),
})
```

`componentProps` 支持 antd `Tabs` 的属性。

## ArrayTable

可编辑表格。列通过 `ArrayTable.Column` 声明，与 antd `Table` 的列配置一致。

```tsx
import { ArrayTable, FormItem, Input } from '@formvk/antd'

const { SchemaField, fragment: f } = createSchemaField({
  components: { Input },
  voidComponents: {
    FormItem,
    Column: ArrayTable.Column,
    Addition: ArrayTable.Addition,
  },
  arrayComponents: { ArrayTable },
  defaultDecorator: 'FormItem',
})

const schema = createSchema({
  users: f.ArrayTable(
    f.Object({
      name: f.Column({
        componentProps: { key: 'name', dataIndex: 'name', title: '姓名', width: 200 },
      }),
    }),
    {
      properties: {
        add: f.Addition({ children: '新增' }),
      },
    }
  ),
})
```

`componentProps` 支持 antd `Table` 的属性，例如 `pagination`、`bordered`、`scroll`。

## SelectTable

从表格数据中勾选值。数据通过 `componentProps.dataSource` 传入，列通过 `SelectTable.Column` 声明。

| 属性            | 类型                                          | 默认值       | 说明                         |
| --------------- | --------------------------------------------- | ------------ | ---------------------------- |
| `mode`          | `'multiple' \| 'single'`                      | `'multiple'` | 单选 / 多选                  |
| `dataSource`    | `any[]`                                       | —            | 表格数据                     |
| `optionAsValue` | `boolean`                                     | `false`      | 是否以整行数据作为值         |
| `valueType`     | `'all' \| 'parent' \| 'child' \| 'path'`      | `'all'`      | 取值方式                     |
| `showSearch`    | `boolean`                                     | `false`      | 是否显示搜索框               |
| `searchProps`   | `SearchProps`                                 | —            | 搜索框属性                   |
| `primaryKey`    | `string \| ((record) => string)`              | `'key'`      | 主键字段或取值函数           |
| `filterOption`  | `(input, option) => boolean`                  | —            | 自定义搜索过滤               |
| `filterSort`    | `(a, b) => number`                            | —            | 搜索排序                     |
| `onSearch`      | `(keyword) => void`                           | —            | 搜索回调（受控搜索）         |

```tsx
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

<demo react="../demos/select-table.tsx" title="SelectTable 示例" description="勾选表格行即可把数据写入表单" />

列组件的 `componentProps` 支持 antd `Table` 的列属性，并支持 `dataIndex` 与字段名绑定。
