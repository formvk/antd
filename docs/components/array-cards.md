# ArrayCards

卡片形态的数组组件，每个元素渲染为一张 antd `Card`，操作组件自动归集到卡片右上角。

<demo react="../demos/array-cards.tsx" title="ArrayCards 示例" description="卡片标题、序号、删除与新增" />

## 何时使用

- 数组项包含的字段较多，希望以卡片视觉边界区分每一项。
- 项数不多、希望突出每条记录的独立性时。

## 属性

继承 antd `CardProps`，常用属性：

| 属性 | 类型 | 说明 |
| --- | --- | --- |
| `title` | `ReactNode` | 卡片标题，缺省时取字段 `title` |
| `extra` | `ReactNode` | 卡片右上角内容，与操作组件组合渲染 |
| `bordered` | `boolean` | 是否带边框 |
| `size` | `'default' \| 'small'` | 卡片尺寸 |

通用数组属性（`disabled` / `onAdd` / `onCopy` / `onRemove` / `onMoveUp` / `onMoveDown`）见 [ArrayBase](/components/array-base#数组属性)。

## 用法

```tsx
const schema = createSchema({
  users: f.ArrayCards(
    f.Object({
      index: f.Index(),
      name: f.Input({ title: '姓名' }),
      remove: f.Remove({ title: '删除' }),
    }),
    {
      properties: {
        add: f.Addition({ title: '新增卡片' }),
      },
    }
  ),
})
```

`Index` 与 `Remove` 等操作组件会自动渲染到卡片标题 / 右上角区域。
