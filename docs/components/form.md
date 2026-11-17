# 表单与布局

## Form

表单容器，内部会提供 `FormProvider`、`FormLayout` 与阅读态占位符上下文。

| 属性                     | 类型                                 | 说明                                     |
| ------------------------ | ------------------------------------ | ---------------------------------------- |
| `form`                   | `Form`                               | 由 `createForm` 创建的表单实例           |
| `component`              | `React.ElementType`                  | 渲染容器，默认 `form`                    |
| `onAutoSubmit`           | `(values) => any`                    | 表单提交成功后的回调                     |
| `onAutoSubmitFailed`     | `(feedbacks) => void`                | 提交校验失败后的回调                     |
| `previewTextPlaceholder` | `ReactNode`                          | 阅读态空值占位符，默认 `N/A`             |
| 其他                     | `IFormLayoutProps`                   | 直接透传给内部 `FormLayout`              |

```tsx
import { Form, Submit } from '@formvk/antd'
import { createForm } from '@formvk/react'

const form = createForm()

<Form form={form} layout="vertical" onAutoSubmit={values => console.log(values)}>
  {/* SchemaField / 字段组件 */}
  <Submit>提交</Submit>
</Form>
```

## FormItem

字段装饰器，负责 label、必填标记、tooltip 与校验反馈的展示。

| 属性             | 类型                                          | 说明                         |
| ---------------- | --------------------------------------------- | ---------------------------- |
| `label`          | `ReactNode`                                   | 标签内容                     |
| `tooltip`        | `ReactNode`                                   | 标签后的提示                 |
| `extra`          | `ReactNode`                                   | 控件下方的补充说明           |
| `feedbackText`   | `ReactNode`                                   | 自定义校验信息               |
| `feedbackStatus` | `'error' \| 'warning' \| 'success' \| 'pending'` | 反馈状态                   |
| `feedbackLayout` | `'loose' \| 'terse' \| 'popover' \| 'none'`    | 反馈信息布局                 |
| `feedbackIcon`   | `ReactNode`                                   | 自定义反馈图标               |
| `addonBefore`    | `ReactNode`                                   | label 前置内容               |
| `addonAfter`     | `ReactNode`                                   | label 后置内容               |
| `labelAlign`     | `'left' \| 'right'`                           | label 对齐方式               |
| `labelWidth`     | `number \| string`                            | label 宽度                   |
| `labelWrap`      | `boolean`                                     | label 是否可换行             |
| `wrapperAlign`   | `'left' \| 'right'`                           | 控件对齐方式                 |
| `wrapperWidth`   | `number \| string`                            | 控件宽度                     |
| `wrapperWrap`    | `boolean`                                     | 控件是否可换行               |
| `fullness`       | `boolean`                                     | 控件是否撑满                 |
| `inset`          | `boolean`                                     | 是否隐藏两侧留白             |
| `bordered`       | `boolean`                                     | 是否显示边框                 |
| `gridSpan`       | `number`                                      | 在 `FormGrid` 中占据的列数   |

在 Schema 中通常直接使用 `decorator: 'FormItem'` 或依赖 `defaultDecorator` 自动注入。

`FormItem.BaseItem` 是不带 Formvk 连接的纯展示版本，可用于自定义装饰器。

## FormLayout

布局配置容器，属性与响应式断点说明见 [布局](/guide/layout#formlayout)。

## FormGrid

响应式栅格布局，属性说明见 [布局](/guide/layout#formgrid)。

```tsx
import { FormGrid } from '@formvk/antd'

<FormGrid minWidth={240} maxColumns={3}>
  <FormGrid.GridColumn gridSpan={2}>{/* ... */}</FormGrid.GridColumn>
  <FormGrid.GridColumn>{/* ... */}</FormGrid.GridColumn>
</FormGrid>
```

## FormButtonGroup

操作按钮组，支持吸附在容器底部。

| 属性     | 类型                         | 默认值  | 说明               |
| -------- | ---------------------------- | ------- | ------------------ |
| `align`  | `'left' \| 'right' \| 'center'` | `'left'` | 对齐方式        |
| `gutter` | `number`                     | `8`     | 按钮间距           |

- `FormButtonGroup.FormItem`：带 `gutter` 的间隔容器。
- `FormButtonGroup.Sticky`：基于 `react-sticky-box` 的吸附容器。

```tsx
<FormButtonGroup.Sticky align="center">
  <Submit>提交</Submit>
  <Reset>重置</Reset>
</FormButtonGroup.Sticky>
```

## Submit / Reset

`Submit` 继承 antd `Button` 的属性，并额外支持：

| 属性               | 说明                                     |
| ------------------ | ---------------------------------------- |
| `onSubmit`         | 提交成功回调；未传时按钮为原生 submit   |
| `onSubmitFailed`   | 校验失败回调                             |
| `onSubmitSuccess`  | 提交成功回调（与 `onSubmit` 二选一）     |

`Reset` 继承 antd `Button` 的属性，并额外支持：

| 属性                     | 说明                   |
| ------------------------ | ---------------------- |
| `forceClear`             | 是否强制清空           |
| `validate`               | 重置后是否触发校验     |
| `onResetValidateSuccess` | 重置并校验成功回调     |
| `onResetValidateFailed`  | 重置并校验失败回调     |

## Space

间距容器，未显式传入 `size` 时使用 `FormLayout.spaceGap`。

```tsx
import { Space } from '@formvk/antd'

<Space>
  <Submit>提交</Submit>
  <Reset>重置</Reset>
</Space>
```
