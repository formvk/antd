import { Form, FormItem, Transfer } from '@formvk/antd'
import { createForm, createSchema, createSchemaField } from '@formvk/react'
import { useState } from 'react'

const { SchemaField, fragment: f } = createSchemaField({
  components: { Transfer },
  voidComponents: { FormItem },
  defaultDecorator: 'FormItem',
})

const dataSource = Array.from({ length: 8 }).map((_, index) => ({
  key: String(index),
  title: `成员 ${index + 1}`,
}))

const schema = createSchema({
  members: f.Transfer({
    title: '选择成员',
    componentProps: {
      dataSource,
      titles: ['待选', '已选'],
      showSearch: true,
    },
  }),
})

export default () => {
  const [form] = useState(() => createForm({ values: { members: ['1', '3'] } }))

  return (
    <Form form={form} layout="vertical">
      <SchemaField schema={schema} />
    </Form>
  )
}
