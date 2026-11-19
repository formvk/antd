# Password

密码输入组件，基于 antd `Input.Password` 封装，扩展了密码强度条能力。阅读态自动切换为 `TextInput`。

<demo react="../demos/password.tsx" title="checkStrength 与密码确认" description="开启强度条，并用 validator 校验两次输入一致，含 readPretty 阅读态" />

## 何时使用

- 登录、注册、修改密码等密码录入场景。
- 需要可视化提示密码强度时，开启 `checkStrength`。

## 属性

继承 antd [`PasswordProps`](https://ant.design/components/input-cn#inputpassword)，本包额外扩展以下属性，其余属性与 antd `Input.Password` 一致并原样透传。

| 属性 | 类型 | 说明 |
| --- | --- | --- |
| `checkStrength` | `boolean` | 本包扩展，是否展示密码强度条，未传时不展示 |
| `value` | `string` | 字段值，由内核注入 |
| `disabled` | `boolean` | 禁用输入 |
| `maxLength` | `number` | 最大输入长度 |

## 阅读态

`readPretty` 模式下渲染为 `TextInput`，以纯文本展示字段值，不会还原为可输入的密码框。
