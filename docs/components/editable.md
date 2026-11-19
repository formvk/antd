# Editable

内联编辑组件：字段默认以只读文本展示，点击后切换为编辑态，失焦且校验通过后自动收起。同包导出弹层形态的 `EditablePopover`。

<demo react="../demos/editable.tsx" title="Editable 示例" description="内联编辑与 EditablePopover 容器编辑" />

## 何时使用

- 详情页中的少量字段需要就地修改，不希望整页都呈现表单形态。
- 一组字段需要统一在弹层中编辑时，使用 `EditablePopover` 包裹。
- 整页都需要编辑 / 只读切换时，直接使用表单的 `pattern` 与阅读态组件即可，无需本组件。

## 属性

### Editable

作为装饰器使用，接收 [FormItem](/components/form-item) 的 `IFormItemProps`（`label`、`tooltip`、`colon` 等），编辑态切换由父级 `pattern` 自动管理，无额外扩展属性。

### EditablePopover

继承 antd `PopoverProps`，常用属性：

| 属性 | 类型 | 说明 |
| --- | --- | --- |
| `title` | `ReactNode` | 弹层标题，缺省取字段标题 |
| `children` | `ReactNode` | 弹层中的编辑内容 |
| `trigger` | `'click'` | 固定为点击触发 |
| `placement` | `string` | 弹层位置 |

## 用法

- 作为字段装饰器：`f.Input({ decorator: 'Editable' })`，需要在 `createSchemaOptions` 的 `voidComponents` 中注册 `Editable`。
- 作为容器：`component: 'EditablePopover'` 包裹多个子字段，编辑内容在 Popover 中展示。

```tsx
const { OptionsProvider, fragment: f } = createSchemaOptions({
  components: { Input },
  voidComponents: {
    FormItem,
    Editable,
    EditablePopover,
  },
  defaultDecorator: 'FormItem',
})

const form = createForm({ pattern: 'editable' })
```

## 注意事项

- 编辑能力依赖父级（字段或表单）的 `pattern` 为 `editable`；处于 `readPretty` 时只展示只读文本，不出现编辑入口。
- 内联编辑在点击外部区域时尝试收起，但字段存在校验错误时会保持编辑态。
- `EditablePopover` 关闭前会校验弹层内的子字段，校验失败时保持打开并展示错误反馈。
