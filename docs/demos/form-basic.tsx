import { Form, FormItem, Input, Select, Submit } from '@formvk/antd'
import { createForm, createSchema, createSchemaField } from '@formvk/react'
import { useState } from 'react'

const { SchemaField, fragment: f } = createSchemaField({
  components: { Input, Select },
  voidComponents: { FormItem },
  defaultDecorator: 'FormItem',
})

const schema = createSchema({
  username: f.Input({ title: '用户名', required: true }),
  role: f.Select({
    title: '角色',
    required: true,
    enum: [
      { label: '管理员', value: 'admin' },
      { label: '访客', value: 'guest' },
    ],
  }),
})

export default () => {
  const [form] = useState(() => createForm())
  const [result, setResult] = useState('')

  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <Form
        form={form}
        layout="vertical"
        onAutoSubmit={values => setResult(`提交成功：${JSON.stringify(values)}`)}
        onAutoSubmitFailed={feedbacks =>
          setResult(`提交失败：${feedbacks.map(item => item.messages?.join('')).join('；')}`)
        }
      >
        <SchemaField schema={schema} />
        <Submit>提交</Submit>
      </Form>
      {result && <div style={{ color: result.startsWith('提交成功') ? '#389e0d' : '#cf1322' }}>{result}</div>}
    </div>
  )
}
