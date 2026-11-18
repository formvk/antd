# ArrayItems

列表形态的数组组件，每个元素渲染在独立的行容器中，是最常用的数组形态。注册到 `createSchemaField` 的 `arrayComponents`。

<demo react="../demos/array-items.tsx" title="ArrayItems 示例" description="新增、删除与字段校验" />

## 何时使用

- 维护一组结构相同的对象，且每项只需要简单的纵向排列与增删操作。
- 需要卡片、折叠、标签页或表格外观时，改用对应的数组组件。

## 用法

```tsx
const { SchemaField, fragment: f } = createSchemaField({
  components: { Input },
  voidComponents: {
    FormItem,
    Addition,
    Remove,
  },
  arrayComponents: { ArrayItems },
  defaultDecorator: 'FormItem',
})

const schema = createSchema({
  users: f.ArrayItems(
    f.Object({
      name: f.Input({ title: '姓名', required: true }),
      remove: f.Remove({ title: '删除' }),
    }),
    {
      properties: {
        add: f.Addition({ title: '新增成员' }),
      },
    }
  ),
})
```

## 属性

本组件无独立扩展属性，通用数组属性（`disabled` / `onAdd` / `onCopy` / `onRemove` / `onMoveUp` / `onMoveDown`）见 [ArrayBase](/components/array-base#数组属性)。

配合 `SortHandle` 可实现拖拽排序，`Index` 展示序号；操作组件在非 `editable` 模式下自动隐藏。
