# ArrayCollapse

折叠面板形态的数组组件，每个元素渲染为一个 antd `Collapse` 面板，适合字段多、需要按需展开的数组。

<demo react="../demos/array-collapse.tsx" title="ArrayCollapse 示例" description="默认展开数量、手风琴模式与新增/删除" />

## 何时使用

- 单条记录字段很多，全部平铺会导致页面过长。
- 用户通常只关注其中一两条记录，需要折叠其余项时。

## 属性

继承 antd [`CollapseProps`](https://ant.design/components/collapse-cn#api)，并扩展：

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `defaultOpenPanelCount` | `number` | `5` | 初始化时默认展开的面板数量 |
| `accordion` | `boolean` | — | 是否手风琴模式（同一时间只展开一个面板） |
| `defaultActiveKey` | `string \| string[]` | — | 默认展开的面板 key |
| `bordered` | `boolean` | — | 是否带边框 |

通用数组属性（`disabled` / `onAdd` / `onCopy` / `onRemove` / `onMoveUp` / `onMoveDown`）见 [ArrayBase](/components/array-base#数组属性)。

## 用法

```tsx
const schema = createSchema({
  users: f.ArrayCollapse(
    f.Object({
      index: f.Index(),
      name: f.Input({ title: '姓名' }),
      remove: f.Remove({ title: '删除' }),
    }),
    {
      componentProps: {
        defaultOpenPanelCount: 2,
        accordion: true,
      },
      properties: {
        add: f.Addition({ title: '新增面板' }),
      },
    }
  ),
})
```

`Index` 与操作组件会渲染在面板标题区，面板标题缺省取字段 `title`。子面板组件为 `CollapsePanel`。
