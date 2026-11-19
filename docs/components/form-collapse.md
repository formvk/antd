# FormCollapse

折叠面板布局容器，子面板通过 `CollapsePanel` 声明，适合分组多、默认只展开部分内容的长表单。

<demo react="../demos/form-collapse.tsx" title="FormCollapse 示例" description="受控实例、默认展开与手风琴模式" />

## 何时使用

- 表单分组较多，希望默认折叠次要分组、缩短页面长度。
- 需要在代码中精确控制哪些分组展开 / 收起时，配合 `createFormCollapse` 受控实例使用。

## 属性

继承 antd `CollapseProps`，并扩展：

| 属性 | 类型 | 说明 |
| --- | --- | --- |
| `formCollapse` | `IFormCollapse` | `createFormCollapse` 创建的受控实例，不传时内部自动创建 |
| `activeKey` | `string \| string[]` | 当前展开的面板 |
| `accordion` | `boolean` | 是否手风琴模式 |
| `onChange` | `(keys) => void` | 展开项变化时触发 |

### CollapsePanel

| 子组件 | 说明 |
| --- | --- |
| `CollapsePanel` | 面板，`componentProps` 同 antd `CollapsePanelProps`（`key`、`header` 等） |

### 受控实例

`createFormCollapse(defaultActiveKeys?)` 返回：

| 成员 | 说明 |
| --- | --- |
| `activeKeys` | 当前展开的 key 列表 |
| `setActiveKeys(keys)` | 设置展开项 |
| `addActiveKey(key)` | 展开指定面板 |
| `removeActiveKey(key)` | 收起指定面板 |
| `toggleActiveKey(key)` | 切换指定面板 |
| `hasActiveKey(key)` | 判断面板是否展开 |

## 用法

```tsx
const collapse = createFormCollapse(['base'])

const schema = createSchema({
  panels: f.FormCollapse({
    componentProps: { formCollapse: collapse, accordion: true },
    properties: {
      base: f.CollapsePanel({
        componentProps: { key: 'base', header: '基本信息' },
        properties: {
          name: f.Input({ title: '姓名' }),
        },
      }),
    },
  }),
})
```

不传 `formCollapse` 时组件内部会自动创建实例。
