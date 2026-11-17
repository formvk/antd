import { Form, FormItem, SelectTable } from '@formvk/antd'
import { createForm, createSchema, createSchemaField } from '@formvk/react'
import { useState } from 'react'

const { SchemaField, fragment: f } = createSchemaField({
  voidComponents: {
    FormItem,
    Column: SelectTable.Column,
  },
  arrayComponents: { SelectTable },
  defaultDecorator: 'FormItem',
})

const schema = createSchema({
  users: f.SelectTable(
    f.Object({
      name: f.Column({
        componentProps: { key: 'name', dataIndex: 'name', title: '姓名' },
      }),
      age: f.Column({
        componentProps: { key: 'age', dataIndex: 'age', title: '年龄' },
      }),
    }),
    {
      title: '成员',
      componentProps: {
        showSearch: true,
        dataSource: [
          { key: 1, name: 'Alice', age: 24 },
          { key: 2, name: 'Bob', age: 28 },
          { key: 3, name: 'Carol', age: 31 },
        ],
      },
    }
  ),
})

export default () => {
  const [form] = useState(() =>
    createForm({
      values: {
        users: [1],
      },
    })
  )

  return (
    <Form form={form}>
      <SchemaField schema={schema} />
    </Form>
  )
}
