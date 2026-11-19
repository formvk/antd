# SchemaForm

`Form` + `SchemaField` 的一层封装：传入 `schema` 即可渲染整张表单，提交、布局与阅读态能力直接复用 `Form`。

<demo react="../demos/schema-form.tsx" title="基础用法" description="顶层 OptionsProvider 注入组件映射，children 追加提交按钮" />

## 何时使用

- 页面只关心 schema，不想重复书写 `Form` + `SchemaField` 的组合。
- 需要以容器的方式统一接收 `scope` 与表单布局参数。
- 需要和 `PopupModel` / `TableModel` 之外的普通表单场景复用同一套渲染方式。

## 属性

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `schema` | `ISchema` | `{}` | 表单 schema |
| `scope` | `Record<string, unknown>` | — | 表达式作用域 |
| `components` | `SchemaReactComponents` | — | 可选，扁平 `name -> 组件` 映射；默认继承顶层 `OptionsProvider`，显式传入时优先 |
| `children` | `ReactNode` | — | 渲染在 `SchemaField` 之后的额外内容，例如 `Submit` |
| 其他 | `FormProps` | — | 透传给内部 `Form`，见 [Form](/components/form) |

## 注意事项

- 推荐在应用最外层注入一次 `OptionsProvider`，`SchemaForm` 会自动继承组件映射；只有局部覆盖或单独使用容器时才需要传 `components`。
- `SchemaForm` 不负责创建表单实例：传入 `form` 时使用该实例，未传入时从父级 `FormProvider` 获取，两者都没有会抛出错误。
- 与 `Form` + `SchemaField` 的写法等价；容器不预绑定内置组件，组件映射优先取 `components` prop，其次继承顶层 `OptionsProvider`。
