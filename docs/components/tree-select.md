# TreeSelect

树选择组件，基于 antd `TreeSelect` 封装。Schema 中的 `enum` 会通过 `dataSource` 自动映射为 `treeData`；阅读态自动切换为 `TextTreeSelect`。

<demo react="../demos/tree-select.tsx" title="TreeSelect 示例" description="单选、多选、勾选与搜索，含 readPretty 阅读态" />

## 何时使用

- 选项为树形结构，且需要下拉面板内的树交互（展开、勾选、搜索）。
- 数据本身是树，但选择结果只需要节点值而不需要完整路径时，相比 [Cascader](/components/cascader) 更合适。

## 属性

继承 antd `TreeSelectProps`，未列出的属性与 antd `TreeSelect` 一致并原样透传。

| 属性 | 类型 | 说明 |
| --- | --- | --- |
| `treeData` | `TreeNode[]` | 树数据 |
| `dataSource` | `TreeNode[]` | 本包映射属性，等价于 `treeData`；Schema 的 `enum` 会自动注入 |
| `multiple` | `boolean` | 是否多选 |
| `treeCheckable` | `boolean` | 是否展示节点复选框 |
| `showCheckedStrategy` | `'SHOW_ALL' \| 'SHOW_PARENT' \| 'SHOW_CHILD'` | 勾选时的回显策略 |
| `showSearch` | `boolean` | 是否可搜索 |
| `treeNodeFilterProp` | `string` | 搜索时用于过滤的节点字段 |
| `fieldNames` | `object` | 自定义节点字段名 |
| `treeDefaultExpandAll` | `boolean` | 是否默认展开全部节点 |

## 阅读态

`readPretty` 模式下自动切换为 `TextTreeSelect`，在 `treeData` / `dataSource` 中递归查找节点并展示其 `title`；多值以 Tag 列表展示，找不到节点或值为空时展示 `previewTextPlaceholder`。
