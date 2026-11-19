# FormButtonGroup

表单操作按钮组，基于 antd `Space` 封装，支持左 / 中 / 右对齐与滚动吸附底部，并提供与表单项 label 对齐的 `FormItem` 子组件。

<demo react="../demos/form-button-group.tsx" title="align / gutter / FormItem / Sticky" description="对齐方式、按钮间距、表单项对齐与底部吸附" />

## 何时使用

- 承载表单底部的提交、重置等操作按钮，并需要统一对齐方式与间距。
- 希望按钮与上方字段的控件区域左对齐（跳过 label 列）时，使用 `FormButtonGroup.FormItem`。
- 长表单需要操作区始终可见时，使用 `FormButtonGroup.Sticky` 吸附在视口底部。

## 属性

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `align` | `'left' \| 'right' \| 'center'` | `'left'` | 对齐方式 |
| `gutter` | `number` | `8` | 按钮间距 |
| 其他 | [`SpaceProps`](https://ant.design/components/space-cn#api) | — | 透传给 antd `Space`（不支持 `align` / `size`，由上面两个属性接管） |

### 子组件

| 子组件 | 说明 |
| --- | --- |
| `FormButtonGroup.FormItem` | 以 `FormItem` 的方式对齐按钮，支持 `gutter`，适合与表单字段左对齐 |
| `FormButtonGroup.Sticky` | 基于 `react-sticky-box` 的吸附容器，滚动时固定在底部，支持 `align` 与 StickyBox 的全部属性 |

```tsx
<FormButtonGroup.Sticky align="right">
  <Submit>提交</Submit>
  <Reset>重置</Reset>
</FormButtonGroup.Sticky>
```

## 注意事项

- `Sticky` 依赖父级滚动容器工作，且会自动继承父级背景色，避免滚动内容透出。
