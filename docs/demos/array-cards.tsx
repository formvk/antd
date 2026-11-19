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
  users: f.ArrayCards(
    f.Object({
      index: f.Index(),
      name: f.Input({ title: '姓名', required: true }),
      email: f.Input({ title: '邮箱' }),
      remove: f.Remove({ title: '删除' }),
    }),
    {
      properties: {
        add: f.Addition({ title: '新增卡片' }),
      },
    }
  ),
})

const Demo = () => {
  const [form] = useState(() =>
    createForm({
      values: {
        users: [{ name: 'Alice', email: 'alice@example.com' }],
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
