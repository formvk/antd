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
  grid: f.FormGrid({
    componentProps: {
      minWidth: 220,
      maxColumns: 3,
    },
    properties: {
      username: f.Input({ title: '用户名' }),
      email: f.Input({ title: '邮箱' }),
      role: f.Select({
        title: '角色',
        enum: [
          { label: '管理员', value: 'admin' },
          { label: '访客', value: 'guest' },
        ],
      }),
      city: f.Input({ title: '城市' }),
      company: f.Input({ title: '公司' }),
      remark: f.Input({ title: '备注' }),
    },
  }),
})

const Demo = () => {
  const [form] = useState(() => createForm())

  return (
    <OptionsProvider>
      <Form form={form} layout="vertical">
        <SchemaField schema={schema} />
      </Form>
    </OptionsProvider>
  )
}

export default withDemoTheme(Demo)
