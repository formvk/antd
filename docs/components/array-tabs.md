# ArrayTabs

标签页形态的数组组件，每个元素渲染为一个 tab，并内置新增 / 关闭按钮（固定 `type="editable-card"`）。

<demo react="../demos/array-tabs.tsx" title="ArrayTabs 示例" description="可新增、关闭的标签页数组" />

## 何时使用

- 数组项之间是平级切换关系，同一时间只编辑一项，如多段行程、多个收件人。
- 项数可能动态增减，且希望新增 / 删除操作直接内聚在标签栏时。

## 属性

继承 antd `TabsProps`，常用属性：

| 属性 | 类型 | 说明 |
| --- | --- | --- |
| `type` | `'line' \| 'card' \| 'editable-card'` | 组件固定使用可编辑卡片样式 |
| `tabPosition` | `'top' \| 'right' \| 'bottom' \| 'left'` | 标签位置 |
| `size` | `'small' \| 'middle' \| 'large'` | 尺寸 |
| `centered` | `boolean` | 标签是否居中 |

通用数组属性（`disabled` / `onAdd` / `onCopy` / `onRemove` / `onMoveUp` / `onMoveDown`）见 [ArrayBase](/components/array-base#数组属性)。

## 注意事项

- 标签文案取自字段 `title` 与序号，如 `成员 1`；字段校验失败时，对应标签上会展示错误数量。
- 第一个面板不可关闭，点击标签栏的 `+` 会自动向数组追加一项。
