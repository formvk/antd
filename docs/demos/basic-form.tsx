import { Form, Reset, Submit, arrayComponents, fieldComponents, voidComponents } from '@formvk/antd'
import { createForm, createSchema, createSchemaOptions, SchemaField } from '@formvk/react'
import { useState } from 'react'

const { OptionsProvider, fragment: f } = createSchemaOptions({
  components: fieldComponents,
  voidComponents,
  arrayComponents,
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
  remark: f.Input({
    title: '备注',
    componentProps: { placeholder: '选填' },
  }),
})

export default () => {
  const [form] = useState(() =>
    createForm({
      values: {
        username: 'alice',
        role: 'admin',
      },
    })
  )
  const [submitted, setSubmitted] = useState('')

  return (
    <OptionsProvider>
      <div style={{ display: 'grid', gap: 16 }}>
        <Form form={form}>
          <SchemaField schema={schema} />
          <div style={{ display: 'flex', gap: 8 }}>
            <Submit onSubmit={values => setSubmitted(JSON.stringify(values, null, 2))}>提交</Submit>
            <Reset>重置</Reset>
          </div>
        </Form>
        {submitted && (
          <pre
            style={{
              margin: 0,
              padding: 12,
              borderRadius: 8,
              background: '#f6f8fa',
              fontSize: 13,
              overflow: 'auto',
            }}
          >
            {submitted}
          </pre>
        )}
      </div>
    </OptionsProvider>
  )
}
