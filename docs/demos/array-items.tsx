import { Addition, ArrayItems, Form, FormItem, Input, Remove } from '@formvk/antd'
import { createForm, createSchema, createSchemaField } from '@formvk/react'
import { useState } from 'react'

const { SchemaField, fragment: f } = createSchemaField({
  components: { Input },
  voidComponents: {
    FormItem,
    Addition,
    Remove,
  },
  arrayComponents: { ArrayItems },
  defaultDecorator: 'FormItem',
})

const schema = createSchema({
  users: f.ArrayItems(
    f.Object({
      name: f.Input({ title: '姓名', required: true }),
      email: f.Input({ title: '邮箱' }),
      remove: f.Remove({ title: '删除' }),
    }),
    {
      properties: {
        add: f.Addition({ title: '新增成员' }),
      },
    }
  ),
})

export default () => {
  const [form] = useState(() =>
    createForm({
      values: {
        users: [{ name: 'Alice', email: 'alice@example.com' }],
      },
    })
  )

  return (
    <Form form={form}>
      <SchemaField schema={schema} />
    </Form>
  )
}
