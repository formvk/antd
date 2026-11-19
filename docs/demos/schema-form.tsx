import { SchemaForm, Submit, arrayComponents, fieldComponents, voidComponents } from '@formvk/antd'
import { createForm, createSchema, createSchemaOptions } from '@formvk/react'
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
})

export default () => {
  const [form] = useState(() => createForm())
  const [result, setResult] = useState('')

  return (
    <OptionsProvider>
      <div style={{ display: 'grid', gap: 12 }}>
        <SchemaForm
          form={form}
          layout="vertical"
          schema={schema}
          onAutoSubmit={values => setResult(`提交成功：${JSON.stringify(values)}`)}
        >
          <Submit>提交</Submit>
        </SchemaForm>
        {result ? <div style={{ color: 'var(--vp-c-green-1, #389e0d)' }}>{result}</div> : null}
      </div>
    </OptionsProvider>
  )
}
