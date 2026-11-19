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

let seed = 0

const createRecordId = () => `member-copy-${Date.now()}-${++seed}`

const schema = createSchema({
  members: f.ArrayCards(
    f.Object({
      // 业务主键不参与展示，只作为数组项 key
      id: f.Input({ hidden: true }),
      index: f.Index(),
      name: f.Input({ title: '姓名', required: true }),
      email: f.Input({ title: '邮箱' }),
      copy: f.Copy({
        title: '复制',
        componentProps: {
          // 复制时为副本生成新的业务 id
          copyRecord: record => ({ ...record, id: createRecordId() }),
        },
      }),
      moveUp: f.MoveUp(),
      moveDown: f.MoveDown(),
      remove: f.Remove(),
    }),
    {
      // 用业务 id 作为数组项的稳定 key
      recordKey: 'id',
      properties: {
        add: f.Addition({ title: '新增成员' }),
      },
    }
  ),
})

const Demo = () => {
  const [form] = useState(() =>
    createForm({
      values: {
        members: Array.from({ length: 6 }, (_, index) => ({
          id: `member-${index + 1}`,
          name: `成员 ${index + 1}`,
          email: `member${index + 1}@example.com`,
        })),
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
