import { Addition, ArrayCards, Form, FormItem, Index, Input, Remove } from '@formvk/antd'
import { createForm, createSchema, createSchemaField } from '@formvk/react'
import { useState } from 'react'

const { SchemaField, fragment: f } = createSchemaField({
  components: { Input },
  voidComponents: {
    FormItem,
    Addition,
    Remove,
    Index,
  },
  arrayComponents: { ArrayCards },
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

export default () => {
  const [form] = useState(() =>
    createForm({
      values: {
        users: [{ name: 'Alice', email: 'alice@example.com' }],
      },
    })
  )

  return (
    <Form form={form} layout="vertical">
      <SchemaField schema={schema} />
    </Form>
  )
}
