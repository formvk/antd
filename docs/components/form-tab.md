# FormTab

标签页布局容器，子面板通过 `TabPane` 声明，按标签页分组字段。面板内字段校验失败时，对应标签上会展示错误数量。

<demo react="../demos/form-tab.tsx" title="FormTab 示例" description="多标签页分组字段与校验错误提示" />

## 何时使用

- 表单字段可以划分为多个平级分组，且每次只需要填写其中一组。
- 希望用户在切换标签时立刻看到该组的校验状态时。

## 属性

继承 antd `TabsProps`，并扩展：

| 属性 | 类型 | 说明 |
| --- | --- | --- |
| `formTab` | `IFormTab` | `createFormTab` 创建的受控实例，不传时内部自动创建 |
| `activeKey` | `string` | 当前激活的 tab |
| `onChange` | `(key) => void` | 切换 tab 时触发 |

### TabPane

| 子组件 | 说明 |
| --- | --- |
| `TabPane` | 标签页面板，`componentProps` 同 antd `TabPaneProps`（`key`、`tab`、`disabled` 等） |

### 受控实例

`createFormTab(defaultActiveKey?)` 返回：

| 成员 | 说明 |
| --- | --- |
| `activeKey` | 当前激活的 tab |
| `setActiveKey(key)` | 切换 tab |

## 用法

```tsx
const { OptionsProvider, fragment: f } = createSchemaOptions({
  components: { Input },
  voidComponents: { FormItem, FormTab, TabPane },
  defaultDecorator: 'FormItem',
})

const schema = createSchema({
  tabs: f.FormTab({
    properties: {
      user: f.TabPane({
        componentProps: { key: 'user', tab: '基本信息' },
        properties: {
          name: f.Input({ title: '姓名' }),
        },
      }),
      setting: f.TabPane({
        componentProps: { key: 'setting', tab: '账号安全' },
        properties: {
          password: f.Input({ title: '密码' }),
        },
      }),
    },
  }),
})
```

不传 `formTab` 时组件内部会自动创建实例；需要从外部切换 tab 时再传入 `createFormTab` 实例。
