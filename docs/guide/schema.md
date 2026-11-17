# Schema 写法

Schema 是对表单结构、状态与联动的声明式描述。本包使用 Formvk 的无前缀字段，例如 `component` 而不是 `x-component`。

## 常用字段

| 字段              | 类型     | 说明                                             |
| ----------------- | -------- | ------------------------------------------------ |
| `type`            | `string` | 字段类型：`string` / `number` / `boolean` / `object` / `array` / `void` |
| `title`           | `string` | 字段标题，通常由 `FormItem` 渲染为 label         |
| `component`       | `any`    | 字段组件，可以是注册名字符串或组件引用           |
| `decorator`       | `any`    | 装饰器组件，一般用于包一层 `FormItem`            |
| `componentProps`  | `object` | 透传给字段组件的 props                           |
| `decoratorProps`  | `object` | 透传给装饰器组件的 props                         |
| `properties`      | `object` | 子字段，用于 `void` / `object` 容器              |
| `items`           | `object` | 数组元素 Schema                                  |
| `default`         | `any`    | 默认值                                           |
| `enum`            | `array`  | 字段数据源，`Select` 等组件会自动连接到 `options` |
| `required`        | `boolean`| 是否必填                                         |
| `description`     | `string` | 字段描述，通常渲染为 `FormItem` 的 extra         |
| `reactions`       | `array`  | 字段联动函数列表                                 |

## fragment 构造器

`createSchemaField` 返回的 `fragment` 提供了一组构造器，返回带类型的 Schema Creator：

| 构造器                        | 用途                                     |
| ----------------------------- | ---------------------------------------- |
| `f.Field(options)`            | 普通字段（不绑定组件）                   |
| `f.Void(properties, options)` | 虚拟字段 / 布局容器                      |
| `f.Object(properties, options)` | 对象字段，`properties` 直接传入子字段    |
| `f.ArrayItems(items, options)`  | 数组字段，`items` 传入元素 Schema Creator |
| `f.Input(options)`            | 注册表推导出的组件构造器（所有字段组件） |

```tsx
const schema = createSchema({
  profile: f.Object({
    name: f.Input({ title: '姓名' }),
  }),
  users: f.ArrayItems(f.Object({ name: f.Input({ title: '姓名' }) })),
  panel: f.Void({}, { component: SomeContainer }),
})
```

## 组件名与组件引用

两种写法等价：

```tsx
// 1. 注册名
createSchema({ name: f.Field({ title: '姓名', component: 'Input' }) })

// 2. 组件引用
createSchema({ name: f.Field({ title: '姓名', component: Input }) })
```

组件引用同样适用于带层级的组件，例如 `FormTab.TabPane`、`FormCollapse.CollapsePanel`、`SelectTable.Column`，本包会通过组件的 `displayName` / `name` 识别其语义。

## 字段联动

`reactions` 是一个函数数组，函数在字段初始化时执行，内部对字段属性赋值即可触发响应式更新：

```tsx
const schema = createSchema({
  country: f.Select({
    title: '国家',
    enum: [
      { label: '中国', value: 'CN' },
      { label: '美国', value: 'US' },
    ],
  }),
  city: f.Input({
    title: '城市',
    reactions: [
      field => {
        field.visible = field.query('.country').value() === 'CN'
      },
    ],
  }),
})
```

## 阅读态

设置表单 `readPretty: true` 或字段 `pattern: 'readPretty'` 后，字段会通过 `PreviewText` 渲染为纯文本：

```tsx
const form = createForm({ readPretty: true })
```

`Form` 支持通过 `previewTextPlaceholder` 统一设置空值占位符。
