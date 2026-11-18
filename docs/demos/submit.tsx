import { Form, FormItem, Input, Submit } from '@formvk/antd'
import { createForm, createSchema, createSchemaField } from '@formvk/react'
import { useState } from 'react'

const { SchemaField, fragment: f } = createSchemaField({
  components: { Input },
  voidComponents: { FormItem },
  defaultDecorator: 'FormItem',
})

const schema = createSchema({
  username: f.Input({ title: '用户名', required: true }),
})

export default () => {
  const [form] = useState(() => createForm())
  const [log, setLog] = useState('')

  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <Form form={form} layout="vertical">
        <SchemaField schema={schema} />
        <Submit
          onSubmit={values => setLog(`onSubmit：${JSON.stringify(values)}`)}
          onSubmitSuccess={values => setLog(`onSubmitSuccess：${JSON.stringify(values)}`)}
          onSubmitFailed={feedbacks => setLog(`onSubmitFailed：${feedbacks.length} 条错误`)}
        >
          提交
        </Submit>
      </Form>
      {log && <div>{log}</div>}
    </div>
  )
}
