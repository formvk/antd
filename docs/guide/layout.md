# 布局

布局组件用于控制 label 与字段的相对位置、栅格排列以及不同断点下的响应式表现。

## FormLayout

`FormLayout` 是表单布局的配置容器，`Form` 内部已经内置了一层。所有配置都可以用数组按断点生效，断点由 `breakpoints` 定义。

| 属性            | 类型                                             | 默认值       | 说明                       |
| --------------- | ------------------------------------------------ | ------------ | -------------------------- |
| `layout`        | `'vertical' \| 'horizontal' \| 'inline'` 及数组   | `'horizontal'` | 布局方向                 |
| `labelAlign`    | `'right' \| 'left'` 及数组                        | `'right'`    | label 对齐方式             |
| `labelWrap`     | `boolean`                                        | `false`      | label 是否可换行           |
| `labelWidth`    | `number`                                         | —            | label 固定宽度             |
| `wrapperAlign`  | `'right' \| 'left'` 及数组                        | `'left'`     | 控件对齐方式               |
| `wrapperWidth`  | `number`                                         | —            | 控件固定宽度               |
| `labelCol`      | `number` 及数组                                   | —            | label 栅格宽度             |
| `wrapperCol`    | `number` 及数组                                   | —            | 控件栅格宽度               |
| `colon`         | `boolean`                                        | `true`       | 是否显示冒号               |
| `feedbackLayout`| `'loose' \| 'terse' \| 'popover' \| 'none'`       | `'loose'`    | 校验信息布局               |
| `tooltipLayout` | `'icon' \| 'text'`                               | `'icon'`     | 提示信息布局               |
| `size`          | `'small' \| 'default' \| 'large'`                 | `'default'`  | 控件尺寸                   |
| `bordered`      | `boolean`                                        | `false`      | 是否显示边框               |
| `fullness`      | `boolean`                                        | `false`      | 控件是否撑满整行           |
| `inset`         | `boolean`                                        | `false`      | 是否隐藏两侧留白           |
| `spaceGap`      | `number`                                         | `8`          | `Space` 组件默认间距       |
| `gridColumnGap` | `number`                                         | `8`          | 栅格列间距                 |
| `gridRowGap`    | `number`                                         | `4`          | 栅格行间距                 |
| `breakpoints`   | `number[]`                                       | —            | 响应式断点                 |

```tsx
<FormLayout layout="vertical" labelAlign="left">
  <FormItem label="用户名">{/* ... */}</FormItem>
</FormLayout>
```

## FormGrid

`FormGrid` 负责字段的栅格排列，按容器宽度自动计算列数。

| 属性            | 类型               | 默认值 | 说明                         |
| --------------- | ------------------ | ------ | ---------------------------- |
| `minWidth`      | `number \| number[]` | `300`  | 单列最小宽度                 |
| `maxWidth`      | `number \| number[]` | —      | 单列最大宽度                 |
| `minColumns`    | `number \| number[]` | `1`    | 最少列数                     |
| `maxColumns`    | `number \| number[]` | —      | 最多列数                     |
| `columnGap`     | `number`           | `8`    | 列间距                       |
| `rowGap`        | `number`           | `4`    | 行间距                       |
| `breakpoints`   | `number[]`         | —      | 响应式断点                   |
| `colWrap`       | `boolean`          | `true` | 是否允许换行                 |
| `strictAutoFit` | `boolean`          | `false`| 是否严格按最小宽度自动适配   |

Schema 用法：

```tsx
const schema = createSchema({
  grid: f.FormGrid({
    componentProps: {
      minWidth: 240,
      maxColumns: 3,
    },
    properties: {
      username: f.Input({ title: '用户名' }),
      email: f.Input({ title: '邮箱' }),
    },
  }),
})
```

<demo react="../demos/layout-grid.tsx" title="FormGrid 自适应栅格" description="拖动改变容器宽度，列数会按 minWidth 自动调整" />

JSX 用法：

```tsx
import { FormGrid } from '@formvk/antd'

<FormGrid minWidth={240} maxColumns={3}>
  <FormGrid.GridColumn gridSpan={2}>
    <FormItem label="备注">{/* ... */}</FormItem>
  </FormGrid.GridColumn>
  <FormGrid.GridColumn>
    <FormItem label="状态">{/* ... */}</FormItem>
  </FormGrid.GridColumn>
</FormGrid>
```

自定义栅格实例：

```tsx
const grid = FormGrid.createFormGrid({ minWidth: 200 })

<FormGrid grid={grid}>{/* ... */}</FormGrid>
```
