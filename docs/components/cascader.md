# Cascader

级联选择组件，基于 antd `Cascader` 封装。Schema 中的 `enum` 会通过 `dataSource` 自动映射为 `options`，字段值为所选路径的 `value` 数组；阅读态自动切换为 `TextCascader`。

<demo react="../demos/cascader.tsx" title="Cascader 示例" description="默认级联、任意一级可选、多选，含 readPretty 阅读态" />

## 何时使用

- 选项具有清晰的层级结构，如省市区、组织架构、商品分类。
- 需要从树形结构中选择一条或多条路径。
- 扁平的大量选项更适合 [Select](/components/select) 或 [TreeSelect](/components/tree-select)。

## 属性

继承 antd [`CascaderProps`](https://ant.design/components/cascader-cn#api)，未列出的属性与 antd `Cascader` 一致并原样透传。

| 属性 | 类型 | 说明 |
| --- | --- | --- |
| `options` | `Option[]` | 级联数据 |
| `dataSource` | `Option[]` | 本包映射属性，等价于 `options`；Schema 的 `enum` 会自动注入 |
| `changeOnSelect` | `boolean` | 是否允许选择任意一级即触发变更 |
| `multiple` | `boolean` | 多选模式 |
| `maxTagCount` | `number \| 'responsive'` | 多选时最多展示的 Tag 数 |
| `showSearch` | `boolean` | 是否可搜索 |
| `fieldNames` | `object` | 自定义 `label` / `value` / `children` 字段名 |
| `displayRender` | `(labels) => ReactNode` | 自定义选中项的回显文案 |

## 阅读态

`readPretty` 模式下自动切换为 `TextCascader`，单条路径的各级标签以 `/` 连接，多条路径以空格分隔；找不到对应选项或值为空时展示 `previewTextPlaceholder`。
