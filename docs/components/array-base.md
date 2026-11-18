# ArrayBase

数组组件的底层基座，提供数组字段的上下文与一组操作组件。`ArrayItems`、`ArrayCards`、`ArrayCollapse`、`ArrayTabs`、`ArrayTable` 都基于 `ArrayBase` 与下列操作组件组合而成，一般只在自定义数组组件时直接使用。

<demo react="../demos/array-base.tsx" title="ArrayBase 示例" description="组合 Index、SortHandle、Copy、Remove、MoveUp、MoveDown 与 Addition，展示操作回调与 disabled" />

## 何时使用

- 内置的五种数组形态都不满足设计时，基于 `ArrayBase` 自定义数组渲染。
- 只需要选择现成形态时，直接使用 [ArrayItems](/components/array-items) 等上层组件。

## 成员

| 成员 | 说明 |
| --- | --- |
| `ArrayBase` | 数组上下文的根容器 |
| `ArrayBaseItem` | 列表项上下文容器，向下提供 `index` 与 `record` |
| `Addition` | 新增按钮 |
| `Remove` | 删除按钮 |
| `Copy` | 复制按钮，在当前项后插入一份克隆 |
| `MoveUp` | 上移按钮 |
| `MoveDown` | 下移按钮 |
| `Index` | 当前项序号，渲染为 `#1.` 形式 |
| `SortHandle` | 拖拽排序手柄，配合 dnd-kit 使用 |
| `useArray` | 读取数组上下文（`field`、`schema` 与 `props`） |
| `useIndex` | 读取当前项索引 |
| `useRecord` | 读取当前项数据 |

## 数组属性

通过数组容器的 `componentProps` 传入，对所有数组组件通用：

| 属性 | 类型 | 说明 |
| --- | --- | --- |
| `disabled` | `boolean` | 禁用全部操作 |
| `onAdd` | `(index: number) => void` | 新增后触发，参数为新项索引 |
| `onCopy` | `(index: number) => void` | 复制后触发，参数为插入位置索引 |
| `onRemove` | `(index: number) => void` | 删除后触发 |
| `onMoveUp` | `(index: number) => void` | 上移后触发 |
| `onMoveDown` | `(index: number) => void` | 下移后触发 |

### Addition 额外属性

`Addition` 基于 antd `Button`，除 `title`、`icon`、`disabled` 外还支持：

| 属性 | 类型 | 说明 |
| --- | --- | --- |
| `method` | `'push' \| 'unshift'` | 新增方式，默认追加到末尾，`unshift` 插入到开头 |
| `defaultValue` | `any` | 新项的初始值；不传时按 Schema 自动推导（数组为 `[]`、对象为 `{}`） |

其余操作组件（`Remove` / `Copy` / `MoveUp` / `MoveDown`）同样支持 `title`、`icon`、`disabled` 与 antd `Button` 的其余属性。

## 自定义数组组件

```tsx
import { ArrayBase, ArrayBaseItem, Addition, useArray } from '@formvk/antd'

const MyArray = props => {
  const array = useArray()
  return (
    <ArrayBase>
      {array?.field?.value?.map((_, index) => (
        <ArrayBaseItem key={index} index={index} record={array.field.value[index]}>
          ...
        </ArrayBaseItem>
      ))}
    </ArrayBase>
  )
}
```

## 注意事项

- 操作组件通过上下文自动获取当前项索引，无需手动传 `index`。
- 字段 `pattern` 不是 `editable` 时，`SortHandle`、`Remove`、`Copy`、`MoveUp`、`MoveDown` 会自动隐藏；`Addition` 在 `editable` / `disabled` 下保留。
