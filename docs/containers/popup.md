# 弹窗表单

基于 `PopupModel` 的弹窗表单容器，提供 `ModalForm`（对话框）与 `DrawerForm`（抽屉）两种形态，并通过 `PopupForm` 按 `type` 统一渲染。

## 何时使用

- 新增 / 编辑数据需要一个独立的表单弹窗。
- 希望弹窗的打开、关闭、表单重建与提交后关闭都由模型统一管理。
- 需要在 Modal 与 Drawer 之间切换，而不改动业务逻辑。

## 基础用法

<demo react="../demos/popup-form.tsx" title="Modal / Drawer 切换" description="同一 PopupModel 与 schema，通过 type 切换弹窗形态" />

`type` 省略时渲染 `DrawerForm`；`type="modal"` 渲染 `ModalForm`。

## PopupForm 属性

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `type` | `'modal' \| 'drawer'` | `'drawer'` | 弹窗形态，决定渲染 `ModalForm` 还是 `DrawerForm` |
| 其他 | `ModalFormProps \| DrawerFormProps` | — | 按 `type` 透传给对应表单组件 |

## PopupModel

| 成员 | 说明 |
| --- | --- |
| `visible` | 弹窗是否可见 |
| `form` | 当前表单实例，`open` 时按传入值重建 |
| `open(values?, initialValues?)` | 重置表单并打开弹窗 |
| `close()` | 关闭弹窗 |
| `onSubmit()` | 校验并提交，提交函数返回真值时自动关闭 |

构造函数接收提交函数与表单选项，提交函数返回真值时才关闭弹窗。

## 属性

### ModalForm

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `popup` | `PopupModel` | — | 弹窗表单模型，内部复用模型创建的 form 实例 |
| `onOk` | `(e) => boolean \| void \| Promise<boolean \| void>` | — | 点击确定时触发，返回 `false` 阻止提交 |
| `onCancel` | `(e) => boolean \| void \| Promise<boolean \| void>` | — | 点击取消时触发，返回 `false` 阻止关闭 |
| `schema` / `scope` / `components` / `children` | 同 [SchemaForm](/containers/schema-form) | — | 表单内容 |
| 其他 | `ModalProps` | — | 透传给 antd `Modal`，`open`、`confirmLoading` 由容器接管 |

### DrawerForm

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `popup` | `PopupModel` | — | 同 `ModalForm` |
| `onOk` / `onCancel` | 同上 | — | 同 `ModalForm` |
| `okText` | `ReactNode` | antd locale 的 `Modal.okText` | 确定按钮文案 |
| `cancelText` | `ReactNode` | antd locale 的 `Modal.cancelText` | 取消按钮文案 |
| `schema` / `scope` / `components` / `children` | 同 [SchemaForm](/containers/schema-form) | — | 表单内容 |
| 其他 | `DrawerProps` | — | 透传给 antd `Drawer`，`open`、`onClose`、`footer`、`size` 由容器接管 |

## 行为说明

- 点确定时先触发 `onOk`，未返回 `false` 才调用 `popup.onSubmit()`。
- 点取消时先触发 `onCancel`，未返回 `false` 才调用 `popup.close()`。
- 抽屉底部按钮文案默认取 `ConfigProvider` locale 中的 `Modal.okText` / `Modal.cancelText`，可通过 `okText` / `cancelText` 覆盖。
- 校验中与提交中按钮通过 `popup.form.submitting` 显示 loading。
- 提交函数返回假值时表单保持打开，便于展示服务端错误。
- 表单内容继承应用最外层的 `OptionsProvider`，通常无需再传 `components`；弹窗内容通过 portal 渲染，上下文依然有效。

## 与 CrudTable 组合

[CrudTable](/containers/crud-table) 的新增 / 编辑弹窗内部即使用 `PopupForm`，默认抽屉形态，可通过 `popupProps`、`addProps`、`editProps` 配置形态与属性：

```tsx
<CrudTable
  table={table}
  add={addSchema}
  edit={editSchema}
  popupProps={{ type: 'modal', width: 520 }}
  editProps={{ title: '编辑用户' }}
/>
```

合并顺序为 `默认值 → popupProps → addProps / editProps`，同时设置时后者生效。
