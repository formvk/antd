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
  users: f.ArrayCollapse(
    f.Object({
      index: f.Index(),
      name: f.Input({ title: '姓名', required: true }),
      email: f.Input({ title: '邮箱' }),
      remove: f.Remove({ title: '删除' }),
    }),
    {
      componentProps: {
        // 默认展开前两个面板
        defaultOpenPanelCount: 2,
        accordion: true,
      },
      properties: {
        add: f.Addition({ title: '新增面板' }),
      },
    }
  ),
})

const Demo = () => {
  const [form] = useState(() =>
    createForm({
      values: {
        users: [
          { name: 'Alice', email: 'alice@example.com' },
          { name: 'Bob', email: 'bob@example.com' },
          { name: 'Carol', email: 'carol@example.com' },
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
