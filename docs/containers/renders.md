# 表格渲染器

`renders` 是一组开箱即用的 antd 表格列渲染器，用于把常见的数据展示需求收敛成一行配置：

```tsx
import { renders } from '@formvk/antd'

const columns = [
  { title: '序号', render: renders.serial() },
  { title: '名称', dataIndex: 'name', render: renders.text({ ellipsis: true }) },
  { title: '状态', dataIndex: 'status', render: renders.option(options) },
]
```

## 基础用法

<demo react="../demos/renders.tsx" title="在 CrudTable 中使用内置渲染器" description="序号、文本、枚举、标签、图片、链接与时间列" />

## 渲染上下文

渲染器会自动从 `CrudTable` 注入的上下文中读取信息，并作为入参传给自定义组件与 `format` 函数：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `text` | `any` | 当前单元格的值 |
| `record` | `IRecord` | 当前行数据 |
| `index` | `number` | 当前行索引 |
| `table` | `TableModel` | 表格模型，可调用 `editPopup.open`、`onRemove` 等 |
| `$state` | `object` | 表格模型的 `state` |
| `...scope` | — | `CrudTable` 的 `scope` 会合并进渲染参数 |

`CrudTable` 会自动包裹 `TableRenderProvider`；如果脱离 `CrudTable` 直接使用 antd `Table`，需要手动提供上下文：

```tsx
import { TableRenderProvider, renders } from '@formvk/antd'

<TableRenderProvider value={{ table, placeholder: '--' }}>
  <Table columns={columns} dataSource={table.records} />
</TableRenderProvider>
```

`placeholder` 为单元格空值占位符，默认 `--`，渲染器内的 `placeholder` 参数优先级更高。

## API

### `renders.serial()`

按当前页的行索引输出 1 起始的序号，不接受参数。

### `renders.text(options?)`

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `placeholder` | `ReactNode` | 继承上下文 | 空值占位符 |
| `ellipsis` | `boolean` | `false` | 单行省略，溢出时通过 Tooltip 展示完整内容 |
| `tooltipProps` | `TooltipProps` | — | 透传给 Tooltip |
| `format` | `(props) => ReactNode` | — | 自定义渲染，返回空值时回退到占位符 |

`options` 也可以直接传 `format` 函数。

### `renders.option(options)`

把单元格值渲染为选项文本，支持树形选项与值数组。

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `options` | `ITree[] \| (props) => ITree[]` | — | 选项数据源 |
| `last` | `boolean` | `true` | 树形选项只显示最后一级 |
| `separator` | `string` | `/` | 多级选项与多值之间的分隔符 |
| `placeholder` | `ReactNode` | 继承上下文 | 空值占位符 |
| `ellipsis` | `boolean` | `false` | 内容溢出时单行省略 |

`options` 也可以直接传选项数组或返回数组的函数。

### `renders.tag(options)`

与 `option` 类似，但使用 antd `Tag` 渲染，选项项可携带 `color` 等 `TagProps`。

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `options` | `ITree<TagProps>[] \| (props) => ITree<TagProps>[]` | — | 选项数据源 |
| `last` | `boolean` | `true` | 树形选项只显示最后一级 |
| `placeholder` | `ReactNode` | 继承上下文 | 空值占位符 |

### `renders.time(options?)`

使用 dayjs 格式化时间，默认 `YYYY-MM-DD HH:mm:ss`。

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `format` | `string \| (props) => ReactNode` | `YYYY-MM-DD HH:mm:ss` | 格式化模板或自定义渲染 |
| `placeholder` | `ReactNode` | 继承上下文 | 空值占位符 |

`options` 也可以直接传格式字符串或渲染函数。

### `renders.image(options?)`

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `size` | `number` | `20` | 图片宽高 |
| `format` | `(props) => string` | — | 由单元格值推导图片地址 |
| `className` / `style` | — | — | 图片样式 |
| `placeholder` | `ReactNode` | 继承上下文 | 空值占位符 |

### `renders.link(options?)`

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `format` | `(props) => string` | — | 由单元格值推导链接地址，默认使用单元格值 |
| `target` | `string` | `_blank` | 打开方式 |
| 其他 | `AnchorHTMLAttributes` | — | 透传给 `<a>` |
| `placeholder` | `ReactNode` | 继承上下文 | 空值占位符 |

### `renders.createRender(Component)`

把自定义组件转换为列渲染函数，组件会以 `observer` 包裹，并接收完整的渲染参数：

```tsx
import { renders } from '@formvk/antd'

const statusRender = renders.createRender(props => (
  <span>{`${props.record.name}：${props.text}`}</span>
))

const columns = [{ title: '状态', dataIndex: 'status', render: statusRender }]
```

## 注意事项

- 渲染器返回值直接作为 antd 列的 `render`，无需再包一层函数。
- `option` / `tag` 的选项值按 `value` 全等匹配，树形结构会返回从根到目标节点的链路。
- `ellipsis` 首屏测量在挂载后完成，单元格内容后续变化时不会重新测量。
