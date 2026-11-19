import { Form, arrayComponents, fieldComponents, voidComponents } from '@formvk/antd'
import { createForm, createSchema, createSchemaOptions, SchemaField } from '@formvk/react'
import { Segmented } from 'antd'
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
    enum: [
      { label: '管理员', value: 'admin' },
      { label: '访客', value: 'guest' },
    ],
  }),
  remark: f.Input({ title: '备注' }),
})

const layouts = [
  { label: 'horizontal', value: 'horizontal' },
  { label: 'vertical', value: 'vertical' },
  { label: 'inline', value: 'inline' },
]

export default () => {
  const [form] = useState(() => createForm())
  const [layout, setLayout] = useState<'horizontal' | 'vertical' | 'inline'>('horizontal')

  return (
    <OptionsProvider>
      <div style={{ display: 'grid', gap: 12 }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          layout：
          <Segmented value={layout} onChange={value => setLayout(value as typeof layout)} options={layouts} />
        </label>
        <Form form={form} layout={layout}>
          <SchemaField schema={schema} />
        </Form>
      </div>
    </OptionsProvider>
  )
}
