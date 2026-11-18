import { Form, FormItem, FormStep, FormStepPane, Input, createFormStep } from '@formvk/antd'
import { createForm, createSchema, createSchemaField, observer } from '@formvk/react'
import { Button } from 'antd'
import { useState } from 'react'

const { SchemaField, fragment: f } = createSchemaField({
  components: { Input },
  voidComponents: {
    FormItem,
    FormStep,
    StepPane: FormStepPane,
  },
  defaultDecorator: 'FormItem',
})

const LAST_STEP = 2

// compose 实例与 schema 都放在模块作用域，schema 保持静态
const formStep = createFormStep()

const schema = createSchema({
  steps: f.FormStep({
    componentProps: { formStep },
    properties: {
      first: f.StepPane({
        componentProps: { title: '基本信息', description: '填写账号信息' },
        properties: {
          username: f.Input({ title: '用户名', required: true }),
          password: f.Input({ title: '密码', required: true }),
        },
      }),
      second: f.StepPane({
        componentProps: { title: '联系方式', description: '填写联系信息' },
        properties: {
          email: f.Input({ title: '邮箱', required: true }),
          mobile: f.Input({ title: '手机号' }),
        },
      }),
      third: f.StepPane({
        componentProps: { title: '完成', description: '确认并提交' },
        properties: {
          remark: f.Input({ title: '备注' }),
        },
      }),
    },
  }),
})

export default observer(() => {
  const [form] = useState(() => createForm())
  const [result, setResult] = useState('')

  return (
    <Form form={form} layout="vertical">
      <SchemaField schema={schema} />
      <div style={{ display: 'flex', gap: 8 }}>
        {/* next/back 会校验当前步骤，并自动切换 display */}
        <Button disabled={formStep.current === 0} onClick={() => formStep.back()}>
          上一步
        </Button>
        {formStep.current < LAST_STEP ? (
          <Button type="primary" onClick={() => formStep.next()}>
            下一步
          </Button>
        ) : (
          <Button type="primary" onClick={() => formStep.submit(values => setResult(JSON.stringify(values)))}>
            提交
          </Button>
        )}
      </div>
      {result && <div style={{ marginTop: 12, color: '#389e0d' }}>提交成功：{result}</div>}
    </Form>
  )
})
