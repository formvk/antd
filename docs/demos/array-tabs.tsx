import { ArrayTabs, Form, FormItem, Input } from '@formvk/antd'
import { createForm, createSchema, createSchemaField } from '@formvk/react'
import { useState } from 'react'

const { SchemaField, fragment: f } = createSchemaField({
  components: { Input },
  voidComponents: { FormItem },
  arrayComponents: { ArrayTabs },
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

export default () => {
  const [form] = useState(() =>
    createForm({
      values: {
        members: [{ name: 'Alice', email: 'alice@example.com' }],
      },
    })
  )

  return (
    <Form form={form} layout="vertical">
      <SchemaField schema={schema} />
    </Form>
  )
}
