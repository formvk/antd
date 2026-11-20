# CrudTable

基于 `TableModel` 的表格容器：整合搜索表单、分页、数据加载与新增 / 编辑弹窗，业务侧只需要提供 schema 与数据请求方法。

## 何时使用

- 标准「搜索 + 表格 + 新增 / 编辑」的 CRUD 页面。
- 想复用 `PopupModel` 的弹窗表单能力，但不想手写打开、刷新、分页回第一页等逻辑。
- 数据结构固定，仅字段与请求实现不同的列表页。

## 基础用法

<demo react="../demos/crud-table.tsx" title="搜索 + 表格 + 新增 / 编辑 / 删除" description="TableModel 提供数据流转，CrudTable 负责渲染，列上直接使用 renders" />

## TableModel

`TableModel` 只负责数据流转，不感知 UI，构造参数如下：

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `search` | `(values, pagination) => Promise<ITableResult \| IRecord[]>` | 搜索方法，可返回记录数组或 `{ records, pagination }` |
| `add` / `edit` | `(values) => Promise<boolean \| void>` | 新增 / 编辑，返回真值时自动回到第一页并刷新 |
| `remove` | `(record) => Promise<boolean \| void>` | 删除，返回真值时自动刷新 |
| `auto` | `boolean` | 是否在 `onMount` 时自动加载，默认 `true` |
| `pagination` | `Partial<IPagination>` | 初始分页 |
| `addOptions` / `editOptions` | `PopupOptions` | 新增 / 编辑弹窗的表单选项 |
| `searchOptions` | `IFormProps` | 搜索表单选项 |

常用成员：

| 成员 | 说明 |
| --- | --- |
| `records` | 当前表格数据 |
| `pagination` | `{ current, pageSize, total }` |
| `form` | 搜索表单实例 |
| `addPopup` / `editPopup` | 新增 / 编辑弹窗模型 |
| `search()` | 提交搜索表单并加载数据 |
| `onSearch(pagination?)` | 翻页搜索，不传分页时回到第一页 |
| `onRemove(record, cb?)` | 删除记录，传 `cb` 时替代默认刷新 |
| `compile(columns, scope?)` | 用表达式编译列配置，作用域含 `$table` / `$state` |

## 属性

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `table` | `TableModel` | — | 表格模型 |
| `search` | `ISchema` | — | 搜索表单 schema，不传则不渲染搜索区 |
| `add` | `ISchema` | — | 新增表单 schema，不传则不渲染新增弹窗 |
| `edit` | `ISchema` | — | 编辑表单 schema，不传则不渲染编辑弹窗 |
| `title` | `ReactNode` | — | 弹窗标题后缀，如 `"用户"` 渲染为「新增用户 / 编辑用户」 |
| `scope` | `Record<string, unknown>` | — | 表达式作用域，同时合并进表格渲染器参数 |
| `components` | `SchemaReactComponents` | — | 可选，扁平组件映射；默认继承顶层 `OptionsProvider`，见 [容器总览](/containers/) |
| `placeholder` | `ReactNode` | `--` | 单元格空值占位符，供 [`renders`](/containers/renders) 使用 |
| `searchProps` | `SearchFormProps` | — | 搜索表单配置，覆盖内部默认的 `layout` / `feedbackLayout` / `wrapperWidth` |
| `popupProps` | `CrudTablePopupProps` | — | 新增与编辑弹窗的公共配置 |
| `addProps` | `CrudTablePopupProps` | — | 新增弹窗配置，覆盖 `popupProps` |
| `editProps` | `CrudTablePopupProps` | — | 编辑弹窗配置，覆盖 `popupProps` |
| 其他 | `TableProps` | — | 透传给 antd `Table`，`dataSource`、`pagination`、`loading`、`title` 由容器接管 |

## 弹窗配置

新增 / 编辑弹窗统一使用 [`PopupForm`](/containers/popup)，通过 `popupProps` 配置公共属性，再用 `addProps` / `editProps` 单独覆盖：

