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
  members: f.ArrayTabs(
    f.Object({
      name: f.Input({ title: '姓名', required: true }),
      email: f.Input({ title: '邮箱' }),
    }),
    { title: '成员' }
  ),
})

const Demo = () => {
  const [form] = useState(() =>
    createForm({
      values: {
        members: [{ name: 'Alice', email: 'alice@example.com' }],
      },
    })
  )

  return (
    <OptionsProvider>
      <Form form={form} layout="vertical">
        <SchemaField schema={schema} />
      </Form>
    </OptionsProvider>
  )
}

export default withDemoTheme(Demo)
