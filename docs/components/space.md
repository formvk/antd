# Space

间距容器，基于 antd `Space` 封装。未显式传入 `size` 时，间距自动取 `FormLayout.spaceGap`，保证与表单整体间距一致。

<demo react="../demos/space.tsx" title="size 与 FormLayout.spaceGap" description="不传 size 时自动跟随布局配置" />

## 何时使用

- 在表单项内部横向排列多个控件或按钮，又希望间距跟随表单布局配置时。
- 纯通用间距场景也可以直接使用 antd 的 `Space`。

## 属性

继承 antd `SpaceProps`，仅 `size` 的默认值被调整：

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `size` | `number \| 'small' \| 'middle' \| 'large'` | `FormLayout.spaceGap`（默认 `8`） | 间距；显式传入时以传入值为准 |
| 其他 | `SpaceProps` | — | 透传给 antd `Space`，如 `direction`、`wrap`、`align` |
