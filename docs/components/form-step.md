# FormStep

分步表单容器，每个步骤通过 `StepPane` 声明，步骤条的 `title` / `description` / `icon` 等属性与 antd `Steps` 一致。步骤切换由 `createFormStep` 受控实例驱动，并内置每步校验。

<demo react="../demos/form-step.tsx" title="FormStep 示例" description="上一步、下一步、校验与提交" />

## 何时使用

- 表单流程有明确的先后顺序，如注册、下单、申请审批。
- 希望每步独立校验、通过后才能进入下一步时。

## 属性

继承 antd [`StepsProps`](https://ant.design/components/steps-cn#api)，并扩展：

| 属性 | 类型 | 说明 |
| --- | --- | --- |
| `formStep` | `IFormStep` | `createFormStep` 创建的受控实例，必传 |
| `current` | `number` | 当前步骤索引 |
| `onChange` | `(index) => void` | 步骤切换回调 |

### StepPane

| 子组件 | 说明 |
| --- | --- |
| `StepPane` | 步骤面板，`componentProps` 同 antd [`StepProps`](https://ant.design/components/steps-cn#step)（`title`、`description`、`icon` 等） |

### 受控实例

`createFormStep(defaultCurrent = 0)` 返回：

| 成员 | 说明 |
| --- | --- |
| `current` | 当前步骤索引 |
| `allowNext` | 是否允许进入下一步 |
| `allowBack` | 是否允许返回上一步 |
| `next()` | 校验当前步骤通过后进入下一步 |
| `back()` | 返回上一步 |
| `submit(onSubmit?)` | 校验通过后提交表单 |
| `setCurrent(index)` | 跳转到指定步骤 |

## 用法

```tsx
const formStep = createFormStep()

const schema = createSchema({
  steps: f.FormStep({
    componentProps: { formStep },
    properties: {
      first: f.StepPane({
        componentProps: { title: '基本信息', description: '填写账号信息' },
        properties: {
          username: f.Input({ title: '用户名', required: true }),
        },
      }),
      second: f.StepPane({
        componentProps: { title: '联系方式' },
        properties: {
          email: f.Input({ title: '邮箱', required: true }),
        },
      }),
    },
  }),
})
```

## 注意事项

- `next()` / `back()` 内部会校验当前步骤并更新 `allowNext` / `allowBack`；按钮状态可读取 `formStep.current` 配合 `observer` 实时更新。
- 非当前步骤的字段会被设置为 `display: 'hidden'`，不参与可见性校验。
- 受控实例与 Schema 建议保持在模块作用域创建，避免每次渲染重建字段。
