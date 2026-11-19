import { Form, arrayComponents, fieldComponents, voidComponents } from '@formvk/antd'
import { createForm, createSchema, createSchemaOptions, SchemaField } from '@formvk/react'
import { useState } from 'react'

import { withDemoTheme } from './DemoTheme'

const { OptionsProvider, fragment: f } = createSchemaOptions({
  components: fieldComponents,
  voidComponents,
  arrayComponents,
  defaultDecorator: 'FormItem',
})

const schema = createSchema({
  password: f.Password({
    title: '密码',
    required: true,
    // checkStrength 开启密码强度条
    componentProps: { checkStrength: true, placeholder: '请输入密码' },
  }),
  confirm: f.Password({
    title: '确认密码',
    required: true,
    componentProps: { checkStrength: false, placeholder: '再次输入密码' },
    validator(value, _rule, ctx) {
      if (value !== ctx.values.password) return '两次输入的密码不一致'
    },
  }),
})

const createInitialValues = () => ({
  password: 'Formvk@2026',
  confirm: 'Formvk@2026',
})

const Demo = () => {
  const [form] = useState(() => createForm({ values: createInitialValues() }))
  const [readPrettyForm] = useState(() => createForm({ pattern: 'readPretty', values: createInitialValues() }))

  return (
    <OptionsProvider>
      <div style={{ display: 'grid', gap: 16 }}>
        <Form form={form} layout="vertical">
          <SchemaField schema={schema} />
        </Form>
        <div>
          <div style={{ marginBottom: 12, fontWeight: 600 }}>阅读态（readPretty）</div>
          <Form form={readPrettyForm} layout="vertical" previewTextPlaceholder="—">
            <SchemaField schema={schema} />
          </Form>
        </div>
      </div>
    </OptionsProvider>
  )
}

export default withDemoTheme(Demo)
