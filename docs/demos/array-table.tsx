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
  users: f.ArrayTable(
    f.Object({
      name: f.Column({
        componentProps: { title: '姓名', dataIndex: 'name', width: 180 },
        properties: { name: f.Input({ required: true }) },
      }),
      email: f.Column({
        componentProps: { title: '邮箱', dataIndex: 'email', width: 240 },
        properties: { email: f.Input() },
      }),
      age: f.Column({
        componentProps: { title: '年龄', dataIndex: 'age', width: 120 },
        properties: { age: f.Input() },
      }),
      actions: f.Column({
        componentProps: { title: '操作', dataIndex: 'actions', width: 160, fixed: 'right' },
        properties: {
          action: f.FormItem({
            properties: {
              remove: f.Remove({ title: '删除' }),
              up: f.MoveUp(),
              down: f.MoveDown(),
            },
          }),
        },
      }),
    }),
    {
      componentProps: {
        // 分页由 ArrayTable 自行接管
        pagination: { pageSize: 2 },
      },
      properties: {
        add: f.Addition({ title: '新增一行' }),
      },
    }
  ),
})

const Demo = () => {
  const [form] = useState(() =>
    createForm({
      values: {
        users: [
          { name: 'Alice', email: 'alice@example.com', age: 24 },
          { name: 'Bob', email: 'bob@example.com', age: 28 },
          { name: 'Carol', email: 'carol@example.com', age: 31 },
        ],
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