```tsx
<CrudTable
  table={table}
  add={addSchema}
  edit={editSchema}
  popupProps={{ type: 'modal', width: 520 }}
  editProps={{ title: '编辑用户', maskClosable: false }}
/>
```

`CrudTablePopupProps` 联合了 `ModalFormProps` 与 `DrawerFormProps`（已剔除 `popup` / `schema` / `scope` / `components`）：

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `type` | `'modal' \| 'drawer'` | `'drawer'` | 弹窗形态 |
| `title` | `ReactNode` | `新增{title}` / `编辑{title}` | 弹窗标题，传入时覆盖默认拼接结果 |
| 其他 | `ModalProps \| DrawerProps` | — | 其余属性透传给对应的 antd 组件 |

合并顺序为 `默认值 → popupProps → addProps / editProps`，后者覆盖前者。

## 表格渲染器

`CrudTable` 会自动注入表格渲染上下文，因此列上可以直接使用内置渲染器，无需手写 `render`：

```tsx
import { renders } from '@formvk/antd'

const columns = [
  { title: '序号', render: renders.serial() },
  { title: '名称', dataIndex: 'name', render: renders.text({ ellipsis: true }) },
  { title: '状态', dataIndex: 'status', render: renders.option(options) },
]
```

渲染器可读取 `table`、`$state`、`scope` 与单元格上下文，完整列表见 [表格渲染器](/containers/renders)。

## 自由组合

`CrudTable` 只是「搜索 + 表格 + 新增 / 编辑」的一层组合封装，适合简单场景。需要自定义布局时，改用 `TableModelProvider` 提供模型，再自由组装下列组件：

<demo react="../demos/crud-table-widgets.tsx" title="Provider + 搜索表单 + 表格 + 弹窗自由组装" description="搜索区与表格放进 Card，新增按钮放到右上角，各组件共享同一个 TableModel" />

| 组件 | 说明 |
| --- | --- |
| `TableModelProvider` | 注入 `TableModel`，可选 `placeholder` 与 `scope`，需包裹其余组件 |
| `SearchForm` | 绑定 `table.form`，默认 `layout="inline"`，提交时调用 `table.search()` |
| `DataTable` | 读取 `table.records` / `table.pagination` / 加载态，挂载时调用 `table.onMount()`，分页变化调用 `table.onSearch({ current, pageSize, total })` |
| `AddPopup` / `EditPopup` | 基于 `PopupForm`，分别复用 `table.addPopup` / `table.editPopup` |

`DataTable` 的 `columns` 支持 `{{ }}` 表达式，会与 `scope`、`$table`、`$state` 一起编译；`pagination={false}` 可关闭分页。`SearchForm` / `DataTable` 的 `scope` 与 `placeholder` 都支持单独覆盖，未传时继承 `TableModelProvider`。

## 行为说明

- 挂载时调用 `table.onMount()`，未关闭 `auto` 时自动执行一次搜索。
- 搜索表单提交后调用 `table.search()`，表单校验不通过不会发起请求。
- 分页变化调用 `table.onSearch({ current, pageSize, total })`。
- 表格 `loading` 取自搜索表单的 `submitting` 状态。
- 新增 / 编辑弹窗分别复用 `table.addPopup`、`table.editPopup`，提交成功后模型自动回到第一页并刷新列表。
- 新增 / 编辑弹窗默认渲染为抽屉（`DrawerForm`），`popupProps.type = 'modal'` 可切换为对话框。
- 新增与删除入口未内置按钮：调用 `table.addPopup.open()` 打开新增弹窗，在列中调用 `table.editPopup.open(record)`、`table.onRemove(record)` 触发编辑 / 删除。
- 表格外层包裹 `TableRenderProvider`，`placeholder` 与 `scope` 会传递给所有内置渲染器。
- 搜索表单与新增 / 编辑弹窗都继承应用最外层的 `OptionsProvider`，通常无需再传 `components`。
